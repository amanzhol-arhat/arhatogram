import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserActions from "../../hooks/user.actions.js";


function LoginForm() {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const userActions = useUserActions();

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginForm = event.currentTarget;

    if (loginForm.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const data = {
      email: form.email,
      password: form.password,
    };

      userActions.login(data).catch((err) => {
        if (err.message) {
          setError(err.request.response);
        }
      });
    };

    // axios
    //   .post("http://localhost:8000/api/auth/login/", data)
    //   .then((res) => {
    //     // Registering acc and token in the store
    //     localStorage.setItem(
    //       "auth",
    //       JSON.stringify({
    //         access: res.data.access,
    //         refresh: res.data.refresh,
    //         user: res.data.user,
    //       })
    //     );
    //     navigate("/");
    //   })
    //   .catch((err) => {
    //     if (err.message) {
    //       setError(err.request?.response || "Login error");
    //     }
    //   });


  return (
    <Form
      id="registration-form"
      className="border p-4 rounded"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      data-testid="login-form"
    >
      <Form.Group className="mb-3" controlId="loginEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          value={form.email}
          data-testid="email-field"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
          type="email"
          placeholder="Enter email"
        />
        <Form.Control.Feedback type="invalid">
          This field is required
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          value={form.password}
          minLength={8}
          data-testid="password-field"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
          type="password"
          placeholder="Password"
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid password.
        </Form.Control.Feedback>
      </Form.Group>

      <div className="text-content text-danger">
        {error && <p>{error}</p>}
      </div>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default LoginForm;
