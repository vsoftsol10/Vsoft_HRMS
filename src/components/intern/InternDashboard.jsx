import React, { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Award, 
  Home, 
  User, 
  FileText, 
  Trophy, 
  Bell, 
  HelpCircle, 
  LogOut,
  Download,
  Eye,
  Upload,
  MessageCircle
} from 'lucide-react';

const InternDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  
  // Sample data
  const internData = {
    name: "Alex Johnson",
    profilePhoto: null,
    trainingEndDate: "August 15, 2025",
    tasksCompleted: 6,
    totalTasks: 10,
    daysRemaining: 14,
    upcomingDeadline: "July 2 – Task 3",
    certificateProgress: 80
  };

  const tasks = [
    { id: 1, title: "Complete Orientation Module", assignedDate: "2025-06-01", dueDate: "2025-06-05", status: "Approved" },
    { id: 2, title: "Project Planning Document", assignedDate: "2025-06-06", dueDate: "2025-06-15", status: "Completed" },
    { id: 3, title: "Mid-term Presentation", assignedDate: "2025-06-16", dueDate: "2025-07-02", status: "In Progress" },
    { id: 4, title: "Code Review Session", assignedDate: "2025-06-20", dueDate: "2025-07-10", status: "Pending" },
    { id: 5, title: "Final Project Submission", assignedDate: "2025-07-01", dueDate: "2025-08-01", status: "Pending" },
  ];

  const timelineSteps = [
    { title: "Training Start", date: "June 1, 2025", status: "completed" },
    { title: "Basic Tasks", date: "June 15, 2025", status: "completed" },
    { title: "Mid-review", date: "July 15, 2025", status: "current" },
    { title: "Final Project", date: "August 1, 2025", status: "upcoming" },
    { title: "Certificate Issued", date: "August 15, 2025", status: "upcoming" }
  ];

  const announcements = [
    "Project submission deadline extended to July 5.",
    "New training materials available in the resources section.",
    "Monthly intern meet-up scheduled for July 20th."
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-gray-500';
      case 'In Progress': return 'bg-purple-600';
      case 'Completed': return 'bg-green-500';
      case 'Approved': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'tasks', icon: FileText, label: 'My Tasks' },
    { id: 'certificates', icon: Trophy, label: 'Certificates' },
    { id: 'announcements', icon: Bell, label: 'Announcements' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
    { id: 'logout', icon: LogOut, label: 'Logout' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Intern Portal</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeNav === item.id ? 'bg-purple-50 border-r-3 border-purple-600 text-purple-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Welcome Banner */}
        <div className="bg-purple-700 text-white p-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {internData.profilePhoto ? (
                <img src={internData.profilePhoto} alt="Profile" className="w-full h-full rounded-full" />
              ) : (
                internData.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {internData.name}!</h1>
              <p className="text-purple-200 mt-1">Your training ends on: {internData.trainingEndDate}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-purple-700 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Tasks Completed</h3>
                  <p className="text-2xl font-bold mt-2">{internData.tasksCompleted} of {internData.totalTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Days Remaining</h3>
                  <p className="text-2xl font-bold mt-2">{internData.daysRemaining} Days Left</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Upcoming Deadline</h3>
                  <p className="text-sm font-bold mt-2">{internData.upcomingDeadline}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gray-500 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Certificate Progress</h3>
                  <p className="text-2xl font-bold mt-2">{internData.certificateProgress}% Complete</p>
                </div>
                <Award className="w-8 h-8 text-gray-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Status Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Task Status</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Task Title</th>
                        <th className="text-left py-2">Assigned Date</th>
                        <th className="text-left py-2">Due Date</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">{task.title}</td>
                          <td className="py-3">{task.assignedDate}</td>
                          <td className="py-3">{task.dueDate}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Upload className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Announcements */}
              <div className="bg-purple-500 text-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4">📢 Announcements</h2>
                <div className="space-y-3">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="bg-purple-400 bg-opacity-50 p-3 rounded">
                      <p className="text-sm">{announcement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🎓 Certificate</h2>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{internData.certificateProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div 
                      className="bg-purple-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${internData.certificateProgress}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded ${
                    internData.certificateProgress === 100 
                      ? 'bg-purple-700 text-white hover:bg-purple-800' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={internData.certificateProgress !== 100}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Complete all tasks to unlock your certificate
                </p>
              </div>

              {/* Help & Support */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">💬 Help & Support</h2>
                <div className="space-y-3">
                  <a href="mailto:intern.support@yourcompany.com" className="block text-purple-600 hover:text-purple-800">
                    📧 intern.support@yourcompany.com
                  </a>
                  <button className="block text-purple-600 hover:text-purple-800">
                    📚 FAQ / Help Docs
                  </button>
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-800">
                    <MessageCircle className="w-4 h-4" />
                    <span>Live Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress Timeline */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🛣️ Training Progress Timeline</h2>
            <div className="flex flex-wrap justify-between items-center">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                    step.status === 'completed' ? 'bg-purple-700' : 
                    step.status === 'current' ? 'bg-purple-500' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-sm text-center">{step.title}</h3>
                  <p className="text-xs text-gray-500 text-center">{step.date}</p>
                  {index < timelineSteps.length - 1 && (
                    <div className="hidden lg:block w-20 h-0.5 bg-gray-300 mt-6 absolute" style={{left: `${(index + 1) * 20}%`}}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;