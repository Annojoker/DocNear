import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // We'll create this CSS file

function LandingPage() {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <h1>DocNear</h1>
        <nav>
          <Link to="/patient/login">Patient Login</Link>
          <Link to="/doctor/login">Doctor Login</Link>
          <Link to="/patient/signup">Patient Sign Up</Link>
          <Link to="/doctor/signup">Doctor Sign Up</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Health, Simplified.</h1>
          <p>Find the right doctors, book appointments easily, and access quality healthcare from the comfort of your home.</p>
          <div className="hero-buttons">
            <Link to="/patient/login" className="patient-button">Find a Doctor</Link>
            <Link to="/doctor/login" className="doctor-button">For Doctors</Link>
          </div>
        </div>
        <div className="hero-image">
          {/* You'd replace this with an actual image */}
          <img src="https://img.freepik.com/premium-photo/doctor-through-phone-screen-check-health-online-medical-consultation-doctor-online_34200-420.jpg?semt=ais_hybrid&w=740" alt="Healthcare Illustration" />
        </div>
      </section>

      <section className="why-choose-us-section">
        <h2>Why Choose DocNear?</h2>
        <div className="benefits-grid">
          <div className="benefit">
            {/* Replace with an icon */}
            <h3>Convenience</h3>
            <p>Book appointments online 24/7 from anywhere.</p>
          </div>
          <div className="benefit">
            {/* Replace with an icon */}
            <h3>Wide Network</h3>
            <p>Access a diverse range of qualified doctors and specialists.</p>
          </div>
          <div className="benefit">
            {/* Replace with an icon */}
            <h3>Secure & Private</h3>
            <p>Your health data is protected with the highest security standards.</p>
          </div>
          <div className="benefit">
            {/* Replace with an icon */}
            <h3>Comprehensive Services</h3>
            <p>From consultations to prescriptions, manage your health in one place.</p>
          </div>
        </div>
      </section>

      <section className="features-overview-section">
        <h2>Our Key Features</h2>
        <div className="features-list">
          <div className="feature">
            {/* Replace with an icon */}
            <h3>Find Doctors</h3>
            <p>Easily search for doctors by specialty, location, and more.</p>
          </div>
          <div className="feature">
            {/* Replace with an icon */}
            <h3>Book Appointments</h3>
            <p>Schedule appointments online at your convenience.</p>
          </div>
          <div className="feature">
            {/* Replace with an icon */}
            <h3>Online Consultations</h3>
            <p>Connect with doctors remotely through chat and video calls.</p>
          </div>
          <div className="feature">
            {/* Replace with an icon */}
            <h3>Prescription Management</h3>
            <p>View and manage your prescriptions online.</p>
          </div>
        </div>
      </section>

      {/* <section className="testimonials-section">
        <h2>Testimonials</h2>
        <div className="testimonial">
          <p>"DocNear made it so easy to find a great doctor and book an appointment quickly!" - Priya</p>
        </div>
        {/* Add more testimonials */}
      {/* </section> */}

      <section className="cta-section">
        <h2>Ready to Simplify Your Healthcare?</h2>
        <p>Join DocNear today and experience a better way to manage your health.</p>
        <div className="cta-buttons">
          <Link to="/patient/signup" className="signup-button">Sign Up as Patient</Link>
          <Link to="/doctor/signup" className="signup-button">Sign Up as Doctor</Link>
        </div>
      </section>

      <footer className="landing-page-footer">
        <p>&copy; 2025 DocNear. All rights reserved.</p>
        {/* Add links to privacy policy, terms of service, etc. if needed */}
      </footer>
    </div>
  );
}

export default LandingPage;