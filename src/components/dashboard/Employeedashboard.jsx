import React, { useState } from 'react';
import "./EmployeeDashboard.css"
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginData, setLoginData] = useState({
    employeeCode: '',
    password: ''
  });
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation =useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.employeeCode || !loginData.password) {
      setLoginError('Please enter both employee code and password');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Call your backend API to authenticate the employee
      const response = await fetch('http://localhost:8000/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeCode: loginData.employeeCode,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful
        setEmployeeInfo(data.employee);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginError('');
      } else {
        // Login failed
        setLoginError(data.message || 'Invalid employee code or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLoginModal(true);
    setLoginData({ employeeCode: '', password: '' });
    setEmployeeInfo(null);
    setLoginError('');
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <div className="login-header">
              <h2>Employee Login</h2>
              <p>Welcome back! Please sign in with your employee credentials.</p>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="employeeCode">Employee Code</label>
                <input
                  type="text"
                  id="employeeCode"
                  name="employeeCode"
                  value={loginData.employeeCode}
                  onChange={handleInputChange}
                  placeholder="Enter your employee code"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {loginError && (
                <div className="login-error">
                  {loginError}
                </div>
              )}
              
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="login-footer">
                <button type="button" className="forgot-password">
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      {isLoggedIn && employeeInfo && (
        <>
          <aside className="sidebar">
            <div className="sidebar-header">
              <h2>HRMS Portal</h2>
              <span className="employee-badge">Employee</span>
            </div>
            <nav className="sidebar-nav">
              <ul>
                <li className="nav-item active">
                  <span className="nav-icon">📊</span>
                  Dashboard
                </li>
                <li className="nav-item">
                  <span className="nav-icon">👤</span>
                  My Profile
                </li>
                <li className="nav-item">
                  <span className="nav-icon">🕒</span>
                  Attendance
                </li>
                <li className="nav-item">
                  <span className="nav-icon">📝</span>
                  Leave Requests
                </li>
                <li className="nav-item" onClick={() => navigation(`/payslip/${employeeInfo.id}`)}>
                  <span className="nav-icon">💰</span>
                  Payslips
                </li>
                <li className="nav-item">
                  <span className="nav-icon">📋</span>
                  Policies
                </li>
                
              </ul>
            </nav>
            <div className="sidebar-footer">
              <div className="employee-info">
                <div className="employee-avatar">
                  {employeeInfo.name.charAt(0).toUpperCase()}
                </div>
                <div className="employee-details">
                  <span className="employee-name">{employeeInfo.name}</span>
                  <span className="employee-id">ID: {employeeInfo.employeeId}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          </aside>

          <main className="dashboard-main">
            <header className="dashboard-header">
              <div className="header-content">
                <h1>Welcome back, {employeeInfo.name}! 👋</h1>
                {/* <p>Here's your work summary and quick actions for today</p> */}
                <div className="employee-meta">
                  {/* <span className="employee-position">{employeeInfo.position}</span> */}
                  {/* <span className="employee-department">{employeeInfo.department}</span> */}
                </div>
              </div>
              <div className="header-actions">
                <div className="current-time">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <button className="clock-in-btn">Clock In</button>
              </div>
            </header>

            <section className="dashboard-cards">
              <div className="dashboard-card present-days">
                <div className="card-icon">📅</div>
                <div className="card-content">
                  <h3>Present Days</h3>
                  <p>18</p>
                  <span className="card-subtitle">This month</span>
                </div>
              </div>
              <div className="dashboard-card leaves-taken">
                <div className="card-icon">🏖️</div>
                <div className="card-content">
                  <h3>Leaves Taken</h3>
                  <p>2</p>
                  <span className="card-subtitle">This month</span>
                </div>
              </div>
              <div className="dashboard-card upcoming-holidays">
                <div className="card-icon">🎉</div>
                <div className="card-content">
                  <h3>Upcoming Holidays</h3>
                  <p>3</p>
                  <span className="card-subtitle">Next 30 days</span>
                </div>
              </div>
              <div className="dashboard-card last-payslip">
                <div className="card-icon">💸</div>
                <div className="card-content">
                  <h3>Last Payslip</h3>
                  <p>₹{employeeInfo.lastSalary ? employeeInfo.lastSalary.toLocaleString() : '45,000'}</p>
                  <span className="card-subtitle">Last month</span>
                </div>
              </div>
            </section>

            <div className="dashboard-content">
              <section className="recent-activity">
                <div className="section-header">
                  <h2>Recent Updates</h2>
                  <button className="view-all-btn">View All</button>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon success">✅</div>
                    <div className="activity-content">
                      <h4>Attendance Marked</h4>
                      <p>Successfully marked attendance for today</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon approved">✅</div>
                    <div className="activity-content">
                      <h4>Leave Request Approved</h4>
                      <p>Your leave request for June 20-22 has been approved</p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon info">📄</div>
                    <div className="activity-content">
                      <h4>Payslip Available</h4>
                      <p>Latest payslip is ready for download</p>
                      <span className="activity-time">3 days ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon holiday">🎉</div>
                    <div className="activity-content">
                      <h4>Holiday Announcement</h4>
                      <p>Company holiday scheduled for June 15, 2024</p>
                      <span className="activity-time">1 week ago</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="quick-actions">
                <div className="section-header">
                  <h2>Quick Actions</h2>
                </div>
                <div className="actions-grid">
                  <button className="action-btn">
                    <span className="action-icon">📝</span>
                    <span>Apply Leave</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📊</span>
                    <span>View Reports</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">💬</span>
                    <span>Contact HR</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">⚙️</span>
                    <span>Settings</span>
                  </button>
                </div>
              </section>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;