import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Login.css'; // Optional CSS styling
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from 'js-cookie';




const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const onChange = ()=>{
    
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login',{
        email,
        password
      },{
        headers :{
          'Content-Type': 'application/json',
        }
      });

      // Assuming the backend returns a JWT token on successful login
      if (response.data.token) {
        
        // console.log("Token on frontend : ", response.data.token)
        
        const token = response.data.token;
        
        //  setting the cookie => use Cookie-js Package
        Cookies.set('token', token, { expires: 7 });


        // setting items in local storage
        // local storage is provided by windows 
        // can see the items in local storage using : window.localstorage
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userEmail', response.data.email);
        navigate('/dashboard'); // Redirect to dashboard/home page
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Invalid email or password');
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
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="login-btn">Login</button>
        

      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
