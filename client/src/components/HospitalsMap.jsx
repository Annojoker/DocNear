import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyles.css';

function NearbyHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchNearbyHospitals = async (latitude, longitude) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/hospitals/nearby?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHospitals(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nearby hospitals:', error);
        setError(error.message || 'Failed to fetch nearby hospitals');
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          fetchNearbyHospitals(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Could not get your location to find nearby hospitals.');
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const handleMarkerClick = (hospital) => {
    setSelectedHospital(hospital);
  };

  if (loading) {
    return <div>Loading nearby hospitals...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="nearby-hospitals-container">
      <header className="nearby-hospitals-header">
        <h2>Nearby Hospitals</h2>
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
      </header>
      <div style={{ height: '500px', width: '100%' }} className="leaflet-container">
        {userLocation && (
          <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hospitals.map((hospital) => (
              hospital.geometry && (
                <Marker
                  key={hospital.place_id}
                  position={[hospital.geometry.lat, hospital.geometry.lng]}
                  onClick={() => handleMarkerClick(hospital)}
                >
                  <Popup>
                    <h3>{hospital.name}</h3>
                    <p>{hospital.address}</p>
                    {hospital.rating && <p>Rating: {hospital.rating}</p>}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        )}
        {!userLocation && <p>Loading map...</p>}
      </div>

      {selectedHospital && (
        <div className="selected-hospital-info">
          <h3>{selectedHospital.name}</h3>
          <p className="address">{selectedHospital.address}</p>
          {selectedHospital.rating && <p className="rating">Rating: {selectedHospital.rating}</p>}
        </div>
      )}

      {hospitals.length === 0 && !loading && !error && (
        <p>No hospitals found nearby.</p>
      )}
    </div>
  );
}

export default NearbyHospitals;