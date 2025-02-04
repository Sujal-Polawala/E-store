const express = require('express');
const {
    register,
    login,
} = require('../../controllers/seller/sellerAuthController');

const router = express.Router();

// seller registration and login
router.post('/seller/register', register);
router.post('/seller/login', login);

module.exports = router;