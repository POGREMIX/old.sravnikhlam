const express = require("express");
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();

homeRouter.get("/about", homeController.about);
homeRouter.get("/", homeController.index);
homeRouter.get("/nextPageList", homeController.nextPageList);
 
module.exports = homeRouter;