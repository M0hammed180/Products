const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const verifyToken = require("../middleware/verfiyToken");

const productController = require("../controllers/product.controller");

router.post("/", upload.array("images", 5), productController.addProduct);
router.patch("/", upload.array("images", 5), productController.editProduct);
router.delete("/:id", productController.removeProduct);
router.get("/products", productController.showProducts);
router.get("/product_detail/:id/:userId", productController.showProductDetails);
router.get(
  "/product_detail_no_login/:id",
  productController.showProductDetailsNoLogin,
);
router.get("/product_no_login/:id", productController.showProductinNoLogin);
router.post("/event_product", productController.trackProductEvent);

module.exports = router;
