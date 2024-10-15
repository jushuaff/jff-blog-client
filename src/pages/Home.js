import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import '../css/home.css';

export default function Home() {
    return (
        <>  
            <Container fluid className="banner-section">
                <Container>
                    <Row>
                        <Col className="col-md-7 d-flex align-items-center">
                            <div class="text-white">
                                <h1>Welcome to JFF BLOG</h1>
                                <h2>Where your stories come to life.</h2>
                                <h3>
                                    "Discover. Write. Share. Connect with like-minded individuals as you explore topics that matter to you. Whether you're sharing personal stories, tech insights, or lifestyle tips, [Blog Name] is your platform to express and inspire."
                                </h3>
                            </div>
                        </Col>
                        <Col className="col-md-5">
                            <div className="banner-image-con">
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    );
}
