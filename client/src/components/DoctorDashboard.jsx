import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './DashboardStyles.css'; // Assuming you have this CSS file

function DoctorDashboard() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const navigate = useNavigate(); // You might not be using this directly in this component

    useEffect(() => {
        const fetchIncomingRequests = async () => {
            setLoading(true);
            setError(null);
            const auth = getAuth();
            const doctor = auth.currentUser;

            if (doctor && doctor.uid) {
                try {
                    const response = await fetch(`http://localhost:5000/api/doctors/${doctor.uid}/appointments`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Failed to fetch requests: ${response.status}`);
                    }
                    const data = await response.json();
                    const pendingRequests = data.filter(appointment => appointment.status === 'Pending');
                    setIncomingRequests(pendingRequests);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching incoming requests:', err);
                    setError(err.message || 'Failed to fetch requests');
                    setLoading(false);
                }
            } else {
                setError('Doctor not authenticated.');
                setLoading(false);
                // Optionally redirect to login if not authenticated
                // navigate('/doctor/login');
            }
        };

        fetchIncomingRequests();
    }, [navigate]); // Added navigate to dependency array in case it's used indirectly

    const handleApprove = async (appointmentId) => {
        try {
          const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to approve appointment: ${response.status}`);
            }

            // Update the state to remove the approved request
            setIncomingRequests(incomingRequests.filter(request => request.id !== appointmentId));
            console.log('Appointment approved successfully');
            // Optionally, show a success message to the user
        } catch (err) {
            console.error('Error approving appointment:', err);
            setError(err.message || 'Failed to approve appointment');
            // Optionally, show an error message to the user
        }
    };

    const handleRescheduleClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setRescheduleModalVisible(true);
        setNewDate('');
        setNewTime('');
    };

    const handleRescheduleSubmit = async () => {
        if (!newDate || !newTime) {
            alert('Please select a new date and time.');
            return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointmentId}/reschedule`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: newDate, time: newTime }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to reschedule appointment: ${response.status}`);
            }

            // Update the state to reflect the rescheduled appointment
            setIncomingRequests(incomingRequests.map(request =>
                request.id === selectedAppointmentId ? { ...request, date: newDate, time: newTime, status: 'Rescheduled' } : request
            ));
            setRescheduleModalVisible(false);
            setSelectedAppointmentId(null);
            console.log('Appointment rescheduled successfully');
            // Optionally, show a success message
        } catch (err) {
            console.error('Error rescheduling appointment:', err);
            setError(err.message || 'Failed to reschedule appointment');
            // Optionally, show an error message
        }
    };

    const handleCloseRescheduleModal = () => {
        setRescheduleModalVisible(false);
        setSelectedAppointmentId(null);
    };

    if (loading) {
        return <div>Loading incoming requests...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Doctor Dashboard</h2>
            </header>
            <div className="dashboard-actions">
                <Link to="/doctor/appointments" className="action-card">
                    <div className="action-icon">📅</div>
                    <span>Appointments</span>
                </Link>
                <Link to="/doctor/history" className="action-card">
                    <div className="action-icon">📜</div>
                    <span>Consultation History</span>
                </Link>
            </div>
            <div className="dashboard-section">
                <h3>Incoming Requests</h3>
                {incomingRequests.length > 0 ? (
                    <ul>
                        {incomingRequests.map((request) => (
                            <li key={request.id}>
                                <strong>Patient ID:</strong> <span>{request.patientId} - {request.date} at {request.time} ({request.reason})</span>
                                <div>
                                    <button onClick={() => handleApprove(request.id)}>Approve</button>
                                    <button onClick={() => handleRescheduleClick(request.id)}>Reschedule</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No new incoming requests.</p>
                )}
            </div>

            {/* Reschedule Modal */}
            {rescheduleModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Reschedule Appointment</h3>
                        <label htmlFor="newDate">New Date:</label>
                        <input
                            type="date"
                            id="newDate"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                        <label htmlFor="newTime">New Time:</label>
                        <input
                            type="time"
                            id="newTime"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleRescheduleSubmit}>Reschedule</button>
                            <button onClick={handleCloseRescheduleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorDashboard;