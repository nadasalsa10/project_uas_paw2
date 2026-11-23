const mongoose = require('mongoose');

const penggunaSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    kataSandi: { type: String, required: true, minlength: 6, select: false },
    peran: { type: String, enum: ['admin', 'sopir', 'penumpang'], default: 'penumpang' },
    telepon: { type: String, trim: true },
    nomorSim: { type: String, trim: true }, // khusus sopir
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pengguna', penggunaSchema, 'pengguna');