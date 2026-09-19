const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verfiyToken");

const cartController = require("../controllers/cart.controller");

router.get("/mycart/:userId", cartController.showCart);
router.get("/mycartpro/:userId", cartController.showCartwithPro);
router.post("/add", cartController.addtoCart);
router.post("/edit", cartController.updateCartQuantity);
router.post("/delete", cartController.removeProductFromCart);

module.exports = router;
