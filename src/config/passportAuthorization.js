const { logger } = require("../middlewares/logger");

const niveles = {
  user: 1,
  premium: 2,
  admin: 3,
};

const authorizaton = (...roles) => {
  return async (req, res, next) => {
    console.log(roles);

    if (roles.includes("PUBLIC")) {
      console.log("Pasa directo");
      return next();
    }

    if (!req.user) {
      return res.status(403).redirect("/session/login");
    }

    logger.info(`UserRol: ${req.user.role} RolesAuth: ${roles}`);

    const nivelUsuario = niveles[req.user.role];

    const nivelesRequeridos = roles.map((rol) => niveles[rol]);

    if (!nivelesRequeridos.some((nivel) => nivelUsuario >= nivel)) {
      return res
        .status(403)
        .send({ status: "error", error: "No tienes permisos" });
    }

    next();
  };
};

module.exports = {
  authorizaton,
};
