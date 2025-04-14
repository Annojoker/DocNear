import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AmbulanceRequestStyles.css';

function AmbulanceRequest() {
  const [pinnedLocation, setPinnedLocation] = useState(null); // For future map interaction
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');

  const handlePinLocation = (/* Event from map click in the future */) => {
    // In a real implementation, this would update pinnedLocation based on map interaction
    setPinnedLocation({ lat: 0, lng: 0 }); // Placeholder coordinates
    alert('Location pinned (placeholder)! Please confirm in the text field.');
    setLocation('Pinned Location (Placeholder)'); // Update text input as well
  };

  const [location, setLocation] = useState(''); // Keep the text input for confirmation/manual entry

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!location.trim()) {
      alert('Please enter your location.');
      return;
    }
    if (!contactNumber.trim()) {
      alert('Please enter your contact number.');
      return;
    }
    // To do: Implement ambulance request submission logic (likely to Firebase with location details)
    console.log('Ambulance Requested:', { location, contactNumber, reason, pinnedLocation });
    alert('Ambulance request submitted!'); // Temporary feedback
    setLocation('');
    setContactNumber('');
    setReason('');
    setPinnedLocation(null);
  };

  return (
    <div className="ambulance-container">
      <header className="ambulance-header">
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
        <h2>Request Ambulance</h2>
      </header>
      <div className="map-placeholder" onClick={handlePinLocation}>
        {/* In a real implementation, a map component would go here */}
        Click here to pin your location on the map (placeholder)
      </div>
      <form onSubmit={handleSubmit} className="ambulance-form">
        <div className="form-group">
          <label htmlFor="location">Current Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Confirm your location or enter manually"
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="tel"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            placeholder="Your phone number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason for Request (Optional):</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe the emergency"
          />
        </div>
        <button type="submit" className="request-button">Request Ambulance</button>
      </form>
    </div>
  );
}

export default AmbulanceRequest;