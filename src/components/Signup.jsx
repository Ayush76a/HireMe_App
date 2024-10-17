import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/SignUp.css'; // Import custom CSS
import Oauth from './Oauth.jsx';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [googleData, setGoogleData] = useState(null); // Store Google user data
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login'); // Navigate to login or dashboard
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to sign up. Please try again later.');
    }
  };

  // Handle Google signup data
  const handleGoogleSignup = (googleUser) => {
    // Save Google user data, prompting for password next
    setGoogleData(googleUser);
    setName(googleUser.name);
    setEmail(googleUser.email);
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();

    // Ensure token is available
    if (!googleData || !googleData.token) {
      setError('Google authentication failed. Please try again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/google-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: googleData.name,
          email: googleData.email,
          token: googleData.token, // Use token from Google response
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login'); // Navigate after successful Google signup
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Google Signup error:', err);
      setError('Failed to sign up with Google. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        
        {!googleData ? (
          // Normal signup form
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
        ) : (
          // Show after successful Google login
          <form onSubmit={handleGoogleSubmit}>
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-btn">Submit</button>
          </form>
        )}

        {/* Google OAuth Signup */}
        <Oauth handleGoogleSignup={handleGoogleSignup} />

        <p className="redirect-text">Already have an account? <a href="/login">Login here</a>.</p>
      </div>
    </div>
  );
};

export default SignUp;
