import { useState, useEffect } from "react";
import "./LoginPage.css";
import logo from "../../assets/logo1.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Added missing role state
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    
    if (!email || !password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (email === "admin@nsoc.com" && password === "admin123") {
        console.log("Login successful");
        // navigate("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${15 + particle.speed * 5}s`,
            animationDelay: `${particle.id * 0.5}s`,
          }}
        />
      ))}

      {/* Left Panel - Logo Section */}
      <div className="logo-panel">
        <div className="decorative-circle circle-1" />
        <div className="decorative-circle circle-2" />
        
        <div className="logo-content">
          <div className="logo-section">
            <div className="logo-icon">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <h1 className="logo-title">VSoft Solutions</h1>
            <p className="logo-subtitle">Smart Software. Smarter Solutions</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="form-panel">
        <div className="form-container">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Sign in to access your dashboard</p>
          
          <div className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="form-input"
                  disabled={isLoading}
                />
                <div className="input-glow" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="form-input"
                  disabled={isLoading}
                />
                <div className="input-glow" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <div className="input-container">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                  disabled={isLoading}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="select-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="input-glow" />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button 
              onClick={handleLogin}
              className="login-button"
              disabled={isLoading}
            >
              {isLoading && <span className="loading-spinner" />}
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;