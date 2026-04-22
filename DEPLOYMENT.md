# Production Deployment Guide

Deploy PrideFitGym to production with Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub repository with your code pushed
- MongoDB Atlas account (or other MongoDB hosting)
- Cloudinary account (optional, for persistent file uploads)
- Vercel and Render accounts

---

## Step 1: Prepare Environment Variables

### Backend (.env) on Render

Set these environment variables in your Render service settings:

```env
# MongoDB Connection (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pridefitgym?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your_generated_jwt_secret_here

# Node Environment
NODE_ENV=production

# Server Port (Render sets this automatically, but keep for clarity)
PORT=10000

# CORS Origin (your Vercel frontend URL - set after deploying frontend)
CORS_ORIGIN=https://your-app.vercel.app

# Base URL (your Render backend URL - will be something like https://your-backend.onrender.com)
BASE_URL=https://your-backend.onrender.com

# Optional: Cloudinary for file uploads (recommended for production)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend (Vercel Environment Variables)

In your Vercel project settings, set:

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Note:** Replace `your-backend.onrender.com` with your actual Render backend URL after deployment.

---

## Step 2: Deploy Backend to Render

### Option A: Using render.yaml (Automatic)

1. Connect your GitHub repository to Render
2. Render will automatically detect `render.yaml` in your repo root
3. Create a new **Web Service** and select your repository
4. Render will use the configuration from `render.yaml`
5. Set environment variables as prompted (or in the dashboard)

### Option B: Manual Configuration

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `pridefit-backend` (or your choice)
   - **Environment:** Node
    - **Build Command:** `cd backend && npm install --production`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free (or paid for production)
5. Add environment variables from Step 1
6. Click **Create Web Service**

**Important:**
- Add your MongoDB Atlas connection string to `MONGODB_URI`
- Set `CORS_ORIGIN` to your Vercel frontend URL (deploy frontend first, then update this)
- Deploying will give you a URL like: `https://pridefit-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
cd frontend
vercel --prod
```

### Option B: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **New Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Add environment variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend.onrender.com/api` (use your actual Render URL)
6. Click **Deploy**

Vercel will automatically detect `vercel.json` configuration.

---

## Step 4: Configure CORS After Deploy

After both deployments:

1. Get your Vercel frontend URL (e.g., `https://pridefit.vercel.app`)
2. Go to Render dashboard → your backend service → **Environment** tab
3. Update `CORS_ORIGIN` to match your Vercel URL
4. Redeploy backend or manually trigger rebuild

**Alternative:** Set `CORS_ORIGIN=*` for testing (not recommended for production).

---

## Step 5: Optional - Cloudinary Setup for File Uploads

Render's filesystem is **ephemeral** - uploaded files are lost on redeploy. Use Cloudinary for persistent storage.

### Set Up Cloudinary:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add to Render environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Redeploy backend

Files will automatically upload to Cloudinary instead of local storage.

---

## Step 6: Verify Deployment

1. **Frontend:** Visit `https://your-app.vercel.app` - should load React app
2. **Backend:** Visit `https://your-backend.onrender.com/api` - should show API message
3. **Test Registration:** Create a user account
4. **Test Uploads:** Upload a profile picture and create a post with image
5. **Check Logs:** Use Render logs to debug any issues

---

## Step 7: Post-Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Enable MongoDB Atlas IP whitelist or allow all (0.0.0.0/0) temporarily
- [ ] Set `NODE_ENV=production` (already in render.yaml)
- [ ] Update `CORS_ORIGIN` to your Vercel URL
- [ ] Configure Cloudinary for file uploads (recommended)
- [ ] Test all features: auth, profile, posts, comments, admin
- [ ] Monitor Render logs for errors
- [ ] Set up custom domains (optional)

---

## Step 8: Custom Domains (Optional)

### Vercel (Frontend)
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `pridefitgym.com`)
3. Update DNS records as instructed

### Render (Backend)
1. Render Dashboard → Your Service → Settings → Custom Domain
2. Add subdomain (e.g., `api.pridefitgym.com`)
3. Update DNS with provided CNAME record

Then update environment variables:
- Frontend `REACT_APP_API_URL` → `https://api.pridefitgym.com/api`
- Backend `CORS_ORIGIN` → `https://pridefitgym.com`

---

## Troubleshooting

### Images not loading
- Check `BASE_URL` in Render environment matches your backend URL
- Verify CORS allows your frontend domain
- Ensure Cloudinary credentials are correct (if using Cloudinary)

### 401 Unauthorized
- JWT_SECRET must be set in Render environment
- Clear browser localStorage and re-login

### MongoDB Connection Fails
- Whitelist Render IPs in MongoDB Atlas (or allow all)
- Verify MONGODB_URI includes full connection string with database name
- Check MongoDB user has readWrite role

### Build Fails on Render
- Ensure `backend/package-lock.json` is committed
- Check build command syntax: `cd backend && npm install --production`
- View build logs in Render dashboard for specific error

### File Upload Errors (500)
- If using Cloudinary, verify credentials
- If using local storage, remember files are ephemeral on Render
- Consider switching to Cloudinary for production

---

## Security Best Practices

1. **JWT Secret:** Use a strong random 64+ character string
2. **MongoDB:** Create dedicated user with minimal permissions
3. **CORS:** Restrict to your frontend domain only
4. **HTTPS:** Both Vercel and Render provide HTTPS automatically
5. **Rate Limiting:** Consider adding express-rate-limit
6. **Input Validation:** Already handled by Mongoose schemas
7. **Secrets:** Never commit `.env` files (already in .gitignore)

---

## Cost & Scaling

- **Vercel Free Tier:** 100GB bandwidth, unlimited sites
- **Render Free Tier:** 750 hours/month (shared with other free services)
- **MongoDB Atlas Free:** 512MB storage, shared RAM
- **Cloudinary Free:** 25GB storage, 25GB bandwidth

For production apps, consider upgrading to paid plans.

---

## Support

- Check browser console and server logs in Render dashboard
- Review MongoDB Atlas logs for DB issues
- Open GitHub issue for bug reports

---

**Made by PrideFitGym Team**
