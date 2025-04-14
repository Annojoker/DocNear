import React from 'react';
import { Link } from 'react-router-dom';
import './VideoStyles.css'; // We'll create this CSS file

function PatientVideo() {
  return (
    <div className="video-container">
      <header className="video-header">
        <Link to="/patient/appointments" className="back-button">Back to Appointments</Link>
        <h2>Video Consultation with Doctor</h2> {/* We'd dynamically add the doctor's name later */}
      </header>
      <div className="video-area">
        <p>Video consultation will appear here.</p>
        {/* Placeholder for video streams and controls */}
      </div>
      <div className="video-controls">
        {/* Placeholder for buttons like mute, unmute, camera on/off, end call */}
        <button>Mute</button>
        <button>Unmute</button>
        <button>Camera On/Off</button>
        <button className="end-call-button">End Call</button>
      </div>
    </div>
  );
}

export default PatientVideo;