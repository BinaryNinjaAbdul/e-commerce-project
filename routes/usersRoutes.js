const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router
  .route("/register")
  .get(userController.register)
  .post(userController.registerUser);

router
  .route("/login")
  .get(userController.loginRender)
  .post(userController.login);

router.route("/logout").get(userController.logout);

module.exports = router;
