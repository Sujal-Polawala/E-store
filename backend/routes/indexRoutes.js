const express = require('express');

const userAuthRoutes = require('./userAuth/userAuthRoutes');
const userRoutes = require('./user/userRoutes');
const productRoutes = require('./product/productRoutes');
const cartRoutes = require('./cart/cartRoutes');
const orderRoutes = require('./order/orderRoutes');
const paymentRoutes = require('./payment/paymentRoutes');

const router = express.Router();

// Apply middleware to all routes in this router

router.use('/', userAuthRoutes);
router.use('/', userRoutes);
router.use('/', productRoutes);
router.use('/', cartRoutes);

module.exports = router;