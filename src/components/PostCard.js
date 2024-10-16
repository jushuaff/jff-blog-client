import { useEffect, useState, useContext } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { API_BASE_URL } from '../config/api';
import UserContext from '../context/UserContext';

export default function PostCard({ post, onUpdate, onDelete }) {
    const { user } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/posts/getComments/${post._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                setComments(data.comments.reverse());
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [post._id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        setError('');

        if (!newComment.trim()) {
            setError('Comment cannot be empty.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/posts/addComment/${post._id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`  // Make sure token is present
                },
                body: JSON.stringify({ comment: newComment })
            });

            const data = await res.json();

            if (res.status !== 200) {
                setError(data.error || 'Failed to add comment.');
            } else {
                setComments([{ comment: newComment }, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to add comment. Please try again.');
        }
    };

return (
    <Card>
    <Card.Body>
        <Card.Title>
            <Row>
                <Col md={8} className="d-flex align-items-center poster-con">
                    <div className="image-con">
                        <img src="/logo512.png" alt="user-profile" />
                    </div>
                    {post.userId.firstName} {post.userId.lastName}
                </Col>
                <Col md={4} className="d-flex justify-content-end poster-con">
                    {post.userId._id === user.id ? 
                        <Button variant="primary" onClick={() => onUpdate(post._id)}>Update</Button>
                    : null }
                    {(user.isAdmin || post.userId._id === user.id) && (
                        <Button variant="danger" onClick={() => onDelete(post._id)}>Delete</Button>
                    )}
                </Col>
                <Col md={12}>
                    {post.title}
                </Col>
            </Row>
        </Card.Title>
        <Card.Text>
            {post.content || "No content available"}
        </Card.Text>
        <hr />
        <Form onSubmit={handleAddComment}>
        <Form.Group controlId="newComment">
            <Form.Control
                type="text"
                placeholder="Add Comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
            />
            {error && <p style={{ color: 'red' }} className="text-right mb-0">{error}</p>}
            </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button type="submit" className="mt-2">
                        Send
                    </Button>
                </div>
            </Form>
        <hr />

        <b>View Comments</b> 
        {loading ? (
                <p>Loading comments...</p>
            ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="mb-2">
                        {comment.comment}
                    </div>
                )
            )) : (
                <i className="d-block t-gray">No comments yet. Be the first to comment!</i>
            )
        }
    </Card.Body>
    </Card>
    );
}