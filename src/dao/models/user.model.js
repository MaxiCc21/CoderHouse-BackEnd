const { Schema, model } = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "users";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  fullname: String,
  username: {
    type: String,
    unique: true,
  },
  // email: {
  //   type: String,
  //   required: true,
  // },
  email: String,
  password: String,
  isAdmin: Boolean,
  adress: String,
  lastUpdate: { type: Date, default: Date.now },
});

userSchema.plugin(mongoosePaginate);
const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
