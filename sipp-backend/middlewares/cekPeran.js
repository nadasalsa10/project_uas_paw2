const { errorHttp } = require('./errorHandler');

// Pemakaian: cekPeran('admin') atau cekPeran('admin', 'sopir')
module.exports = (...peranDiizinkan) => (req, res, next) => {
  if (!req.pengguna || !peranDiizinkan.includes(req.pengguna.peran)) {
    return next(errorHttp(403, 'Anda tidak memiliki akses'));
  }
  next();
};