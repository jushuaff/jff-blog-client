import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';

export default function UpdatePost() {
    const { postId } = useParams(); 
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch the existing movie details when the component loads
    useEffect(() => {
        fetch(`${API_BASE_URL}/posts/getPost/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error
                });
            } else {
                setPost({
                    title: data.title,
                    content: data.content
                });
                setLoading(false);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load post details'
            });
            setLoading(false);
        });
    }, [postId, navigate]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_BASE_URL}/posts/update/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(post)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Post updated successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Post Updated',
                    text: 'Post updated successfully!'
                });
                navigate('/blogs');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Failed to update post'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update post'
            });
        });
    };

    if (loading) {
        return <div>Loading post details...</div>;
    }

    return (
        <div className="container-fluid banner-section">
            <div className="container">
                <div className="update-post row">
                    <div className="col-md-6 offset-md-3">
                        <h3 className="text-center mb-4">Update Post</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Post Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={post.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    className="form-control"
                                    value={post.content}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary mt-3">
                                Update Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
