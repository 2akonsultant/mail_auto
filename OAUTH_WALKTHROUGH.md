# Complete Google OAuth Setup Walkthrough

## 🎯 Goal
Get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to enable Google login.

---

## 📋 STEP 1: Sign In to Google Cloud Console

1. **Open:** https://console.cloud.google.com/
2. **Sign in** with your Google account (vamshiirugadindla70322@gmail.com)

---

## 📋 STEP 2: Create a New Project

1. At the top, click the **project dropdown** (shows current project name)
2. Click **"New Project"**
3. **Project name:** `Service Booking App`
4. Click **"Create"**
5. Wait a few seconds, then **select your new project** from the dropdown

**Visual Guide:**
```
[Project Dropdown ▼] → New Project → Enter Name → Create → Select Project
```

---

## 📋 STEP 3: Enable People API

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"**
3. In the search box, type: **"People API"**
4. Click on **"People API"** (by Google)
5. Click the blue **"ENABLE"** button
6. Wait for it to enable (you'll see a green checkmark)

**Visual Guide:**
```
Left Menu → APIs & Services → Library → Search "People API" → Enable
```

---

## 📋 STEP 4: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**
2. **User Type:** Select **"External"** → Click **"CREATE"**
3. **App information:**
   - **App name:** `Service Booking App`
   - **User support email:** Select `vamshiirugadindla70322@gmail.com`
   - **App logo:** (Skip - optional)
   - **App domain:** (Skip - optional)
   - **Developer contact:** `vamshiirugadindla70322@gmail.com`
4. Click **"SAVE AND CONTINUE"**
5. **Scopes page:** Click **"SAVE AND CONTINUE"** (default scopes are fine)
6. **Test users page:**
   - Click **"+ ADD USERS"**
   - Enter: `vamshiirugadindla70322@gmail.com`
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**
7. **Summary page:** Click **"BACK TO DASHBOARD"**

**Visual Guide:**
```
APIs & Services → OAuth consent screen → External → CREATE
→ Fill form → SAVE AND CONTINUE (3 times) → BACK TO DASHBOARD
```

---

## 📋 STEP 5: Create OAuth 2.0 Credentials ⭐ (MOST IMPORTANT)

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. At the top, click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"**
4. **Application type:** Select **"Web application"**
5. **Name:** `Web Client` (or any name you like)
6. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Enter exactly: `http://localhost:3000/auth/google/callback`
   - (Make sure there's no trailing slash!)
7. Click **"CREATE"**
8. **IMPORTANT:** A popup will appear with:
   - **Your Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)
   - **Your Client Secret** (looks like: `GOCSPX-abc...xyz`)
9. **COPY BOTH VALUES** - you'll need them!

**Visual Guide:**
```
Credentials → + CREATE CREDENTIALS → OAuth client ID
→ Web application → Name → Add URI: http://localhost:3000/auth/google/callback
→ CREATE → COPY Client ID and Secret
```

---

## 📋 STEP 6: Update Your .env File

1. Open `.env` file in your project (`e:\mail service\.env`)
2. Find these two lines:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
3. Replace `your_google_client_id` with your **Client ID**
4. Replace `your_google_client_secret` with your **Client Secret**

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

**⚠️ Important:**
- No spaces around `=`
- No quotes around values
- Copy exactly as shown (no extra characters)

---

## 📋 STEP 7: Restart Your Server

1. Stop the current server (if running):
   - In terminal, press `Ctrl + C`
2. Start it again:
   ```bash
   npm start
   ```
3. You should see: `Server running on port 3000` (without the OAuth warning)

---

## ✅ STEP 8: Test It!

1. Open browser: `http://localhost:3000`
2. Click **"Sign in with Google"**
3. You should be redirected to Google's login page
4. Sign in with your Google account
5. You'll receive an OTP email at `vamshiirugadindla70322@gmail.com`

---

## 🔗 Quick Links

- **Main Console:** https://console.cloud.google.com/
- **Credentials:** https://console.cloud.google.com/apis/credentials
- **OAuth Consent:** https://console.cloud.google.com/apis/credentials/consent
- **API Library:** https://console.cloud.google.com/apis/library

---

## 🆘 Troubleshooting

### "invalid_client" Error
- ✅ Check `.env` file - make sure Client ID and Secret are correct
- ✅ No extra spaces or quotes
- ✅ Restart server after updating `.env`

### "redirect_uri_mismatch" Error
- ✅ Make sure redirect URI in Google Console is exactly: `http://localhost:3000/auth/google/callback`
- ✅ No trailing slash
- ✅ Check for typos

### Can't Find Credentials
- ✅ Make sure you're in the correct project
- ✅ Check "Credentials" page (not "OAuth consent screen")
- ✅ Look for "OAuth 2.0 Client IDs" section

### OAuth Consent Screen Issues
- ✅ Make sure you completed all steps
- ✅ Add your email as a test user
- ✅ Wait a few minutes after setup for changes to propagate

---

## 📸 What to Look For

**Client ID Format:**
```
123456789012-abcdefghijklmnopqrstuvwxyz123.apps.googleusercontent.com
```

**Client Secret Format:**
```
GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

Both will be shown in a popup after clicking "CREATE" in Step 5.

---

## 💡 Pro Tips

1. **Keep credentials secret** - Never share your Client Secret publicly
2. **Use different credentials** for production (Render) vs local development
3. **Test users** - Only emails added as test users can sign in during testing
4. **Redirect URIs** - Add both localhost and your Render URL when deploying

---

**Need help?** If you get stuck at any step, let me know which step and what error you see!
