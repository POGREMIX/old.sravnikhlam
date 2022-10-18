const express = require("express");
const registrationController = require("../controllers/registrationController.js");
const registrationRouter = express.Router();
 

registrationRouter.post("/registrate", registrationController.registrate);
registrationRouter.post("/sendEmailCode", registrationController.sendEmailCode);
registrationRouter.get("/verifyEmail", registrationController.verifyEmail);


module.exports = registrationRouter;