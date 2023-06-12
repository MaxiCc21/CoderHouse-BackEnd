const LocalStrategy = reqire("passport-local").Strategy,
  local = require("passport-local"),
  UserManager = require("../dao/MongoManager/UserManager"),
  {
    createHash,
    isValidObjectId,
    isValidPassword,
  } = require("../utils/bcryptHas");
const { Model } = require("mongoose");
const { userModel } = require("../dao/models/user.model");
// -------------------------------------------
function initialize(passport) {
  const authenticateUser = async (identification, password, done) => {
    let data = await handleUser.loginValidation(identification, password);
    if (data.status === "ok") {
      res
        .cookie("username", data.username, {
          maxAge: 100000,
        })
        .redirect("/home");
    } else {
      res.status(401).redirect("/views/login");
    }
  };
  //   ----------------------------------------
  passport.user(
    new LocalStrategy({ usernameFiel: "identification" }),
    authenticateUser
  );

  // ----------------------------------------

  passport.serializeUser((user, done) => {
    second;
  });
  passport.deserializeUser((id, done) => {
    second;
  });
}

module.exports = {
  initialize,
};

// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );
