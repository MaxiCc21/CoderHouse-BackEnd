const { connect } = require("mongoose");

let url =
  "mongodb+srv://maxi21498:Morethanwords21@cluster0.2z3gkua.mongodb.net/MercadoLibre";

module.exports = {
  connectDB: () => {
    connect(url);
    console.log("Base de datos conectadas");
  },
};
