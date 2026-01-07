const { TwitterApi } = require('twitter-api-v2');

class TwitterService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  initialize() {
    if (process.env.TWITTER_BEARER_TOKEN) {
      this.client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
      this.isInitialized = true;
      console.log('Twitter API initialized');
    } else {
      console.warn('Twitter API credentials not configured');
    }
  }

  async searchTweets(query = '$fish', maxResults = 20) {
    if (!this.isInitialized) {
      throw new Error('Twitter API not initialized');
    }

    try {
      const response = await this.client.v2.search(query, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'entities'],
        'user.fields': ['name', 'username', 'profile_image_url'],
        expansions: ['author_id'],
        sort_order: 'recency'
      });

      // Format the response
      const tweets = response.data.data || [];
      const users = response.data.includes?.users || [];

      return tweets.map(tweet => {
        const author = users.find(u => u.id === tweet.author_id);
        return {
          id: tweet.id,
          text: tweet.text,
          createdAt: tweet.created_at,
          author: {
            id: author?.id,
            name: author?.name,
            username: author?.username,
            profileImage: author?.profile_image_url
          },
          metrics: tweet.public_metrics,
          entities: tweet.entities
        };
      });
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  }

  async getTweetById(tweetId) {
    if (!this.isInitialized) {
      throw new Error('Twitter API not initialized');
    }

    try {
      const response = await this.client.v2.singleTweet(tweetId, {
        'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'entities'],
        'user.fields': ['name', 'username', 'profile_image_url'],
        expansions: ['author_id']
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching tweet:', error);
      throw error;
    }
  }

  extractKeywords(tweetText) {
    // Extract hashtags and mentions
    const hashtags = (tweetText.match(/#\w+/g) || []).map(tag => tag.toLowerCase().replace('#', ''));
    const mentions = (tweetText.match(/@\w+/g) || []).map(mention => mention.toLowerCase().replace('@', ''));

    // Extract common words (excluding common stop words)
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
    const words = tweetText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));

    return [...new Set([...hashtags, ...mentions, ...words])];
  }
}

module.exports = new TwitterService();
