import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Login.css'; 
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const navigate = useNavigate();
  
  const onChange = () => {
    // Handle reCAPTCHA change here if needed
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/login',
        { email, password },
        { withCredentials: true } 
      );

      // Assuming the backend returns a JWT token on successful login
      if (response.data.token) {   
        localStorage.setItem('userName', response.data.name)     
        navigate('/dashboard');
      }
    } 
    catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to HIRE_ME</h2>
      <ReCAPTCHA
        sitekey="6LcAQlcqAAAAAFqCD0Pv8lba9HQ8SXwiO8zfoUIT"
        onChange={onChange}
      />

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-btn">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
