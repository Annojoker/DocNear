import React from 'react';
import { Link } from 'react-router-dom';
import './AppointmentsStyles.css'; // We'll create this CSS file

function PatientAppointments() {
  // In a real application, this data would come from Firebase
  const appointments = [
    { id: 'appt1', doctorName: 'Dr. Anya Sharma', date: '2025-04-16', time: '10:00', status: 'Upcoming' },
    { id: 'appt2', doctorName: 'Dr. Ben Carter', date: '2025-04-18', time: '14:30', status: 'Upcoming' },
    // Add more appointments here
  ];

  return (
    <div className="appointments-container">
      <header className="appointments-header">
        <h2>My Appointments</h2>
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
      </header>
      <ul className="appointments-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-card">
            <div className="appointment-info">
              <h3>{appointment.doctorName}</h3>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <p>Status: {appointment.status}</p>
            </div>
            {appointment.status === 'Upcoming' && (
              <div className="appointment-actions">
                <Link to="/patient/chat" className="chat-button">Chat with Doctor</Link>
                <Link to="/patient/video" className="video-button">Video Call</Link>
              </div>
            )}
            {appointment.status !== 'Upcoming' && (
              <div className="appointment-actions">
                <span>Consultation Ended</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientAppointments;