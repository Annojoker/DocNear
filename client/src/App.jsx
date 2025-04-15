import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PatientLogin from './components/PatientLogin';
import PatientSignup from './components/PatientSignup';
import DoctorLogin from './components/DoctorLogin';
import DoctorSignup from './components/DoctorSignup';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorList from './components/DoctorList';
import PatientAppointments from './components/PatientAppointments';
import HospitalsMap from './components/HospitalsMap';
import PharmaciesMap from './components/PharmaciesMap';
import AmbulanceRequest from './components/AmbulanceRequest';
import PatientPrescriptions from './components/PatientPrescriptions';
import DoctorAppointments from './components/DoctorAppointments';
import DoctorHistory from './components/DoctorHistory';
import BookAppointment from './components/BookAppointment';
import PatientChat from './components/PatientChat';
import PatientVideo from './components/PatientVideo';
import DoctorChat from './components/DoctorChat'; // Import DoctorChat
import DoctorVideo from './components/DoctorVideo'; // Import DoctorVideo

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient/signup" element={<PatientSignup />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/doctors" element={<DoctorList />} />
        <Route path="/patient/book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="/patient/chat/:doctorId" element={<PatientChat />} /> {/* New route */}
        <Route path="/patient/video/:doctorId" element={<PatientVideo />} /> {/* New route */}
        <Route path="/patient/hospitals" element={<HospitalsMap />} />
        <Route path="/patient/pharmacies" element={<PharmaciesMap />} />
        <Route path="/patient/ambulance" element={<AmbulanceRequest />} />
        <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/history" element={<DoctorHistory />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/chat/:patientId" element={<DoctorChat />} /> {/* New route */}
        <Route path="/doctor/video/:patientId" element={<DoctorVideo />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;