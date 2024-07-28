
const emailSender = require("./EmailSender");

/////////////////------creation of element------//////////////////////
const createFactory = function(elementModel, resourceType){
    return async function(req, res){
        try{
            console.log(req.session.OTPVerified)

            if (req.session.OTPVerified === true){
                // id creation
                const id = resourceType + "_" + Math.floor(Math.random()*100000).toString() + "_" + Date.now().toString();
                req.body.id = id;
                
                let resource = {};
                const resourceDetails = req.body;        
                resource = await elementModel.create(resourceDetails);
                res.status(201).json({
                        code: 201,
                        message: "resource created",
                        resource: resource
                    });
            } else{
                res.status(500).json({
                    code: 500,
                    status: "failure",
                    message: "OTP has not been verified"
                });
            }
            
        } catch(err){
            res.status(500).json({
                code: 500,
                status: "internal server error",
                message: err.message
            })            
        }
    }
}

const validateSignUpInput = function(elementModel){
    return async function(req, res){
        const signUpDetails = req.body;

        const testResource = new elementModel(signUpDetails)

        const error = testResource.validateSync();

        if (error){
            res.status(500).json({
                code: 500,
                message: error,                
            })
            
        }else{
            res.status(201).json({
                code: 201,
                message: "Data entered is all fine - as per schema",                
            })
        }

    }
}


const sendEmail = function (OTPGenerator){
    return async function (req, res) {
        try{
            generatedOTP = OTPGenerator();
            
            req.session.generatedOTP = generatedOTP;
                      
            const template = "SignUpOTP.html";
            const receiverEmail = req.body.email;
            console.log(req.body)
            const subject =  "Signup email verification - Jol Jol Tuni"
            const emailObject = {
                name: req.body.fullName,
                OTP:  generatedOTP
            };
            const emailResponse = await emailSender(template, receiverEmail, subject, emailObject);
            // if (JSON.stringify(emailResponse.info.accepted) == JSON.stringify([`${email}`])){
                res.status(201).json({
                    code: 201,
                    message: "email sent",                    
                    resource: emailResponse
                });
              
        } catch (err){
            res.status(500).json({
                code: 500,
                status: "Internal server error",
                message: err.message
            });
        }   
            
    }
}

const verifyOTP = function (){
    return async function(req, res){
        try{    
            req.session.OTPVerified = false;        
            const enteredOTP = req.body.OTP;
            
            const generatedOTP = req.session.generatedOTP;
            
            if (enteredOTP === generatedOTP){ 
                req.session.OTPVerified = true;               
                res.status(201).json({
                    code: 201,
                    message: "OTP matched"
                });
                
            } else{
                console.log("OTP dont match");
                res.status(501).json({
                    code: 501,
                    message: "OTP doesn't match"
                })
            }
        }catch(err){
            res.status(500).json({
                code: 500,
                status: "Internal server error",
                message: err.message
            })
        }
        
        
    }
    
}
    



const getAllFactory = function (elementModel) {

    return async (req, res) => {
        try {

            const user = await elementModel.find();
            // if user is present -> send the resp
            if (user.length != 0) {
                res.status(200).json({
                    message: user,
                })
                // if it's not there then send user not found 
            } else {
                res.status(404).json({
                    message: "did not get any user"
                })
            }
        } catch (err) {
            res.status(500).json({
                status: "Internal server error",
                message: err.message
            })
        }

    }
}

const findByField = function (elementModel){
    return async (req, res) => {
        try{
            const byField = Object.keys(req.params)[0];
            const fieldValue = req.params[[byField]];

            const foundElement = await elementModel.findOne( {[byField]: fieldValue} );

            if (foundElement === null){
                res.status(404).json({
                    code: 404,
                    message: "did not find element"
                })
            }else {
                res.status(200).json({
                    code: 200,
                    message: foundElement,
                });
            }
        } catch (err) {
            res.status(500).json({
                status: "Internal server error",
                message: err.message
            })
        }   
    }
}

const validateLogin = function (elementModel){
    return async (req, res) => {
        try{
            const username = req.query.username;
            const password = req.query.password;

            const foundElement = await elementModel.findOneAndUpdate({ email: username, password: password }, { isLoggedIn: true }, { new: true} );

            if (foundElement !== null){                
                res.status(201).json({
                    code: 201,
                    message: "success",
                    details: {
                        id: foundElement.id,
                        fullName: foundElement.fullName,
                        role: foundElement.role,
                        isLoggedIn: foundElement.isLoggedIn,
                        loggedInAtTime: Date.now()
                    }
                });
            } else{
                res.status(404).json({
                    code: 404,
                    message: "failure",
                    details: {}               

            });

            }

        } catch (err) {
            res.status(500).json({
                status: "Internal server error",
                message: err.message
            })
        }
    }
}


const logout = function(elementModel){
    
    return async (req, res) => {
        try{
            
            const id = req.params.id;

            const loggedOutUser = await elementModel.findOneAndUpdate({ id: id }, { isLoggedIn: false }, { new: true});
            
            if (loggedOutUser !== null){
                res.status(201).json({
                    code: 201,
                    message: "logout successfull",
                    id: id,
                    loggedOutAtTIme: Date.now(),
                    isLoggedIn: loggedOutUser.isLoggedIn
                })
            }
            else{
                
                res.status(404).json({
                    code: 404,
                    message: "failure",
                    details: {}               

            });
        } 
            
        }catch (err) {
            res.status(500).json({
                status: "Internal server error",
                message: err.message
            });
        }

    }
}


module.exports = {createFactory, getAllFactory, findByField, validateLogin, logout, sendEmail, verifyOTP, validateSignUpInput };


