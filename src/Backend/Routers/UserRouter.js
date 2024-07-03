const express = require("express");
const userRouter = express.Router();

const { createUser, getAllUsers, findByEmail, validateUserLogin, logoutUser, sendOTPEmail, verifyUserOTP, validateSignUpInfo} = require("../Controllers/UserController");

userRouter.route("/")
    .post(createUser)
    .get(getAllUsers);

userRouter.route("/email/:email")
    .get(findByEmail);

userRouter.route("/login") 
   .post(validateUserLogin);

userRouter.route("/logout/id/:id")
    .post(logoutUser);

userRouter.route("/OTP/sendemail")
    .post(sendOTPEmail);

userRouter.route("/OTP/verify")
    .post(verifyUserOTP);

userRouter.route("/signup/validate")
    .post(validateSignUpInfo);
   
module.exports = userRouter;