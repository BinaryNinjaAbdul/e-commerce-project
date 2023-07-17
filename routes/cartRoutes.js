const express = require("express");
const cartController = require("../controller/cartController");

const router = express.Router();

router.route("/add/:slug").get(cartController.addToCart);
router.route("/checkout").get(cartController.getCheckOutPage);

router.route("/update/:product").get(cartController.updateCart);

router.route("/clear").get(cartController.clearCart);
module.exports = router;
