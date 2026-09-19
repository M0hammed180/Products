const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verfiyToken");

const orderController = require("../controllers/order.controller");

router.get("/myorder/:orderId", orderController.showMyOrder);
router.get("/myorders/:userId", orderController.showMyOrders);
router.post("/add", orderController.makeOrder);

module.exports = router;
