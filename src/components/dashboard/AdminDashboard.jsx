import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>HRMS Admin</h2>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Employees</li>
            <li>Attendance</li>
            <li>Leaves</li>
            <li><a href="/payrollAdmin" style={{textDecoration:"none", color:"white"}}>Payroll</a></li>
            <li>Intern Portal</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, Admin</h1>
          <p>Here’s a quick overview of your system</p>
        </header>

        <section className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Employees</h3>
            <p>48</p>
          </div>
          <div className="dashboard-card">
            <h3>Active Interns</h3>
            <p>12</p>
          </div>
          <div className="dashboard-card">
            <h3>Pending Leaves</h3>
            <p>6</p>
          </div>
          <div className="dashboard-card">
            <h3>Payroll Pending</h3>
            <p>3</p>
          </div>
        </section>

        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            <li>✅ John marked attendance</li>
            <li>📝 Priya applied for leave</li>
            <li>📄 Kumar generated payslip</li>
            <li>📢 Intern feedback submitted</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
