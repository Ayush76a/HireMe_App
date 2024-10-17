import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const Oauth = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = async (googleData) => {
    try {
      const response = await fetch('http://localhost:8080/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${googleData.credential}`, // Add Authorization header

        },
        body: JSON.stringify({ token: googleData.credential }),
      });

      if (response.ok) {
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        console.error('Google signup failed');
      }
    } catch (error) {
      console.error('Error during Google signup:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        const decoded = jwtDecode(credentialResponse.credential);
        handleGoogleSignup(credentialResponse); // Send to backend
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
};

export default Oauth;
