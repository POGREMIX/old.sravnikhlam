const express = require("express");
const likeController = require("../controllers/likeController.js");
const likeRouter = express.Router();
 

likeRouter.get("/getLikes", likeController.getLikes);
likeRouter.post("/postLike", likeController.postLike);
likeRouter.post("/deleteLike", likeController.deleteLike);

module.exports = likeRouter;