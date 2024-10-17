import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Homepage.css';


const Homepage = () => {
  
  return (
    <div className="homepage-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to HIRE_ME.com</h1>
          <p>
            A trusted platform where you can hire people for your tasks or get hired to complete tasks. 
            Whether it's a time-based contract or a task-based one, we've got you covered. 
            Negotiate fees, set agreements, and get things done with ease.
          </p>
          <div className="auth-buttons">
            <Link to="/login" className="btn primary-btn">Login</Link>
            <Link to="/signup" className="btn secondary-btn">Sign Up</Link>
          </div>
        </div>
      </header>

      <section className="testimonials-section">
        <h2>What Our Users Are Saying</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>
              "HIRE_ME.com has made it incredibly easy for me to find people to complete my projects on time and with quality!"
            </p>
            <h4>- Sarah T., Entrepreneur</h4>
          </div>
          <div className="testimonial">
            <p>
              "I was able to land a few gigs and make money while offering my skills on this platform. The process is smooth and secure."
            </p>
            <h4>- Mark J., Freelancer</h4>
          </div>
          <div className="testimonial">
            <p>
              "It's simple to use, and I love the fact that we can negotiate and agree on prices before starting work."
            </p>
            <h4>- Emily R., Small Business Owner</h4>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 HIRE_ME.com - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Homepage;
