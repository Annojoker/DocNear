import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function DoctorDashboard() {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchIncomingRequests = async () => {
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
        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/appointments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch incoming requests.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setIncomingRequests(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIncomingRequests();
  }, [navigate]);

  const handleApprove = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Failed to approve appointment: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

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
        let errorMessage = `Failed to reschedule appointment: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

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