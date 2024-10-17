import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import HireHelper from './components/HireHelper';
import GetWork from './components/getWork';
import Settings from './components/Settings';
import Transactions from './components/Transaction';
import Profile from './components/Profile';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import ContactHelper from './components/ContactHelper';
import Payment from './components/Payment';


const App = () => {
  useGoogleOneTapLogin({
    onError: error => console.log(error),
    onSuccess: response => console.log(response),
    googleAccountConfigs: {
      client_id: "475904526860-ck3h4ohk35hom7gd213cvu9all68kh0e.apps.googleusercontent.com"
    },
  });  

  return (
    <GoogleOAuthProvider clientId="475904526860-ck3h4ohk35hom7gd213cvu9all68kh0e.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hirehelper" element={<HireHelper />} />
        <Route path="/getwork" element={<GetWork />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/contactHelper/:helperId" element={<ContactHelper />} />
        <Route path="/payment" element={<Payment />} />

      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
