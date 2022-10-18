const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
 
userRouter.use("/profile", userController.profile);
userRouter.post("/authorization", userController.authorization);
userRouter.use("/", userController.getUsers);
 
module.exports = userRouter;