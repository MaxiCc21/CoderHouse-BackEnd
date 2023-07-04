const { connect } = require("mongoose");
require("dotenv").config();
const mongoose = require("mongoose");

class MongoSingleton {
  static #instance;
  constructor() {
    connect(process.env.MONGO_URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  static getInstance() {
    if (this.#instance) {
      console.log("Base de datos ya está creada");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    console.log("Base de dato creada");
    return this.#instance;
  }
}

module.exports = {
  MongoSingleton,
};
