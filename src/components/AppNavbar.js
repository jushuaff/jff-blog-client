import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar className="shadow-sm" expand="lg">
            <div className="nav-top">
            </div>
            <Container>
                <div className="main-nav">
                    <div className="logo-con">
                        <Navbar.Brand as={NavLink} to="/">
                            <img className="logo" src="/logo512.png" alt="Logo" />
                        </Navbar.Brand>
                    </div>
                    <div className="nav-con">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                                {user.id !== null 
                                    ? <>
                                        <Nav.Link as={NavLink} to="/blogs">Blog</Nav.Link>
                                        <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                                      </>
                                    : <>
                                        <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                        <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                                      </>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
}