import React from 'react';
import { Link } from 'react-router-dom';
import './VideoStyles.css'; // Reusing styles

function DoctorVideo() {
  return (
    <div className="video-container">
      <header className="video-header">
        <Link to="/doctor/appointments" className="back-button">Back to Appointments</Link>
        <h2>Video Consultation with Patient</h2> {/* We'll add patient name later */}
      </header>
      <div className="video-area">
        <p>Video consultation with the patient will appear here.</p>
      </div>
      <div className="video-controls">
        <button>Mute</button>
        <button>Unmute</button>
        <button>Camera On/Off</button>
        <button className="end-call-button">End Call</button>
      </div>
    </div>
  );
}

export default DoctorVideo;