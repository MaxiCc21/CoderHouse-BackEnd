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

    const updateMessage = req.query.update
      ? "Se realizaron los cambios con exito"
      : "Ah ocurrido un erro inesperado \nVuelva a intentarlo mas tarde";

    const myproducts = await productService.getProductByUserID(uid);

    const options = {
      style: "showMyProducts.css",
      data: myproducts.data,
      usercookie: JWTuser,
      updateMessage,
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

    res.redirect("/publicar/myproducts");
  };

  editMyProductGET = async (req, res) => {
    const { pid } = req.params;

    const JWTuser = req.user;
    const options = {
      style: "editMyProduct.css",
      usercookie: JWTuser,
    };

    const getProduct = await productService.getProductById(pid);
    if (!getProduct) {
      options.warmMessage = "A ocurrido un error el buscar el producto";
    } else {
      options.product = getProduct;
    }

    res.render("publicar/editmyproduct", options);
  };

  editMyProductPOST = async (req, res) => {
    const { body: productData } = req;
    const { pid } = req.params;

    const { status, ...rest } = await productService.updateProduct(
      pid,
      productData
    );

    res.status(status).redirect(`/publicar/myproducts?update=${rest.ok}`);
  };
}

module.exports = new PublicarController();
