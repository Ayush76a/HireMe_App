import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await axios.get('http://localhost:8080/logout', {
        withCredentials: true,
      });

      if(response)
      navigate('/');
    }
     catch (err) {
      console.error('Logout failed:', err);
    } 
  };

  return (
    <div>
      <h2>Logout</h2>

      <p>Click here to logout</p>
      <button onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );
};

export default Logout;