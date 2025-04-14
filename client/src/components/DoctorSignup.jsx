import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

function DoctorSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // TODO: Implement Firebase doctor signup logic here, including licenseNumber
    console.log('Doctor Signup:', { email, password, licenseNumber });
  };

  return (
    <div className="auth-container">
      <h2>Doctor Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="licenseNumber">Medical License No:</label>
          <input
            type="text"
            id="licenseNumber"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/doctor/login">Log In</Link>
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default DoctorSignup;