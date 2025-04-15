// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors());

// To parse JSON request bodies
app.use(express.json());

// To parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Path to your Firebase service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.MAPS_API_KEY; // Ensure this is in your .env

const db = admin.firestore(); // For Firestore access from the server
const authAdmin = admin.auth(); // For Firebase Auth Admin SDK

// --- Google Maps API Endpoints ---

// Example: Geocoding an address
app.post('/api/location/geocode', async (req, res) => {
  try {
    const address = req.body.address;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const apiKey = process.env.MAPS_API_KEY;
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(geocodingApiUrl);
    const data = await response.json();

    if (data.status === 'OK') {
      res.json(data.results[0].geometry.location);
    } else {
      res.status(data.status === 'ZERO_RESULTS' ? 404 : 500).json({ error: data.error_message || 'Geocoding failed' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

// Example: Reverse geocoding coordinates
app.post('/api/location/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.MAPS_API_KEY;
    const reverseGeocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    const response = await fetch(reverseGeocodingApiUrl);
    const data = await response.json();

    if (data.status === 'OK') {
      res.json(data.results[0].formatted_address);
    } else {
      res.status(data.status === 'ZERO_RESULTS' ? 404 : 500).json({ error: data.error_message || 'Reverse geocoding failed' });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode coordinates' });
  }
});

// --- Twilio Video API Endpoints ---
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(twilioAccountSid, twilioAuthToken);

// Example: Creating a new Twilio Video room
app.post('/api/video/create-room', async (req, res) => {
  try {
    const { roomName } = req.body;
    if (!roomName) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = await twilio.video.v1.rooms.create({
      uniqueName: roomName,
      type: 'group' // Or 'peer-to-peer' depending on your needs
    });

    res.json({ roomId: room.sid });
  } catch (error) {
    console.error('Twilio create room error:', error);
    res.status(500).json({ error: 'Failed to create video room' });
  }
});

// Example: Generating a Twilio Video token for a participant
app.post('/api/video/token', async (req, res) => {
  try {
    const { identity, roomName } = req.body;
    if (!identity || !roomName) {
      return res.status(400).json({ error: 'Identity and room name are required' });
    }

    const AccessToken = require('twilio').jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // Create an access token
    const accessToken = new AccessToken(
      twilioAccountSid,
      process.env.TWILIO_API_KEY_SID || twilioAccountSid, // Use API Key SID if available
      process.env.TWILIO_API_KEY_SECRET || twilioAuthToken, // Use API Key Secret if available
      { identity: identity }
    );

    // Grant the token access to Video
    const grant = new VideoGrant({
      room: roomName,
    });
    accessToken.addGrant(grant);

    // Serialize the token to a JWT string
    const jwt = accessToken.toJwt();
    res.json({ token: jwt });
  } catch (error) {
    console.error('Twilio token generation error:', error);
    res.status(500).json({ error: 'Failed to generate video token' });
  }
});

// --- Doctor Signup Endpoint ---
app.post('/api/doctors/signup', async (req, res) => {
    try {
      const { name, email, password, medicalLicense, specialty, latitude, longitude } = req.body;
  
      // Basic input validation (ensure latitude and longitude are also present)
      if (!name || !email || !password || !medicalLicense || !specialty || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required (including location)' });
      }
  
      // Create a new user in Firebase Authentication
      const userRecord = await authAdmin.createUser({
        email: email,
        password: password,
        displayName: name,
      });
  
      // Store additional doctor information in Firestore with location
      await db.collection('doctors').doc(userRecord.uid).set({
        name: name,
        email: email,
        medicalLicense: medicalLicense,
        specialty: specialty,
        latitude: parseFloat(latitude), // Store as numbers
        longitude: parseFloat(longitude), // Store as numbers
      });
  
      res.status(201).json({ message: 'Doctor account created successfully', userId: userRecord.uid });
  
    } catch (error) {
      console.error('Doctor signup error:', error);
      let errorMessage = 'Failed to create doctor account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use';
      }
      res.status(400).json({ error: errorMessage });
    }
  });

// --- Patient Signup Endpoint ---
app.post('/api/patients/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Basic input validation
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create a new user in Firebase Authentication
      const userRecord = await authAdmin.createUser({
        email: email,
        password: password,
        displayName: name, // Optional: set display name
      });
  
      // Store additional patient information in Firestore
      await db.collection('patients').doc(userRecord.uid).set({
        name: name,
        email: email,
        // You can add other patient-specific fields here
      });
  
      res.status(201).json({ message: 'Patient account created successfully', userId: userRecord.uid });
  
    } catch (error) {
      console.error('Patient signup error:', error);
      let errorMessage = 'Failed to create patient account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use';
      }
      res.status(400).json({ error: errorMessage });
    }
  });

// --- Get All Doctors Endpoint ---
const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };
  
  // --- Search Doctors by Radius Endpoint ---
  app.get('/api/doctors/search-by-radius', async (req, res) => {
    try {
      const patientLatitude = parseFloat(req.query.latitude);
      const patientLongitude = parseFloat(req.query.longitude);
      const radius = parseFloat(req.query.radius);
  
      if (isNaN(patientLatitude) || isNaN(patientLongitude) || isNaN(radius)) {
        return res.status(400).json({ error: 'Invalid latitude, longitude, or radius' });
      }
  
      const doctorsRef = db.collection('doctors');
      const snapshot = await doctorsRef.get();
      const nearbyDoctors = [];
  
      snapshot.forEach(doc => {
        const doctorData = doc.data();
        if (doctorData.latitude && doctorData.longitude) {
          const distance = haversine(
            patientLatitude,
            patientLongitude,
            doctorData.latitude,
            doctorData.longitude
          );
          if (distance <= radius) {
            nearbyDoctors.push({ id: doc.id, ...doctorData });
          }
        }
      });
  
      res.json(nearbyDoctors);
  
    } catch (error) {
      console.error('Error searching doctors by radius:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// --- Doctor Login Endpoint ---
// --- Verify Doctor ID Token Endpoint ---
app.post('/api/doctors/verify-token', async (req, res) => {
    try {
      const idToken = req.headers.authorization?.split(' ')[1];
  
      if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No ID token provided' });
      }
  
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
  
        // Token is valid. You can now proceed to establish a session or retrieve user data.
        // For this example, we'll just send back a success message and the UID.
        res.json({ message: 'ID token verified successfully', uid: uid });
  
      } catch (error) {
        console.error('Error verifying ID token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid ID token' });
      }
  
    } catch (error) {
      console.error('Verify token endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // --- Patient Login Endpoint ---
  // --- Verify Patient ID Token Endpoint ---
app.post('/api/patients/verify-token', async (req, res) => {
    try {
      const idToken = req.headers.authorization?.split(' ')[1];
  
      if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No ID token provided' });
      }
  
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
  
        // Token is valid. You can now proceed to establish a session or retrieve user data.
        // For this example, we'll just send back a success message and the UID.
        res.json({ message: 'Patient ID token verified successfully', uid: uid });
  
      } catch (error) {
        console.error('Error verifying patient ID token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid ID token' });
      }
  
    } catch (error) {
      console.error('Verify patient token endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// --- Get Nearby Hospitals Endpoint ---
app.get('/api/hospitals/nearby', async (req, res) => {
    try {
      const latitude = parseFloat(req.query.latitude);
      const longitude = parseFloat(req.query.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
      }

      const GOOGLE_MAPS_API_KEY = process.env.MAPS_API_KEY;

      if (!GOOGLE_MAPS_API_KEY) {
        return res.status(500).json({ error: 'Google Maps API key not configured' });
      }

      const params = {
        location: { lat: latitude, lng: longitude },
        radius: 5000, // Search radius in meters (you can adjust this)
        type: 'hospital',
        key: GOOGLE_MAPS_API_KEY,
      };

      const googleResponse = await googleMapsClient.placesNearby({ params }); // Call without .asPromise()

      if (googleResponse.data.results) {
        const hospitals = googleResponse.data.results.map(hospital => ({
          name: hospital.name,
          address: hospital.vicinity,
          rating: hospital.rating,
          place_id: hospital.place_id,
          geometry: hospital.geometry ? hospital.geometry.location : null,
        }));
        res.json(hospitals);
      } else {
        res.json([]); // No hospitals found
      }

    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
    }
  });

// --- Get Nearby Pharmacies Endpoint ---
app.get('/api/pharmacies/nearby', async (req, res) => {
    try {
      const latitude = parseFloat(req.query.latitude);
      const longitude = parseFloat(req.query.longitude);
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
      }
  
      const GOOGLE_MAPS_API_KEY = process.env.MAPS_API_KEY;
  
      if (!GOOGLE_MAPS_API_KEY) {
        return res.status(500).json({ error: 'Google Maps API key not configured' });
      }
  
      const params = {
        location: { lat: latitude, lng: longitude },
        radius: 5000, // Search radius in meters (you can adjust this)
        type: 'pharmacy',
        key: GOOGLE_MAPS_API_KEY,
      };
  
      const googleResponse = await googleMapsClient.placesNearby({ params }); // Call without .asPromise()
  
      if (googleResponse.data.results) {
        const pharmacies = googleResponse.data.results.map(pharmacy => ({
          name: pharmacy.name,
          address: pharmacy.vicinity,
          rating: pharmacy.rating,
          place_id: pharmacy.place_id,
          geometry: pharmacy.geometry ? pharmacy.geometry.location : null,
          // Add other relevant fields
        }));
        res.json(pharmacies);
      } else {
        res.json([]); // No pharmacies found
      }
  
    } catch (error) {
      console.error('Error fetching nearby pharmacies:', error);
      res.status(500).json({ error: 'Failed to fetch nearby pharmacies' });
    }
  });

  // --- Get Nearby Ambulances Endpoint ---
  app.get('/api/ambulances/nearby', async (req, res) => {
    try {
      const latitude = parseFloat(req.query.latitude);
      const longitude = parseFloat(req.query.longitude);
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
      }
  
      const GOOGLE_MAPS_API_KEY = process.env.MAPS_API_KEY;
  
      if (!GOOGLE_MAPS_API_KEY) {
        return res.status(500).json({ error: 'Google Maps API key not configured' });
      }
  
      const params = {
        location: { lat: latitude, lng: longitude },
        radius: 10000, // Increased radius to 10km (adjust as needed)
        type: 'ambulance_station', // Changed to ambulance_station for more accurate results
        key: GOOGLE_MAPS_API_KEY,
      };
  
      const googleResponse = await googleMapsClient.placesNearby({ params });
  
      if (googleResponse.data.results) {
        const ambulances = googleResponse.data.results.map(ambulance => ({
          name: ambulance.name,
          address: ambulance.vicinity,
          rating: ambulance.rating,
          place_id: ambulance.place_id,
          geometry: ambulance.geometry ? ambulance.geometry.location : null,
          phoneNumber: ambulance.formatted_phone_number, // Add phone number if available
          // Add other relevant fields
        }));
        res.json(ambulances);
      } else {
        res.json([]); // No ambulances found
      }
  
    } catch (error) {
      console.error('Error fetching nearby ambulances:', error);
      res.status(500).json({ error: 'Failed to fetch nearby ambulances' });
    }
  });

  // --- Get Appointments for a Patient ---
app.get('/api/patients/:patientId/appointments', async (req, res) => {
    try {
        const patientId = req.params.patientId;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const appointmentsRef = db.collection('appointments');
        const querySnapshot = await appointmentsRef.where('patientId', '==', patientId).get();

        const patientAppointments = [];
        querySnapshot.forEach(doc => {
            patientAppointments.push({ id: doc.id, ...doc.data() });
        });

        res.json(patientAppointments);

    } catch (error) {
        console.error('Error fetching appointments for patient:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

  // --- Get Doctor by ID Endpoint ---
app.get('/api/doctors/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const doctorRef = db.collection('doctors').doc(doctorId);
        const docSnapshot = await doctorRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const doctorData = docSnapshot.data();
        res.json({ id: docSnapshot.id, ...doctorData });

    } catch (error) {
        console.error('Error fetching doctor by ID:', error);
        res.status(500).json({ error: 'Failed to fetch doctor details' });
    }
});

// --- Create New Appointment Endpoint ---
// --- Create New Appointment Endpoint (Modified to include doctor's name) ---
app.post('/api/appointments', async (req, res) => {
    try {
        const { doctorId, patientId, date, time, reason, status } = req.body;

        // Basic validation of required fields
        if (!doctorId || !patientId || !date || !time) {
            return res.status(400).json({ error: 'Doctor ID, Patient ID, date, and time are required' });
        }

        // Fetch the doctor's name from Firestore
        const doctorRef = db.collection('doctors').doc(doctorId);
        const doctorSnapshot = await doctorRef.get();

        if (!doctorSnapshot.exists) {
            return res.status(400).json({ error: 'Invalid Doctor ID' });
        }

        const doctorData = doctorSnapshot.data();
        const doctorName = doctorData.name;

        const newAppointment = {
            doctorId: doctorId,
            doctorName: doctorName, // Include doctor's name
            patientId: patientId,
            date: date,
            time: time,
            reason: reason || '',
            status: status || 'Pending', // Default to 'Pending' if not provided
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Add a timestamp
        };

        // Store the new appointment in the 'appointments' collection in Firestore
        const docRef = await db.collection('appointments').add(newAppointment);

        // Respond with the ID of the newly created appointment
        res.status(201).json({ message: 'Appointment request created successfully', appointmentId: docRef.id });

    } catch (error) {
        console.error('Error creating new appointment:', error);
        res.status(500).json({ error: 'Failed to create new appointment request' });
    }
});

// --- Get Appointments for a Doctor ---
app.get('/api/doctors/:doctorId/appointments', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(400).json({ error: 'Doctor ID is required' });
        }

        const appointmentsRef = db.collection('appointments');
        const querySnapshot = await appointmentsRef.where('doctorId', '==', doctorId).get();

        const doctorAppointments = [];
        querySnapshot.forEach(doc => {
            doctorAppointments.push({ id: doc.id, ...doc.data() });
        });

        res.json(doctorAppointments);

    } catch (error) {
        console.error('Error fetching appointments for doctor:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// --- Approve Appointment Endpoint ---
app.put('/api/appointments/:appointmentId/approve', async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;

        if (!appointmentId) {
            return res.status(400).json({ error: 'Appointment ID is required' });
        }

        const appointmentRef = db.collection('appointments').doc(appointmentId);
        const appointmentSnapshot = await appointmentRef.get();

        if (!appointmentSnapshot.exists) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        await appointmentRef.update({ status: 'Approved' });

        // Optionally, you can add logic here to send a notification to the patient

        res.json({ message: 'Appointment approved successfully' });

    } catch (error) {
        console.error('Error approving appointment:', error);
        res.status(500).json({ error: 'Failed to approve appointment' });
    }
});

// Define the PUT route for rescheduling
app.put('/api/appointments/:appointmentId/reschedule', async (req, res) => {
    const { appointmentId } = req.params; // Extract appointmentId from URL parameters
    const { date, time } = req.body; // Extract new date and time from request body

    try {
        const appointmentRef = db.collection('appointments').doc(appointmentId);
const appointmentSnapshot = await appointmentRef.get();

if (!appointmentSnapshot.exists) {
    return res.status(404).json({ error: 'Appointment not found' });
}

await appointmentRef.update({ date: date, time: time });

        // Send a success response
        res.json({ message: 'Appointment rescheduled successfully' });

    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        res.status(500).json({ error: 'Failed to reschedule appointment' });
    }
});

// --- Start the server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});