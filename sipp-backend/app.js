require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Koneksi Database (Cached untuk Serverless Vercel) ----------
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sipp';

let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('Terhubung ke MongoDB');
  } catch (err) {
    console.error('Gagal terhubung ke MongoDB:', err.message);
  }
};

// Pastikan koneksi DB dipanggil setiap ada request masuk
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server SIPP berjalan!');
});

// ---------- Route per modul ----------
app.use('/auth', authRoutes);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Jalankan Server Lokal & Export untuk Vercel ----------
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  });
}

module.exports = app;