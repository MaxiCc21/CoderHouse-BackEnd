const passport = require("passport"),
  local = require("passport-local"),
  UserManager = require("../dao/MongoManager/UserManager"),
  {
    createHash,
    isValidObjectId,
    isValidPassword,
  } = require("../utils/bcryptHas");
const { userModel } = require("../dao/models/user.model");

const LocalStrategy = local.Strategy;

const initPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let userDB = await userModel.findOne({ username: username });
          if (userDB)
            return done(null, false, { message: "Este usuario ya existe" });

          let newUser = {
            ...req.body,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);

          return done(null, result);
        } catch (err) {
          return done("Error al obtener el usuario");
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
      const userDB = await userModel.findOne({ username: username });
      try {
        if (!userDB)
          return done(null, false, { message: "No se a contrado un usuario" });

        if (!isValidPassword(password, userDB.password))
          return done(null, false, {
            message: "La contrasela no es correcta",
          });
        return done(null, userDB);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};

module.exports = {
  initPassport,
};