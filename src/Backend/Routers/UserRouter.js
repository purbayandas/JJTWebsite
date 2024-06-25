const express = require("express");
const userRouter = express.Router();

const { createUser, getAllUsers, findByEmail, validateUserLogin, logoutUser } = require("../Controllers/UserController");

userRouter.route("/")
    .post(createUser)
    .get(getAllUsers);

userRouter.route("/email/:email")
    .get(findByEmail);

userRouter.route("/login") 
   .post(validateUserLogin);

userRouter.route("/logout/id/:id")
    .post(logoutUser);
   
module.exports = userRouter;