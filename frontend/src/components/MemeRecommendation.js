import React, { useState, useEffect } from 'react';
import { tweetsAPI } from '../services/api';
import './MemeRecommendation.css';

const MemeRecommendation = ({ selectedTweet }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMeme, setSelectedMeme] = useState(null);

  useEffect(() => {
    if (selectedTweet) {
      fetchRecommendations();
    }
  }, [selectedTweet]);

  const fetchRecommendations = async () => {
    if (!selectedTweet) return;

    try {
      setLoading(true);
      setError(null);
      const response = await tweetsAPI.getRecommendations(selectedTweet.text, 5);
      setRecommendations(response.data.data);
    } catch (err) {
      setError('Failed to get recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReplyWithMeme = (tweet, memeUrl) => {
    const memeText = selectedMeme ? `Check out this meme! ${memeUrl}` : '';
    return `https://x.com/intent/tweet?in_reply_to=${tweet.id}&text=@${tweet.author.username}%20${encodeURIComponent(memeText)}`;
  };

  const getBackendUrl = () => {
    return process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace('/api', '')
      : 'http://localhost:5000';
  };

  const getFullMemeUrl = (meme) => {
    return `${getBackendUrl()}${meme.imageUrl}`;
  };

  if (!selectedTweet) {
    return (
      <div className="card recommendation-card">
        <div className="card-header">
          <h2 className="card-title">
            <span>✨</span> Meme Recommendations
          </h2>
        </div>
        <div className="no-selection">
          <p>👈 Select a tweet to see recommended memes</p>
          <p className="tip">Our AI will match memes based on tweet keywords!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card recommendation-card">
      <div className="card-header">
        <h2 className="card-title">
          <span>✨</span> Recommended Memes
        </h2>
        <button onClick={fetchRecommendations} className="btn btn-small btn-secondary">
          🔄 Refresh
        </button>
      </div>

      <div className="selected-tweet-info">
        <div className="info-label">Selected Tweet:</div>
        <div className="selected-tweet-preview">
          <div className="tweet-author-mini">
            <img
              src={selectedTweet.author.profileImage || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'}
              alt={selectedTweet.author.name}
              className="mini-avatar"
            />
            <span>@{selectedTweet.author.username}</span>
          </div>
          <div className="tweet-text-mini">
            {selectedTweet.text.substring(0, 100)}
            {selectedTweet.text.length > 100 ? '...' : ''}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="no-recommendations">
          <p>No matching memes found 😢</p>
          <p className="tip">Try uploading memes with relevant keywords!</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <>
          <div className="recommendations-list">
            {recommendations.map((meme) => (
              <div
                key={meme._id}
                className={`recommendation-item ${selectedMeme?._id === meme._id ? 'selected' : ''}`}
                onClick={() => setSelectedMeme(meme)}
              >
                <div className="rec-meme-image-container">
                  <img
                    src={getFullMemeUrl(meme)}
                    alt={meme.title}
                    className="rec-meme-image"
                  />
                </div>
                <div className="rec-meme-info">
                  <div className="rec-meme-title">{meme.title}</div>
                  {meme.keywords && meme.keywords.length > 0 && (
                    <div className="rec-meme-keywords">
                      {meme.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="mini-keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="rec-meme-stats">
                    <span>❤️ {meme.likes}</span>
                    <span>👁️ {meme.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedMeme && (
            <div className="reply-section">
              <div className="reply-preview">
                <img
                  src={getFullMemeUrl(selectedMeme)}
                  alt={selectedMeme.title}
                  className="reply-meme-preview"
                />
              </div>
              <a
                href={generateReplyWithMeme(selectedTweet, getFullMemeUrl(selectedMeme))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary reply-btn"
              >
                🐦 Reply with this Meme
              </a>
              <p className="reply-tip">
                The meme URL will be included in your reply. You can attach the image manually on X.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemeRecommendation;
