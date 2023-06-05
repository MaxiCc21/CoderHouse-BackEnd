const { Router, response, request } = require("express");
const router = Router();
const chatHandle = new (require("../dao/MongoManager/ChatManager"))();

router.get("/", async (request, response) => {
  let messages = await chatHandle.getMessages();

  let options = {
    style: "chat.css",
    messages,
  };

  response.render("chat.handlebars", options);
});

module.exports = router;
