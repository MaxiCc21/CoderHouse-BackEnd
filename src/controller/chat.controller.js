const { chatService } = require("../service");

class ChatController {
  chatGET = async (request, response) => {
    let messages = await chatService.getMessages();

    let options = {
      style: "chat.css",
      messages,
    };

    response.render("chat.handlebars", options);
  };
}

module.exports = new ChatController();
