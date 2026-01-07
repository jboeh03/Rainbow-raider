const express = require('express');
const router = express.Router();
const twitterService = require('../services/twitterService');
const recommendationService = require('../services/recommendationService');

// GET /api/tweets - Search tweets by query
router.get('/', async (req, res) => {
  try {
    const { query = '$fish', maxResults = 20 } = req.query;
    const tweets = await twitterService.searchTweets(query, parseInt(maxResults));
    res.json({ success: true, data: tweets });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tweets',
      message: error.message
    });
  }
});

// POST /api/tweets/recommend - Get meme recommendations for a tweet
router.post('/recommend', async (req, res) => {
  try {
    const { tweetText, limit = 5 } = req.body;

    if (!tweetText) {
      return res.status(400).json({
        success: false,
        error: 'Tweet text is required'
      });
    }

    const recommendations = await recommendationService.recommendMemesForTweet(
      tweetText,
      parseInt(limit)
    );

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
      message: error.message
    });
  }
});

module.exports = router;
