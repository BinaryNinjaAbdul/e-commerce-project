const Page = require("../models/pageModel");
/***
 * GET /
 * index
 */

exports.home = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: "home" });
    res.render("index", {
      title: page.title,
      content: page.content,
    });
  } catch (error) {
    console.log(error);
  }
};

/***
 * GET /:slug
 * index
 */

exports.getPage = async (req, res) => {
  const slug = req.params.slug;

  try {
    const page = await Page.findOne({ slug });
    if (!page) {
      res.redirect("/");
    } else {
      res.render("index", {
        title: page.title,
        content: page.content,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
