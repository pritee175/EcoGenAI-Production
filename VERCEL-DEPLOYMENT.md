# Deploy to Vercel - Step by Step Guide

## Prerequisites
- GitHub repository: https://github.com/pritee175/EcoGenAI.git
- Vercel account (sign up at https://vercel.com)
- Firebase project credentials

## Deployment Steps

### 1. Import Project to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Enter your GitHub repository URL: `https://github.com/pritee175/EcoGenAI`
4. Click "Import"

### 2. Configure Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: `frontend-new` (IMPORTANT: Select this folder!)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Add Environment Variables
Click "Environment Variables" and add the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDAYRoi-esn7YTRBW-oGRCAgQ0WjUVjEk8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecogenai-f90f4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecogenai-f90f4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecogenai-f90f4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=842899053497
NEXT_PUBLIC_FIREBASE_APP_ID=1:842899053497:web:cd3e59a2b142a1b4d23468
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NYSE2C477V
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: You'll need to update `NEXT_PUBLIC_API_URL` to your deployed backend URL once you deploy the backend.

### 4. Deploy
1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

### 5. Configure Firebase Authentication
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `ecogenai-f90f4`
3. Go to Authentication > Settings > Authorized domains
4. Add your Vercel domain: `your-project-name.vercel.app`

### 6. Deploy Backend (Optional)
For production, you'll need to deploy the backend separately:
- Options: Railway, Render, Heroku, AWS, or any Python hosting
- Update `NEXT_PUBLIC_API_URL` in Vercel environment variables with the backend URL

## Troubleshooting

### "frontend-new not found"
- Make sure you pushed the latest code to GitHub
- Refresh the Vercel import page
- Check that `frontend-new` folder exists in your GitHub repo

### Build Errors
- Check that all environment variables are set correctly
- Ensure Firebase credentials are valid
- Check build logs in Vercel dashboard

### Firebase Authentication Not Working
- Verify authorized domains in Firebase Console
- Check that environment variables match Firebase project
- Ensure Google Sign-In is enabled in Firebase Authentication

## Next Steps
1. Set up custom domain (optional)
2. Deploy backend to production
3. Update API URL in environment variables
4. Enable Firebase Analytics (optional)
5. Set up monitoring and error tracking

## Support
- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
