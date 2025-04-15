import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './NearbyPharmaciesStyles.css'; // Ensure you have this CSS file

function NearbyPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  useEffect(() => {
    const fetchNearbyPharmacies = async (latitude, longitude) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/pharmacies/nearby?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPharmacies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nearby pharmacies:', error);
        setError(error.message || 'Failed to fetch nearby pharmacies');
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
          fetchNearbyPharmacies(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Could not get your location to find nearby pharmacies.');
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const handleMarkerClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };

  if (loading) {
    return <div>Loading nearby pharmacies...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="nearby-pharmacies-container">
      <header className="nearby-pharmacies-header">
        <h2>Nearby Pharmacies</h2>
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
      </header>
      <div style={{ height: '500px', width: '100%' }} className="leaflet-container">
        {userLocation && (
          <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pharmacies.map((pharmacy) => (
              pharmacy.geometry && (
                <Marker
                  key={pharmacy.place_id}
                  position={[pharmacy.geometry.lat, pharmacy.geometry.lng]}
                  onClick={() => handleMarkerClick(pharmacy)}
                >
                  <Popup>
                    <h3>{pharmacy.name}</h3>
                    <p>{pharmacy.address}</p>
                    {pharmacy.rating && <p>Rating: {pharmacy.rating}</p>}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        )}
        {!userLocation && <p>Loading map...</p>}
      </div>

      {selectedPharmacy && (
        <div className="selected-pharmacy-info">
          <h3>{selectedPharmacy.name}</h3>
          <p className="address">{selectedPharmacy.address}</p>
          {selectedPharmacy.rating && <p className="rating">Rating: {selectedPharmacy.rating}</p>}
        </div>
      )}

      {pharmacies.length === 0 && !loading && !error && (
        <p>No pharmacies found nearby.</p>
      )}
    </div>
  );
}

export default NearbyPharmacies;