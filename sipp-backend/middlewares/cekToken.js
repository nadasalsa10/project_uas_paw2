const jwt = require('jsonwebtoken');
const { errorHttp } = require('./errorHandler');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(errorHttp(401, 'Token tidak ditemukan'));
  }

  try {
    const token = header.split(' ')[1];
    req.pengguna = jwt.verify(token, process.env.JWT_SECRET || 'kunci_rahasia_jwt_sipp_kelompok_5'); // { id, peran, iat, exp }
    next();
  } catch (err) {
    next(errorHttp(401, 'Token tidak valid atau sudah kedaluwarsa'));
  }
};
