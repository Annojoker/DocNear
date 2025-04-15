import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './HistoryStyles.css';

function DoctorHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsultationHistory = async () => {
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
                const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    let errorMessage = 'Failed to fetch consultation history.';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        console.error('Error parsing error response:', e);
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setHistory(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching consultation history:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchConsultationHistory();
    }, [navigate]);

    if (loading) {
        return <div>Loading consultation history...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="history-container">
            <header className="history-header">
                <Link to="/doctor/dashboard" className="back-button">Back to Dashboard</Link>
                <h2>Consultation History</h2>
            </header>
            <ul className="history-list">
                {history.map((consultation) => (
                    <li key={consultation.id} className="history-card">
                        <h3>Patient: {consultation.patientName}</h3>
                        <p>Date: {consultation.date}</p>
                        <p>Reason: {consultation.reason}</p> {/* Display the reason for the appointment */}
                        {consultation.summary && <p>Summary: {consultation.summary}</p>} {/* Only show summary if it exists */}
                        <p>Status: {consultation.status}</p> {/* Display the final status */}
                        {/* You might want to add an option to view details of the consultation later */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DoctorHistory;