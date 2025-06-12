import React, { useState } from 'react';
import './InternDashboard.css';

// You can replace these with actual icons from react-icons or any icon library
const MenuIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const HomeIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>;
const TaskIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3 8-8"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c.9 0 1.77.13 2.6.37"></path></svg>;
const CertificateIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"></polyline></svg>;
const UserIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const BellIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const DownloadIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const TrendingIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline><polyline points="17,6 23,6 23,12"></polyline></svg>;

const InternDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'tasks', label: 'Tasks', icon: TaskIcon },
    { id: 'certificate', label: 'Certificate', icon: CertificateIcon },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingIcon },
    { id: 'my-tasks', label: 'My Tasks', icon: TaskIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
  ];

  const upcomingDeadlines = [
    { task: 'Complete Module 3', due: 'Tomorrow', priority: 'high' },
    { task: 'Submit Assignment', due: '3 days', priority: 'medium' },
    { task: 'Peer Review', due: '1 week', priority: 'low' },
  ];

  const assignedTasks = [
    { id: 1, title: 'Introduction to React', status: 'completed', progress: 100 },
    { id: 2, title: 'Component Lifecycle', status: 'completed', progress: 100 },
    { id: 3, title: 'State Management', status: 'in-progress', progress: 60 },
    { id: 4, title: 'API Integration', status: 'pending', progress: 0 },
    { id: 5, title: 'Testing & Deployment', status: 'pending', progress: 0 },
  ];

  const completedTasks = assignedTasks.filter(task => task.status === 'completed').length;
  const totalTasks = assignedTasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <div className="logo">EduPlatform</div>
          </div>

          <div className="navbar-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="navbar-right">
            <div className="notification-btn">
              <BellIcon />
              <div className="notification-dot"></div>
            </div>
            <button className="profile-btn">
              <div className="profile-avatar">
                <UserIcon />
              </div>
              <span className="profile-name">John Doe</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${sidebarOpen ? 'open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
                className={`mobile-nav-item ${activeNav === item.id ? 'active' : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-content">
            <h3 className="sidebar-title">Navigation</h3>
            <div className="sidebar-menu">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} className="sidebar-item">
                    <Icon />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Welcome Message */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, John! 👋</h1>
            <p className="welcome-subtitle">Ready to continue your learning journey?</p>
          </div>

          {/* Progress Summary Card */}
          <div className="progress-card">
            <div className="progress-header">
              <h3>Progress Summary</h3>
              <span className="progress-text">{completedTasks}/{totalTasks} tasks complete</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="progress-percentage">{Math.round(progressPercentage)}% Complete</p>
          </div>

          {/* Upcoming Deadlines */}
          <div className="deadlines-card">
            <h3 className="card-title">Upcoming Deadlines</h3>
            <div className="deadlines-list">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className={`deadline-item ${deadline.priority}`}>
                  <div className="deadline-info">
                    <h4>{deadline.task}</h4>
                    <span className="deadline-due">Due: {deadline.due}</span>
                  </div>
                  <div className={`priority-badge ${deadline.priority}`}>
                    {deadline.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="tasks-card">
            <h3 className="card-title">Assigned Modules/Tasks</h3>
            <div className="tasks-list">
              {assignedTasks.map((task) => (
                <div key={task.id} className={`task-item ${task.status}`}>
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <div className="task-progress-bar">
                      <div 
                        className="task-progress-fill" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="task-progress-text">{task.progress}%</span>
                  </div>
                  <div className={`status-badge ${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Certificate */}
          <div className="certificate-card">
            <div className="certificate-content">
              <div className="certificate-info">
                <h3>Certificate Available</h3>
                <p>Congratulations! You've completed enough modules to earn your certificate.</p>
              </div>
              <button className="download-btn">
                <DownloadIcon />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;