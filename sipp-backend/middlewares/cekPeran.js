const { errorHttp } = require('./errorHandler');

// Pemakaian: cekPeran('admin') atau cekPeran('admin', 'sopir')
module.exports = (...peranDiizinkan) => (req, res, next) => {
  if (!req.pengguna) {
    return next(errorHttp(401, 'Token tidak ditemukan'));
  }

  const peranTernormalisasi = peranDiizinkan.map((p) => {
    if (p === 'driver') return 'sopir';
    if (p === 'customer') return 'penumpang';
    return p;
  });

  const peranPengguna = req.pengguna.peran;
  const cocok = peranDiizinkan.includes(peranPengguna) || peranTernormalisasi.includes(peranPengguna);

  if (!cocok) {
    return next(errorHttp(403, 'Anda tidak memiliki akses'));
  }
  next();
};
