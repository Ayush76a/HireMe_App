import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import '../styling/HireHelper.css'; // Ensure you have a corresponding CSS file for styling

const HireHelper = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirecting

  // Fetch helpers on component mount
  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getHelpers', {
          withCredentials: true, // Ensures cookies (like JWT) are sent with the request
        });
        setHelpers(response.data); // Store helpers data in state
        setLoading(false); // Stop the loading spinner
      } catch (err) {
        console.error('Error fetching helpers data:', err);
        setError('Failed to load helpers data');
        setLoading(false);
      }
    };

    fetchHelpers();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  // Function to handle contact button click and navigate to the contact page
  const handleContact = (helperId) => {
    navigate(`/contactHelper/${helperId}`); // Redirect to contact page with helper ID
  };

  // Display loading, error, or helper cards
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="hire-helper-container">
      <h1>Hire Helpers</h1>
      {helpers.length > 0 ? (
        <div className="helper-cards-container">
          {helpers.map((helper) => (
            <div key={helper._id} className="helper-card">
              <h3>{helper.name}</h3>
              <p><strong>Email:</strong> {helper.email}</p>
              <p><strong>Phone:</strong> {helper.phone || 'N/A'}</p>
              <p><strong>Bio:</strong> {helper.bio || 'N/A'}</p>
              <p><strong>Skills:</strong> {helper.skills?.join(', ') || 'N/A'}</p>
              {/* Contact Button */}
              <button className="contact-btn" onClick={() => handleContact(helper._id)}>
                Contact
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No helpers available at the moment.</p>
      )}
    </div>
  );
};

export default HireHelper;
