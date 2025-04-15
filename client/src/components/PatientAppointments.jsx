import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './AppointmentsStyles.css';

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientAppointments = async () => {
            setLoading(true);
            setError(null);

            // Get token and patient ID from localStorage
            const storedToken = localStorage.getItem('patientAuthToken');
            const patientId = localStorage.getItem('patientId');
            const auth = getAuth();
            const patient = auth.currentUser;
            const token = storedToken || (patient ? await patient.getIdToken() : null);

            // Log for debugging purposes
            console.log('Stored Token:', storedToken);
            console.log('Patient ID:', patientId);
            console.log('Firebase User:', patient);

            // If token or patientId is missing, redirect to login
            if (!token || !patientId) {
                console.log('Redirecting to login due to missing token or patient ID');
                setError('Patient not authenticated or ID missing.');
                setLoading(false);
                navigate('/patient/login');
                return;
            }

            try {
                // Fetch appointments
                const response = await fetch(`http://localhost:5000/api/patients/${patientId}/appointments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Check if response is OK
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

                // Set appointments
                const data = await response.json();
                setAppointments(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError(err.message || 'Failed to fetch appointments');
                setLoading(false);
            }
        };

        fetchPatientAppointments();
    }, [navigate]);

    // Display loading, error, or appointments
    if (loading) return <div>Loading appointments...</div>;
    if (error) return <div>Error: {error}</div>;

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
                            <h3>Doctor: {appointment.doctorName}</h3>
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

                        {appointment.status === 'Approved' && appointment.doctorId && (
                            <div className="appointment-actions">
                                <Link to={`/patient/chat/${appointment.doctorId}`} className="chat-button">Chat with Doctor</Link>
                                <Link to={`/patient/video/${appointment.doctorId}`} className="video-button">Video Call</Link>
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
