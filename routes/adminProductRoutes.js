const express = require("express");
const adminProductController = require("../controller/adminProductController");
const auth = require('../config/off');
const isAdmin = auth.isAdmin;

const router = express.Router();

router.route("/products").get(isAdmin, adminProductController.products);

router
  .route("/add-product")
  .get(isAdmin, adminProductController.addProduct)
  .post(adminProductController.createProduct);

router
  .route("/edit-product/:id")
  .get(isAdmin, adminProductController.editProduct)
  .post(adminProductController.updateProduct);

router.route("/delete-product/:id").get(isAdmin, adminProductController.deleteProduct);

module.exports = router;
