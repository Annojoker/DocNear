import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DoctorListStyles.css';

function DoctorList() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(20); // Default radius
  const [manualAddress, setManualAddress] = useState('');

  const fetchDoctors = async (latitude, longitude, radius) => {
    setLoading(true);
    setError(null);
    const url = `http://localhost:5000/api/doctors/search-by-radius?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDoctorsList(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.message || 'Failed to fetch doctors');
      setLoading(false);
    }
  };

  const handleRadiusChange = (event) => {
    setSearchRadius(parseFloat(event.target.value));
  };

  const handleManualAddressChange = (event) => {
    setManualAddress(event.target.value);
  };

  const handleSearchByLocation = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchDoctors(position.coords.latitude, position.coords.longitude, searchRadius);
        },
        (error) => {
          console.error('Error getting user location:', error);
          alert('Could not get your current location. Please enter an address.');
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
    } else if (manualAddress) {
      // Implement geocoding here to convert manualAddress to coordinates
      // For now, we'll just show an alert - you'll need to integrate a geocoding service
      alert('Geocoding service not yet implemented. Please use browser location.');
      setLoading(false);
      // Example of how you might call geocoding and then fetchDoctors:
      // geocodeAddress(manualAddress)
      //   .then(coords => {
      //     if (coords) {
      //       fetchDoctors(coords.latitude, coords.longitude, searchRadius);
      //     } else {
      //       setError('Invalid address');
      //       setLoading(false);
      //     }
      //   })
      //   .catch(err => {
      //     console.error('Geocoding error:', err);
      //     setError('Failed to geocode address');
      //     setLoading(false);
      //   });
    } else {
      alert('Please enable location or enter an address to search.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="doctor-list-container">
      <header className="doctor-list-header">
        <h2>Find Doctors Near You</h2>
        <Link to="/patient/dashboard" className="back-button">Back to Dashboard</Link>
      </header>
      <div className="filter-controls">
        <label htmlFor="radius">Search Radius (km):</label>
        <input
          type="number"
          id="radius"
          value={searchRadius}
          onChange={handleRadiusChange}
          min="5"
          max="100"
        />
        <button onClick={handleSearchByLocation}>Find Doctors</button>
      </div>
      {/* Optional: Manual address input */}
      {/* <div className="manual-location">
        <label htmlFor="address">Enter Address:</label>
        <input
          type="text"
          id="address"
          value={manualAddress}
          onChange={handleManualAddressChange}
          placeholder="Your address"
        />
      </div> */}
      <ul className="doctors-list">
        {doctorsList.map((doctor) => (
          <li key={doctor.id} className="doctor-card">
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p className="specialty">{doctor.specialty}</p>
              <p className="location">Location: {doctor.location}</p>
              {doctor.medicalLicense && (
                <p className="medical-license">License: {doctor.medicalLicense}</p>
              )}
            </div>
            <div className="doctor-actions">
              <Link to={`/patient/book-appointment/${doctor.id}`} className="book-button">Book Appointment</Link>
            </div>
          </li>
        ))}
      </ul>
      {doctorsList.length === 0 && !loading && !error && (
        <p>No doctors found within the specified radius.</p>
      )}
    </div>
  );
}

export default DoctorList;