const mongoose = require('mongoose');

const ruteSchema = new mongoose.Schema(
  {
    asal: { type: String, required: true, trim: true },
    tujuan: { type: String, required: true, trim: true },
    durasiMenit: { type: Number, default: 300, min: 1 },
    hargaDasar: { type: Number, required: true, min: 0 },
    aktif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rute', ruteSchema, 'rute');