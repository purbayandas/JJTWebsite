import { useContext, useRef, useState, useEffect } from "react";
import ButtonComponent from "../../Components/Button/Button";
import FormFloatingComponent from "../../Components/FloatingLabel/FloatingLabel";
import NavBarComponent from "../../Components/Navbar/Navbar";
import SwitchComponent from "../../Components/Switch/Switch";
import { useNavigate } from "react-router-dom";
import { isLoggedInContext } from "../../App";

function LoginPage(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useContext(isLoggedInContext);

    const [adminLoginSwitch, setAdminLoginSwitch] = useState(false);

    function signUpButtonHandler(){
        navigate("/signUp");
    }

    function adminToggleHandler(event){

        if (event.target.value === "on")
            setAdminLoginSwitch(true);
        else{
            setAdminLoginSwitch(false);

        }
        
    }

    function loginButtonHandler(){
        const signUpRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }            
        };

    
        fetch(`http://localhost:3001/api/v1/user/login?username=${emailRef.current.value}&password=${passwordRef.current.value}`, signUpRequestOptions)
                .then(response => response.json())
                .then(data => {                    
                    if (data.code === 201 && data.message === "success"){
                        const jwtPayload = {
                            userId: data.details.id,
                            isLoggedIn: data.details.isLoggedIn,
                            fullName: data.details.fullName,
                            adminLoginSwitch: adminLoginSwitch
                        }                   

                        const JWTsignUpRequestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(jwtPayload),
                            credentials: "include"           
                        };

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
                                
                            })

                        


                        navigate("/");
                    }
                    else{
                        alert("login failed")
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