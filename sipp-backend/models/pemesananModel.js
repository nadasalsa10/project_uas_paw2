const mongoose = require('mongoose');

const pemesananSchema = new mongoose.Schema(
  {
    kodePemesanan: { type: String, required: true, unique: true },
    pengguna: { type: mongoose.Schema.Types.ObjectId, ref: 'Pengguna', required: true },
    jadwal: { type: mongoose.Schema.Types.ObjectId, ref: 'Jadwal', required: true },
    penumpang: [
      {
        nama: { type: String, required: true, trim: true },
        telepon: { type: String, trim: true },
        nomorKursi: { type: String, required: true },
      },
    ],
    totalBayar: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['MENUNGGU', 'LUNAS', 'DIBATALKAN', 'KEDALUWARSA'],
      default: 'MENUNGGU',
    },
    pembayaran: {
      metode: {
        type: String,
        enum: ['TRANSFER_BANK', 'VIRTUAL_ACCOUNT', 'QRIS', 'E_WALLET'],
        default: 'TRANSFER_BANK',
      },
      status: {
        type: String,
        enum: ['MENUNGGU', 'LUNAS', 'GAGAL', 'KEDALUWARSA', 'DIKEMBALIKAN'],
        default: 'MENUNGGU',
      },
      dibayarPada: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pemesanan', pemesananSchema, 'pemesanan');