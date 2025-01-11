const express = require('express');
const { placeOrder, getAllOrder, getOrderByUser, deleteOrder, getOrder, getOrderData } = require('../../controllers/order/orderController');

const router = express.Router();

// Place an order
router.post('/api/checkout', placeOrder);

// Get all orders

router.get('/api/orders', getAllOrder);

// Get an order

router.get('/api/order/:userId', getOrder);

// Get orders by user

router.get('/api/orders/user/:userId', getOrderByUser);

router.get('/api/orders/:orderId', getOrderData);
// Delete an order
router.delete('/api/orders/:id', deleteOrder);

module.exports = router;