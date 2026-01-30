import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPalette, FaMusic, FaFeatherAlt, FaUsers, FaCheckCircle } from "react-icons/fa";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <header className="landing-hero">
        <h1>🎨 AI Creative Studio</h1>
        <p className="hero-subtitle">
          Unleash Your Creativity. Turn Ideas into Art, Music & Poetry Instantly.
        </p>
        <button className="cta-btn" onClick={() => navigate("/signup")}>
          Get Started
        </button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="login-link">
            Login
          </span>
        </p>
      </header>

      {/* ABOUT / WHY SECTION */}
      <section className="about-section">
        <h2>Why AI Creative Studio?</h2>
        <div className="about-cards">
          <div className="about-card">
            <FaCheckCircle className="about-icon" />
            <h3>Innovative</h3>
            <p>Transform your ideas into stunning art, music, and poems instantly.</p>
          </div>
          <div className="about-card">
            <FaUsers className="about-icon" />
            <h3>Accessible</h3>
            <p>No skills required — everyone can create like a pro.</p>
          </div>
          <div className="about-card">
            <FaFeatherAlt className="about-icon" />
            <h3>Fast & Fun</h3>
            <p>Experience your creations in seconds with AI-powered tools.</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features">
          <div className="feature-card">
            <FaPalette className="feature-icon" />
            <h3>Art Generator</h3>
            <p>Transform your prompts into stunning AI-generated images.</p>
          </div>

          <div className="feature-card">
            <FaMusic className="feature-icon" />
            <h3>Music Generator</h3>
            <p>Create original music tracks based on your ideas and mood.</p>
          </div>

          <div className="feature-card">
            <FaFeatherAlt className="feature-icon" />
            <h3>Poetry Generator</h3>
            <p>Generate beautiful poems from a single line or theme.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonial-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <p>
              "AI Creative Studio turned my random ideas into a masterpiece — love it!"
            </p>
            <strong>- Alex</strong>
          </div>
          <div className="testimonial-card">
            <p>
              "I never knew I could compose music until I tried this — amazing tool!"
            </p>
            <strong>- Maya</strong>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="final-cta">
        <h2>Ready to create something extraordinary?</h2>
        <button className="cta-btn" onClick={() => navigate("/signup")}>
          Sign Up Free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© 2026 AI Creative Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
