import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ChatStyles.css'; // Reusing styles

function DoctorChat() {
  const { patientId } = useParams(); // Assuming patientId is in the route
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: 'Hello! How can I help you today?' },
    { sender: 'patient', text: 'Hi, I have a question about...' },
    // More messages will go here
  ]); // Initialize as empty

  useEffect(() => {
    // TODO: Fetch initial messages for this patient from Firebase
    // and populate the 'messages' state.
    // The messages fetched should have 'sender' ('doctor' or 'patient') and 'text' properties.
    // Example (adapt to your Firebase setup):
    // const fetchChatHistory = async () => {
    //   const chatData = await firebase.firestore()
    //     .collection('chats')
    //     .where('patientId', '==', patientId)
    //     // Optionally filter by doctor if needed
    //     .orderBy('timestamp')
    //     .get();
    //   const initialMessages = chatData.docs.map(doc => doc.data());
    //   setMessages(initialMessages);
    // };
    // fetchChatHistory();

    // TODO: Set up real-time listener for new messages (optional)
  }, [patientId]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      const newMessage = { sender: 'doctor', text: message };
      setMessages([...messages, newMessage]);
      setMessage('');
      // TODO: Implement sending message to Firebase
      console.log('Sending message:', newMessage, 'to patient:', patientId);
      // Example (adapt to your Firebase setup):
      // firebase.firestore().collection('chats').add(newMessage);
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