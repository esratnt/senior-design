import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { onLogin } from "../api/auth";
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await onLogin({ email, password });
      const { role, token } = response.data;

      if (!role) {
        throw new Error("Role is undefined");
      }

      dispatch(authenticateUser({ role }));
      localStorage.setItem("token", token);
      localStorage.setItem("isAuth", true);
      localStorage.setItem("role", role);

      if (role === "admin-hr") {
        navigate("/dashboard");
      } else if (role === "employee_lead") {
        navigate("/employee-lead-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (error) {
      setError("Error logging in: " + error.message);
    }
  };

  return (
    <Container fluid className="login-background">
      <Row className="align-items-center justify-content-center login-row">
        <Col md={6} className="login-form-col">
          <div className="logo-container">
            <h1 className="project-title">Team Tracker</h1>
          </div>
          <Card className="p-4 shadow login-card">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="mb-3 login-input" 
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="mb-3 login-input" 
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3 login-button">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="login-image-col">
          <div className="login-image-container">
            <img src={`${process.env.PUBLIC_URL}Home-Photoroom.png`} alt="Team Tracker" className="login-image" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
