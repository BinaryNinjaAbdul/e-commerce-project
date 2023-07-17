const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/:category").get(productController.getProductsByCategory);
router.route("/:category/:product").get(productController.getProductsDetail);

module.exports = router;
