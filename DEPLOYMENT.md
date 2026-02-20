# Deploying to Render

## 1. Push your code to GitHub

Ensure this project is in a GitHub repository.

## 2. Create a Render Web Service

1. Go to [render.com](https://render.com) and sign in.
2. **New** → **Web Service**.
3. Connect your GitHub repo and select this project.
4. Use these settings:
   - **Name:** `service-booking-app` (or any name)
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Plan:** Free (or paid)

## 3. Environment variables (required)

In the Render dashboard, open your service → **Environment** and add:

| Key | Description |
|-----|-------------|
| `NODE_ENV` | `production` |
| `GOOGLE_CLIENT_ID` | From [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Same OAuth client → secret |
| `CALLBACK_URL` | `https://YOUR-SERVICE-NAME.onrender.com/auth/google/callback` (replace with your Render URL) |
| `SMTP_HOST` | `smtp.gmail.com` (or your SMTP host) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `vamshiirugadindla70322@gmail.com` |
| `SMTP_PASS` | `eqof wpsz cmwz ypsa` (Gmail App Password) |
| `MAIL_FROM` | `vamshiirugadindla70322@gmail.com` |
| `SESSION_SECRET` | A long random string (Render can auto-generate) |

## 4. Google OAuth setup

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Create an OAuth 2.0 Client ID (Web application).
   - Add **Authorized redirect URIs:**  
     `https://YOUR-SERVICE-NAME.onrender.com/auth/google/callback`
2. Enable the **Google+ API** or ensure **People** (profile, email) is in the OAuth consent screen scopes.

## 5. Deploy

Click **Deploy**. After the first deploy, your app URL will be like:

`https://service-booking-app.onrender.com`

Use this URL when setting `CALLBACK_URL` and Google redirect URIs.

---

## Local development

1. Copy `.env.example` to `.env`.
2. Fill in Google OAuth and SMTP values; use `CALLBACK_URL=http://localhost:3000/auth/google/callback` for local.
3. Run: `npm install` then `npm start`.
4. Open `http://localhost:3000`.
