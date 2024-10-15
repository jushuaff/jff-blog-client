import { useEffect, useState, useContext } from 'react';
import PostCard from '../components/PostCard';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import '../css/blog.css';

export default function Blog() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState({});

    const fetchPosts = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch blog post list');
            return res.json();
        })
        .then(data => {
            setPosts(data || []);
            setError('');
        })
        .catch(err => {
            console.error("Fetch error:", err.message); // Log error for better understanding
            setError(err.message);
        });
    };

    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user]);

    const handleAddPost = () => {
        const errors = {};
        if (!title.trim()) {
            errors.title = 'Post title is required';
        }
        if (!content.trim()) {
            errors.content = 'Post content is required';
        }

        setValidationError(errors);
        
        if (Object.keys(errors).length > 0) {
            return;
        }

        const postData = {
            title,
            content,
            imageUrl: ''
        };

        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(postData)
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to add a post");
            }
            return data;
        })
        .then(newPost => {
            setPosts(prev => [newPost, ...prev]);
            setTitle('');
            setContent('');
            setError('');
            setValidationError({});

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Post Created',
                text: 'Your post has been successfully added!',
                confirmButtonText: 'OK'
            });
        })
        .catch(err => {
            console.error("Add post error:", err.message);
            setError(err.message);
        });
    };

    const handleDeletePost = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to delete post');
                    return res.json();
                })
                .then(() => {
                    setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Your post has been deleted.',
                        confirmButtonText: 'OK'
                    });
                })
                .catch(err => {
                    console.error("Delete post error:", err.message);
                    setError(err.message);
                });
            }
        });
    };


    const handleUpdate = (id) => {
        navigate(`/update-post/${id}`);
    }

    return (
        <Container fluid className="banner-section blog-page">
            <Container>
                {user ? (
                    <>
                    <Row className="mt-3">
                        <div className="col-md-6 offset-md-3 text-center mb-4">
                            <h3>Blog Catalog</h3>
                        </div>
                    </Row>
                    <Row>
                        <Col md={6} className="mb-4 offset-md-3">
                            <Form.Group>
                                <Form.Label className="mb-2">Create a Post</Form.Label>
                                {validationError.title && <div className="text-danger">{validationError.title}</div>}
                                <Form.Control
                                    type="text"
                                    className={`mb-2 ${validationError.title ? 'is-invalid' : ''}`}
                                    placeholder="Post Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {validationError.content && <div className="text-danger">{validationError.content}</div>}
                                <Form.Control
                                    as="textarea"
                                    className={`${validationError.content ? 'is-invalid' : ''}`}
                                    placeholder="Content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleAddPost} className="mt-2 w-100">
                                    Add Post
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Row key={post._id}>
                                <Col md={6} key={post._id} className="mb-4 offset-md-3">
                                    <PostCard 
                                        post={post} 
                                        onUpdate={handleUpdate}
                                        onDelete={handleDeletePost}
                                    />
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <Row>
                            <Col md={6} className="offset-md-3">
                                <h4>{error || 'No Posts available'}</h4>
                            </Col>
                        </Row>
                    )}
                    </>
                ) : (
                    <>
                    <h1>You are not logged in</h1>
                    <Link className="btn btn-primary" to={"/login"}>Login to View</Link>
                    </>
                )}
            </Container>
        </Container>
    );
}
