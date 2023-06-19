const jwt = require("jsonwebtoken");
const { privateKey } = require("../config/objetConfig");

const generateToke = (user) => {
  const token = jwt.sign({ user }, privateKey, { expiresIn: "1d" });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send({ status: "error", satusMsj: "No autorizado" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_PRIVATE_KEY, (error, credential) => {
    if (error) {
      return res
        .status(403)
        .send({ status: "error", satusMsj: "No autorizado" });
    }
    req.user = credential.user;
    console.log("Entra?????????????");
    next();
  });
};

module.exports = {
  generateToke,
  authToken,
};
