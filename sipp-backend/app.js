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

<<<<<<< HEAD
// ---------- Route per modul (hubungkan DB sebelum masuk controller) ----------
app.use('/auth', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
}, authRoutes);

=======
app.get('/api', (req, res) => {
  res.json({ message: 'Server SIPP REST API berjalan!' });
});

// ---------- Route per modul ----------
// Mendukung akses /auth maupun /api/auth agar sinkron dengan laporan dan pengujian
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

>>>>>>> 75a2baffaa421e026e0b62fa65e91d1c34f94003
// ---------- Handler 404 dan error handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

<<<<<<< HEAD
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
=======
// Jalankan app.listen hanya di lingkungan lokal (bukan serverless Vercel)
if (!process.env.VERCEL) {
  sambungDB().then(() => {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  });
}

module.exports = app;
>>>>>>> 75a2baffaa421e026e0b62fa65e91d1c34f94003
