const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal koneksi database' });
  }
});

app.get('/', (req, res) => res.json({ message: 'SIPP API berjalan' }));

module.exports = app;