const express = require("express");
const commentController = require("../controllers/commentController.js");
const commentRouter = express.Router();
 
commentRouter.get("/getTextComments", commentController.getTextComments);
commentRouter.post("/postComment", commentController.postComment);
 
module.exports = commentRouter;