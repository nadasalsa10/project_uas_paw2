const mongoose = require('mongoose');

const jadwalSchema = new mongoose.Schema(
  {
    rute: { type: mongoose.Schema.Types.ObjectId, ref: 'Rute', required: true },
    kendaraan: { type: mongoose.Schema.Types.ObjectId, ref: 'Kendaraan', required: true },
    sopir: { type: mongoose.Schema.Types.ObjectId, ref: 'Pengguna' },
    waktuBerangkat: { type: Date, required: true },
    waktuTiba: { type: Date, required: true },
    harga: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['MENUNGGU', 'BOARDING', 'DALAM_PERJALANAN', 'TIBA', 'SELESAI', 'DIBATALKAN'],
      default: 'MENUNGGU',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Jadwal', jadwalSchema, 'jadwal');