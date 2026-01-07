const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  imageUrl: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  uploaderEmail: {
    type: String,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for keyword search
memeSchema.index({ keywords: 1 });
memeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Meme', memeSchema);
