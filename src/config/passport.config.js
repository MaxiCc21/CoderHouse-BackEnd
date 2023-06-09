const passport = require("passport"),
  local = require("passport-local"),
  UserManager = require("../dao/MongoManager/UserManager"),
  {
    createHash,
    isValidObjectId,
    isValidPassword,
  } = require("../utils/bcryptHas");
const { userModel } = require("../dao/models/user.model");
const GithubStrategy = require("passport-github2");
const handleUser = new (require("../dao/MongoManager/UserManager"))();

const passportJWT = require("passport-jwt");
const { privateKey } = require("./objetConfig");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

require("dotenv").config();

const LocalStrategy = local.Strategy;

const cookieExtrator = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCoder"];
  }
  return token;
};
const optionsJWT = {};

optionsJWT.jwtFromRequest = ExtractJWT.fromExtractors([cookieExtrator]);
optionsJWT.secretOrKey = privateKey;

const initPassportJWT = () => {
  passport.use(
    "jwt",
    new JWTStrategy(optionsJWT, async (jwt_payload, done) => {
      try {
        done(null, jwt_payload);
      } catch (err) {
        return done(err);
      }
    })
  );
};

// --------------------------------------------
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

          return done(null, result, { message: "Usuario creado" });
        } catch (err) {
          return done("Error al obtener el usuario");
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
      try {
        const loginRes = await handleUser.loginValidation(username, password);

        if (!loginRes.ok) {
          return done(error, null, { message: loginRes.statusMsj });
        }

        return done(null, loginRes.found, { message: loginRes.statusMsj });
      } catch (error) {
        return done(error);
      }
    })
  );
  // passport.use(
  //   "login",
  //   new LocalStrategy(async (username, password, done) => {
  //     // const userDB = await userModel.findOne({ username: username });
  //     const loginRes = await handleUser.loginValidation(username, password);
  //     // MOD USER MANAGER
  //     try {
  //       if (!userDB)
  //         return done(null, false, { message: "No se a contrado un usuario" });

  //       if (!isValidPassword(password, userDB.password))
  //         return done(null, false, {
  //           message: "La contrasela no es correcta",
  //         });
  //       return done(null, userDB);
  //     } catch (error) {
  //       return done(error);
  //     }
  //   })
  // );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};

const initPassportGithub = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              username: profile._json.login,
              email: "asadasa@gmail.com",
              isAdmin: false,
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (err) {
          console.log(err);
          done(err);
        }
      }
    )
  );
};

// const initPassportGithub = () => {
//   passport.use(
//     "loginGithub",
//     new GithubStrategy(
//       {
//         clientID: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         callbackURL: process.env.GITHUB_CALLBACK_URL,
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         console.log(profile);
//         try {
//           const found = await handleUser.loginValidationGithub(
//             profile._json.email
//           );
//           if (!found.ok) {
//             return done(null, false, { message: found.stateMsj });
//           }
//           return done(null, found.item_found, { message: found.stateMsj });
//         } catch (err) {
//           console.log(err);
//           done(err);
//         }
//       }
//     )
//   );
// };

module.exports = {
  initPassport,
  initPassportGithub,
  initPassportJWT,
};
