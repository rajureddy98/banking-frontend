import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const SignUp1 = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const signUp_URL= import.meta.env.VITE_LOGIN_API_ENDPOINT;
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(signUp_URL +'/api/user-service/users', { name, email, password });
      setMessage(response.data);
      // Redirect to login or another page after successful registration
      navigate('/auth/signin-1');
    } catch (error) {
      setError(error.response.data || 'An error occurred');
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group mb-4">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button className="btn btn-primary mb-4" type="submit">
                      Sign up
                    </button>
                  </form>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to={'/auth/signin-1'} className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
