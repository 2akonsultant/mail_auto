require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory stores (use a database in production)
const otpStore = new Map(); // token -> { email, otp, expiresAt }
const bookings = [];

// Services data
const services = [
  { id: '1', name: 'Haircut & Styling', duration: '45 min', price: 25 },
  { id: '2', name: 'Hair Color', duration: '2 hours', price: 85 },
  { id: '3', name: 'Manicure', duration: '30 min', price: 20 },
  { id: '4', name: 'Pedicure', duration: '45 min', price: 35 },
  { id: '5', name: 'Facial', duration: '1 hour', price: 55 },
  { id: '6', name: 'Massage', duration: '1 hour', price: 60 },
];

// Email transporter
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function sendMail(to, subject, html) {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  return transporter.sendMail({ from, to, subject, html }).catch((err) => {
    console.error('Mail error:', err.message);
    throw err;
  });
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Validate Google OAuth credentials
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleAuth = googleClientId && googleClientSecret && 
  googleClientId !== 'your_google_client_id' && 
  googleClientSecret !== 'your_google_client_secret';

if (hasGoogleAuth) {
  const callbackURL = process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback';
  console.log('🔗 Using redirect URI:', callbackURL);
  console.log('📝 Make sure this EXACT URI is added in Google Cloud Console:');
  console.log('   https://console.cloud.google.com/apis/credentials');
  
  // Passport Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: callbackURL,
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) return done(new Error('No email from Google'));
        return done(null, { id: profile.id, email, name: profile.displayName });
      }
    )
  );
} else {
  console.warn('⚠️  Google OAuth credentials not configured. Google login will not work.');
  console.warn('   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
const isProduction = process.env.NODE_ENV === 'production';
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'default-secret-change-in-production'],
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Auth routes
app.get('/auth/google', (req, res) => {
  if (!hasGoogleAuth) {
    return res.status(500).send(`
      <html>
        <head><title>OAuth Not Configured</title></head>
        <body style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto;">
          <h1>Google OAuth Not Configured</h1>
          <p>Please set up Google OAuth credentials:</p>
          <ol>
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a></li>
            <li>Create an OAuth 2.0 Client ID (Web application)</li>
            <li>Add authorized redirect URI: <code>http://localhost:3000/auth/google/callback</code></li>
            <li>Update your <code>.env</code> file with:
              <ul>
                <li><code>GOOGLE_CLIENT_ID=your_client_id</code></li>
                <li><code>GOOGLE_CLIENT_SECRET=your_client_secret</code></li>
              </ul>
            </li>
            <li>Restart the server</li>
          </ol>
          <p><a href="/">← Back to home</a></p>
        </body>
      </html>
    `);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
});

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user;
    const otp = generateOTP();
    const token = require('crypto').randomBytes(24).toString('hex');
    otpStore.set(token, {
      email: user.email,
      name: user.name,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const html = `
      <h2>Your verification code</h2>
      <p>Hello${user.name ? ` ${user.name}` : ''},</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>It expires in 10 minutes.</p>
    `;

    sendMail(user.email, 'Your verification code', html)
      .then(() => {
        res.redirect(`/verify.html?token=${token}`);
      })
      .catch(() => {
        res.redirect('/?error=email_failed');
      });
  }
);

// Verify OTP and create session
app.post('/api/verify-otp', (req, res) => {
  const { token, otp } = req.body;
  if (!token || !otp) {
    return res.status(400).json({ error: 'Token and OTP required' });
  }
  const data = otpStore.get(token);
  if (!data) return res.status(400).json({ error: 'Invalid or expired link' });
  if (Date.now() > data.expiresAt) {
    otpStore.delete(token);
    return res.status(400).json({ error: 'OTP expired' });
  }
  if (data.otp !== String(otp).trim()) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
  otpStore.delete(token);
  req.session.user = { email: data.email, name: data.name };
  req.session.verified = true;
  return res.json({ success: true, user: req.session.user });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
});

// Get current user
app.get('/api/me', (req, res) => {
  if (req.session && req.session.verified && req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ error: 'Not authenticated' });
});

// List services
app.get('/api/services', (req, res) => {
  res.json(services);
});

// Create booking (no auth required - collect email/name from form)
app.post('/api/book', (req, res) => {
  const { serviceId, date, time, notes, email, name } = req.body;
  
  // Validate required fields
  if (!serviceId || !date || !time || !email) {
    return res.status(400).json({ error: 'Service, date, time, and email are required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  
  const service = services.find((s) => s.id === serviceId);
  if (!service) return res.status(400).json({ error: 'Invalid service' });

  // Always use email and name from form (no login/verification required)
  const bookingEmail = email;
  const bookingName = name || 'Customer';

  const booking = {
    id: String(bookings.length + 1),
    email: bookingEmail,
    name: bookingName,
    service: service.name,
    duration: service.duration,
    price: service.price,
    date,
    time,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);

  // Send confirmation email (no verification/login required)
  const html = `
    <h2>Booking Confirmed</h2>
    <p>Hello ${bookingName},</p>
    <p>Your booking has been confirmed successfully!</p>
    <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
      <h3 style="margin-top: 0;">Booking Details:</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="margin: 0.5rem 0;"><strong>Service:</strong> ${booking.service}</li>
        <li style="margin: 0.5rem 0;"><strong>Duration:</strong> ${booking.duration}</li>
        <li style="margin: 0.5rem 0;"><strong>Price:</strong> $${booking.price}</li>
        <li style="margin: 0.5rem 0;"><strong>Date:</strong> ${booking.date}</li>
        <li style="margin: 0.5rem 0;"><strong>Time:</strong> ${booking.time}</li>
        ${booking.notes ? `<li style="margin: 0.5rem 0;"><strong>Notes:</strong> ${booking.notes}</li>` : ''}
      </ul>
    </div>
    <p>We look forward to serving you!</p>
    <p>Thank you for choosing us.</p>
  `;

  // Send email and log result
  sendMail(bookingEmail, `Booking Confirmed: ${booking.service}`, html)
    .then(() => {
      console.log(`✅ Confirmation email sent to ${bookingEmail} for booking #${booking.id}`);
    })
    .catch((err) => {
      console.error(`❌ Failed to send email to ${bookingEmail}:`, err.message);
      // Don't fail the booking if email fails - booking is still created
    });

  res.status(201).json(booking);
});

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth')) return next();
  const ext = path.extname(req.path);
  if (ext) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
