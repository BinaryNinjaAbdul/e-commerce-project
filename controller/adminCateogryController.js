const Category = require("../models/categoryModel");

/***
 * GET /
 * category
 */

exports.category = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/categories", {
      categories,
    });
  } catch (err) {
    console.log(err);
  }
};

/***
 * GET /add-category
 */
exports.addCategory = (req, res) => {
  const title = "";

  res.render("admin/addCategory", {
    title,
  });
};

/***
 * POST /add-category
 */

exports.createCategory = async (req, res) => {
  let { title } = req.body;
  const errors = [];

  if (!title) {
    errors.push({ message: "A category must have title" });
  }

  if (errors.length > 0) {
    return res.render("admin/addCategory", {
      errors,
      title,
    });
  }

  let slug = title;
  slug = slug.trim();
  slug = slug.replace(/\s+/g, "-").toLowerCase();

  const category = await Category.findOne({ slug });
  if (category) {
    errors.push({
      message: "Category already exists, please choose another one.",
    });
    return res.render("admin/addCategory", {
      errors,
      title,
    });
  }

  try {
    await Category.create({
      title,
      slug,
    });

    const categories = await Category.find();
    req.app.locals.categories = categories;

    req.flash("success", "Category created successfully.");
    res.redirect("/admin/categories");
  } catch (error) {
    req.flash("danger", "Error while creating category.");
    return res.render("admin/addCategory", {
      title,
    });
  }
};

/***
 * GET /edit-category/:id
 */

exports.editCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    res.render("admin/editCategory", {
      title: category.title,
      id: category._id,
    });
  } catch (error) {
    console.log(error);
  }
};

/***
 * POST /edit-category/:id
 */

exports.updateCategory = async (req, res) => {
  let { title } = req.body;
  const id = req.params.id;
  const errors = [];

  if (!title) {
    errors.push({ message: "A category must have title" });
  }

  if (errors.length > 0) {
    return res.render("admin/editCategory", {
      errors,
      title,
      id,
    });
  }

  let slug = title;
  slug = slug.trim();
  slug = slug.replace(/\s+/g, "-").toLowerCase();

  const category = await Category.findOne({ slug, _id: { $ne: id } });
  if (category) {
    errors.push({
      message: "Category already exists, please choose another one.",
    });
    return res.render("admin/editCategory", {
      errors,
      title,
      id,
    });
  }

  const updateCategory = await Category.findById(id);
  try {
    updateCategory.title = title;
    updateCategory.slug = slug;

    await updateCategory.save();

    const categories = await Category.find();
    req.app.locals.categories = categories;

    req.flash("success", "Category updated successfully.");
    res.redirect(`/admin/edit-category/${updateCategory._id}`);
  } catch (error) {
    req.flash("danger", "Error while updating category.");
    res.render("admin/editCategory", {
      title,
      id,
    });
  }
};

/***
 * GET /delete-category/:id
 */

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    const categories = await Category.find();
    req.app.locals.categories = categories;
    req.flash("success", "Category deleted successfully.");
    res.redirect(`/admin/categories`);
  } catch (error) {
    console.log(error);
  }
};
