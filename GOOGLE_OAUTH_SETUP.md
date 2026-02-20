# Google OAuth Setup Guide

## Step-by-Step Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter a project name (e.g., "Service Booking App")
4. Click **"Create"**

### 2. Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and click **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Fill in:
   - **App name:** Service Booking App
   - **User support email:** Your email
   - **Developer contact:** Your email
4. Click **"Save and Continue"**
5. On **Scopes** page, click **"Save and Continue"**
6. On **Test users** page (if needed), add your email, then **"Save and Continue"**
7. Click **"Back to Dashboard"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name it (e.g., "Web Client")
5. **Authorized redirect URIs:**
   - For local: `http://localhost:3000/auth/google/callback`
   - For Render: `https://YOUR-APP-NAME.onrender.com/auth/google/callback`
6. Click **"Create"**
7. **Copy the Client ID and Client Secret** (you'll need these!)

### 5. Update Your .env File

Open `.env` in your project and update:

```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 6. Restart the Server

After updating `.env`, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### 7. Test

1. Open `http://localhost:3000`
2. Click **"Sign in with Google"**
3. You should be redirected to Google's login page
4. After logging in, you'll receive an OTP via email

---

## Troubleshooting

### Error: "invalid_client"
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that there are no extra spaces or quotes in your `.env` file
- Restart the server after updating `.env`

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches `CALLBACK_URL` in your `.env`
- For local: `http://localhost:3000/auth/google/callback`
- Check for trailing slashes or typos

### OAuth consent screen issues
- Make sure you've completed the OAuth consent screen setup
- If testing, add your email as a test user
