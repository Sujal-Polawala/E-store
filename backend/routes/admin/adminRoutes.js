const express = require('express');
const { adminLogin } = require('../../controllers/admin/adminAuthController')

const { getTotalUsers, getTotalOrders, getTotalProducts, getStatus } = require('../../controllers/admin/dashboardController');

const router = express.Router();
// admin login
 router.post('/api/admin/login', adminLogin);

 // dashboard data
 router.get('/admin/total-users', getTotalUsers);
 router.get('/admin/total-orders', getTotalOrders);
 router.get('/admin/total-products', getTotalProducts);
router.put('/admin/users/:userId/status', getStatus);

module.exports = router;