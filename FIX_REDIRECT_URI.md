# Fix redirect_uri_mismatch Error

## 🔴 The Problem
Google is rejecting the redirect URI because it doesn't match what's configured in Google Cloud Console.

## ✅ The Solution

### Step 1: Check Your Current Redirect URI

Your app is using: `http://localhost:3000/auth/google/callback`

### Step 2: Fix in Google Cloud Console

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Find your OAuth 2.0 Client ID** (the one you created)
3. **Click the ✏️ Edit icon** (pencil icon) next to your client ID
4. **Scroll down to "Authorized redirect URIs"**
5. **Check if this EXACT URI exists:**
   ```
   http://localhost:3000/auth/google/callback
   ```

### Step 3: Add/Update the Redirect URI

**If the URI doesn't exist:**
- Click **"+ ADD URI"**
- Enter exactly: `http://localhost:3000/auth/google/callback`
- **Important:** 
  - ✅ Must start with `http://` (not `https://`)
  - ✅ Must include port `:3000`
  - ✅ No trailing slash at the end
  - ✅ Exact path: `/auth/google/callback`

**If the URI exists but has a typo:**
- Click the **✏️ Edit icon** next to the wrong URI
- Fix it to: `http://localhost:3000/auth/google/callback`
- Or delete the wrong one and add the correct one

### Step 4: Save Changes

- Click **"SAVE"** at the bottom
- Wait a few seconds for changes to propagate

### Step 5: Try Again

1. Go back to your app: `http://localhost:3000`
2. Click "Sign in with Google" again
3. It should work now!

---

## 🔍 Common Mistakes to Avoid

❌ **Wrong:** `https://localhost:3000/auth/google/callback` (should be `http://`)  
❌ **Wrong:** `http://localhost/auth/google/callback` (missing port `:3000`)  
❌ **Wrong:** `http://localhost:3000/auth/google/callback/` (trailing slash)  
❌ **Wrong:** `http://127.0.0.1:3000/auth/google/callback` (using IP instead of localhost)  
✅ **Correct:** `http://localhost:3000/auth/google/callback`

---

## 📸 Visual Guide

In Google Cloud Console, you should see:

```
Authorized redirect URIs
┌─────────────────────────────────────────────────────────────┐
│ http://localhost:3000/auth/google/callback          [✏️] [🗑️]│
└─────────────────────────────────────────────────────────────┘
[+ ADD URI]
```

---

## 🆘 Still Not Working?

1. **Clear browser cache** and try again
2. **Wait 1-2 minutes** after saving (Google needs time to update)
3. **Double-check** the URI matches exactly (copy-paste from here)
4. **Verify** you're editing the correct OAuth client ID
5. **Check** your `.env` file has: `CALLBACK_URL=http://localhost:3000/auth/google/callback`

---

## 💡 Pro Tip

If you're deploying to Render later, you'll need to add ANOTHER redirect URI:
- Local: `http://localhost:3000/auth/google/callback`
- Render: `https://your-app-name.onrender.com/auth/google/callback`

Both can exist at the same time!
