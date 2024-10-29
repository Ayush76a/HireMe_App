import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Oauth = () => {
  const navigate = useNavigate();

  const handleGoogleSubmit = async (googleData) => {
    try {
      const response = await fetch('http://localhost:8080/google-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: googleData.credential }),
      });

      if (response.ok) {
        // Wait for backend processing to complete
        const data = await response.json();
        (console.log('Cookies:', document.cookie))
        localStorage.setItem('userName', data.name);
        console.log('Google signup success:', data);

        if (data.token) {
          console.log('Cookies:', document.cookie); // Optional: Log cookies for debugging
          // Now navigate to the dashboard after ensuring cookies are set
          navigate('/dashboard');
        } else {
          console.error('No cookies found after signup.');
        }
      } else {
        const errorResponse = await response.json();
        console.error('Google signup failed:', errorResponse);
      }
    } catch (error) {
      console.error('Error during Google signup:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={credentialResponse => handleGoogleSubmit(credentialResponse)}
      onError={() => console.log('Login Failed')}
    />
  );
};

export default Oauth;
