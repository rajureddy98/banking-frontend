import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

const LOGIN_API_ENDPOINT = 'https://miniature-space-giggle-rxr4q9479v3rgr-3000.app.github.dev/api/auth'; // Replace with your actual login API endpoint

const JWTLogin = () => {
  const navigate = useNavigate(); // For navigation after successful login

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Send login request to the backend
      const response = await fetch(LOGIN_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Login failed' });
      } else {
        const data = await response.json();
        // Store the JWT token in sessionStorage
        sessionStorage.setItem('userToken', data.token);
        // Redirect to the dashboard page
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred, please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Email Address"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
            />
            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              placeholder="Enter your password"
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials.
            </label>
          </div>

          {errors.submit && (
            <Col sm={12}>
              <Alert variant="danger">{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
                color="primary"
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="primary"
              >
                Sign In
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
