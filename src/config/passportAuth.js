const passport = require("passport");

const passportAuth = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(err);
      }
      req.user = user.user ? user.user : null;
      next();
    })(req, res, next);
  };
};

module.exports = {
  passportAuth,
};
