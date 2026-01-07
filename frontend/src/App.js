import React, { useState } from 'react';
import TweetFeed from './components/TweetFeed';
import MemeGallery from './components/MemeGallery';
import MemeRecommendation from './components/MemeRecommendation';
import EmailSignup from './components/EmailSignup';
import './App.css';

function App() {
  const [selectedTweet, setSelectedTweet] = useState(null);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <span className="fish-icon">🐠</span>
            <div>
              <h1>Rainbow Fish</h1>
              <p className="header-subtitle">$fish Community Hub</p>
            </div>
          </div>
          <div className="header-info">
            <a
              href="https://x.com/rainbowflish"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Follow @rainbowflish
            </a>
          </div>
        </div>
      </header>

      <main className="main-content">
        <TweetFeed
          onTweetSelect={setSelectedTweet}
          selectedTweet={selectedTweet}
        />
        <MemeRecommendation selectedTweet={selectedTweet} />
      </main>

      <div className="secondary-content">
        <MemeGallery />
      </div>

      <div className="footer-content">
        <EmailSignup />
      </div>

      <footer className="app-footer">
        <p>
          Built with 🌈 for the Rainbow Fish community | Powered by $fish
        </p>
        <p className="disclaimer">
          This is a community engagement tool. Always verify information and trade responsibly.
        </p>
      </footer>
    </div>
  );
}

export default App;
