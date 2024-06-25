import { useContext, useRef, useState, useEffect } from "react";
import ButtonComponent from "../../Components/Button/Button";
import FormFloatingComponent from "../../Components/FloatingLabel/FloatingLabel";
import NavBarComponent from "../../Components/Navbar/Navbar";
import SwitchComponent from "../../Components/Switch/Switch";
import { useNavigate } from "react-router-dom";
import { isLoggedInContext } from "../../App";
import AlertComponent from "../../Components/Alert/Alert";


function LoginPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useContext(isLoggedInContext);

    const [adminLoginSwitch, setAdminLoginSwitch] = useState(false);

    const [alert, setAlert] = useState({        
        needAlert: false,
        alertComponent: null
    });

    const [loginFail, setLoginFail] = useState({
        loginFailed: false,
        alertHeading: "Login failed",
        alertText: "Username / password don't match."
    });

    useEffect(() => {
        if (loginFail.loginFailed) {
            const alertHeading = loginFail.alertHeading;
            const alertText = loginFail.alertText;

            setAlert({                                    
                needAlert: true,
                alertComponent: <AlertComponent heading={alertHeading} text={alertText} setAlert={setAlert} />
            });
        }
    }, [loginFail]);

    function signUpButtonHandler() {
        navigate("/signUp");
    }

    function adminToggleHandler(event) {
        setAdminLoginSwitch(event.target.checked);
        setLoginFail({
            loginFailed: false,
            alertHeading: "",
            alertText: ""
        });
    }

    function loginButtonHandler() {
        setLoginFail({
            loginFailed: false,
            alertHeading: "",
            alertText: ""
        });

        const signUpRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }            
        };

        fetch(`http://localhost:3001/api/v1/user/login?username=${emailRef.current.value}&password=${passwordRef.current.value}`, signUpRequestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.code === 201 && data.message === "success") {
                    const jwtPayload = {
                        userId: data.details.id,
                        isLoggedIn: data.details.isLoggedIn,
                        fullName: data.details.fullName,
                        adminLoginSwitch: adminLoginSwitch
                    };

                    const JWTsignUpRequestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(jwtPayload),
                        credentials: "include"
                    };

                    if (adminLoginSwitch) {
                        if (data.details.role === "superAdmin" || data.details.role === "admin") {
                            fetch(`http://localhost:3001/sign`, JWTsignUpRequestOptions)
                                .then(JWTresponse => JWTresponse.json())
                                .then(JWTdata => {
                                    setIsLoggedIn({
                                        loginStatus: data.details.isLoggedIn,
                                        fullName: data.details.fullName,
                                        id: data.details.id,
                                        authToken: JWTdata.authToken,
                                        adminLoginSwitch: adminLoginSwitch
                                    });
                                    navigate("/");
                                });
                        } else {
                            setLoginFail({
                                loginFailed: true,
                                alertHeading: "Login failed",
                                alertText: "You don't have Admin rights! Please switch off the Admin toggle and then login."
                            });
                        }
                    } else {
                        fetch(`http://localhost:3001/sign`, JWTsignUpRequestOptions)
                            .then(JWTresponse => JWTresponse.json())
                            .then(JWTdata => {
                                setIsLoggedIn({
                                    loginStatus: data.details.isLoggedIn,
                                    fullName: data.details.fullName,
                                    id: data.details.id,
                                    authToken: JWTdata.authToken,
                                    adminLoginSwitch: adminLoginSwitch
                                });
                                navigate("/");
                            });
                    }
                } else {
                    setLoginFail({
                        loginFailed: true,
                        alertHeading: "Login failed",
                        alertText: "Username / Password don't match up"
                    });
                    const id = data.details.id;
                    fetch(`http://localhost:3001/api/v1/user/logout/id/${id}`, signUpRequestOptions)
                        .then(response => response.json())
                        .then(data => {
                            if (data.code === 201 && data.message === "logout successful") {
                                const requestOptions = {
                                    method: 'GET',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: "include"
                                };

                                fetch("http://localhost:3001/clearCookies", requestOptions)
                                    .then(response => response.json())
                                    .then(jwtdata => {
                                        setIsLoggedIn({
                                            loginStatus: data.isLoggedIn,
                                            fullName: "",
                                            id: "",
                                            authToken: ""
                                        });
                                    });
                            }
                        });
                }
            });
    }


    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    return (  
        <>
        
        <div style={{
            padding:100,           
            display: "flex",
            flexDirection: 'column',            
            justifyContent: 'space-evenly',
            alignItems: "center",
            backgroundImage: `url("https://as1.ftcdn.net/v2/jpg/02/92/90/56/1000_F_292905667_yFUJNJPngYeRNlrRL4hApHWxuYyRY4kN.jpg")`,
            backgroundSize: 'contain',
            backgroundPosition: 'left',
            backgroundRepeat: 'no-repeat',
        }}>

            {alert.needAlert ? 
                <div 
                    style={{position: "absolute",                 
                        top: "30%",  left: "50%",
                        transform: "translate(-50%, -50%)",                            
                        zIndex: 10
                    }}
            >{alert.alertComponent} </div>: null}
            
            <div 
                style={{
                    height: "50vh",
                    width: "50vw",
                    padding: 50,
                    display: "flex",
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-evenly',
                    borderRadius: "20px",
                    boxShadow: "0 20px 20px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                }}
                
                
            >
                <div style={{                        
                        display: "flex",
                        flexDirection: 'row',                        
                        justifyContent: 'flex-end'
                }}
                >
                    <SwitchComponent switchLabel="Login as Administrator" onChange={adminToggleHandler}/>
                </div>
                
                <FormFloatingComponent 
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-1"
                    placeholder="name@example.com"
                    type="email"
                    ref={emailRef}
                />
                <FormFloatingComponent 
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-3"
                    placeholder="Password"
                    type="password"
                    ref={passwordRef}
                />

                <ButtonComponent label="Login" type="dark" size="lg" onClick={loginButtonHandler}/>

                <div style={{                        
                            display: "flex",
                            flexDirection: 'row',                        
                            justifyContent: 'flex-end',
                            marginTop: "10px"
                        }}
                >
                    <p>New user? Please Sign up with us</p>
                </div>                

                <div style={{                        
                            display: "flex",
                            flexDirection: 'row',                        
                            justifyContent: 'flex-end',
                            
                        }}
                >
                    
                    <ButtonComponent label="Sign Up" type="info" size="lg" onClick={signUpButtonHandler}/>
                </div>
                

            </div>
        </div>
        
        </>      
        
    );
}
export default LoginPage;