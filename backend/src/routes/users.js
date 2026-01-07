const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/signup - Optional email signup
router.post('/signup', async (req, res) => {
  try {
    const { email, subscribedToUpdates = true } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
        message: 'Email already registered'
      });
    }

    // Create new user
    user = new User({
      email: email.toLowerCase(),
      subscribedToUpdates
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user,
      message: 'Successfully signed up for updates'
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign up',
      message: error.message
    });
  }
});

// GET /api/users/count - Get user count
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user count',
      message: error.message
    });
  }
});

module.exports = router;
