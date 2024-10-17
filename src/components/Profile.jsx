import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styling/Profile.css'; // Optional CSS for styling

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getUser', {
          withCredentials: true, // Ensures cookies (like JWT) are sent with the request
        });
        setUserData(response.data); // Store the user data in state
        setLoading(false); // Stop the loading spinner
      } 
      catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  // Display loading, error, or the user profile
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {userData && (
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
          <p><strong>Bio:</strong> {userData.bio || 'N/A'}</p>
          {/* Add other fields as necessary */}
        </div>
      )}
    </div>
  );
};

export default Profile;
