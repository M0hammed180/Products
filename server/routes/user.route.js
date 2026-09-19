const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const verifyToken = require("../middleware/verfiyToken");

const userController = require("../controllers/users.controller");

router.post("/register", upload.single("photo"), userController.register);
router.post("/login", userController.login);
router.get("/", userController.Alluser);
router.get("/:id", verifyToken, userController.getUserById);
router.delete("/:id", verifyToken, userController.removeUser);
router.patch("/edit", verifyToken, upload.single("photo"), userController.edit);
router.get("/locations/:userId", verifyToken, userController.getUserLocation);
router.post("/location", verifyToken, userController.addLocation);
router.delete(
  "/locations/:userId/:addressId",
  verifyToken,
  userController.removeLocation,
);

module.exports = router;
