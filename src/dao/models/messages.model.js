const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  user: String,
  message: String,
  createDate: { type: Date, default: Date.now },
});

const messageModel = model("messages", MessageSchema);

module.exports = {
  messageModel,
};
