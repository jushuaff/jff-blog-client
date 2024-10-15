import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import UpdatePost from './pages/UpdatePost';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Error from './pages/Error';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });
    };

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.auth !== 'Failed') {
                        setUser({
                            id: data.id,
                            isAdmin: data.isAdmin,
                        });
                    } else {
                        setUser({
                            id: null,
                            isAdmin: false, 
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                    setUser({
                        id: null,
                        isAdmin: false,
                    });
                });
        } else {
            setUser({
                id: null,
                isAdmin: false,
            });
        }
    }, [token]);

    useEffect(() => {
        //console.log(user);
        //console.log(localStorage);
    }, [user]);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router class="shadow-sm">
                <AppNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blogs" element={<Blog />} />
                    <Route path="/register" element={<Register />} />
                    {!token ? 
                        <Route path="/login" element={<Login />} />
                    : null}
                    {token ? 
                        <Route path="/update-post/:postId" element={<UpdatePost />} />
                    : null}
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Error />} />
                </Routes>
                <Footer />
            </Router>
        </UserProvider>
    );
}

export default App;
