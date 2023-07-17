const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

/***
 * GET all products
 */

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("allProducts", {
      title: "All products",
      products,
    });
  } catch (error) {
    console.lof(error);
  }
};

/***
 * GET products by category
 */

exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.render("catProducts", {
      title: "All products",
      products,
    });
  } catch (error) {
    console.lof(error);
  }
};

/***
 * GET products details
 */

exports.getProductsDetail = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.product });
    const loggedIn = req.isAuthenticated() ? true : false;
    res.render("product", {
      title: product.title,
      product,
      loggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};
