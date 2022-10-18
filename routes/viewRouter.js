const express = require("express");
const viewController = require("../controllers/viewController.js");
const viewRouter = express.Router();
 
viewRouter.get("/getView", viewController.getView);
viewRouter.post("/postView", viewController.postView);

module.exports = viewRouter;