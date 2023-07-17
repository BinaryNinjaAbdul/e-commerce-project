const express = require("express");
const adminPageController = require("../controller/adminPageController");
const auth = require('../config/off');
const isAdmin = auth.isAdmin;

const router = express.Router();

router.route("/pages").get(isAdmin, adminPageController.pages);

router
  .route("/add-page")
  .get(isAdmin, adminPageController.addPage)
  .post(adminPageController.createPage);

router.route("/reorder-pages").post(adminPageController.reorderPages);

router
  .route("/edit-page/:id")
  .get(isAdmin, adminPageController.editpage)
  .post(adminPageController.updatePage);

router
  .route("/delete-page/:id")
  .get(isAdmin, adminPageController.deletePage);

module.exports = router;
