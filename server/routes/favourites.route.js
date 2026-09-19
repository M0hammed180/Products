const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verfiyToken");

const favouritesController = require("../controllers/favourites.controller");

router.get("/myfavourites/:userId", favouritesController.showFavourites);
router.get("/myfavouritespro/:userId", favouritesController.showFavouriteswithPro);
router.post("/add", favouritesController.addtoFavourites);
router.post("/delete", favouritesController.removeProductFromFavourites);

module.exports = router;
