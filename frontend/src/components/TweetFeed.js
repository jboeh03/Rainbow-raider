import React, { useState, useEffect } from 'react';
import { tweetsAPI } from '../services/api';
import './TweetFeed.css';

const TweetFeed = ({ onTweetSelect, selectedTweet }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('$fish');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tweetsAPI.search(searchQuery, 20);
      setTweets(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tweets. Please check your X API credentials.');
      console.error('Error fetching tweets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [searchQuery]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchTweets, 60000); // Refresh every 60 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, searchQuery]);

  const generateReplyLink = (tweet) => {
    const tweetUrl = `https://x.com/${tweet.author.username}/status/${tweet.id}`;
    return `https://x.com/intent/tweet?in_reply_to=${tweet.id}&text=@${tweet.author.username}%20`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTweets();
  };

  return (
    <div className="card tweet-feed-card">
      <div className="card-header">
        <h2 className="card-title">
          <span>🐦</span> $fish Conversations
        </h2>
        <button onClick={fetchTweets} className="btn btn-small btn-secondary">
          🔄 Refresh
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tweets (e.g., $fish, @rainbowflish)"
        />
        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
          Search
        </button>
      </form>

      <div className="auto-refresh">
        <label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span>Auto-refresh (60s)</span>
        </label>
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

      {!loading && !error && tweets.length === 0 && (
        <div className="no-tweets">
          No tweets found. Try a different search query.
        </div>
      )}

      <div className="tweets-container">
        {tweets.map((tweet) => (
          <div
            key={tweet.id}
            className={`tweet-card ${selectedTweet?.id === tweet.id ? 'selected' : ''}`}
            onClick={() => onTweetSelect(tweet)}
          >
            <div className="tweet-header">
              <img
                src={tweet.author.profileImage || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'}
                alt={tweet.author.name}
                className="tweet-avatar"
              />
              <div className="tweet-author">
                <div className="author-name">{tweet.author.name}</div>
                <div className="author-username">@{tweet.author.username}</div>
              </div>
              <div className="tweet-time">{formatDate(tweet.createdAt)}</div>
            </div>

            <div className="tweet-content">{tweet.text}</div>

            <div className="tweet-footer">
              <div className="tweet-metrics">
                <span>❤️ {tweet.metrics?.like_count || 0}</span>
                <span>🔄 {tweet.metrics?.retweet_count || 0}</span>
                <span>💬 {tweet.metrics?.reply_count || 0}</span>
              </div>
              <a
                href={generateReplyLink(tweet)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-small btn-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Reply on X
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetFeed;
