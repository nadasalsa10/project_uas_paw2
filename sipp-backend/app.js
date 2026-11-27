require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Koneksi Database (Serverless & Local Friendly) ----------
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-uas-paw2';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('Terhubung ke MongoDB');
  } catch (err) {
    console.error('Koneksi MongoDB gagal/ditunda:', err.message);
  }
};

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use((req, res, next) => {
  req.body = req.body ?? {};
  next();
});

// Sambungkan DB saat ada request jika belum tersambung
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server SIPP berjalan!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Server SIPP REST API berjalan!' });
});

// ---------- Route per modul ----------
// Mendukung /auth dan /api/auth agar sinkron dengan pengujian Postman
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// ---------- Handler 404 dan error handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// Jalankan server jika dijalankan secara lokal (bukan Vercel Serverless)
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  });
}

module.exports = app;
