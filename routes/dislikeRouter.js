const express = require("express");
const dislikeController = require("../controllers/dislikeController.js");
const dislikeRouter = express.Router();
 
dislikeRouter.get("/getDislikes", dislikeController.getDislikes);
dislikeRouter.post("/postDislike", dislikeController.postDislike);
dislikeRouter.post("/deleteDislike", dislikeController.deleteDislike);
 
module.exports = dislikeRouter;