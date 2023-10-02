const { productService } = require("../service");

class PublicarController {
  publicarGET = async (req, res) => {
    const JWTuser = req.user;

    const options = {
      style: "yourProduct.css",
      usercookie: JWTuser,
    };

    res.render("publicar/yourProduct", options);
  };

  myProductsGET = async (req, res) => {
    const JWTuser = req.user;
    let uid = JWTuser.sub;

    const myproducts = await productService.getProductByUserID(uid);

    const options = {
      style: "showMyProducts.css",
      data: myproducts.data,
      usercookie: JWTuser,
    };

    res.render("publicar/showMyProducts", options);
  };

  createProductGET = (req, res) => {
    const JWTuser = req.user;
    const options = {
      style: "createOwnProduct.css",
      usercookie: JWTuser,
    };

    res.render("publicar/createOwnProduct", options);
  };

  createProductPOST = async (req, res) => {
    let dataNewProduct = req.body;

    dataNewProduct = {
      ...dataNewProduct,
      owner: {
        ownerID: req.body.ownerID,
        ownerUsername: req.body.ownerUsername,
      },
    };
    delete dataNewProduct.ownerID;
    delete dataNewProduct.ownerUsername;
    const createNewProduct = await productService.createProduct(dataNewProduct);

    res.send(createNewProduct);
  };
}

module.exports = new PublicarController();
