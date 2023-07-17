const Page = require("../models/pageModel");

/***
 * GET /
 * index
 */

exports.pages = async (req, res) => {
  const pages = await Page.find().sort({ sorting: 1 });
  res.render("admin/pages", {
    pages,
  });
};

/***
 * GET /add-page
 */
exports.addPage = (req, res) => {
  const title = "";
  const slug = "";
  const content = "";

  res.render("admin/addPage", {
    title,
    slug,
    content,
  });
};

/***
 * POST /add-page
 */

exports.createPage = async (req, res) => {
  let { title, slug, content } = req.body;
  const errors = [];

  if (!title) {
    errors.push({ message: "A page must have title" });
  }

  if (!content) {
    errors.push({ message: "A page must have content" });
  }

  if (errors.length > 0) {
    return res.render("admin/addPage", {
      errors,
      title,
      slug,
      content,
    });
  }

  if (slug === "") slug = title;
  slug = slug.trim();
  slug = slug.replace(/\s+/g, "-").toLowerCase();

  const page = await Page.findOne({ slug });
  if (page) {
    errors.push({
      message: "Page slug already exists, please choose another one.",
    });
    return res.render("admin/addPage", {
      errors,
      title,
      slug,
      content,
    });
  }

  try {
    await Page.create({
      title,
      slug,
      content,
      sorting: 100,
    });
    Page.find()
      .sort({ sorting: 1 })
      .then((pages) => {
        req.app.locals.pages = pages;
      }).catch((err) => {
        console.log(err);
      });
    req.flash("success", "Page created successfully.");
    res.redirect("/admin/pages");
  } catch (error) {
    req.flash("danger", "Error while creating page.");
    return res.render("admin/addPage", {
      title,
      slug,
      content,
    });
  }
};

/***
 * POST reorder pages index
 */

function sortPages(ids, cb) {
  let count = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    count++;

    (function (count) {
      Page.findById(id).then((page) => {
        page.sorting = count;
        page
          .save()
          .then(() => {
            ++count;
            if (count >= ids.length) {
              cb();
            }
          })
          .catch((err) => console.log(err));
      });
    })(count);
  }
}

exports.reorderPages = (req, res) => {
  const ids = req.body.id;

  sortPages(ids, function () {
    Page.find()
      .sort({ sorting: 1 })
      .then((pages) => {
        req.app.locals.pages = pages;
      }).catch((err) => {
        console.log(err);
      });
  });
};

/***
 * GET /edit-page/:slug
 */

exports.editpage = async (req, res) => {
  try {
    const id = req.params.id;
    const page = await Page.findById(id);

    res.render("admin/editPage", {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id,
    });
  } catch (error) {
    console.log(error);
  }
};

/***
 * POST /edit-page/:slug
 */

exports.updatePage = async (req, res) => {
  const id = req.params.id;
  let { title, slug, content } = req.body;
  const errors = [];

  if (!title) {
    errors.push({ message: "A page must have title" });
  }

  if (!content) {
    errors.push({ message: "A page must have content" });
  }

  if (errors.length > 0) {
    return res.render("admin/editPage", {
      errors,
      title,
      slug,
      content,
      id,
    });
  }

  if (slug === "") slug = title;
  slug = slug.trim();
  slug = slug.replace(/\s+/g, "-").toLowerCase();

  const page = await Page.findOne({ slug, _id: { $ne: id } });
  if (page) {
    errors.push({
      message: "Page slug already exists, please choose another one.",
    });
    return res.render("admin/editPage", {
      errors,
      title,
      slug,
      content,
      id,
    });
  }

  const updatePage = await Page.findById(id);
  try {
    updatePage.title = title;
    updatePage.slug = slug;
    updatePage.content = content;

    await updatePage.save();
    Page.find()
      .sort({ sorting: 1 })
      .then((pages) => {
        req.app.locals.pages = pages;
      }).catch((err) => {
        console.log(err);
      });
    req.flash("success", "Page updated successfully.");
    res.redirect(`/admin/edit-page/${id}`);
  } catch (error) {
    req.flash("danger", "Error while updating page.");
    res.render("admin/editPage", {
      title,
      slug,
      content,
      id,
    });
  }
};

/***
 * GET /delete-page/:id
 */

exports.deletePage = async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    Page.find()
      .sort({ sorting: 1 })
      .then((pages) => {
        req.app.locals.pages = pages;
      }).catch((err) => {
        console.log(err);
      });
    req.flash("success", "Page deleted successfully.");
    res.redirect(`/admin/pages`);
  } catch (error) {
    console.log(error);
  }
};
