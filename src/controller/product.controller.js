const { options } = require("../routes/product.routes");
const { productService, cartService } = require("../service");

class ProductControler {
  showSingleProductGET = async (req, res) => {
    const pid = req.params.pid;

    const product = await productService.getProductById(pid);

    if (!product) {
      res.send({
        error: `No se a econtrado nungun producto con id(${pid})`,
      });
    }
    const jwtUser = req.user ? req.user : false;
    const options = {
      style: "productShow.css",
      data: product,
      usercookie: jwtUser,
    };

    res.render("products/product_show.handlebars", options);
  };
  APIshowSingleProductGET = async (req, res) => {
    const pid = req.params.pid;

    const product = await productService.getProductById(pid);

    if (!product) {
      res.status(401).send({
        error: `No se a econtrado nungun producto con id(${pid})`,
      });
    }

    res.status(200).send(product);
  };

  showSingleProductPOST = async (req, res) => {
    console.log("#POST /Agregar al carrito");
    const { pid } = req.params;
    const foundProduct = await productService.getProductById(pid);
    console.log(foundProduct);
    if (!foundProduct) {
      res.send({ status: "error", statusMsg: "No se a econtrado un producto" });
    } else {
      if (req.body.action === "comprar") {
        console.log("comprar");
        res.send("comprar");
      } else if (req.body.action === "carrito") {
        let cid = req.user.sub;
        let pid = foundProduct._id;
        let body = foundProduct;
        const itemAdd = await cartService.addItem(cid, pid, body);
        console.log(itemAdd.statusMsj);
        res.send({ Message: itemAdd.statusMsj, cid, pid, body });
      }
    }
  };

  showProductsByCategoryGET = async (req, res) => {
    const jwtUser = req.user;
    const categoria = req.params.pc;

    const productCategory = await productService.getProductsByCategory(
      categoria
    );

    const options = {
      style: "home.css",
      data: productCategory.data,
      usercookie: jwtUser,
    };
    if (!productCategory.ok) {
      res.status(400).send(productCategory.statusMsj);
    } else {
      res.render("products/showProductsByCategory", options);
    }
  };

  getProductPaginatorGET = async (req, res) => {
    try {
      const JWTuser = req.user;
      const page = req.query.page || 1;
      const products = await productService.getProductPaginator(page, 5);
      console.log(products);
      // const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products;
      // let options = {
      //   style: "productPaginateAdmin.css",
      //   users: docs,
      //   page,
      //   hasPrevPage,
      //   hasNextPage,
      //   prevPage,
      //   nextPage,
      //   disabled: "disabled",
      //   usercookie: JWTuser,
      // };
      res.render("admin/productPaginateAdmin");
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = new ProductControler();
