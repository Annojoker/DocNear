import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './AppointmentsStyles.css';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      setLoading(true);
      setError(null);

      const storedToken = localStorage.getItem('doctorAuthToken');
      const doctorId = localStorage.getItem('doctorId');
      const auth = getAuth();
      const doctor = auth.currentUser;
      const token = storedToken || (doctor ? await doctor.getIdToken() : null);

      if (!token || !doctorId) {
        setError('Doctor not authenticated or ID missing.');
        setLoading(false);
        navigate('/doctor/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/appointments/confirmed`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch appointments.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAppointments();
  }, [navigate]);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <h3>Patient: {appointment.patientName || `ID: ${appointment.patientId}`}</h3>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <p>Status: {appointment.status}</p>
              {appointment.reason && <p>Reason: {appointment.reason}</p>}
            </div>

            <div className="appointment-actions">
              {appointment.status === 'Upcoming' && (
                <>
                  <Link to={`/doctor/chat/${appointment.patientId}`} className="chat-button">Chat with Patient</Link>
                  <Link to={`/doctor/video/${appointment.patientId}`} className="video-button">Video Call</Link>
                </>
              )}

              {appointment.status === 'Approved' && (
                <>
                  <span>Appointment Approved</span>
                  <Link to={`/doctor/chat/${appointment.patientId}`} className="chat-button">Chat with Patient</Link>
                </>
              )}

              {appointment.status !== 'Upcoming' && appointment.status !== 'Approved' && (
                <span>Consultation {appointment.status}</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {appointments.length === 0 && !loading && !error && (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default DoctorAppointments;
