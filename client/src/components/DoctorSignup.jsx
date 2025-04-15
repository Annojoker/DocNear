import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import './AuthStyles.css';

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
});

function LocationPicker({ onLocationChange }) {
  const [position, setPosition] = useState([12.87, 80.09]); // Guduvancheri as default
  const map = useMapEvents({
    moveend() {
      setPosition([map.getCenter().lat, map.getCenter().lng]);
      onLocationChange({ latitude: map.getCenter().lat, longitude: map.getCenter().lng });
    },
    dragend(e) {
      setPosition(e.target.getLatLng());
      onLocationChange({ latitude: e.target.getLatLng().lat, longitude: e.target.getLatLng().lng });
    }
  });

  return <Marker position={position} draggable={true} />;
}

function DoctorSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState(null); // State for { latitude, longitude }
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignupError('');

    if (!name || !email || !password || !medicalLicense || !specialty || !location) {
      setSignupError('All fields are required (including location)');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/doctors/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, medicalLicense, specialty, latitude: location.latitude, longitude: location.longitude }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Doctor account created:', data);
        navigate('/doctor/dashboard');
      } else {
        console.error('Signup failed:', data.error);
        setSignupError(data.error || 'Signup failed');
      }

    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('Failed to connect to the server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Doctor Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="icon">👤</span>
              <input type="text" id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="icon">📧</span>
              <input type="email" id="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input type="password" id="password" placeholder="Choose a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="medicalLicense">Medical License Number</label>
            <div className="input-wrapper">
              <span className="icon">📜</span>
              <input type="text" id="medicalLicense" placeholder="Your medical license number" value={medicalLicense} onChange={(e) => setMedicalLicense(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <div className="input-wrapper">
              <span className="icon">⚕️</span>
              <input type="text" id="specialty" placeholder="Your medical specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Office Location</label>
            <div style={{ height: '300px', width: '100%', marginBottom: '10px' }}>
              <MapContainer center={[12.87, 80.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationChange={handleLocationChange} />
              </MapContainer>
            </div>
            {location && (
              <p>Selected Location: Latitude {location.latitude.toFixed(6)}, Longitude {location.longitude.toFixed(6)}</p>
            )}
          </div>
          {signupError && <p style={{ color: 'red', marginTop: '5px' }}>{signupError}</p>}
          <button type="submit" className="auth-button signup-button">Sign Up</button>
        </form>
        <div className="auth-link">
          Already a doctor? <Link to="/doctor/login">Log In</Link>
        </div>
        <div className="back-to-home">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignUp;