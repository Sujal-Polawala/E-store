// /routes/productRoutes.js

const express = require('express');
const { insertProducts, getAllProduct, getAllProducts, fetchProductById, getFilters } = require('../../controllers/product/productController');
const { getBadges} = require('../../controllers/product/badgeController')

const router = express.Router();

// POST route to insert products
router.post('/api/insert', insertProducts);

// GET route to fetch all products
router.get('/api/products/:category', getAllProduct);

router.get('/api/products', getAllProducts);

router.get('/products/:id', fetchProductById);

router.get('/api/badge', getBadges);

router.get('/api/filters', getFilters);
module.exports = router;
