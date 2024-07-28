
import { useEffect, useRef, useState } from "react";
import ButtonComponent from "../../Components/Button/Button";
import FormFloatingComponent from "../../Components/FloatingLabel/FloatingLabel";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../Components/Alert/Alert";
import CloseButtonComponent from "../../Components/CloseButton/CloseButton";

function SignUpPage(){

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const OTP = useRef(null);

    const componentMounted = useRef(true);


    const navigate = useNavigate();

    const [signUpInfo, setSignUpInfo] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [signUpSuccessful, setSignUpSuccessfull] = useState(false);
    const [displayOTPBox, setDisplayOTPBox] = useState(false);
    const [alert, setAlert] = useState({        
        needAlert: false,
        alertComponent: null
    });
    const [signUpFail, setSignUpFail] = useState({
        signUpFailed: false,
        alertHeading: "Sign Up failed",
        alertText: "Please enter the details in all fields"
    });

    const [otpEmailSent, setOTPEmailSent] = useState(false);

    useEffect(() => {
        if (signUpFail.signUpFailed) {
            const alertHeading = signUpFail.alertHeading;
            const alertText = signUpFail.alertText;

            setAlert({                                    
                needAlert: true,
                alertComponent: <AlertComponent heading={alertHeading} text={alertText} setAlert={setAlert} variant="danger"/>
            });
        }
    }, [signUpFail]);

    useEffect(() => {
        if (otpEmailSent) {
            const alertHeading = "OTP Email sent";
            const alertText = "The Email with your OTP has been sent. Please check your inbox";

            setAlert({                                    
                needAlert: true,
                alertComponent: <AlertComponent heading={alertHeading} text={alertText} setAlert={setAlert} variant="success"/>
            });
        }
    }, [otpEmailSent]);
    
    function handleSignUpSubmit(){
        setSignUpFail({
            signUpFailed: false,
            alertHeading: "",
            alertText: ""
        });
        // if all fileds are filled
        if (fullNameRef.current.value !== "" && emailRef.current.value !== "" && passwordRef.current.value !== "" &&  confirmPasswordRef.current.value !== ""){
            const signUpValidationOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: fullNameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                    confirmPassword: confirmPasswordRef.current.value
                }),
                credentials: "include"
            };

            //sign up input validation
            fetch('http://localhost:3001/api/v1/user/signup/validate', signUpValidationOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 201){

                        const emailUniqueCheckOptions = {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },                            
                            credentials: "include"
                        };

                        //email uniqueness check
                        fetch(`http://localhost:3001/api/v1/user/email/${emailRef.current.value}`, emailUniqueCheckOptions)
                            .then(response => response.json())
                            .then(data => {
                                if (data.code === 200){
                                    setSignUpFail({
                                        signUpFailed: true,
                                        alertHeading: "Sign Up Failed!",
                                        alertText: "This email is already registered"
                                    });
                                }
                                else{
                                    setDisplayOTPBox(true);
                                    setSignUpInfo({
                                        fullName: fullNameRef.current.value,
                                        email: emailRef.current.value,
                                        password: passwordRef.current.value,
                                        confirmPassword: confirmPasswordRef.current.value
                                    });

                                    const signUpRequestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({fullName: fullNameRef.current.value, email: emailRef.current.value}),
                                        credentials: "include"
                                    };
                            
                            
                                    //send OTP email
                                    fetch('http://localhost:3001/api/v1/user/OTP/sendemail', signUpRequestOptions)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.code === 201){                                            
                                            setOTPEmailSent(true);
                                        } else{
                                            
                                            setSignUpFail({
                                                signUpFailed: true,
                                                alertHeading: "Sign Up Failed!",
                                                alertText: data.message
                                            });
                                        }
                                    });

                                    
                                    
                                }

                            });                       
                                
                    } else{                        
                        setSignUpFail({
                            signUpFailed: true,
                            alertHeading: "Sign Up Failed!",
                            alertText: data.message.message
                        });
                    }
                        });          
        }else{
            setSignUpFail({
                            signUpFailed: true,
                            alertHeading: "Sign Up Failed!",
                            alertText: "Please enter the details in all fields"
                        });

        }        
    }

    

    function handleOTPSubmit(){
        setSignUpFail({
            signUpFailed: false,
            alertHeading: "",
            alertText: ""
        });
        const signUpRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({OTP: OTP.current.value}),
            credentials: "include"
        };
        fetch('http://localhost:3001/api/v1/user/OTP/verify', signUpRequestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.code === 201){
                //OTP matched
                setDisplayOTPBox(false);
                const userCreationInfo = {
                    ...signUpInfo,
                    role: "user",
                    isLoggedIn: false
                }
        
                const signUpRequestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userCreationInfo),
                    credentials: "include"
                };

                fetch('http://localhost:3001/api/v1/user', signUpRequestOptions)
                .then(response => response.json())
                .then(data => {                    
                    if (data.code !== 201){
                        setSignUpFail({
                            signUpFailed: true,
                            alertHeading: "Sign Up Failed!",
                            alertText: data.message
                        });
                    }
                    else{
                        setSignUpSuccessfull(true);
                        const timer = setTimeout(() => {
                            setSignUpSuccessfull(false);
                            navigate("/login");
                            setSignUpInfo({
                                fullName: "",
                                email: "",
                                password: "",
                                confirmPassword: ""
                            });
                        }, 3000)
                    }
                });
                    

            }else {
                setSignUpFail({
                    signUpFailed: true,
                    alertHeading: "Sign Up Failed!",
                    alertText: "OTP entered did not match with the one sent in your email"
                });
            }
        })
        
        
        
    }      

    return (
        <>
                {displayOTPBox ? 
                    <div style={{
                        backgroundColor: "white",
                        position: "absolute",                 
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",                            
                        zIndex: 10,
                        height: "50vh",
                        width: "20vw",
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom:20,
                        paddingTop: 10,                    
                        display: "flex",
                        flexDirection: 'column',
                        flexWrap: "wrap",
                        justifyContent: 'space-between',
                        borderRadius: "20px",
                        boxShadow: "0 20px 20px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        
                    }}> 
                    <div style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        // padding: '15px'                
                    }}>
                        <CloseButtonComponent 
                            onClick={()=>{
                                setDisplayOTPBox(false);
                        }}/>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: "80%",
                            width: "100%",
                          
                        }}
                    
                    >
                    Please enter the OTP sent to your email address                       
                       <FormFloatingComponent 
                        controlId="OTP"
                        label="Enter the OTP"
                        className="g-2"
                        placeholder="OTP"
                        type="text"
                        ref={OTP}
                        />
                        <ButtonComponent label="Submit" type="dark" size="lg" onClick={handleOTPSubmit}/>




                    </div>
                    
            
                    </div> : null}

                                        
                    

                    {alert.needAlert || otpEmailSent? 
                <div 
                    style={{position: "absolute",                 
                        top: "30%",  left: "50%",
                        transform: "translate(-50%, -50%)",                            
                        zIndex: 10
                    }}
            >{alert.alertComponent} </div>: null}

            
                {signUpSuccessful ?
                 <div style={{position: "absolute",                 
                            top: "50%",  left: "50%",
                            transform: "translate(-50%, -50%)",                            
                            zIndex: 10
                        }}>
                <img src="https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/Sign_Up/signUpSuccessful.png" alt="Sign up success"/>
            </div> : null}      
           
           <div 
                style={{
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
                    paddingLeft: 50,
                    paddingRight: 50,
                    paddingBottom:20,                    
                    display: "flex",
                    flexDirection: 'column',
                    flexWrap: "wrap",
                    justifyContent: 'space-evenly',
                    borderRadius: "20px",
                    boxShadow: "0 20px 20px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                }}
                
            >
                <div style={{ textAlign: "center", paddingBottom:20, paddingTop:10 }}>Sign Up Form</div>

                <FormFloatingComponent 
                    controlId="floatingFullName"
                    label="Full Name"
                    className="mb-1"                    
                    placeholder="Full Name"
                    type="text"
                    ref={fullNameRef}
                />
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
                    className="mb-1"
                    placeholder="Password"
                    type="password"
                    ref={passwordRef}
                />

                <FormFloatingComponent 
                    controlId="floatingConfirmPassword"
                    label="Confirm Password"
                    className="mb-4"
                    placeholder="Confirm Password"
                    type="password"
                    ref={confirmPasswordRef}
                />

                <ButtonComponent label="Submit" type="dark" size="lg" onClick={handleSignUpSubmit}/>

                </div>
            </div>
        </>
    );
}

export default SignUpPage;