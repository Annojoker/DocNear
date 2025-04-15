import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './AmbulanceRequestStyles.css'; // Ensure you have this CSS

function AmbulanceRequest() {
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [locationText, setLocationText] = useState(''); // Display selected location

  useEffect(() => {
    console.log('useEffect - Initial');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log('useEffect - Geolocation success:', { latitude, longitude });
        },
        (error) => {
          console.error('useEffect - Error getting user location:', error);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      console.log('Geolocation is not supported.');
    }
  }, []);

  function MapEvents() {
    const map = useMapEvents({
      click: (e) => {
        setDeliveryLocation(e.latlng);
        setLocationText(`Latitude: ${e.latlng.lat.toFixed(6)}, Longitude: ${e.latlng.lng.toFixed(6)} (Selected)`);
        console.log('MapEvents - Clicked for delivery:', e.latlng);
      },
    });
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!deliveryLocation) {
      alert('Please select the ambulance delivery location on the map.');
      return;
    }
    if (!contactNumber.trim()) {
      alert('Please enter your contact number.');
      return;
    }
    console.log('Ambulance Requested for:', {
      contactNumber,
      deliveryLocation,
    });
    alert('Ambulance request submitted!');
    setContactNumber('');
    setDeliveryLocation(null);
    setLocationText('');
  };

  console.log('Rendering - userLocation:', userLocation);
  console.log('Rendering - deliveryLocation:', deliveryLocation);

  return (
    <div className="ambulance-request-container">
      <header className="ambulance-request-header">
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
        <h2>Request Ambulance</h2>
      </header>
      <div className="map-container">
        <MapContainer
          center={{ lat: 13.76, lng: 80.01 }} // Example coordinates (Guduvancheri)
          zoom={15}
          style={{ height: '300px', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {deliveryLocation && (
            <Marker position={deliveryLocation}>
              <Popup>
                Delivery Location
              </Popup>
            </Marker>
          )}
          <MapEvents />
        </MapContainer>
        <p className="map-instruction">Click on the map to select the ambulance delivery location.</p>
      </div>
      <form onSubmit={handleSubmit} className="ambulance-form">
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
          <label htmlFor="location">Delivery Location:</label>
          <input
            type="text"
            id="location"
            value={locationText}
            readOnly
            required
            placeholder="Select location on the map"
          />
        </div>
        <button type="submit" className="request-button">Request Ambulance</button>
      </form>
    </div>
  );
}

export default AmbulanceRequest;