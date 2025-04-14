import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

function PatientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Patient Login:', { email, password });
    // TODO: Implement Firebase login logic
  };

  return (
    <div className="auth-container">
      <div className="auth-card"> {/* ADD THIS DIV */}
        <h2>Patient Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input
                type="email"
                id="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="auth-button login-button">Log In</button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/patient/signup">Sign Up here</Link>
        </div>
        <div className="back-to-home">
          <Link to="/">Back to Home</Link>
        </div>
      </div> {/* CLOSE THE ADDED DIV */}
    </div>
  );
}

export default PatientLogin;