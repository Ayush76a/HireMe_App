import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styling/ContactHelper.css'; // Ensure to include the updated CSS file
import { useNavigate } from 'react-router-dom';


const ContactHelper = () => {
  const { helperId } = useParams(); // Get the helper ID from the URL
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    fees: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the token from cookies
      const tokenRow = document.cookie.split('; ').find(row => row.startsWith('token='));
      const token = tokenRow ? tokenRow.split('=')[1] : null; // Get the token value or null

      // Log the token for debugging purposes
      console.log('Token:', token);

      // Ensure the token exists before making the request
      if (!token) {
        console.error('Token not found!');
        setStatusMessage('Token not found! Please log in.');
        return; // Prevent making the request if token is missing
      }

      // Make the POST request with the token and the form data
      const response = await axios.post(`http://localhost:8080/contactHelper/${helperId}`, {
        task: formData.task,
        description: formData.description,
        fees: formData.fees,
      }, {
        withCredentials: true,  // Ensure cookies are sent with the request
        headers: {
          'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
        },
      });

      // Handle response
      setStatusMessage(response.data.message);
      setFormData({
        task: '',
        description: '',
        fees: '',
      });
    } catch (err) {
      console.error('Error sending request:', err);
      setStatusMessage('Failed to send request.');
    }
  };

  return (
    <>
    <div className="contact-form-container">
      <h1>Contact Helper</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task">Task</label>
          <input
            type="text"
            id="task"
            name="task"
            value={formData.task}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="fees">Fees</label>
          <input
            type="number"
            id="fees"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Send Request</button>
      </form>

      {statusMessage && <p>{statusMessage}</p>}
    </div>
    <p>See the Notification section to proceed further</p>
    <p>Pay from the Hire Me app only, Terms and Conditions apply.</p>
    <p><button onClick={()=>{navigate('/Dashboard')}}>Notification</button></p>
    </>
  );
};

export default ContactHelper;
