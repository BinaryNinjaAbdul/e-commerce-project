const { mkdirp } = require("mkdirp");
const fs = require("fs-extra");
const resizeImage = require("resize-img");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

/***
 * GET / product index
 * index
 */

exports.products = async (req, res) => {
  const productCount = await Product.count();
  const products = await Product.find();

  res.render("admin/products", {
    title: "Products",
    products,
    productCount,
  });
};

/***
 * GET /add-product
 */
exports.addProduct = async (req, res) => {
  const title = "";
  const desc = "";
  const price = "";

  try {
    const categories = await Category.find();
    res.render("admin/addProduct", {
      title,
      desc,
      price,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

/***
 * POST /add-page
 */

const isImage = function (req) {
  const ext = req?.files?.image?.mimetype.split("/")[1];
  if (ext === "png" || ext === "jpg" || ext === "jpeg") {
    return true;
  } else {
    return false;
  }
};

exports.createProduct = async (req, res) => {
  const imageFile =
    typeof req?.files?.image !== "undefined"
      ? req?.files?.image?.name
      : "undefined";

  let { title, desc, price, category } = req.body;

  const errors = [];

  if (!title) {
    errors.push({ message: "A product must have a title" });
  }

  if (!desc) {
    errors.push({ message: "A product must have a description" });
  }

  if (!price) {
    errors.push({ message: "A product must have a price" });
  }

  if (!category) {
    errors.push({
      message: "A product must have be a part of specific category",
    });
  }

  if (imageFile !== "undefined") {
    if (!isImage(req)) {
      errors.push({
        message: "Image can only be type of .png, .jpg or .jpeg",
      });
    }
  }

  if (errors.length > 0) {
    const categories = await Category.find();
    return res.render("admin/addProduct", {
      errors,
      title,
      desc,
      price,
      categories,
    });
  }

  let slug = title.trim();
  slug = slug.replace(/\s+/g, "-").toLowerCase();

  const categories = await Category.find();

  const product = await Product.findOne({ title });
  if (product) {
    errors.push({
      message: "Product already exists, please choose another one.",
    });
    return res.render("admin/addProduct", {
      errors,
      title,
      desc,
      price,
      categories,
    });
  }

  try {
    price = parseFloat(price).toFixed(2);
    const newProduct = await Product.create({
      title,
      slug,
      desc,
      price,
      category,
      image: imageFile,
    });

    await mkdirp(`public/product_images/${newProduct._id}`);

    if (imageFile !== "undefined") {
      const productImage = req?.files?.image;
      const path = `public/product_images/${newProduct._id}/${imageFile}`;

      await productImage.mv(path);
    }

    req.flash("success", "Product added.");
    res.redirect("/admin/products");
  } catch (error) {
    req.flash("danger", "Error while creating a new product.");
    const categories = await Category.find();
    return res.render("admin/addProduct", {
      errors,
      title,
      desc,
      price,
      categories,
    });
  }
};

/***
 * GET /edit-product/:id
 */

exports.editProduct = async (req, res) => {
  try {
    let errors;
    if (req?.session?.errors) errors = req?.session?.errors;

    const id = req.params.id;
    const product = await Product.findById(id);
    const categories = await Category.find();

    res.render("admin/editProduct", {
      title: product.title,
      desc: product.desc,
      price: parseFloat(product.price).toFixed(2),
      categories: categories,
      category: product.category.replace(/\s+/g, "-").toLowerCase(),
      image: product.image,
      id: product._id,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/products");
  }
};

/***
 * POST /edit-page/:slug
 */

exports.updateProduct = async (req, res) => {
  const imageFile =
    typeof req?.files?.image !== "undefined"
      ? req?.files?.image?.name
      : "undefined";

  const id = req.params.id;
  const categories = await Category.find();
  const updateProduct = await Product.findById(id);

  let { title, desc, price, category, pImage } = req.body;

  const errors = [];

  if (!title) {
    errors.push({ message: "A product must have a title" });
  }

  if (!desc) {
    errors.push({ message: "A product must have a description" });
  }

  if (!price) {
    errors.push({ message: "A product must have a price" });
  }

  if (!category) {
    errors.push({
      message: "A product must have be a part of specific category",
    });
  }

  if (imageFile !== "undefined") {
    if (!isImage(req)) {
      errors.push({
        message: "Image can only be type of .png, .jpg or .jpeg",
      });
    }
  }

  if (errors.length > 0) {
    const categories = await Category.find();
    return res.render("admin/editProduct", {
      errors,
      title,
      desc,
      price,
      categories,
      id,
      image: updateProduct.image,
      category: updateProduct.category,
    });
  }

  let slug = title.trim();
  slug = slug.replace(/\s+/g, "-").toLowerCase();

  const product = await Product.findOne({ slug, _id: { $ne: id } });
  if (product) {
    errors.push({
      message: "Product title already exists, please choose another one.",
    });
    return res.render("admin/editProduct", {
      errors,
      title,
      desc,
      price,
      categories,
      id,
      image: updateProduct.image,
      category: updateProduct.category,
    });
  }

  try {
    updateProduct.title = title;
    updateProduct.slug = slug;
    updateProduct.desc = desc;
    updateProduct.price = parseFloat(price).toFixed(2);
    updateProduct.cacategory = category;

    if (imageFile != "undefined") {
      updateProduct.image = imageFile;
    }

    await updateProduct.save();

    if (imageFile != "undefined") {
      if (pImage != "") {
        const path = `public/product_images/${id}/${pImage}`;
        await fs.remove(path);
      }

      const productImage = req?.files?.image;
      const path = `public/product_images/${id}/${imageFile}`;

      await productImage.mv(path);
    }

    req.flash("success", "Product updated.");
    res.redirect(`/admin/edit-Product/${id}`);
  } catch (error) {
    req.flash("danger", "Error while updating product.");
    console.log(error);
    return res.render("admin/editProduct", {
      errors,
      title,
      desc,
      price,
      categories,
      id,
      image: updateProduct.image,
      category: updateProduct.category,
    });
  }
};

/***
 * GET /delete-page/:id
 */

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const path = `public/product_images/${id}`;
    await fs.remove(path);

    await Product.findByIdAndDelete(id);
    req.flash("success", "Page deleted successfully.");
    res.redirect(`/admin/products`);
  } catch (error) {
    console.log(error);
  }
};
