require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Koneksi Database Caching (Serverless Friendly) ----------
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sipp';
let isConnected = false;

const sambungDB = async () => {
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

// Sambungkan DB saat ada request jika belum tersambung
app.use(async (req, res, next) => {
  await sambungDB();
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
// Mendukung akses /auth maupun /api/auth agar sinkron dengan laporan dan pengujian
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// ---------- Handler 404 dan error handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// Jalankan app.listen hanya di lingkungan lokal (bukan serverless Vercel)
if (!process.env.VERCEL) {
  sambungDB().then(() => {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  });
}

module.exports = app;
