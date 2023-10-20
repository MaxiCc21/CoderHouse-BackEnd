const dotenv = require("dotenv");
const commander = require("../process/comander");
const { mode } = commander.opts(); //opts se guardan las configuraciones que nosotros creamos y acedemos a la propiedad mode para poder trabajar en distintos entornos
const { MongoSingleton } = require("../utils/singleton");

dotenv.config({
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

module.exports = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  PERSISTENCE: process.env.PERSISTENCE,
  MAILER_USER_GMAIL: process.env.MAILER_USER_GMAIL,
  MAILER_USER_PASS: process.env.MAILER_USER_PASS,
  connectDB: async () => {
    await MongoSingleton.getInstance();
  },
};
