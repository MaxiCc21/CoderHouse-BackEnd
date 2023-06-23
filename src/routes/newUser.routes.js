const RouterClass = require("./RouterClass.js");

class UserRouter extends RouterClass {
  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        res.sendSuccess("hOLA CODER");
      } catch (err) {
        res.sendServerError(err);
      }
    });
  }
}

module.exports = UserRouter;
