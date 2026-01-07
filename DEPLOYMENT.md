# Deployment Guide 🚀

Complete guide to deploy Rainbow Fish webapp for FREE using Render (backend) and Vercel (frontend).

## Prerequisites

- ✅ MongoDB Atlas set up (see [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md))
- ✅ GitHub repository with your code
- ✅ X API Bearer Token

## Option 1: Render (Backend) + Vercel (Frontend) - RECOMMENDED

### Part A: Deploy Backend to Render

#### 1. Create Render Account
- Go to https://render.com/
- Sign up with your GitHub account
- Authorize Render to access your repositories

#### 2. Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Rainbow-raider`
3. Configure the service:
   - **Name**: `rainbow-fish-backend`
   - **Region**: Choose closest to you
   - **Branch**: `claude/rainbow-fish-webapp-KLa1O` (or your main branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

#### 3. Add Environment Variables
In the "Environment Variables" section, add:

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://rainbowfish:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rainbow-fish?retryWrites=true&w=majority
TWITTER_BEARER_TOKEN = AAAAAAAAAAAAAAAAAAAAAHZN6wEAAAAAt72qvHiVUsAx2zXiqHFLR7EX0Y8%3DfuiQzDQcIQS06zhX7EqXeAVDO3kNnkimmlNQvY0qjGEirkiugO
FRONTEND_URL = https://your-app-name.vercel.app
```

**Important**:
- Replace MongoDB URI with your actual Atlas connection string
- We'll update `FRONTEND_URL` after deploying frontend

#### 4. Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend URL will be: `https://rainbow-fish-backend.onrender.com`
4. Test it: Visit `https://rainbow-fish-backend.onrender.com/api/health`

### Part B: Deploy Frontend to Vercel

#### 1. Create Vercel Account
- Go to https://vercel.com/
- Sign up with your GitHub account
- Authorize Vercel to access your repositories

#### 2. Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `Rainbow-raider`
3. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### 3. Add Environment Variable
In "Environment Variables", add:

```
REACT_APP_API_URL = https://rainbow-fish-backend.onrender.com/api
```

Replace with your actual Render backend URL.

#### 4. Deploy
1. Click **"Deploy"**
2. Wait 3-5 minutes
3. Your frontend URL will be: `https://rainbow-fish-webapp.vercel.app`

#### 5. Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Click "Environment" in sidebar
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL = https://rainbow-fish-webapp.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

### Part C: Update MongoDB Atlas Network Access

1. Go to MongoDB Atlas dashboard
2. Click "Network Access" in sidebar
3. Click "Add IP Address"
4. Add Render's IP addresses or keep 0.0.0.0/0 for simplicity
5. Click "Confirm"

---

## Option 2: Railway (Backend + Frontend) - ALTERNATIVE

Railway can host both backend and frontend in one place.

#### 1. Create Railway Account
- Go to https://railway.app/
- Sign up with GitHub

#### 2. Deploy from GitHub
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `Rainbow-raider` repository
3. Railway will detect both backend and frontend

#### 3. Configure Backend Service
1. Select the backend service
2. Add environment variables in Settings:
   ```
   MONGODB_URI = your_atlas_connection_string
   TWITTER_BEARER_TOKEN = your_bearer_token
   FRONTEND_URL = https://${{RAILWAY_STATIC_URL}}
   PORT = 5000
   ```
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`

#### 4. Configure Frontend Service
1. Select the frontend service
2. Add environment variable:
   ```
   REACT_APP_API_URL = https://backend-service-url.railway.app/api
   ```
3. Set root directory: `frontend`
4. Build command: `npm install && npm run build`

---

## Option 3: Fly.io (Backend) - ALTERNATIVE

#### 1. Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

#### 2. Login
```bash
fly auth login
```

#### 3. Deploy Backend
```bash
cd backend
fly launch --name rainbow-fish-backend
```

Follow the prompts and add environment variables via:
```bash
fly secrets set MONGODB_URI="your_connection_string"
fly secrets set TWITTER_BEARER_TOKEN="your_token"
fly secrets set FRONTEND_URL="your_frontend_url"
```

---

## Testing Your Deployment

### Test Backend
Visit: `https://your-backend-url.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-07T...",
  "service": "Rainbow Fish Backend"
}
```

### Test Frontend
1. Visit your frontend URL
2. Try searching for tweets (should work if X API is configured)
3. Try uploading a meme
4. Test email signup

### Common Issues

**Backend Health Check Failing**
- Check MongoDB Atlas connection string
- Verify Network Access in Atlas allows connections
- Check Render logs for errors

**Frontend Can't Connect to Backend**
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Ensure `FRONTEND_URL` is set in backend environment

**Tweets Not Loading**
- Verify X API Bearer Token is correct
- Check backend logs for Twitter API errors
- Verify API rate limits haven't been exceeded

**Meme Uploads Failing**
- Render's free tier has limited disk space
- Consider using cloud storage (Cloudinary, AWS S3) for production
- Check file size limits (10MB)

---

## Free Tier Limitations

### Render Free Tier:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free
- Limited disk space (not persistent)

### Vercel Free Tier:
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions limited to 10s execution time

### Railway Free Tier:
- $5 credit/month
- Good for small projects
- Credit resets monthly

### Upgrading:
- Render Pro: $7/month for always-on service
- Vercel Pro: $20/month for teams
- Railway: Pay as you go after credit

---

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### For Render (Backend):
1. Go to service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records

---

## Environment Variables Summary

### Backend (Render/Railway):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
TWITTER_BEARER_TOKEN=AAAAAAA...
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel):
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Monitoring & Logs

### Render:
- View logs: Service Dashboard → Logs tab
- Monitor health: Service Dashboard → Events tab

### Vercel:
- View logs: Project → Deployments → Click deployment → View logs
- Monitor analytics: Project → Analytics

### MongoDB Atlas:
- Monitor database: Atlas Dashboard → Metrics
- View activity: Atlas Dashboard → Activity Feed

---

## Production Checklist

- ✅ MongoDB Atlas cluster created
- ✅ Database user created with password
- ✅ Network Access configured
- ✅ Backend deployed to Render
- ✅ Frontend deployed to Vercel
- ✅ Environment variables configured
- ✅ CORS settings updated
- ✅ Health check passing
- ✅ Tweets loading correctly
- ✅ Meme upload working
- ✅ Email signup functional

---

## Updating Your Deployment

### Auto-Deploy (Recommended):
Both Render and Vercel support auto-deploy from GitHub:
1. Push changes to your GitHub repository
2. Services automatically detect changes
3. Deployment starts automatically

### Manual Deploy:
- **Render**: Dashboard → Manual Deploy → Deploy latest commit
- **Vercel**: Dashboard → Deployments → Redeploy

---

## Cost Estimation

**Free tier is sufficient for:**
- Learning and development
- Small communities (< 100 daily users)
- MVP testing

**Upgrade when:**
- Need faster response times (no spin-down)
- Higher traffic (> 1000 daily users)
- Persistent file storage required
- Custom domains needed

---

Need help? Check the troubleshooting section or open an issue on GitHub! 🐠🌈
