import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatStyles.css'; // Reusing the same styles for now

function PatientChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: 'Hello! How can I help you today?' },
    { sender: 'patient', text: 'Hi, I have a follow-up question...' },
    // More messages will go here
  ]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      const newMessage = { sender: 'patient', text: message };
      setMessages([...messages, newMessage]);
      setMessage('');
      // TODO: Implement sending message to Firebase
      console.log('Sending message:', newMessage);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <Link to="/patient/appointments" className="back-button">Back to Appointments</Link>
        <h2>Chat with Doctor</h2> {/* We might want to display the doctor's name here later */}
        <button className="video-button">Start Video Call</button> {/* Placeholder for video call */}
      </header>
      <div className="message-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'patient' ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default PatientChat;