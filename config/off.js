exports.isUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "Please log in");
    res.redirect("/users/login");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req?.user?.admin == 1) {
    next();
  } else {
    req.flash("danger", "Please log in as admin");
    res.redirect("/users/login");
  }
};
