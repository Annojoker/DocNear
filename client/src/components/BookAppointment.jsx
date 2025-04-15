import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Ensure Firebase is initialized in your project
import './BookAppointmentStyles.css'; // Ensure this CSS file exists

function BookAppointment() {
  const { doctorId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch doctor details: ${response.status}`);
        }
        const data = await response.json();
        setDoctorDetails(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError(err.message || 'Failed to fetch doctor details');
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBookAppointment = async (event) => {
    event.preventDefault();
    if (!appointmentDate || !appointmentTime) {
      alert('Please select a date and time for your appointment.');
      return;
    }

    // In a real application, get the logged-in user's ID securely

    const auth = getAuth();
    const patientId = auth.currentUser ? auth.currentUser.uid : null;

    const appointmentData = {
      doctorId: doctorId,
      patientId: patientId,
      date: appointmentDate,
      time: appointmentTime,
      reason: reason,
      status: 'Pending', // Initial status
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to book appointment: ${response.status}`);
      }

      const data = await response.json();
      console.log('Appointment request sent:', data);
      alert('Appointment request sent successfully! Waiting for doctor approval.');
      navigate('/patient/appointments'); // Redirect to My Appointments
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        {doctorDetails.specialty && <p className="specialty">{doctorDetails.specialty}</p>}
        {doctorDetails.location && <p className="location">Location: {doctorDetails.location}</p>}
        {/* Add more doctor details here if needed */}
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
        <button type="submit" className="book-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Request Appointment'}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;