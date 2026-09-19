const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verfiyToken");
const messageController = require("../controllers/messages.controller");

router.get("/:orderId", verifyToken, messageController.getMessages);

module.exports = router;
