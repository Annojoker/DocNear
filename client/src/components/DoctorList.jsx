import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorListStyles.css';

function DoctorList() {
  const doctors = [
    { id: 'doc1', name: 'Dr. Anya Sharma', specialty: 'Cardiologist', location: 'Apollo Hospitals, Chennai', medicalLicense: 'MED12345' },
    { id: 'doc2', name: 'Dr. Ben Carter', specialty: 'Pediatrician', location: 'City Clinic, Tambaram', medicalLicense: 'PED67890' },
    { id: 'doc3', name: 'Dr. Chloe Davis', specialty: 'Dermatologist', location: 'Skin Care Center, Velachery', medicalLicense: 'DER11223' },
    // Add more doctors with their locations and medical licenses
  ];

  return (
    <div className="doctor-list-container">
      <header className="doctor-list-header">
        <h2>Available Doctors</h2>
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
      </header>
      <ul className="doctors-list">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="doctor-card">
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p className="specialty">{doctor.specialty}</p>
              <p className="location">Location: {doctor.location}</p>
              {doctor.medicalLicense && (
                <p className="medical-license">License: {doctor.medicalLicense}</p>
              )}
            </div>
            <div className="doctor-actions">
              <Link to={`/patient/book-appointment/${doctor.id}`} className="book-button">Book Appointment</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;