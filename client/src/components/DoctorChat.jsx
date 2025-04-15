import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ChatStyles.css'; // Reusing styles

function DoctorChat() {
  const { patientId } = useParams(); // Assuming patientId is in the route
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Initialize as empty

  useEffect(() => {
    const fetchChatHistory = async () => {
      const doctorId = localStorage.getItem('doctorId');
      const doctorAuthToken = localStorage.getItem('doctorAuthToken');
      if (!doctorId || !doctorAuthToken || !patientId) {
        console.error('Doctor ID, authentication token, or Patient ID not found.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/chat/${patientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'doctorId': doctorId,
            'userId': doctorId, // Send doctor's ID in the headers
            'userRole': 'doctor', // Indicate the user role
            'Authorization': `Bearer ${doctorAuthToken}`,
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
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [patientId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message.trim()) {
      const doctorId = localStorage.getItem('doctorId'); // Get doctor's ID from localStorage
      const doctorAuthToken = localStorage.getItem('doctorAuthToken'); // Get doctor's auth token

      if (!doctorId || !doctorAuthToken) {
        console.error('Doctor ID or authentication token not found.');
        return;
      }

      const newMessage = { sender: 'doctor', text: message };
      setMessages([...messages, newMessage]); // Optimistically update local state
      setMessage('');

      try {
        const response = await fetch('http://localhost:5000/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'doctorId': doctorId, // Send doctor's ID in the headers
            'userId': doctorId, // Send doctor's ID in the headers
            'userRole': 'doctor', // Indicate the user role
            'Authorization': `Bearer ${doctorAuthToken}`, // Send authorization token
          },
          body: JSON.stringify({ otherUserId: patientId, text: message }),
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
          // Optionally revert the optimistic update:
          // setMessages(messages.slice(0, -1));
        } else {
          const data = await response.json();
          console.log('Message sent successfully:', data);
          // Optionally update local messages with the message ID from the backend if needed
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Optionally revert the optimistic update:
        // setMessages(messages.slice(0, -1));
      }
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <Link to="/doctor/appointments" className="back-button">Back to Appointments</Link>
        <h2>Chat with Patient {patientId}</h2> {/* Replace with patient name later */}
        <button className="video-button">Start Video Call</button>
      </header>
      <div className="message-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'doctor' ? 'sent' : 'received'}`}
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

export default DoctorChat;