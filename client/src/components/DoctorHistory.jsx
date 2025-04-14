import React from 'react';
import { Link } from 'react-router-dom';
import './HistoryStyles.css'; // We'll create this CSS file

function DoctorHistory() {
  // In a real application, this data would come from Firebase
  const consultationHistory = [
    { id: 'hist1', patientName: 'Alice Smith', date: '2025-04-10', summary: 'Follow-up for general checkup.' },
    { id: 'hist2', patientName: 'Bob Johnson', date: '2025-04-12', summary: 'Discussed medication side effects.' },
    // Add more past consultations here
  ];

  return (
    <div className="history-container">
      <header className="history-header">
        <Link to="/doctor/dashboard" className="back-button">Back to Dashboard</Link>
        <h2>Consultation History</h2>
      </header>
      <ul className="history-list">
        {consultationHistory.map((consultation) => (
          <li key={consultation.id} className="history-card">
            <h3>Patient: {consultation.patientName}</h3>
            <p>Date: {consultation.date}</p>
            <p>Summary: {consultation.summary}</p>
            {/* You might want to add an option to view details of the consultation later */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorHistory;