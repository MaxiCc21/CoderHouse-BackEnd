const { Router } = require("express");
const jwt = require("jsonwebtoken");
class RouterClass {
  constructor() {
    this.router = Router();
    this.init();
  }
  getRouter() {
    return this.router;
  }

  init() {}

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.send({ status: "error", error: "no autorizado" });
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, "CoderSecreto");
    if (!policies.includes(user.role.toUpperCase()))
      return res
        .status(403)
        .send({ status: "success", error: "not permissions" });
    req.user = user;
    next();
  };

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (payload) => res.send({ status: "success", payload });
    res.sendServerError = (error) => res.send({ status: "error", error });
    res.sendUserError = (error) => res.send({ status: "error", error });
    next();
  };

  get(path, policies, ...callback) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callback)
    );
  }
  post(path, policies, ...callback) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callback)
    );
  }
  put(path, policies, ...callback) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callback)
    );
  }
  delete(path, policies, ...callback) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callback)
    );
  }
}

module.exports = RouterClass;
