const dotenv = require("dotenv");
const commander = require("../process/comander");
const { mode } = commander.opts(); //opts se guardan las configuraciones que nosotros creamos y acedemos a la propiedad mode para poder trabajar en distintos entornos
const { MongoSingleton } = require("../utils/singleton");

dotenv.config({
  //Dependiendo los argumentos que le pasemos a la ejecucion/proceso nos ejecutara un entorno u otro, recordar el valor por defecto que se le otorgó a la configuración.
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

module.exports = {
  PORT: process.env.PORT,
  PROD_ACCESS_TOKEN: process.env.PROD_ACCESS_TOKEN,
  privateKey: process.env.PRIVATE_KEY_CODER,
  gmail_user_app: process.env.GMAIL_USER_APP,
  gmail_pass_app: process.env.GMAIL_PASS_APP,

  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
  my_number: process.env.MY_NUMBER,

  connectDB: async () => {
    await MongoSingleton.getInstance();
  },
};
