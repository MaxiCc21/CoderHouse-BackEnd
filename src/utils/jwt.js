const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/config");

const generateToke = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1d" });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.cookies["jwtCoder"];
  if (!authHeader) {
    return res.status(401).redirec({ status: "error", satusMsj: "No Cookie" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify("token", PRIVATE_KEY, (error, credential) => {
    if (error) {
      return res
        .status(403)
        .send({ status: "error", satusMsj: "No autorizado" });
    }
    req.user = credential.user;

    next();
  });
};

module.exports = {
  generateToke,
  authToken,
};
