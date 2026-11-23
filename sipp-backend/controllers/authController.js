const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pengguna = require('../models/penggunaModel');
const { errorHttp } = require('../middlewares/errorHandler');

// Membuat token JWT berisi id dan peran pengguna
function buatToken(pengguna) {
  return jwt.sign(
    { id: pengguna._id, peran: pengguna.peran },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

exports.register = async (req, res) => {
  const { nama, email, kataSandi, peran, telepon, nomorSim, kodeAdmin } = req.body;

  if (!nama || !email || !kataSandi) {
    throw errorHttp(400, 'nama, email, dan kataSandi wajib diisi');
  }
  if (kataSandi.length < 6) {
    throw errorHttp(400, 'kataSandi minimal 6 karakter');
  }

  // Peran bawaan penumpang; admin hanya jika kode admin benar
  let peranFinal = 'penumpang';
  if (peran === 'sopir') peranFinal = 'sopir';
  if (peran === 'admin') {
    if (!process.env.KODE_ADMIN || kodeAdmin !== process.env.KODE_ADMIN) {
      throw errorHttp(403, 'Kode admin tidak valid');
    }
    peranFinal = 'admin';
  }

  const kataSandiHash = await bcrypt.hash(kataSandi, 10);
  const pengguna = await Pengguna.create({
    nama,
    email,
    kataSandi: kataSandiHash,
    peran: peranFinal,
    telepon,
    nomorSim,
  });

  res.status(201).json({
    message: 'Registrasi berhasil',
    data: { id: pengguna._id, nama: pengguna.nama, email: pengguna.email, peran: pengguna.peran },
  });
};

exports.login = async (req, res) => {
  const { email, kataSandi } = req.body;

  if (!email || !kataSandi) {
    throw errorHttp(400, 'email dan kataSandi wajib diisi');
  }

  // kataSandi bersifat select:false, jadi harus diminta eksplisit
  const pengguna = await Pengguna.findOne({ email: email.toLowerCase() }).select('+kataSandi');
  const cocok = pengguna && (await bcrypt.compare(kataSandi, pengguna.kataSandi));

  // Pesan sengaja sama agar tidak membocorkan email mana yang terdaftar
  if (!cocok) throw errorHttp(401, 'Email atau kata sandi salah');

  res.json({
    message: 'Login berhasil',
    token: buatToken(pengguna),
    data: { id: pengguna._id, nama: pengguna.nama, email: pengguna.email, peran: pengguna.peran },
  });
};

exports.profil = async (req, res) => {
  const pengguna = await Pengguna.findById(req.pengguna.id);
  if (!pengguna) throw errorHttp(404, 'Pengguna tidak ditemukan');
  res.json({ data: pengguna });
};