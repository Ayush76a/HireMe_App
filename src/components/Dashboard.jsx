import React, { useState } from 'react';
import '../styling/Dashboard.css';
import HireHelper from './HireHelper';
import GetWork from './getWork';
import Profile from './Profile';
import Transactions from './Transaction';
import Settings from './Settings';
import Logout from './Logout';
import Notifications from './Notifications';


const Dashboard = () => {
  const userName = localStorage.getItem('userName') || 'Guest';
  const [activeSection, setActiveSection] = useState('hireHelper'); // Default section

  const renderSection = () => {
    switch (activeSection) {
      case 'hireHelper':
        return <HireHelper />;
      case 'getWork':
        return <GetWork />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'transactions':
        return <Transactions />;
      case 'settings':
        return <Settings />;
      case 'logout':
        return <Logout />;
      default:
        return <HireHelper />;
    }
  };

  return (
    <div className="dashboard-container">

      <aside className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li onClick={() => setActiveSection('hireHelper')}>Hire Helper</li>
          <li onClick={() => setActiveSection('getWork')}>Get Work</li>
          <li onClick={() => setActiveSection('profile')}>Profile</li>
          <li onClick={() => setActiveSection('notifications')}>Notifications</li>
          <li onClick={() => setActiveSection('transactions')}>Transactions</li>
          <li onClick={() => setActiveSection('settings')}>Settings</li>
          <li onClick={() => setActiveSection('logout')}>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, {userName}</h1>
        
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
