# Rainbow Fish 🐠 $fish Community Hub

An MVP webapp for the Rainbow Fish $fish memecoin community engagement on X (Twitter). Built with React, Node.js, and MongoDB.

## Features

- **Real-time Tweet Tracking** 🐦
  - Monitor $fish hashtag and community conversations
  - Search by hashtags, usernames, or keywords
  - Auto-refresh every 60 seconds
  - View tweet metrics (likes, retweets, replies)

- **Meme Gallery** 🎨
  - Upload community memes with titles, descriptions, and keywords
  - Browse all uploaded memes
  - Like and view memes
  - Support for JPG, PNG, GIF, and WebP formats

- **Smart Meme Recommendations** ✨
  - AI-powered keyword matching
  - Select any tweet to get relevant meme suggestions
  - One-click reply with recommended memes

- **Prefilled Reply Links** 🔗
  - Generate prefilled X.com reply links
  - No direct posting - respects user control
  - Easy sharing of memes in conversations

- **Community Features** 📧
  - Optional email signup
  - Community member counter
  - No authentication required for core features

- **Rainbow Fish Branding** 🌈
  - Beautiful rainbow gradient theme
  - Fish-themed icons and animations
  - Tied to @rainbowflish parody account

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- CSS3 with custom animations
- Responsive design

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Twitter API v2 integration
- Multer for file uploads
- CORS enabled

### APIs
- X (Twitter) API v2
- Custom REST API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- X (Twitter) API credentials (Bearer Token)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Rainbow-raider.git
cd Rainbow-raider
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/rainbow-fish

# Server Configuration
PORT=5000
NODE_ENV=development

# Twitter API Credentials
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Getting X API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use an existing one
3. Navigate to "Keys and tokens"
4. Generate a Bearer Token
5. Copy the Bearer Token to your backend `.env` file

**Note:** The free tier of X API may have rate limits. For production use, consider upgrading to a paid tier.

## Running the Application

### Start MongoDB

If using local MongoDB:

```bash
mongod
```

Or use MongoDB Atlas and update the `MONGODB_URI` in your `.env` file.

### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

For development with auto-reload:

```bash
npm run dev
```

### Start Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Tracking Tweets

1. The app defaults to tracking the `$fish` hashtag
2. Use the search box to track different hashtags, usernames, or keywords
3. Click the refresh button or enable auto-refresh (60s)
4. Click any tweet to select it for meme recommendations

### Uploading Memes

1. Click "Upload Meme" in the Meme Gallery
2. Select an image file (max 10MB)
3. Add a title (required)
4. Add description and keywords for better recommendations
5. Optionally add your email
6. Click "Upload Meme"

### Getting Meme Recommendations

1. Select a tweet from the feed
2. The system will automatically find relevant memes based on keywords
3. Click on a recommended meme to select it
4. Click "Reply with this Meme" to open a prefilled reply on X

### Email Signup

1. Enter your email in the "Join the Community" section
2. Click "Sign Up" to receive community updates
3. Your email will only be used for community notifications

## Project Structure

```
Rainbow-raider/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── Meme.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── tweets.js
│   │   │   ├── memes.js
│   │   │   └── users.js
│   │   ├── services/
│   │   │   ├── twitterService.js
│   │   │   └── recommendationService.js
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TweetFeed.js
│   │   │   ├── TweetFeed.css
│   │   │   ├── MemeGallery.js
│   │   │   ├── MemeGallery.css
│   │   │   ├── MemeRecommendation.js
│   │   │   ├── MemeRecommendation.css
│   │   │   ├── EmailSignup.js
│   │   │   └── EmailSignup.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env
└── README.md
```

## API Endpoints

### Tweets

- `GET /api/tweets?query=$fish&maxResults=20` - Search tweets
- `POST /api/tweets/recommend` - Get meme recommendations for a tweet

### Memes

- `GET /api/memes?limit=50&skip=0&sortBy=createdAt` - Get all memes
- `GET /api/memes/:id` - Get single meme
- `POST /api/memes` - Upload new meme (multipart/form-data)
- `POST /api/memes/:id/like` - Like a meme
- `DELETE /api/memes/:id` - Delete a meme

### Users

- `POST /api/users/signup` - Email signup
- `GET /api/users/count` - Get user count

### Health

- `GET /api/health` - Health check endpoint

## Customization

### Changing the Brand

1. Update the header title in `frontend/src/App.js`
2. Modify colors in `frontend/src/styles/index.css` (`:root` variables)
3. Update the Twitter username link in the header
4. Change the fish emoji to your preferred icon

### Modifying Search Defaults

Edit `frontend/src/components/TweetFeed.js`:

```javascript
const [searchQuery, setSearchQuery] = useState('$fish'); // Change default query
const [autoRefresh, setAutoRefresh] = useState(true); // Toggle auto-refresh
```

### Adjusting Recommendation Algorithm

Edit `backend/src/services/recommendationService.js` to customize the keyword matching logic.

## Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Verify your `.env` file has correct values
- Ensure port 5000 is not in use

### Frontend can't connect to backend

- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

### No tweets appearing

- Verify X API credentials are correct
- Check API rate limits on Twitter Developer Portal
- Ensure your Bearer Token has read permissions
- Check backend logs for API errors

### Meme uploads failing

- Check file size (max 10MB)
- Verify file format (JPG, PNG, GIF, WebP)
- Ensure `uploads/` directory exists in backend
- Check backend logs for errors

## Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables on your hosting platform
2. Ensure MongoDB Atlas is configured
3. Update FRONTEND_URL to your deployed frontend URL

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update `REACT_APP_API_URL` to your deployed backend URL
2. Run `npm run build` to create production build
3. Deploy the `build` folder

## Security Notes

- Never commit `.env` files
- Keep your Twitter API credentials secret
- Implement rate limiting in production
- Add input validation and sanitization
- Consider adding CAPTCHA for uploads
- Implement authentication for admin features

## Future Enhancements

- User authentication and profiles
- Meme tagging and categories
- Trending memes dashboard
- Direct X posting integration
- Meme contests and voting
- Analytics and metrics
- Push notifications
- Advanced search filters
- Meme templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own memecoin communities!

## Support

For issues and questions:
- Open an issue on GitHub
- Contact @rainbowflish on X
- Join our community discussions

---

Built with 🌈 for the Rainbow Fish $fish community
