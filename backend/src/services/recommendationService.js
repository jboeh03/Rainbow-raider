const Meme = require('../models/Meme');
const twitterService = require('./twitterService');

class RecommendationService {
  async recommendMemesForTweet(tweetText, limit = 5) {
    try {
      // Extract keywords from tweet
      const keywords = twitterService.extractKeywords(tweetText);

      if (keywords.length === 0) {
        // If no keywords, return recent popular memes
        return await Meme.find()
          .sort({ likes: -1, createdAt: -1 })
          .limit(limit);
      }

      // Find memes with matching keywords
      const memes = await Meme.find({
        keywords: { $in: keywords }
      });

      // Score memes based on keyword matches
      const scoredMemes = memes.map(meme => {
        const matchCount = meme.keywords.filter(k => keywords.includes(k)).length;
        return {
          meme,
          score: matchCount
        };
      });

      // Sort by score and return top matches
      scoredMemes.sort((a, b) => b.score - a.score);

      return scoredMemes.slice(0, limit).map(item => item.meme);
    } catch (error) {
      console.error('Error recommending memes:', error);
      throw error;
    }
  }

  async recommendMemesForMultipleTweets(tweets, limit = 5) {
    try {
      const allKeywords = tweets.flatMap(tweet =>
        twitterService.extractKeywords(tweet.text)
      );

      // Get unique keywords
      const uniqueKeywords = [...new Set(allKeywords)];

      if (uniqueKeywords.length === 0) {
        return await Meme.find()
          .sort({ likes: -1, createdAt: -1 })
          .limit(limit);
      }

      // Find memes with matching keywords
      const memes = await Meme.find({
        keywords: { $in: uniqueKeywords }
      });

      // Score memes
      const scoredMemes = memes.map(meme => {
        const matchCount = meme.keywords.filter(k => uniqueKeywords.includes(k)).length;
        return {
          meme,
          score: matchCount
        };
      });

      scoredMemes.sort((a, b) => b.score - a.score);

      return scoredMemes.slice(0, limit).map(item => item.meme);
    } catch (error) {
      console.error('Error recommending memes:', error);
      throw error;
    }
  }
}

module.exports = new RecommendationService();
