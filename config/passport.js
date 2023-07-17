const localStratergy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

module.exports = function (passport) {
  passport.use(
    new localStratergy(async function (username, password, done) {
      try {
        //Match User
        let userN = username.toLowerCase();
        const user = await User.findOne({ username: userN });
        if (!user) {
          return done(null, false, { message: "Incorrect Email or Password" });
        }

        // Chekcing password
        const isRightPassword = await bcrypt.compare(password, user.password);
        if (!isRightPassword) {
          return done(null, false, { message: "Incorrect Email or Password" });
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
