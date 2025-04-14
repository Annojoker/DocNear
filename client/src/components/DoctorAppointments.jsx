import React from 'react';
import { Link } from 'react-router-dom';
import './AppointmentsStyles.css'; // Reusing the same styles for consistency

function DoctorAppointments() {
  // In a real application, this data would come from Firebase
  const appointments = [
    { id: 'appt1', patientName: 'Alice Smith', date: '2025-04-16', time: '10:00', status: 'Upcoming' },
    { id: 'appt2', patientName: 'Bob Johnson', date: '2025-04-16', time: '11:00', status: 'Upcoming' },
    { id: 'appt3', patientName: 'Charlie Brown', date: '2025-04-18', time: '14:30', status: 'Completed' },
    // Add more appointments here
  ];

  return (
    <div className="appointments-container">
      <header className="appointments-header">
        <h2>My Appointments</h2>
        <Link to="/doctor/dashboard" className="back-button">Back to Dashboard</Link>
      </header>
      <ul className="appointments-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-card">
            <div className="appointment-info">
              <h3>Patient: {appointment.patientName}</h3>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <p>Status: {appointment.status}</p>
            </div>
            {appointment.status === 'Upcoming' && (
              <div className="appointment-actions">
                <Link to="/doctor/chat/:patientId" className="chat-button">Chat with Patient</Link>
                <Link to="/doctor/video/:patientId" className="video-button">Video Call</Link>
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

export default DoctorAppointments;