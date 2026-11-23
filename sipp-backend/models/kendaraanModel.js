const mongoose = require('mongoose');

const kendaraanSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true, trim: true },
    platNomor: { type: String, required: true, unique: true, uppercase: true, trim: true },
    kapasitas: { type: Number, default: 12, min: 1 },
    fasilitas: [{ type: String, trim: true }],
    kursi: [{ type: String }], // contoh: ["1A", "1B", "2A"]
    status: { type: String, enum: ['AKTIF', 'PERAWATAN'], default: 'AKTIF' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kendaraan', kendaraanSchema, 'kendaraan');