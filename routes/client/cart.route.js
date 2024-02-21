const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
router.get("/", controller.index);
router.post("/add/:productId", controller.cartAdd);
router.get("/delete/:productId",controller.delete);
router.get("/update/:quantity/:productId", controller.updateQuantity);
module.exports = router;