const { MongoSingleton } = require("../utils/singleton");
require("dotenv").config();

module.exports = {
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
