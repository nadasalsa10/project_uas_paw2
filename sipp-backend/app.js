require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Koneksi Database (Cached untuk Serverless) ----------
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sipp';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI belum diatur di Environment Variables Vercel');
  }
  await mongoose.connect(mongoURI);
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

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server SIPP berjalan!');
});

// ---------- Route per modul (hubungkan DB sebelum masuk controller) ----------
app.use('/auth', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
}, authRoutes);

// ---------- Handler 404 dan error handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Jalankan Server Lokal & Export untuk Vercel ----------
if (process.env.NODE_ENV !== 'production') {
  connectDB()
    .then(() => {
      console.log('Terhubung ke MongoDB');
      app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
    })
    .catch((err) => console.error('Gagal terhubung:', err.message));
}

module.exports = app;