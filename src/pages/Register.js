import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function Register() {

    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (
            firstName !== "" && 
            lastName !== "" && 
            email !== "" && 
            password !== "" && 
            confirmPassword !== "" && 
            password === confirmPassword && 
            password.length >= 8
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.message === 'Registered successfully') {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Thank you for registering!"
                });
            } else {
                Swal.fire({
                    title: "Something went wrong.",
                    icon: "error",
                    text: data.message || "Please try again later or contact us for assistance"
                });
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "An unexpected error occurred. Please try again later."
            });
        });
    }

    return (
        user.id !== null ? 
            <Navigate to="/" /> 
        :
            <Container fluid className="banner-section">
                <Container>
                    <h1 className="mb-3 text-center">Register</h1>
                    <Form onSubmit={registerUser}>
                        <div className="row">
                            <div className="col-md-4 offset-md-4">
                                <Form.Group className="my-3">
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter First Name"
                                        required
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="my-3">
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Last Name"
                                        required
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="my-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter Email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="my-3">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="my-3">
                                    <Form.Label>Confirm Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={!isActive}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Container>
            </Container>
    );
}
