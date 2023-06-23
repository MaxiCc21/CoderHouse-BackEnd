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
const cokieParser = require("cookie-parser");
const { uploader } = require("./utils/multer");
const productHandle = new (require("./dao/MongoManager/ProductManager"))();
const objectConfig = require("./config/objetConfig");
const messagesHandle = new (require("./dao/MongoManager/ChatManager"))();
const FileStore = require("session-file-store");
const { create } = require("connect-mongo");

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
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + `/views`);
app.set("view engine", "handlebars");
// HandleBars

app.use(express.json());
app.use(cokieParser("c0ntr4s3n4"));
app.use("/static", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "s33sionC0d3",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

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

app.use("/api/session", userRoutes);

app.use("/prueba", NewUserRoutes.getRouter());

app.use("/home", homeRoutes);

app.use("/views", viewsRoutes);

app.use("/chat", chatRoutes);

app.use("/cookie", cookieRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Todo mal");
});

// Socket-----------------------------------------------------------------------------

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTime.css" });
});

const { Server } = require("socket.io");

const { send } = require("process");

const httpServer = app.listen(8080);

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
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
});

app.use((req, res, next) => {
  // Guardar un nuevo parámetro en req
  req.customParam = "authorization";
  next();
});
app.get("*", (req, res) => {
  res.status(404).send("Not found");
});
