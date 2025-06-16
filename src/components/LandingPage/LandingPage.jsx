import React, { useState, useEffect } from 'react';
import './LandingPage.css';

import logo from "../../assets/logo1.png"

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="floating-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Interactive cursor glow */}
      <div 
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
        }}
      ></div>

      {/* Main Content */}
      <div className={`content-wrapper ${isLoaded ? 'loaded' : ''}`}>
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-backdrop"></div>
            <div className="logo-placeholder">
              <div className="logo-icon">
                {/* Replace this img src with your actual logo path */}
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="logo-image"
                />
              </div>
            </div>
            <div className="logo-glow"></div>
          </div>
          <h1 className="brand-title">
            <span className="title-line">Welcome to</span>
            <span className="title-main">Excellence</span>
          </h1>
          <p className="brand-subtitle">
            Empowering growth through innovation and dedication
          </p>
        </div>

        {/* Buttons Section */}
        <div className="button-section">
          <div className="buttons-container">
            <button className="landing-btn btn-primary">
              <span className="btn-icon">👤</span>
              <span className="btn-text">Employee</span>
              <div className="btn-glow"></div>
            </button>
            
            <button className="landing-btn btn-secondary">
              <span className="btn-icon">🌍</span>
              <span className="btn-text">Non Employee</span>
              <div className="btn-glow"></div>
            </button>
            
            <button className="landing-btn btn-accent">
              <span className="btn-icon">🎓</span>
              <span className="btn-text">Training</span>
              <div className="btn-glow"></div>
            </button>
          </div>
          
          <div className="action-hint">
            <div className="hint-pulse"></div>
            <span>Choose your path to get started</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-grid">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="grid-dot"></div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="bottom-accent"></div>
    </div>
  );
};

export default LandingPage;