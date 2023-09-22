const { tr } = require("@faker-js/faker");
const { Schema, model } = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "users";

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  lastUpdate: { type: Date, default: Date.now },
  online: {
    type: String,
    default: "on",
    enum: ["on", "off", "pause"],
  },
});

userSchema.set("toObject", { getters: true });

userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.plugin(mongoosePaginate);
const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
