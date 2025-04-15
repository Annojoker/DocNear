import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Import getAuth
import './AppointmentsStyles.css';

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientAppointments = async () => {
            setLoading(true);
            setError(null);
            const auth = getAuth(); // Get the auth instance
            const patientId = auth.currentUser ? auth.currentUser.uid : null; // Get the current user's uid

            if (patientId) {
                try {
                    const response = await fetch(`http://localhost:5000/api/patients/${patientId}/appointments`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Failed to fetch appointments: ${response.status}`);
                    }
                    const data = await response.json();
                    setAppointments(data);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching appointments:', err);
                    setError(err.message || 'Failed to fetch appointments');
                    setLoading(false);
                }
            } else {
                setError('User not authenticated.');
                setLoading(false);
            }
        };

        fetchPatientAppointments();
    }, []);

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                            <h3>Doctor: {appointment.doctorName}</h3> {/* Directly use doctorName */}
                            <p>Date: {appointment.date}</p>
                            <p>Time: {appointment.time}</p>
                            <p>Status: {appointment.status}</p>
                            {appointment.reason && <p>Reason: {appointment.reason}</p>}
                        </div>
                        {appointment.status === 'Pending' && (
                            <div className="appointment-actions">
                                <span>Pending Approval</span>
                            </div>
                        )}
                        {appointment.status === 'Approved' && (
                            <div className="appointment-actions">
                                <Link to="/patient/chat" className="chat-button">Chat with Doctor</Link>
                                <Link to="/patient/video" className="video-button">Video Call</Link>
                            </div>
                        )}
                        {appointment.status !== 'Pending' && appointment.status !== 'Approved' && (
                            <div className="appointment-actions">
                                <span>Consultation {appointment.status}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {appointments.length === 0 && !loading && !error && (
                <p>No appointments found.</p>
            )}
        </div>
    );
}

export default PatientAppointments;