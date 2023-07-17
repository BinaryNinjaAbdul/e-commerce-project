const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const expressValidator = require("express-validator");
const fileupload = require("express-fileupload");
const passport = require("passport");

const DB = process.env.DB_URL.replace("<PASSWORD>", process.env.DB_PASS);

mongoose
  .connect(DB)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

const app = express();

// File Upload
app.use(fileupload());

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express Session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Public folder
app.use(express.static(path.join(__dirname, "public")));

// Global Variables
app.locals.errors = null;

// Get all pages to pass to header.ejs
const Page = require("./models/pageModel");
(async function () {
  try {
    const pages = await Page.find().sort({ sorting: 1 });
    app.locals.pages = pages;
  } catch (err) {
    console.log(err);
  }
})();

// Get all categories to pass to header.ejs
const Category = require("./models/categoryModel");
(async function () {
  try {
    const categories = await Category.find();
    app.locals.categories = categories;
  } catch (err) {
    console.log(err);
  }
})();

// Express messages
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Passport config
require("./config/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.cart = req?.session?.cart;
  res.locals.user = req?.user || null;
  next();
});

// Set routers
const adminPages = require("./routes/adminPagesRoutes");
const adminCategory = require("./routes/adminCategoryRoutes");
const adminProduct = require("./routes/adminProductRoutes");
const products = require("./routes/products");
const cart = require("./routes/cartRoutes");
const user = require('./routes/usersRoutes');
const pages = require("./routes/pagesRoutes");

app.use("/admin", adminPages);
app.use("/admin", adminCategory);
app.use("/admin", adminProduct);
app.use("/products", products);
app.use("/cart", cart);
app.use("/users", user);
app.use("/", pages);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
