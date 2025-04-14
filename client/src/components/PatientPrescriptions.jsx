import React from 'react';
import { Link } from 'react-router-dom';
import './PrescriptionsStyles.css'; // We'll create this CSS file

function PatientPrescriptions() {
  // In a real application, this data would come from Firebase
  const prescriptions = [
    { id: 'pres1', doctor: 'Dr. Anya Sharma', date: '2025-04-10', medication: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day' },
    { id: 'pres2', doctor: 'Dr. Ben Carter', date: '2025-04-12', medication: 'Amoxicillin', dosage: '250mg', frequency: 'Three times a day' },
    // Add more prescriptions here
  ];

  return (
    <div className="prescriptions-container">
      <header className="prescriptions-header">
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
        <h2>My Prescriptions</h2>
      </header>
      <ul className="prescriptions-list">
        {prescriptions.map((prescription) => (
          <li key={prescription.id} className="prescription-card">
            <h3>Prescribed by: {prescription.doctor}</h3>
            <p>Date: {prescription.date}</p>
            <p>Medication: {prescription.medication}</p>
            <p>Dosage: {prescription.dosage}</p>
            <p>Frequency: {prescription.frequency}</p>
            {/* You might want to add an option to view details or download the prescription file later */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientPrescriptions;