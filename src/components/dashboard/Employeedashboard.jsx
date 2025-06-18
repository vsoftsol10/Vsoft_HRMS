import React, { useState, useEffect } from 'react';
import "./EmployeeDashboard.css"
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedEmployeeInfo = localStorage.getItem('employeeInfo');

    if (isLoggedIn === 'true' && storedEmployeeInfo) {
      setEmployeeInfo(JSON.parse(storedEmployeeInfo));
      setIsLoading(false);
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);
  // Handle navigation to My Profile
const handleMyProfileClick = () => {
  if (employeeInfo && employeeInfo.employeeId) {
    navigate(`/profile/${employeeInfo.employeeId}`);
  }
};

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('employeeInfo');
    
    // Redirect to login
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!employeeInfo) {
    return null; // Will redirect to login
  }

  return (
    <div className="employee-dashboard">
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
            <li className="nav-item" onClick={handleMyProfileClick}>
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
            <li
              className="nav-item"
              onClick={() => navigate(`/payslip/${employeeInfo.id}`)}
            >
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
            <div className="employee-meta">
              {/* <span className="employee-position">{employeeInfo.position}</span> */}
              {/* <span className="employee-department">{employeeInfo.department}</span> */}
            </div>
          </div>
          <div className="header-actions">
            <div className="current-time">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
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
              <p>
                ₹
                {employeeInfo.lastSalary
                  ? employeeInfo.lastSalary.toLocaleString()
                  : "45,000"}
              </p>
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
    </div>
  );
};

export default EmployeeDashboard;