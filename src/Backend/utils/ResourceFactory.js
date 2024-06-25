/////////////////------creation of element------//////////////////////

const createFactory = function(elementModel, resourceType){
    return async function(req, res){
        try{
            // id creation
            const id = resourceType + "_" + Math.floor(Math.random()*100000).toString() + "_" + Date.now().toString();
            req.body.id = id;

            const resourceDetails = req.body;
            const resource = await elementModel.create(resourceDetails);
            console.log("resource created");

            res.status(201).json({
                code: 201,
                message: "resource created",
                resource: resource
            });
        }catch(err){
            res.status(500).json({
                code: 500,
                status: "internal server error",
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
                console.log
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


module.exports = {createFactory, getAllFactory, findByField, validateLogin, logout };


