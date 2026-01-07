# Quick Start Guide 🚀

Get Rainbow Fish webapp running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be v14+
mongod --version  # Should be installed
```

## 1. Install Dependencies

```bash
# From root directory
npm run install:all
```

Or manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2. Configure Environment

### Backend Configuration

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/rainbow-fish
PORT=5000
TWITTER_BEARER_TOKEN=your_bearer_token_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 3. Start MongoDB

```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas and update the connection string.

## 4. Run the App

### Option A: Run Both Together (Recommended)

```bash
npm run dev
```

### Option B: Run Separately

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

## 5. Access the App

Open your browser to: **http://localhost:3000**

## Testing Without X API

If you don't have X API credentials yet, you can still test:

1. **Meme Gallery** - Upload and browse memes
2. **Email Signup** - Test community signup
3. **UI/UX** - Explore the Rainbow Fish theme

The tweet feed will show an error message but the rest of the app will work.

## Getting X API Credentials

1. Go to https://developer.twitter.com/
2. Create a new app
3. Generate a Bearer Token
4. Copy to `backend/.env`

## Common Issues

**Port already in use:**
```bash
# Change PORT in backend/.env to 5001
# Update REACT_APP_API_URL in frontend/.env
```

**MongoDB connection failed:**
```bash
# Start MongoDB: mongod
# Or use MongoDB Atlas connection string
```

**CORS errors:**
```bash
# Ensure FRONTEND_URL in backend/.env matches your frontend URL
```

## Next Steps

- Upload some test memes
- Try searching for tweets with $fish
- Test the meme recommendation feature
- Sign up with your email

For full documentation, see [README.md](README.md)

---

🐠 Happy fishing in the memecoin seas! 🌈
