const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cekToken = require('../middlewares/cekToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profil', cekToken, authController.profil);

module.exports = router;