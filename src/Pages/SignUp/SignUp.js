
import { useEffect, useRef, useState } from "react";
import ButtonComponent from "../../Components/Button/Button";
import FormFloatingComponent from "../../Components/FloatingLabel/FloatingLabel";
import NavBarComponent from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

function SignUpPage(){

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const navigate = useNavigate();

    const [signUpInfo, setSignUpInfo] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [signUpSuccessful, setSignUpSuccessfull] = useState(false);

    
    function handleSignUpSubmit(){
        setSignUpInfo({
            fullName: fullNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmPassword: confirmPasswordRef.current.value
        });
    }

    useEffect(() => {
        console.log("use effect is executed")

        const userCreationInfo = {
            ...signUpInfo,
            role: "user",
            isLoggedIn: false
        }

        const signUpRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCreationInfo)
        };
        if (signUpInfo.fullName !== "" && signUpInfo.email !== "" && signUpInfo.password !== "" &&  signUpInfo.confirmPassword !== ""){
                fetch('http://localhost:3001/api/v1/user', signUpRequestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.code !== 201){
                        alert(data.message);
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
            }          

    },[signUpInfo]);

    

    return (
        <>
           

            
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