const userModel = require("../Models/UserModel");
const {createFactory, getAllFactory, findByField, validateLogin, logout, sendEmail, verifyOTP, validateSignUpInput} = require("../utils/ResourceFactory");
const OTPGenerator = require("../utils/OTPGenerator");

const createUser = createFactory(userModel, "user");
const getAllUsers = getAllFactory(userModel);
const findByEmail = findByField(userModel);
const validateUserLogin = validateLogin(userModel);
const logoutUser = logout(userModel);
const sendOTPEmail = sendEmail(OTPGenerator());
const verifyUserOTP = verifyOTP();

const validateSignUpInfo = validateSignUpInput(userModel)

module.exports = { createUser, getAllUsers, findByEmail, validateUserLogin, logoutUser, sendOTPEmail, verifyUserOTP, validateSignUpInfo };

