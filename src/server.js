const express = require("express");
const session = require("express-session");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/carts.routes");
const homeRoutes = require("./routes/home.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
const viewsRoutes = require("./routes/views.routes");
const newUserRoutes = require("./routes/newUser.routes");
const cookieRoutes = require("./routes/cookie.routes");
const comprarRoutes = require("./routes/comprar.routes");
const pruebaRoutes = require("./routes/prueba.routes");
const mailRoutes = require("./routes/mailing.routes");
const mockingRoutes = require("./routes/mock.routes");
const cokieParser = require("cookie-parser");
const { uploader } = require("./utils/multer");
const productHandle = new (require("./dao/MongoManager/ProductManager"))();
const cartHandle = new (require("./dao/MongoManager/CartManager"))();
const objectConfig = require("./config/objetConfig");
const messagesHandle = new (require("./dao/MongoManager/ChatManager"))();
const FileStore = require("session-file-store");
const { create } = require("connect-mongo");
// const core = required("core");
const { Server } = require("socket.io");
const { errorHandler } = require("./middlewares/error.middleware");
const { send } = require("process");
const { cartService } = require("./service");
const { addLogger } = require("./middlewares/logger");

const NewUserRoutes = new newUserRoutes();

const cors = require("cors");
//Passport
const {
  initPassport,
  initPassportGithub,
  initPassportJWT,
} = require("./config/passport.config");
const passport = require("passport");

objectConfig.connectDB();

const app = express();
// HandleBars
const handlebars = require("express-handlebars");
const exphbs = require("express-handlebars");
app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + `/views`);
app.set("view engine", "handlebars");

// Definir un helper llamado "toUpperCase"
const Handlebars = require("handlebars");
const moment = require("moment");
Handlebars.registerHelper("toUpperCase", function (date) {
  return moment(date).locale("es").format("D MMMM YYYY"); // Aplicar el idioma español
});
// HandleBars

app.use(express.json());
// app.use(core());
app.use(cokieParser("c0ntr4s3n4"));
app.use("/static", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

app.use(addLogger);

const fileStore = FileStore(session);
// app.use(
//   session({
//     store: new fileStore({
//       ttl: 100000 * 60,
//       path: "./session",
//       retries: 0,
//     }),
//     secret: "s33sionC0d3",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(
  session({
    store: create({
      mongoUrl:
        "mongodb+srv://maxi21498:Morethanwords21@cluster0.2z3gkua.mongodb.net/MercadoLibre",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 15,
    }),
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

app.post("/single", uploader.single("myFile"), (res, req) => {
  res.status(200).send("Todo ok");
});

app.use("/products", productRoutes);

app.use("/api/carts", cartRoutes);

app.use("/session", userRoutes);

app.use("/newuserRoutes", NewUserRoutes.getRouter());

app.use("/home", homeRoutes);

app.use("/prueba", pruebaRoutes);

app.use("/views", viewsRoutes);

app.use("/chat", chatRoutes);

app.use("/cookie", cookieRoutes);

app.use("/comprar", comprarRoutes);

app.use("/email", mailRoutes);

app.use("/mockingproducts", mockingRoutes);

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(500).send("Todo mal");
// });

app.use(errorHandler);

// Socket-----------------------------------------------------------------------------

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTime.css" });
});

const { Server: ServerIO } = require("socket.io");
const { Server: ServerHTTP } = require("http");

const serverHTTP = ServerHTTP(app);
const io = new ServerIO(serverHTTP);

const { send } = require("process");
const { cartService } = require("./service");

// const io = new Server(httpServer);

io.on("connection", async (socket) => {
  socket.emit("message", "Se conectado un usuario");
  let data = await productHandle.getProducts();

  socket.emit("show-All-Products", data);

  socket.on("addProduct", async (data) => {
    let res = await productHandle.addProduct(data);
  });

  socket.on("eliminar-producto", async (dataID) => {
    let res = await productHandle.deleteProduct(dataID);
    console.log(res.statusMsj);
  });

  let messages = await messagesHandle.getMessages();
  socket.emit("send-all-messages", messages);

  socket.on("new-message", async (data) => {
    let res = await messagesHandle.addMessages(data);
    console.log(res);
    socket.emit("send-all-messages", messages);
  });
  //------------------CART------------------------------
  socket.on("cartDeleteItem", async ($userIdInput, $productIdInput) => {
    let res = await cartService.deleteItemToCart($userIdInput, $productIdInput);
    console.log(res.statusMsj);
    if (res.ok) {
      socket.emit("okModCart", "Todo ok ");
    }
  });
  socket.on("cartAddItem", async ($userIdInput, $productIdInput) => {
    let res = await cartService.addItemToCart($userIdInput, $productIdInput);
    console.log(res.statusMsj);
    if (res.ok) {
      socket.emit("okModCart", "Todo ok ");
    }
  });
  socket.on("cartDeleteProduct", async (userIdInput, productIdInput) => {
    let res = await cartService.DeleteProduct(userIdInput, productIdInput);
    console.log(res.statusMsj);
    if (res.ok) {
      socket.emit("okModCart", "Todo ok ");
    }
  });
});

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

const PORT = 8080;

exports.initServer = () => {
  serverHTTP.listen(PORT, () => {
    // logger.info(`Escuchando en el puerto: ${PORT}`);
    console.log(`Escuchando en el puerto: ${PORT}`);
  });
};