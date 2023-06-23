const authorizaton = (role) => {
  return async (req, res, next) => {
    console.log(req.user);
    if (role === "PUBLIC") {
      console.log("Pasa directo");
      return next();
    }
    if (!req.user) {
      return res.status(403).redirect("/views/login");
    }

    if (req.user.role !== role)
      return res
        .status(403)
        .send({ status: "error", error: "Not permissions" });
    next();
  };
};

module.exports = {
  authorizaton,
};
