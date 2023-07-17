const express = require("express");
const pagesController = require("../controller/pagesController");

const router = express.Router();

router.route("/").get(pagesController.home);
router.route("/:slug").get(pagesController.getPage);

module.exports = router;
