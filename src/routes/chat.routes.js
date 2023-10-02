const { Router, response, request } = require("express");
const { chatGET } = require("../controller/chat.controller");
const router = Router();
const chatHandle = new (require("../dao/MongoManager/ChatManager"))();

router.get("/", chatGET);

module.exports = router;
