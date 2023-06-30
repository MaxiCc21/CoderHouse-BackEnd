const { productService, cartService } = require("../service/idex");

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
    const options = {};
    options.style = "productShow.css";
    options.product = product[0];
    (options.usercookie = jwtUser.username ? req.user.username : null),
      res.render("products/product_show.handlebars", options);
  };

  showSingleProductPOST = async (req, res) => {
    console.log("#POST /Agregar al carrito");
    const { pid } = req.params;
    const foundProduct = await productService.getProductById(pid);

    if (!foundProduct) {
      res.send({ status: "error", statusMsg: "No se a econtrado un producto" });
    } else {
      if (req.body.action === "comprar") {
        console.log("comprar");
        res.send("comprar");
      } else if (req.body.action === "carrito") {
        let cid = req.user.sub;
        let pid = foundProduct[0]._id;
        let body = foundProduct[0];
        const itemAdd = await cartService.addItem(cid, pid, body);
        console.log(itemAdd.statusMsj);
        res.send({ Message: itemAdd.statusMsj, cid, pid, body });
      }
    }
  };
}

module.exports = new ProductControler();
