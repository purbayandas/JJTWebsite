const userModel = require("../Models/UserModel");
const {createFactory, getAllFactory, findByField, validateLogin, logout} = require("../utils/ResourceFactory");

const createUser = createFactory(userModel, "user");
const getAllUsers = getAllFactory(userModel);
const findByEmail = findByField(userModel);
const validateUserLogin = validateLogin(userModel);
const logoutUser = logout(userModel);


module.exports = { createUser, getAllUsers, findByEmail, validateUserLogin, logoutUser };

