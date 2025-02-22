const express = require('express');
const { adminLogin } = require('../../controllers/admin/adminAuthController')

const { getTotalUsers, getTotalOrders, getTotalProducts, getStatus } = require('../../controllers/admin/dashboardController');

const { approveRequest, getSellerRequests, updateRequestStatus } = require('../../controllers/seller/sellerRequestController') 

const router = express.Router();
// admin login
 router.post('/api/admin/login', adminLogin);

 // dashboard data
 router.get('/admin/total-users', getTotalUsers);
 router.get('/admin/total-orders', getTotalOrders);
 router.get('/admin/total-products', getTotalProducts);
router.put('/admin/users/:userId/status', getStatus);

// seller requests
 router.get('/api/admin/seller-requests', getSellerRequests);
 router.post('/api/admin/approve-request', approveRequest);
 router.post("/api/admin/update-request-status", updateRequestStatus);

module.exports = router;