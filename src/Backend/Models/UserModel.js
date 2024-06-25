const mongoose = require("mongoose");

////////////////// -----user schema------////////////////////////////////////

let userSchemaObject = {
    id: {
        type: String,
        required: false,
        unique: true

    },
    fullName: {
        type: String,
        required: [true, "Full name is reqiured"],
    },
    email: {
        type: String,
        reqiured: [true, "email is reqiured"],
        unique: true,
        validate: [function () {
            return this.email.split('@').length === 2 && this.email.split('@')[0].length != 0 && this.email.split('@')[1].length != 0;
        }, "email is not valid"]
    },
    password: {
        type: String,
        reqiured: true,
        minLength: [8, "password should be atleast 8 characters long"]
    },
    confirmPassword:{
        type: String,
        reqiured: true,
        minLength: 8,
        validate: [function () {
            return this.password === this.confirmPassword;
        }, "password and confirmPassword should be same"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "user"
    },
    isLoggedIn: {
        type: Boolean,
        reqiured: true
    }
}

const userSchema = new mongoose.Schema(userSchemaObject);

/////////////-----pre-hooks-----////////////////////////////////////////////////////////////////

userSchema.pre("save", function (next){
    this.confirmPassword = undefined;
    next();
});

const roles = ["admin", "user", "superAdmin"];

userSchema.pre("save", function (next){
    let isPresent = roles.find((currentRole) => {
        return currentRole === this.role;
    });

    if (isPresent == undefined){
        const error = new Error("role is invalid");
        return next(error);
    }
    return next();
});

userSchema.pre("findOne", function (next){
    this.select("-confirmPassword -__v");
    next();
});

userSchema.post("save", function (error, doc, next){
    if (error.code === 11000){
        next(new Error("email is already registered"));
    }
    next();
});

///////////////////////-------user model------///////////////////////////////



const userModel = mongoose.model("JJT-Users", userSchema);

module.exports = userModel;

