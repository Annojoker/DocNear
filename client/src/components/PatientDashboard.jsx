import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardStyles.css';

function PatientDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Patient Dashboard</h2>
        {/* You might want to add user info or a logout button here later */}
      </header>
      <div className="dashboard-actions">
        <Link to="/patient/doctors" className="action-card">
          <div className="action-icon">⚕️</div>
          <span>Find a Doctor</span>
        </Link>
        <Link to="/patient/hospitals" className="action-card">
          <div className="action-icon">🏥</div>
          <span>Hospitals Nearby</span>
        </Link>
        <Link to="/patient/pharmacies" className="action-card">
          <div className="action-icon">💊</div>
          <span>Pharmacies Nearby</span>
        </Link>
        <Link to="/patient/ambulance" className="action-card">
          <div className="action-icon">🚑</div>
          <span>Request Ambulance</span>
        </Link>
        <Link to="/patient/prescriptions" className="action-card">
          <div className="action-icon">📝</div>
          <span>My Prescriptions</span>
        </Link>
        <Link to="/patient/appointments" className="action-card">
          <div className="action-icon">📅</div>
          <span>My Appointments</span>
        </Link>
      </div>
      {/* You might add a section for recent activity or other relevant info here */}
    </div>
  );
}

export default PatientDashboard;