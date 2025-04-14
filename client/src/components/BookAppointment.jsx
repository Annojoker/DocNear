import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './BookAppointmentStyles.css'; // We'll create this CSS file

function BookAppointment() {
  const { doctorId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');

  // In a real application, we'd fetch doctor details based on doctorId
  useEffect(() => {
    // Placeholder for fetching doctor details
    const fetchDoctor = async () => {
      // Simulate fetching doctor data
      const doctorsData = [
        { id: 'doc1', name: 'Dr. Anya Sharma', specialty: 'Cardiologist', location: 'Apollo Hospitals, Chennai' },
        { id: 'doc2', name: 'Dr. Ben Carter', specialty: 'Pediatrician', location: 'City Clinic, Tambaram' },
        { id: 'doc3', name: 'Dr. Chloe Davis', specialty: 'Dermatologist', location: 'Skin Care Center, Velachery' },
      ];
      const selectedDoctor = doctorsData.find((doc) => doc.id === doctorId);
      setDoctorDetails(selectedDoctor);
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBookAppointment = (event) => {
    event.preventDefault();
    if (!appointmentDate || !appointmentTime) {
      alert('Please select a date and time for your appointment.');
      return;
    }
    // TODO: Implement booking appointment logic (likely to Firebase)
    console.log('Appointment Booked:', { doctorId, appointmentDate, appointmentTime, reason });
    alert('Appointment booked successfully!'); // Temporary feedback
    setAppointmentDate('');
    setAppointmentTime('');
    setReason('');
  };

  if (!doctorDetails) {
    return <div>Loading doctor details...</div>;
  }

  return (
    <div className="book-appointment-container">
      <header className="book-appointment-header">
        <Link to="/patient/doctors" className="back-button">Back to Doctors</Link>
        <h2>Book Appointment with {doctorDetails.name}</h2>
      </header>
      <div className="doctor-info-section">
        <h3>{doctorDetails.name}</h3>
        <p className="specialty">{doctorDetails.specialty}</p>
        <p className="location">Location: {doctorDetails.location}</p>
      </div>
      <form onSubmit={handleBookAppointment} className="book-appointment-form">
        <div className="form-group">
          <label htmlFor="appointmentDate">Date:</label>
          <input
            type="date"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="appointmentTime">Time:</label>
          <input
            type="time"
            id="appointmentTime"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason for Appointment (Optional):</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe your concern"
          />
        </div>
        <button type="submit" className="book-button">Confirm Appointment</button>
      </form>
    </div>
  );
}

export default BookAppointment;