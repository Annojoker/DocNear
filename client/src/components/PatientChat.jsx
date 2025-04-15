import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ChatStyles.css';

function PatientChat() {
  const { doctorId } = useParams(); // Retrieve the doctorId from the URL params
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchChatHistory = async () => {
      const patientId = localStorage.getItem('patientId');
      const patientAuthToken = localStorage.getItem('patientAuthToken');
      if (!patientId || !patientAuthToken || !doctorId) {
        console.error('Patient ID, authentication token, or Doctor ID not found.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/chat/${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'patientId': patientId,
            'userId': patientId,  // Send patient's ID in the headers
            'userRole': 'patient',
            'Authorization': `Bearer ${patientAuthToken}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch chat history.');
          let errorMessage = 'Failed to fetch chat history.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          console.error(errorMessage);
        } else {
          const data = await response.json();
          setMessages(data);  // Update chat history
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [doctorId]);  // Only fetch if doctorId changes

  const handleSendMessage = async (event) => {
        event.preventDefault();
        if (message.trim()) {
          const patientId = localStorage.getItem('patientId');
          const patientAuthToken = localStorage.getItem('patientAuthToken');
    
          if (!patientId || !patientAuthToken) {
            console.error('Patient ID or authentication token not found.');
            return;
          }
    
          const newMessage = { sender: 'patient', text: message };
          setMessages([...messages, newMessage]);
          setMessage('');
    
          try {
            const response = await fetch('http://localhost:5000/api/chat/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'patientId': patientId,
                'userId': patientId,
                'userRole': 'patient',
                'Authorization': `Bearer ${patientAuthToken}`,
              },
              body: JSON.stringify({ otherUserId: doctorId, text: message }), // Changed doctorId to otherUserId
            });
    
            if (!response.ok) {
              console.error('Failed to send message to backend.');
              let errorMessage = 'Failed to send message.';
              try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                console.error('Error parsing error response:', e);
              }
              console.error(errorMessage);
            } else {
              const data = await response.json();
              console.log('Message sent successfully:', data);
              // Optionally, update the messages state with the server response
            }
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
      };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <Link to="/patient/appointments" className="back-button">Back to Appointments</Link>
        <h2>Chat with Doctor {doctorId}</h2>
        <button className="video-button">Start Video Call</button>
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