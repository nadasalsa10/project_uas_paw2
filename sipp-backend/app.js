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

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server SIPP berjalan!');
});

// ---------- Route per modul ----------
app.use('/auth', authRoutes);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Koneksi Database & Jalankan Server ----------
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sipp';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung:', err.message);
    process.exit(1);
  });