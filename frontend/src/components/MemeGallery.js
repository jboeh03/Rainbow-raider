import React, { useState, useEffect } from 'react';
import { memesAPI } from '../services/api';
import './MemeGallery.css';

const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    keywords: '',
    uploaderEmail: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const response = await memesAPI.getAll({ limit: 50, sortBy: 'createdAt' });
      setMemes(response.data.data);
    } catch (err) {
      setError('Failed to fetch memes');
      console.error('Error fetching memes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    if (!uploadData.title.trim()) {
      setError('Please provide a title');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('keywords', uploadData.keywords);
    formData.append('uploaderEmail', uploadData.uploaderEmail);

    try {
      setLoading(true);
      await memesAPI.upload(formData);
      setUploadSuccess(true);
      setShowUploadForm(false);
      setUploadData({ title: '', description: '', keywords: '', uploaderEmail: '' });
      setSelectedFile(null);
      await fetchMemes();

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload meme');
      console.error('Error uploading meme:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (memeId) => {
    try {
      await memesAPI.like(memeId);
      setMemes(prev => prev.map(meme =>
        meme._id === memeId ? { ...meme, likes: meme.likes + 1 } : meme
      ));
    } catch (err) {
      console.error('Error liking meme:', err);
    }
  };

  const getBackendUrl = () => {
    return process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api', '')
      : 'http://localhost:5000';
  };

  return (
    <div className="card meme-gallery-card">
      <div className="card-header">
        <h2 className="card-title">
          <span>🎨</span> Meme Gallery
        </h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn btn-small btn-primary"
        >
          {showUploadForm ? '✕ Cancel' : '➕ Upload Meme'}
        </button>
      </div>

      {uploadSuccess && (
        <div className="success-message">
          Meme uploaded successfully! 🎉
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showUploadForm && (
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label>Image File *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input"
              required
            />
            {selectedFile && (
              <div className="file-preview">
                Selected: {selectedFile.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={uploadData.title}
              onChange={handleInputChange}
              className="input"
              placeholder="Give your meme a catchy title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={uploadData.description}
              onChange={handleInputChange}
              className="input textarea"
              placeholder="Describe your meme"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Keywords (comma-separated)</label>
            <input
              type="text"
              name="keywords"
              value={uploadData.keywords}
              onChange={handleInputChange}
              className="input"
              placeholder="fish, moon, pump, hodl"
            />
          </div>

          <div className="form-group">
            <label>Your Email (optional)</label>
            <input
              type="email"
              name="uploaderEmail"
              value={uploadData.uploaderEmail}
              onChange={handleInputChange}
              className="input"
              placeholder="your@email.com"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Meme'}
          </button>
        </form>
      )}

      {loading && !showUploadForm && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      <div className="memes-grid">
        {memes.map((meme) => (
          <div key={meme._id} className="meme-card">
            <div className="meme-image-container">
              <img
                src={`${getBackendUrl()}${meme.imageUrl}`}
                alt={meme.title}
                className="meme-image"
                loading="lazy"
              />
            </div>
            <div className="meme-info">
              <h3 className="meme-title">{meme.title}</h3>
              {meme.description && (
                <p className="meme-description">{meme.description}</p>
              )}
              {meme.keywords && meme.keywords.length > 0 && (
                <div className="meme-keywords">
                  {meme.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <div className="meme-footer">
                <button
                  onClick={() => handleLike(meme._id)}
                  className="like-button"
                >
                  ❤️ {meme.likes}
                </button>
                <span className="view-count">👁️ {meme.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && memes.length === 0 && (
        <div className="no-memes">
          No memes yet. Be the first to upload! 🎨
        </div>
      )}
    </div>
  );
};

export default MemeGallery;
