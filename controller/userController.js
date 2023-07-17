const passport = require("passport");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/userModel");

/***
 * GET register page
 */

exports.register = (req, res) => {
  res.render("register", {
    title: "Register",
  });
};

/***
 * POST register
 */

exports.registerUser = async (req, res) => {
  let { name, email, username, password, confirmPassword } = req.body;
  let errors = [];

  if (!name) {
    errors.push({ message: "Please enter your name to continue" });
  }

  if (!email) {
    errors.push({ message: "Please enter your email address" });
  }

  if (!username) {
    errors.push({ message: "Please enter a username" });
  }

  if (!password) {
    errors.push({ message: "Please enter a password" });
  }

  if (password !== confirmPassword) {
    errors.push({ message: "Password confirm did not matched" });
  }

  if (errors.length > 0) {
    return res.render("register", {
      title: "Register",
      name,
      email,
      username,
      password,
      confirmPassword,
      errors,
    });
  }

  if (!validator.isEmail(email)) {
    errors.push({ message: "Please enter a valid email address" });
  }

  if (!validator.isStrongPassword(password)) {
    errors.push({
      message:
        "A password must be 8 letter long and must contain 1 Capital letter, 1 Lowercase letter, 1 Number and 1 Special character. ",
    });
  }

  if (errors.length > 0) {
    return res.render("register", {
      title: "Register",
      name,
      email,
      username,
      password,
      confirmPassword,
      errors,
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    errors.push({
      message: "User with this email already registered",
    });
    return res.render("register", {
      title: "Register",
      name,
      email,
      username,
      password,
      confirmPassword,
      errors,
    });
  }

  try {
    password = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      username,
      password,
      admin: 0,
    });

    req.flash("success", "You are now registered and can log in");
    res.redirect("/users/login");
  } catch (error) {
    console.log(error);
    req.flash("danger", "Error while registering user, please try again later");
    return res.render("register", {
      title: "Register",
      name,
      email,
      username,
      password,
      confirmPassword,
      errors,
    });
  }
};

/***
 * GET login
 */

exports.loginRender = (req, res) => {
  if (res.locals.user) return res.redirect("/");

  res.render("login", {
    title: "Log In",
  });
};

/***
 * POST login
 */

exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

/***
 * GET logout
 */

exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
};
