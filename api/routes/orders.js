const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')


const OrderController =  require('../controllers/orders');

// Get All Orders
router.get("/",checkAuth , OrderController.orders_get_all);

// Add Orders
router.post("/",  checkAuth , OrderController.orders_create_order);

// Update Order

router.patch("/:orderId",  checkAuth , OrderController.orders_update);

// get Order By ID
router.get("/:orderId",  checkAuth, OrderController.orders_get_by_id);


// Delete Product By Id
router.delete("/:orderId",  checkAuth , OrderController.orders_deletes);

module.exports = router;
