import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardStyles.css';

function DoctorDashboard() {
  // In a real application, these would be fetched from Firebase
  const incomingRequests = [
    { id: 'req1', patientName: 'David Miller', date: '2025-04-17', time: '11:30', reason: 'General checkup' },
    { id: 'req2', patientName: 'Eve Williams', date: '2025-04-18', time: '10:00', reason: 'Follow-up' },
    // Add more incoming requests here
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Doctor Dashboard</h2>
        {/* You might want to add user info or a logout button here later */}
      </header>
      <div className="dashboard-actions">
        <Link to="/doctor/appointments" className="action-card">
          <div className="action-icon">📅</div>
          <span>Appointments</span>
        </Link>
        <Link to="/doctor/history" className="action-card">
          <div className="action-icon">📜</div>
          <span>Consultation History</span>
        </Link>
        {/* More actions can be added here */}
      </div>
      <div className="dashboard-section">
        <h3>Incoming Requests</h3>
        {incomingRequests.length > 0 ? (
          <ul>
            {incomingRequests.map((request) => (
              <li key={request.id}>
                <strong>{request.patientName}</strong> - {request.date} at {request.time} ({request.reason})
                <button onClick={() => console.log(`Approve request ${request.id}`)}>Approve</button>
                <button onClick={() => console.log(`Reschedule request ${request.id}`)}>Reschedule</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new incoming requests.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;