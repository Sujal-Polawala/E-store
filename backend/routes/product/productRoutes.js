// /routes/productRoutes.js

const express = require('express');
const { insertProducts, getAllProduct, getAllProducts, fetchProductById } = require('../../controllers/product/productController');

const router = express.Router();

// POST route to insert products
router.post('/api/insert', insertProducts);

// GET route to fetch all products
router.get('/api/products/:category', getAllProduct);

router.get('/api/products', getAllProducts);

router.get('/products/:id', fetchProductById);
module.exports = router;
