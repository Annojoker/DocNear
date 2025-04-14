import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement Firebase doctor login logic here
    console.log('Doctor Login:', { email, password });
  };

  return (
    <div className="auth-container">
      <h2>Doctor Login</h2>
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
        <button type="submit" className="auth-button">Log In</button>
      </form>
      <p>
        Don't have an account? <Link to="/doctor/signup">Sign Up</Link>
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default DoctorLogin;