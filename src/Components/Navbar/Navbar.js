import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LogoComponent from '../Logo/Logo';
import ButtonComponent from '../Button/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, React } from 'react';
import { isLoggedInContext } from '../../App';

function NavBarComponent() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useContext(isLoggedInContext);    

    function loginButtonHandler(){        
        navigate("/login");
    }

    function logoutButtonHandler(){ 
        const signUpRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }            
        };
        const id = isLoggedIn.id;
    
        fetch(`http://localhost:3001/api/v1/user/logout/id/${id}`, signUpRequestOptions)
                .then(response => response.json())
                .then(data => { 
                                      
                    if (data.code === 201 && data.message === "logout successfull"){
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
                    else{
                        alert("logout failed")
                    }
                });  
        
    }

    const isAdminText = isLoggedIn.adminLoginSwitch ? <img src="https://jjt-website-main-bucket.s3.ap-south-1.amazonaws.com/Admin/admin.png" alt="admin" style={{width: "100px", height: "100%", padding: "5px"}}></img> : null;

  return (
    <Navbar expand="lg" variant='dark' className='bg-dark d-flex justify-content-between'>
        
            <Container className='ms-0 d-flex justify-content-between' style={{ maxWidth: '100%' }}>                          
                <Nav
                    className="my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                >
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/aboutUs">About Us</Link>
                    <NavDropdown title="Discography" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                        Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                        Something else here
                    </NavDropdown.Item>
                    </NavDropdown>
                    {isLoggedIn.loginStatus ?
                     <div style={{color: "white"}}>Welcome - {isLoggedIn.fullName}{isAdminText} <ButtonComponent label="Logout" type="light" size="sm" onClick={logoutButtonHandler}/></div>
                     :<ButtonComponent label="Login" type="light" size="sm" onClick={loginButtonHandler}/>}
                </Nav> 
                
                <LogoComponent className/>
                <Form className="d-flex" data-bs-theme="dark">
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    />
                    <Button variant="outline-light">Search</Button>
                </Form>
                
            </Container>   
      
    </Navbar>
  );
}

export default NavBarComponent;