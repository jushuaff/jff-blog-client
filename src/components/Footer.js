import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer className="text-light py-4">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>About Us</h5>
                        <p>
                            We offer the best products designed for everyday wear. 
                            Style that speaks without saying a word.
                        </p>
                    </Col>
                    <Col md={4}>
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-light">Home</a></li>
                        </ul>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5>Follow Us</h5>
                        <ul className="list-unstyled">
                            <li><a href="https://www.facebook.com/" target="blank" className="text-light">Facebook</a></li>
                            <li><a href="https://www.instagram.com/" target="blank" className="text-light">Instagram</a></li>
                            <li><a href="https://x.com/" target="blank" className="text-light">Twitter</a></li>
                        </ul>
                    </Col>
                </Row>
                <Row className="text-center mt-3">
                    <Col>
                        <p className="mb-0">All rights reserved &copy; {new Date().getFullYear()} Joe David</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
