# Service Booking App

A small web app where customers can sign in with Gmail, verify their email with an OTP, and book services. Confirmation emails are sent after each booking.

## Features

- **Services** – List of bookable services (e.g. Haircut, Manicure, Facial).
- **Sign in with Google** – Uses Google OAuth to get the user’s email.
- **OTP verification** – After Google sign-in, a 6-digit OTP is sent to the user’s email; they must enter it to continue.
- **Booking** – Logged-in users can pick a service, date, and time to book.
- **Confirmation email** – After a booking, the user receives an email with the booking details.

## Quick start (local)

1. Copy `.env.example` to `.env` and set:
   - Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CALLBACK_URL=http://localhost:3000/auth/google/callback`
   - Email (e.g. Gmail): `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
   - `SESSION_SECRET` (any long random string)
2. Install and run:
   ```bash
   npm install
   npm start
   ```
3. Open `http://localhost:3000`.

## Deploy on Render

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions and required environment variables.

Summary:

- Create a **Web Service** on Render, connect your repo, use **Build:** `npm install`, **Start:** `npm start`.
- Set all env vars from `.env.example` in the Render dashboard; set `CALLBACK_URL` to `https://<your-app>.onrender.com/auth/google/callback`.
- In Google Cloud Console, add that same URL as an authorized redirect URI for your OAuth client.

## Tech

- **Backend:** Node.js, Express, Passport (Google OAuth), Nodemailer, cookie-session.
- **Frontend:** Plain HTML, CSS, JS.
- **Deploy:** Render (see `render.yaml` and DEPLOYMENT.md).
