const express = require("express");
const textController = require("../controllers/textController.js");
const textRouter = express.Router();


textRouter.use("/createText", textController.createText);
textRouter.use("/addImage", textController.addImage);
textRouter.use("/create", textController.create);
textRouter.use("/getById/:id", textController.getById);
 
module.exports = textRouter;