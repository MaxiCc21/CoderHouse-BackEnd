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
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "user",
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: String,
  lastUpdate: { type: Date, default: Date.now },
  online: {
    type: String,
    default: "on",
    enum: ["on", "off", "pause"],
  },
});

userSchema.plugin(mongoosePaginate);
const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
