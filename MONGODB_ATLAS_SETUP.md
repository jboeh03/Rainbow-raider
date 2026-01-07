# MongoDB Atlas Setup Guide 🍃

Follow these steps to set up your free MongoDB Atlas database.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or Google account
3. Complete the registration form

## Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (perfect for development)
3. Select a cloud provider and region:
   - **Provider**: AWS, Google Cloud, or Azure (doesn't matter for free tier)
   - **Region**: Choose the one closest to you
4. Name your cluster (e.g., "rainbow-fish-cluster")
5. Click **"Create"** and wait 3-5 minutes for provisioning

## Step 3: Set Up Database Access

### Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter credentials:
   - **Username**: `rainbowfish` (or your choice)
   - **Password**: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Copy and save this password!
5. Under "Database User Privileges", select **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Set Up Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, choose **"Allow Access from Anywhere"**
   - Click **"ALLOW ACCESS FROM ANYWHERE"** button
   - This adds `0.0.0.0/0` to the IP Access List
   - ⚠️ For production, use specific IP addresses
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. In the left sidebar, click **"Database"**
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://rainbowfish:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `backend/.env` in your project
2. Replace the `MONGODB_URI` line with your connection string
3. **Important**: Replace `<password>` with your actual database password
4. Add the database name to the connection string:

```env
# Before (replace this):
MONGODB_URI=mongodb://localhost:27017/rainbow-fish

# After (use your actual connection string):
MONGODB_URI=mongodb+srv://rainbowfish:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/rainbow-fish?retryWrites=true&w=majority
```

**Example with real values:**
```env
MONGODB_URI=mongodb+srv://rainbowfish:MySecurePass123@cluster0.abc123.mongodb.net/rainbow-fish?retryWrites=true&w=majority
```

### Connection String Breakdown:
- `rainbowfish` - Your database username
- `MySecurePass123` - Your database password (replace with yours!)
- `cluster0.abc123.mongodb.net` - Your cluster URL
- `rainbow-fish` - Your database name

## Step 7: Test the Connection

1. Make sure your `backend/.env` is updated with the correct connection string
2. Start your backend server:
   ```bash
   cd backend
   npm start
   ```
3. You should see: `MongoDB Connected: cluster0.xxxxx.mongodb.net`

## Troubleshooting

### "MongoServerError: bad auth"
- Check your password is correct in the connection string
- Make sure you're using the database user password, not your Atlas account password
- Ensure there are no special characters breaking the URL (if password has special chars, URL encode them)

### "MongoNetworkError: connection timeout"
- Check Network Access allows your IP (0.0.0.0/0 for development)
- Wait a few minutes after adding IP addresses
- Check your internet connection

### "Cannot connect to cluster"
- Ensure cluster is fully provisioned (takes 3-5 minutes)
- Verify the connection string format is correct
- Make sure database name is added to the connection string

### Special Characters in Password
If your password contains special characters, URL encode them:
- `@` becomes `%40`
- `:` becomes `%3A`
- `/` becomes `%2F`
- `?` becomes `%3F`
- `#` becomes `%23`

Or regenerate a password without special characters.

## Quick Reference

Your MongoDB Atlas setup checklist:
- ✅ Account created
- ✅ Free M0 cluster provisioned
- ✅ Database user created
- ✅ Network access configured (0.0.0.0/0)
- ✅ Connection string copied
- ✅ `backend/.env` updated with connection string
- ✅ Password replaced in connection string
- ✅ Database name added (`rainbow-fish`)
- ✅ Server tested and connected

## Production Notes

For production deployment:
1. Use specific IP addresses instead of 0.0.0.0/0
2. Add your hosting provider's IP addresses to Network Access
3. Use environment variables for sensitive data
4. Enable MongoDB Atlas backups
5. Monitor your database usage in the Atlas dashboard

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Connection String Guide: https://docs.mongodb.com/manual/reference/connection-string/
- Support: https://support.mongodb.com/

---

Once connected, you're ready to run the Rainbow Fish webapp! 🐠🌈
