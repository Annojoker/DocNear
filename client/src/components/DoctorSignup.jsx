import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

function DoctorSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [specialty, setSpecialty] = useState(''); // New state for specialty
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setPasswordError(''); // Clear any previous error

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    console.log('Doctor Sign Up:', { name, email, medicalLicense, specialty, password });
    // TODO: Implement Firebase signup logic, including saving the specialty
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Doctor Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="icon">👤</span>
              <input
                type="text"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input
                type="email"
                id="email"
                placeholder="Your professional email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="medicalLicense">Medical License Number</label>
            <div className="input-wrapper">
              <span className="icon">⚕️</span>
              <input
                type="text"
                id="medicalLicense"
                placeholder="Your medical license number"
                value={medicalLicense}
                onChange={(e) => setMedicalLicense(e.target.value)}
                required
              />
            </div>
          </div>
          {/* New Specialty Field */}
          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <div className="input-wrapper">
              <span className="icon">🩺</span> {/* You can choose a relevant icon */}
              <input
                type="text"
                id="specialty"
                placeholder="Your medical specialty (e.g., Cardiology, Pediatrics)"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
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
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {passwordError && <p style={{ color: 'red', marginTop: '5px' }}>{passwordError}</p>}
          <button type="submit" className="auth-button signup-button">Sign Up</button>
        </form>
        <div className="auth-link">
          Already a doctor? <Link to="/doctor/login">Log In</Link>
        </div>
        <div className="back-to-home">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignUp;