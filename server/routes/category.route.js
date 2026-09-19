const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");

const categoryController = require("../controllers/category.controller");

router.post("/", upload.single("image"), categoryController.addCategory);
router.get("/", categoryController.showCategorys);

module.exports = router;
