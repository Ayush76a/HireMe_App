import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../styling/Notifications.css'; // Import the CSS file

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/notifications', {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // setting data as statea
  const handlePayment = (helperName, helperEmail, fees) => {
    navigate('/payment', { state: { helperName, helperEmail, fees } });
  };
  

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification._id} className="notification-item">
              <h3>Helper: {notification.helperName}</h3>
              <p><strong>Task:</strong> {notification.task}</p>
              <p><strong>Fees:</strong> ${notification.fees}</p>
              <p><strong>Status:</strong> {notification.taskStatus === 'pending' ? 'Pending' : notification.taskStatus === 'accepted' ? 'Accepted' : 'Declined'}</p>
              <p>{notification.message}</p>
              {notification.taskStatus === 'accepted' && (
              <h3>
                <button onClick={() => handlePayment(notification.helperName, notification.helperEmail, notification.fees)}>💲Pay Fees</button>
              </h3>
              )}
            </li>
          ))
        ) : (
          <li>No notifications available.</li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
