# Quick Deployment Guide

## The Error
The Netlify CLI deployment failed due to plugin installation issues on Windows. This is a known issue with the `@netlify/plugin-nextjs` package.

## ✅ Recommended Solution: Deploy via Git

This is the most reliable method and enables automatic deployments:

### Step 1: Initialize Git (if not already done)
```powershell
git init
git add .
git commit -m "Initial commit - Cleaning Roster System"
```

### Step 2: Create a GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "cleaning-roster-system")
3. Don't initialize with README (we already have one)

### Step 3: Push to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/cleaning-roster-system.git
git branch -M main
git push -u origin main
```

### Step 4: Connect to Netlify
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Click "GitHub" and authorize Netlify
4. Select your `cleaning-roster-system` repository
5. Build settings (should auto-detect):
   - **Build command:** `pnpm install && pnpm run build`
   - **Publish directory:** `.next`
6. Click "Deploy site"

### Step 5: Wait for Deployment
- Netlify will build and deploy your site
- You'll get a URL like: `https://ourroster.netlify.app`

## Alternative: Manual Zip Upload

If you prefer not to use Git:

1. Build the project locally (already done ✅)
2. Go to https://app.netlify.com/projects/ourroster
3. Drag and drop the `.next` folder to the "Deploys" tab

## Your Site Details
- **Admin URL:** https://app.netlify.com/projects/ourroster
- **Site URL:** https://ourroster.netlify.app
- **Project ID:** 63d2247b-fd31-40d8-844e-bdd7a799d02d

## After Deployment

Once deployed, you can:
- Configure a custom domain
- Enable HTTPS (automatic)
- Set up environment variables (if needed)
- Enable deploy previews for branches

## Need Help?

The build succeeded locally, so the code is ready. The issue is just with the CLI deployment method on Windows. Using Git deployment will work perfectly!
