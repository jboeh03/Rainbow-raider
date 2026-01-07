const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Meme = require('../models/Meme');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'meme-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// GET /api/memes - Get all memes
router.get('/', async (req, res) => {
  try {
    const { limit = 50, skip = 0, sortBy = 'createdAt' } = req.query;

    const memes = await Meme.find()
      .sort({ [sortBy]: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Meme.countDocuments();

    res.json({
      success: true,
      data: memes,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    console.error('Error fetching memes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch memes',
      message: error.message
    });
  }
});

// GET /api/memes/:id - Get single meme
router.get('/:id', async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);

    if (!meme) {
      return res.status(404).json({
        success: false,
        error: 'Meme not found'
      });
    }

    // Increment view count
    meme.views += 1;
    await meme.save();

    res.json({ success: true, data: meme });
  } catch (error) {
    console.error('Error fetching meme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meme',
      message: error.message
    });
  }
});

// POST /api/memes - Upload new meme
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image file is required'
      });
    }

    const { title, description, keywords, uploaderEmail } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    // Parse keywords
    let keywordArray = [];
    if (keywords) {
      keywordArray = typeof keywords === 'string'
        ? keywords.split(',').map(k => k.trim().toLowerCase())
        : keywords;
    }

    const meme = new Meme({
      title,
      description,
      keywords: keywordArray,
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      uploaderEmail
    });

    await meme.save();

    res.status(201).json({
      success: true,
      data: meme,
      message: 'Meme uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading meme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload meme',
      message: error.message
    });
  }
});

// POST /api/memes/:id/like - Like a meme
router.post('/:id/like', async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);

    if (!meme) {
      return res.status(404).json({
        success: false,
        error: 'Meme not found'
      });
    }

    meme.likes += 1;
    await meme.save();

    res.json({ success: true, data: meme });
  } catch (error) {
    console.error('Error liking meme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like meme',
      message: error.message
    });
  }
});

// DELETE /api/memes/:id - Delete a meme
router.delete('/:id', async (req, res) => {
  try {
    const meme = await Meme.findByIdAndDelete(req.params.id);

    if (!meme) {
      return res.status(404).json({
        success: false,
        error: 'Meme not found'
      });
    }

    // Optionally delete the file from filesystem
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../uploads', meme.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'Meme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete meme',
      message: error.message
    });
  }
});

module.exports = router;
