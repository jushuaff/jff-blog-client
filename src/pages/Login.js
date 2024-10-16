import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function Login() {

    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const navigate = useNavigate();

    async function authenticate(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await res.json();

            if (data.access !== undefined) {
                localStorage.setItem('token', data.access);
                const details = await retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                const welcomeMessage = details.isAdmin ? 
                    "Welcome to Dashboard, " : 
                    "Welcome to your blog, ";

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: `${welcomeMessage}${details.firstName} ${details.lastName} !`
                });

                navigate("/blogs");

            } else {
                Swal.fire({
                    title: "Authentication failed",
                    icon: "error",
                    text: "Check your login details and try again."
                });
            }
        } catch (error) {
            Swal.fire({
                title: "An error occurred",
                icon: "error",
                text: error.message
            });
        }
    }

    const retrieveUserDetails = async (token) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            // Assuming data is directly the user object
            if (data) {
                setUser({
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    isAdmin: data.isAdmin || false // Fallback in case isAdmin is undefined
                });

                return data;
            } else {
                Swal.fire({
                    title: "User data is missing",
                    icon: "error",
                    text: "Unable to retrieve user details."
                });
            }
        } catch (error) {
            Swal.fire({
                title: "An error occurred on retrieval",
                icon: "error",
                text: error.message
            });
        }
    };



    useEffect(() => {
        if(email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    if (user.id) {
        return navigate("/");
    }

    return (
        <>
            <Container fluid className="banner-section">
                <Container className="my-4">
                    <h1 className="mb-4 text-center">Login</h1>
                    <Form onSubmit={authenticate} >
                        <Form.Group controlId="userEmail" className="my-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                autoComplete="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="my-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                autoComplete="current-password"
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={!isActive}>
                            Submit
                        </Button>
                    </Form>
                </Container>
            </Container>
        </>
    );
}
