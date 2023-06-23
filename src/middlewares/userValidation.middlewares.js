function auth(req, res, next) {
  if ((req.session.rol = "admin")) {
    next();
  }
  return res.status(401).send("Error de autenticacion");
}
//
module.exports = {
  auth,
};
