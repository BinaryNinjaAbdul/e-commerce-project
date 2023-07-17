const express = require("express");
const adminCateogryController = require("../controller/adminCateogryController");
const auth = require('../config/off');
const isAdmin = auth.isAdmin;

const router = express.Router();

router.route("/categories").get(isAdmin, adminCateogryController.category);

router
  .route("/add-category")
  .get(isAdmin, adminCateogryController.addCategory)
  .post(adminCateogryController.createCategory);

router
  .route("/edit-category/:id")
  .get(isAdmin, adminCateogryController.editCategory)
  .post( adminCateogryController.updateCategory);

router
  .route("/delete-category/:id")
  .get(isAdmin, adminCateogryController.deleteCategory);

module.exports = router;
