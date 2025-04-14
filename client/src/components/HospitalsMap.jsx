import React from 'react';
import { Link } from 'react-router-dom';
import './MapStyles.css'; // We'll create this CSS file

function HospitalsMap() {
  return (
    <div className="map-container">
      <header className="map-header">
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
        <h2>Hospitals Nearby</h2>
      </header>
      <div className="map-area">
        <p>Map of nearby hospitals will be displayed here.</p>
        {/* Placeholder for map component */}
      </div>
    </div>
  );
}

export default HospitalsMap;