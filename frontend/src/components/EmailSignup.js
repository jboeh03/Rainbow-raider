import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import './EmailSignup.css';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await usersAPI.getCount();
      setUserCount(response.data.count);
    } catch (err) {
      console.error('Error fetching user count:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    try {
      setLoading(true);
      const response = await usersAPI.signup(email, true);
      setMessage({
        type: 'success',
        text: response.data.message || 'Successfully signed up for updates!'
      });
      setEmail('');
      await fetchUserCount();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to sign up'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card email-signup-card">
      <div className="card-header">
        <h2 className="card-title">
          <span>📧</span> Join the Community
        </h2>
      </div>

      <div className="signup-content">
        <p className="signup-description">
          Get updates about Rainbow Fish $fish community events, meme contests, and more!
        </p>

        <div className="community-stats">
          <div className="stat-item">
            <div className="stat-number">{userCount}</div>
            <div className="stat-label">Community Members</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input"
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </div>
        )}

        <div className="signup-footer">
          <p className="privacy-note">
            We respect your privacy. No spam, just fish vibes! 🐠
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSignup;
