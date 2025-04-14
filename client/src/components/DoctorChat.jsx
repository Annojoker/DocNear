import React from 'react';
import { Link } from 'react-router-dom';
import './ChatStyles.css'; // Reusing styles

function DoctorChat() {
  return (
    <div className="chat-container">
      <header className="chat-header">
        <Link to="/doctor/appointments" className="back-button">Back to Appointments</Link>
        <h2>Chat with Patient</h2> {/* We'll add patient name later */}
        <button className="video-button">Start Video Call</button>
      </header>
      <div className="message-area">
        <p>Chat messages with the patient will appear here.</p>
      </div>
      <form className="message-input-area">
        <input type="text" placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default DoctorChat;