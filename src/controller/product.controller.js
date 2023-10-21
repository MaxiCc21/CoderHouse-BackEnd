const { logger } = require("../middlewares/logger");
const { options } = require("../routes/product.routes");
const {
  productService,
  cartService,
  userService,
  ticketService,
} = require("../service");

const mercadopago = require("../config/mercadopago");
const { PORT } = require("../config/config");

class ProductControler {
  productGET = async (request, response) => {
    let res = await productService.getAllProducts();
    let { limit } = request.query;
    if (limit) {
      res = res.slice(0, limit);
    }
    response.send(res);
  };

  createProductPOST = async (req, res) => {
    let dataNewProduct = req.body;

    const { status, statusMsj, ok, data } = await productService.createProduct(
      dataNewProduct
    );

    res.status(status).send({ statusMsj, data });
  };

  productDELETE = async (req, res) => {
    let { pid } = req.params;

    let deleteProduct = await productService.deleteProductByID(pid);

    res.status(deleteProduct.status).send(deleteProduct);
  };

  productAddPOST = async (req, res) => {
    const newProduct = req.body;

    let agregarProducto = await productService.addProduct(newProduct);

    res.status(agregarProducto.status).send(agregarProducto);
  };

  showSingleProductGET = async (req, res) => {
    let warningMessage;
    if (PORT === 4000) {
      warningMessage =
        "OJO! si estas viendo esta paguina desde internet, las credenciales Mercado Pago estan activas, para probar con seguridad pruebe en modo development MG";
    }

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
      warningMessage,
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
    const { pid } = req.params;
    const JWTuser = req.user;

    const foundProduct = await productService.getProductById(pid);

    if (!foundProduct) {
      res.send({
        status: "error",
        statusMsg: "No se ha encontrado un producto",
      });
    } else {
      if (req.body.action === "comprar") {
        let back_urls;
        if (PORT == 8080) {
          back_urls = {
            success: `http://localhost:8080/comprar/mercadopago-response/${foundProduct._id}`,
            failure: `http://localhost:8080/comprar/mercadopago-response/${foundProduct._id}`,
            pending: `http://localhost:8080/comprar/mercadopago-response/${foundProduct._id}`,
          };
        } else {
          back_urls = {
            success: `https://mymercadopago.onrender.com/comprar/mercadopago-response/${foundProduct._id}`,
            failure: `https://mymercadopago.onrender.com/mercadopago-response/${foundProduct._id}`,
            pending: `https://mymercadopago.onrender.com/mercadopago-response/${foundProduct._id}`,
          };
        }

        const { data } = await userService.getUserByID(JWTuser.sub);
        let preference = {
          items: [
            {
              title: foundProduct.title,
              description: foundProduct.description,
              unit_price: foundProduct.price,
              quantity: 1,
              currency_id: "ARS",
              picture_url: foundProduct.thumbnail,
              category_id: foundProduct.category[0],
              id: foundProduct._id,
            },
          ],
          payer: {
            name: data.firstname,
            surname: data.lastname,
            email: data.email,
            identification: {
              type: "DNI",
              number: "12345678",
            },
            address: {
              street_name: data.address,
              street_number: 123,
              zip_code: "5700",
            },
          },
          back_urls,
          auto_return: "approved",
        };

        const response = await mercadopago.preferences.create(preference);
        const preferenceId = response.body.id;

        res.redirect(response.body.init_point);
      } else if (req.body.action === "carrito") {
        let cid = req.user.sub;
        let pid = foundProduct._id;
        let body = foundProduct;
        console.log(cid, pid, body);
        const itemAdd = await cartService.addItem(cid, pid, body);
        console.log(itemAdd);
        res.redirect("/api/cart");
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

      res.render("admin/productPaginateAdmin");
    } catch (err) {
      logger.error(err);
    }
  };
}

module.exports = new ProductControler();
