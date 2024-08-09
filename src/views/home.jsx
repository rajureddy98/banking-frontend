import React from 'react';
import { Container, Row, Col, Card, Button, Carousel, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginClick = () => {
      navigate('/login'); // Navigate to the login page
    }
    const handleSignupClick = () => {
        navigate('/auth/signup-1'); // Navigate to the login page
      };
  return (
    <React.Fragment>
      {/* Header Section */}
      <header className="bg-light shadow-sm mb-4">
        <Container>
          <Row className="align-items-center py-3">
            <Col md={6}>
              <Nav className="justify-content-start">
                <Nav.Link href="#home" className="nav-link text-dark">Home</Nav.Link>
                <Nav.Link href="#features" className="nav-link text-dark">Features</Nav.Link>
                <Nav.Link href="#testimonials" className="nav-link text-dark">Testimonials</Nav.Link>
                <Nav.Link href="#contact" className="nav-link text-dark">Contact</Nav.Link>
              </Nav>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="primary" className="me-2" onClick={handleLoginClick}>Login</Button>
              <Button variant="outline-primary" onClick={handleSignupClick}>Sign Up</Button>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="hero bg-gradient text-white text-center py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="hero-title">Elevate Your Banking Experience</h1>
              <p className="hero-subtitle">Explore innovative solutions tailored to your needs.</p>
              <Button variant="light" size="lg" className="mt-3">Get Started</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="my-5">
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <Card className="feature-card mb-4 shadow-lg">
                <Card.Body>
                  <Card.Title className="feature-title">Advanced Security</Card.Title>
                  <Card.Text className="feature-text">
                    Protecting your data with cutting-edge security measures.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card mb-4 shadow-lg">
                <Card.Body>
                  <Card.Title className="feature-title">24/7 Support</Card.Title>
                  <Card.Text className="feature-text">
                    Our support team is here to assist you anytime.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card mb-4 shadow-lg">
                <Card.Body>
                  <Card.Title className="feature-title">Easy Integration</Card.Title>
                  <Card.Text className="feature-text">
                    Seamlessly integrate with your existing tools and systems.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="my-5">
        <Container>
          <Row>
            <Col>
              <Carousel className="testimonial-carousel">
                <Carousel.Item>
                  <Card className="testimonial-card text-center shadow-lg">
                    <Card.Body>
                      <Card.Text className="testimonial-text">
                        "This platform has transformed how I manage my finances. Excellent service!"
                      </Card.Text>
                      <Card.Footer>
                        <small className="text-muted testimonial-author">Jordan Smith</small>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </Carousel.Item>
                <Carousel.Item>
                  <Card className="testimonial-card text-center shadow-lg">
                    <Card.Body>
                      <Card.Text className="testimonial-text">
                        "A user-friendly interface with all the features I need. Highly recommended!"
                      </Card.Text>
                      <Card.Footer>
                        <small className="text-muted testimonial-author">Emily Davis</small>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta bg-dark text-white text-center py-5">
        <Container>
          <Row>
            <Col>
              <h2 className="cta-title">Ready to Transform Your Banking Experience?</h2>
              <Button variant="primary" size="lg" className="mt-3">Join Us Now</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-light text-dark text-center py-3">
        <Container>
          <Row>
            <Col>
              <p className="mb-0">&copy; 2024 Your Bank. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Custom Styles */}
      <style>
        {`
            section.hero.bg-gradient.text-white.text-center.py-5 {
    background-color: cadetblue;
}
          .hero {
            background: linear-gradient(to right, #007bff, #00d2ff);
            color: #ffffff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }
          .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .hero-subtitle {
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 2rem;
          }
          .feature-card {
            border: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
          .feature-title {
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 1rem;
          }
          .feature-text {
            font-size: 1rem;
            color: #333;
          }
          .testimonial-carousel .carousel-item {
            padding: 1rem;
          }
          .testimonial-card {
            border: none;
            background: #f8f9fa;
          }
          .testimonial-text {
            font-size: 1.25rem;
            font-style: italic;
            color: #555;
          }
          .testimonial-author {
            font-size: 0.875rem;
            font-weight: 600;
          }
          .cta {
            background-color: #343a40;
          }
          .cta-title {
            font-size: 2rem;
            font-weight: 600;
          }
          .bg-light {
            background-color: #e2e2e2;
          }
          .bg-dark {
            background-color: #343a40 !important;
          }
          .nav-link {
            font-size: 1rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
          }
          .nav-link:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default LandingPage;
