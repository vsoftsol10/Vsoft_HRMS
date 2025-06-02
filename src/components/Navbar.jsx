import { useState } from "react";
import "./Navbar.css";

import Logo from "../assets/logo1.png"

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="navbar">
      {/* Background Gradient Overlay */}
      <div className="navbar-bg-overlay"></div>
      
      {/* Logo with Animation */}
      <div className="navbar-logo">
        <div className="logo-icon">
          <img src={Logo} alt="logo"  className="logo"/>
        </div>
      </div>

      {/* Nav Links with Hover Effects */}
      <nav className="navbar-links">
        <a href="/dashboard" className="nav-link">
          <span className="nav-icon">📊</span>
          Dashboard
        </a>
        <a href="/employees" className="nav-link">
          <span className="nav-icon">👥</span>
          Employees
        </a>
        <a href="/leave" className="nav-link">
          <span className="nav-icon">🏖️</span>
          Leave
        </a>
        <a href="/payroll" className="nav-link">
          <span className="nav-icon">💰</span>
          Payroll
        </a>
        <a href="/reports" className="nav-link">
          <span className="nav-icon">📈</span>
          Reports
        </a>
      </nav>

      {/* Right-side Controls */}
      <div className="navbar-controls">
        {/* Enhanced Search */}
        {/* <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search anything..."
            className="navbar-search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div> */}

        {/* Notification with Pulse Animation
        <div className="navbar-icon notification-icon">
          <span className="icon">🔔</span>
          <span className="navbar-badge pulse">3</span>
        </div> */}

        {/* Profile Dropdown with Enhanced UI */}
        <div className="navbar-profile" onClick={() => setProfileOpen(!profileOpen)}>
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <span className="profile-text">Admin</span>
          <span className={`profile-arrow ${profileOpen ? 'rotated' : ''}`}>▾</span>
          
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="user-info">
                  <div className="user-avatar">👤</div>
                  <div className="user-details">
                    <div className="user-name">Admin User</div>
                    <div className="user-role">Administrator</div>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <a href="/profile" className="dropdown-item">
                <span className="dropdown-icon">👤</span>
                Profile
              </a>
              <a href="/settings" className="dropdown-item">
                <span className="dropdown-icon">⚙️</span>
                Settings
              </a>
              <a href="/logout" className="dropdown-item logout">
                <span className="dropdown-icon">🚪</span>
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;