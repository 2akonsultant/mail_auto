# Quick OAuth Setup Checklist

## ✅ Step-by-Step Checklist

- [ ] **Step 1:** Go to https://console.cloud.google.com/
- [ ] **Step 2:** Create a new project (name: "Service Booking App")
- [ ] **Step 3:** Enable "People API" (APIs & Services → Library → Search "People API" → Enable)
- [ ] **Step 4:** Configure OAuth consent screen:
  - [ ] Go to "APIs & Services" → "OAuth consent screen"
  - [ ] Choose "External"
  - [ ] Fill app name and your email
  - [ ] Add your email as test user
- [ ] **Step 5:** Create OAuth credentials:
  - [ ] Go to "APIs & Services" → "Credentials"
  - [ ] Click "+ CREATE CREDENTIALS" → "OAuth client ID"
  - [ ] Choose "Web application"
  - [ ] Add redirect URI: `http://localhost:3000/auth/google/callback`
  - [ ] Click "Create"
  - [ ] **COPY Client ID and Client Secret**
- [ ] **Step 6:** Update `.env` file:
  ```env
  GOOGLE_CLIENT_ID=paste_your_client_id_here
  GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
  ```
- [ ] **Step 7:** Restart server (stop with Ctrl+C, then `npm start`)

## 🔗 Direct Links

- **Google Cloud Console:** https://console.cloud.google.com/
- **Credentials Page:** https://console.cloud.google.com/apis/credentials
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **API Library:** https://console.cloud.google.com/apis/library

## 📝 What You'll Get

After creating credentials, Google will show you:
- **Client ID:** Looks like `123456789-abc...apps.googleusercontent.com`
- **Client Secret:** Looks like `GOCSPX-abc...xyz`

Copy both and paste them into your `.env` file!
