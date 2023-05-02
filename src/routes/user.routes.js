const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  let options = {
    style: "user.css",
  };

  res.render("handleUser.handlebars", options);
});

module.exports = router;
