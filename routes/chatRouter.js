const express = require("express");
const chatController = require("../controllers/chatController.js");
const chatRouter = express.Router();

 
chatRouter.get("/getUpdates", chatController.getUpdates);
chatRouter.post("/addChatMessage", chatController.addChatMessage);

chatRouter.ws("/common", chatController.Common);
chatRouter.ws("/text", chatController.Text);
 
module.exports = chatRouter;