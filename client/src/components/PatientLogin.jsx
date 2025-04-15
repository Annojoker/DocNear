import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Assuming firebase.js is in the src directory
import './AuthStyles.css';

function PatientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/patients/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Patient logged in and token verified:', data);

        // Store the token and patient ID in localStorage
        localStorage.setItem('patientAuthToken', idToken);
        localStorage.setItem('patientId', user.uid);

        // Redirect to the dashboard after successful login
        navigate('/patient/dashboard');
      } else {
        console.error('Token verification failed:', data.error);
        setLoginError(data.error || 'Login failed');
      }

    } catch (error) {
      console.error('Firebase sign-in error:', error);
      setLoginError(error.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Patient Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input
                type="email"
                id="email"
                placeholder="Your registered email"
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
          {loginError && <p style={{ color: 'red', marginTop: '5px' }}>{loginError}</p>}
          <button type="submit" className="auth-button login-button">Log In</button>
        </form>
        <div className="auth-link">
          New patient? <Link to="/patient/signup">Create Account</Link>
        </div>
        <div className="back-to-home">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;
