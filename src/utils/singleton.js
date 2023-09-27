const { logger } = require("handlebars");
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
      logger.info("Base de datos ya está creada");

      return this.#instance;
    }
    this.#instance = new MongoSingleton();

    logger.info("Base de dato creada");
    return this.#instance;
  }
}

module.exports = {
  MongoSingleton,
};
