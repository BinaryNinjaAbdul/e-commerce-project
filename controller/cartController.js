const Product = require("../models/productModel");

/***
 * GET add product to cart
 */

exports.addToCart = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug });

    if (typeof req?.session?.cart === "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: product.slug,
        qty: 1,
        price: parseFloat(product.price).toFixed(2),
        image: `/product_images/${product._id}/${product.image}`,
      });
    } else {
      let cart = req?.session?.cart;
      let newItem = true;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
          cart[i].qty++;
          newItem = false;
          break;
        }
      }

      if (newItem) {
        req.session.cart.push({
          title: product.slug,
          qty: 1,
          price: parseFloat(product.price).toFixed(2),
          image: `/product_images/${product._id}/${product.image}`,
        });
      }
    }

    req.flash("success", "Product Added");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

/***
 * GET checkout page
 */

exports.getCheckOutPage = (req, res) => {
  if (req?.session?.cart && req?.session?.cart?.length == 0) {
    delete req?.session?.cart;
    return res.redirect("/cart/checkout");
  }
  res.render("checkout", {
    title: "Checkout",
    cart: req?.session?.cart,
  });
};

/***
 * GET update product
 */

exports.updateCart = async (req, res) => {
  try {
    const slug = req.params.product;
    let cart = req?.session?.cart;
    const action = req.query.action;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].title == slug) {
        switch (action) {
          case "add":
            cart[i].qty++;
            break;
          case "remove":
            cart[i].qty--;
            if (cart[i].qty < 1) cart.splice(i, 1);
            if (cart.length == 0) delete req?.session?.cart;
            break;
          case "clear":
            cart.splice(i, 1);
            if (cart.length == 0) delete req?.session?.cart;
            break;
          default:
            console.log("Update problem");
            break;
        }
        break;
      }
    }

    req.flash("success", "Cart Updated");
    res.redirect("/cart/checkout");
  } catch (error) {
    console.log(error);
  }
};

/***
 * GET Clear cart
 */

exports.clearCart = (req, res) => {
  delete req?.session?.cart;
  req.flash("success", "Cart Cleared!");
  res.redirect("/cart/checkout");
};

