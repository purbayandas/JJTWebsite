const express = require("express");
const mongoose = require("mongoose");
/**********env variables **********/
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const util = require("util");




dotenv.config();
const { DB_USER, DB_PASSWORD, JWT_SECRET } = process.env;

/*****************************/
const app = express();

const promisify = util.promisify;
const promisdiedJWTsign = promisify(jwt.sign);
const promisdiedJWTverify = promisify(jwt.verify);

// const payload = { 
//     userId: "user_81079_1718474406147",
//     isLoggedIn: false
// }

// reading the content
/*****connect to the DB******/
const dbUrl =
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@jjt-database.goqd244.mongodb.net/jjt-users?retryWrites=true&w=majority&appName=JJT-Database`
mongoose.connect(dbUrl)
    .then(function (conn) {
        console.log("connected to db")
    }).catch(err => console.log(err))
/************************************/
const corsConfig = {
    origin: true,
    credentials: true,
};
// this is allowing all the requests
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
/**********payload -> req.body**************/
app.use(express.json());
/*******to get the cookie in req.cookies**/
app.use(cookieParser());



const UserRouter = require("./Routers/UserRouter");

/****send the token ***/
app.post("/sign", async function (req, res) {
    try {
        const payload = req.body;
        // create the token
        const authToken = await promisdiedJWTsign({ payload }, JWT_SECRET, { algorithm: "HS256" });
        // add it to cookies
        // transport -> cookies
        res.cookie("jwt", authToken, { maxAge: 90000000, httpOnly: true });
        console.log("cookie sent");
        //  send actual reponse
        res.status(200).json({
            message: "signed the jwt and sending it in the cookie",
            authToken,
            code: 200
        })
    } catch (err) {
        console.log("err", err);
        res.status(400).json({
            message: err.message,
            status: "failure"
        })
    }
})

/*************verifying those tokens********************/
app.get("/verify", async function (req, res) {
    try {
        let jwt = req.cookies.jwt;        
        if (jwt) {
            const decryptedToken = await promisdiedJWTverify(jwt, JWT_SECRET);
            res.status(200).json({
                message: "jwt token is verified",
                decryptedToken,
                code: 200
            })
            } else {
                res.status(400).json({
                    message: "no jwt token found",
                    status: "failure",
                    code: 400
                })
            }
    } catch (err) {
        console.log("err", err);
        res.status(400).json({
            message: err.message,
            status: "failure"
        })
    }

})

app.get("/clearCookies", function (req, res) {
    // clearing the cookie -> name of the cookie , path where it was created 
    res.clearCookie('jwt', { path: "/" });
    res.status(200).json({
        message: "i have cleared your cookie"
    })

})


// request -> user -> api/v1/user
app.use("/api/v1/user", UserRouter);

/***********************user*********************/

// 5. resource not found 

app.use(function (req, res) {
    console.log("recieved the request");
    res.status(404).json({
        message: "resource not found"
    })
})

// listening for all the http request 
app.listen(3001, function () {
    console.log("Listening to port 3001");
})

