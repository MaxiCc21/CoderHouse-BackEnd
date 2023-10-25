const express = require("express");
const session = require("express-session");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/carts.routes");
const homeRoutes = require("./routes/home.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
const cookieRoutes = require("./routes/cookie.routes");
const comprarRoutes = require("./routes/comprar.routes");
const mailRoutes = require("./routes/mailing.routes");
const mockingRoutes = require("./routes/mock.routes");
const publicarRoutes = require("./routes/publicar.routes");
const cokieParser = require("cookie-parser");
const productHandle = new (require("./dao/MongoManager/ProductManager"))();
const { connectDB, PORT } = require("./config/config");
const messagesHandle = new (require("./dao/MongoManager/ChatManager"))();
const { cartService } = require("./service");
const { addLogger, logger } = require("./middlewares/logger");
const { Server: ServerIO } = require("socket.io");
const { Server: ServerHTTP } = require("http");
const handlebars = require("express-handlebars");

//---------------Swagger--------------
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

//---------------Swagger--------------

const cors = require("cors");
//Passport
const {
  initPassport,
  initPassportGithub,
  initPassportJWT,
} = require("./config/passport.config");
const passport = require("passport");

connectDB();

const app = express();
// HandleBars

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + `/views`);
app.set("view engine", "handlebars");

// Definir un helper
const Handlebars = require("handlebars");
const moment = require("moment");

const helpers = {
  toUpperCase: function (date) {
    return moment(date).locale("es").format("D MMMM YYYY");
  },
  isString: function (value) {
    return typeof value === "string";
  },
  eq: function (value1, value2, options) {
    return value1 === value2 ? options.fn(this) : options.inverse(this);
  },
  sumProductPrice: function (products) {
    let total = 0;
    products.forEach((product) => {
      total += product.product.price * product.quantity;
    });
    return total.toFixed(2);
  },
};

for (const helperName in helpers) {
  Handlebars.registerHelper(helperName, helpers[helperName]);
}

app.use(express.json());
app.use(cokieParser("c0ntr4s3n4"));
app.use("/static", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

app.use(addLogger);

//---------------Swagger--------------

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de Mercado Libre",
      description: "Esta el la documentacion de Mercado Libre",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//---------------Swagger--------------

app.use(
  session({
    secret: "s33sionC0d3",
    resave: false,
    saveUninitialized: false,
  })
);

// Passportt
initPassport();
initPassportGithub();
initPassportJWT();
app.use(passport.initialize());
app.use(passport.session());

// cors

app.use(cors());

app.use("/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/session", userRoutes);

app.use("/home", homeRoutes);

app.use("/chat", chatRoutes);

app.use("/cookie", cookieRoutes);

app.use("/comprar", comprarRoutes);

app.use("/email", mailRoutes);

app.use("/mockingproducts", mockingRoutes);

app.use("/publicar", publicarRoutes);

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).send("Todo mal");
});

// Socket-----------------------------------------------------------------------------

const serverHTTP = ServerHTTP(app);
const io = new ServerIO(serverHTTP);

io.on("connection", async (socket) => {
  socket.emit("message", "Se conectado un usuario");
  let data = await productHandle.getAllProducts();

  socket.emit("show-All-Products", data);

  socket.on("addProduct", async (data) => {
    let res = await productHandle.addProduct(data);
  });

  socket.on("eliminar-producto", async (dataID) => {
    let res = await productHandle.deleteProduct(dataID);
  });

  let messages = await messagesHandle.getMessages();
  socket.emit("send-all-messages", messages);

  socket.on("new-message", async (data) => {
    let res = await messagesHandle.addMessages(data);

    socket.emit("send-all-messages", messages);
  });
  //------------------CART------------------------------
  socket.on("cartDeleteItem", async ($userIdInput, $productIdInput) => {
    let res = await cartService.deleteItemToCart($userIdInput, $productIdInput);

    if (res.ok) {
      socket.emit("okModCart", "Todo ok ");
    }
  });
  socket.on("cartAddItem", async ($userIdInput, $productIdInput) => {
    let res = await cartService.addItemToCart($userIdInput, $productIdInput);

    if (res.ok) {
      socket.emit("okModCart", "Todo ok ");
    }
  });
  socket.on("cartDeleteProduct", async (userIdInput, productIdInput) => {
    let res = await cartService.DeleteProduct(userIdInput, productIdInput);

    if (res.ok) {
      socket.emit("okModCart", "Todo ok ");
    }
  });
});

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

serverHTTP.listen(PORT, () => {
  logger.info(`Escuchando en el puerto: ${PORT}`);
});
