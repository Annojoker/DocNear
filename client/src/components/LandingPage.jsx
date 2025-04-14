import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Make sure this CSS file exists in the same directory

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>Consult. Connect. Care. <br />Instantly Nearby</h1>
        <div className="button-group">
          <Link to="/patient/login" className="patient-button">I'm a Patient</Link>
          <Link to="/doctor/login" className="doctor-button">I'm a Doctor</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;