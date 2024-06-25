import './App.css';
import NavBarComponent from './Components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Pages/Home/HomePage';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AboutUs from './Pages/AboutUs/AboutUs';
import LoginPage from './Pages/Login/Login';
import SignUpPage from './Pages/SignUp/SignUp';
import { createContext, useContext, useState, React, useEffect } from 'react';

export const isLoggedInContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState({loginStatus: false, fullName: "", id: "", authToken: "", adminLoginSwitch: false});


  useEffect(() => {
    const signInRequestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"           
    };
    fetch("http://localhost:3001/verify", signInRequestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.code === 200){
          console.log(data.decryptedToken.payload)
          if (data.decryptedToken.payload.isLoggedIn){

            console.log(isLoggedIn)
            setIsLoggedIn({
              ...isLoggedIn,
              loginStatus: data.decryptedToken.payload.isLoggedIn,
              id: data.decryptedToken.payload.userId,
              fullName: data.decryptedToken.payload.fullName,
              adminLoginSwitch: data.decryptedToken.payload.adminLoginSwitch

            });
          }
  
        }
        
      });
  }, [])
     
 
    
  
    
  


  
  return (
    <div className="App">
      <isLoggedInContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
        <Router>
          <NavBarComponent/>
          <Routes>
            <Route path="/" element={<HomePage/>}></Route>
            <Route path="/aboutUs" element={<AboutUs/>}></Route>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/signUp" element={<SignUpPage/>}></Route>            
          </Routes>
        </Router> 
      </isLoggedInContext.Provider>     
    </div>
  );
}

export default App;
