const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../ProductManager"))();

router.get("/", async (require, res) => {
  let listProducts = await handleProducts.getProducts();

  let testUser = {
    products: listProducts,
  };

  res.render("home.handlebars", testUser);
});

module.exports = router;
