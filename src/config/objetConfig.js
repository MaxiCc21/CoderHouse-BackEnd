const { connect } = require("mongoose");
const { MongoSingleton } = require("../utils/singleton");
require("dotenv").config();

let url =
  "mongodb+srv://maxi21498:Morethanwords21@cluster0.2z3gkua.mongodb.net/MercadoLibre";

module.exports = {
  privateKey: process.env.PRIVATE_KEY_CODER,
  // connectDB: () => {
  //   connect(url);
  //   console.log("Base de datos conectadas");
  // },
  connectDB: async () => {
    await MongoSingleton.getInstance();
  },
};
