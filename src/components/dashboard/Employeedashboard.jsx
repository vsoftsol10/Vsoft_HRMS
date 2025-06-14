import React from 'react';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <aside className="sidebar">
        <h2>HRMS Employee</h2>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>My Profile</li>
            <li>Attendance</li>
            <li>Leave Requests</li>
            <li>Payslips</li>
            <li>Policies</li>
            <li>Support</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, Nirmal 👋</h1>
          <p>Your work summary and quick actions</p>
        </header>

        <section className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Present Days</h3>
            <p>18</p>
          </div>
          <div className="dashboard-card">
            <h3>Leaves Taken</h3>
            <p>2</p>
          </div>
          <div className="dashboard-card">
            <h3>Upcoming Holidays</h3>
            <p>3</p>
          </div>
          <div className="dashboard-card">
            <h3>Last Payslip</h3>
            <p>₹45,000</p>
          </div>
        </section>

        <section className="recent-activity">
          <h2>Recent Updates</h2>
          <ul>
            <li>✅ Attendance marked for today</li>
            <li>📝 Leave approved by HR</li>
            <li>📄 Payslip for May downloaded</li>
            <li>🎉 Company holiday on June 15</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
