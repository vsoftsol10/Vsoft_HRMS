import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, X } from 'lucide-react';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation - in real app, you'd authenticate with backend
    if (loginData.username === 'admin' && loginData.password === 'admin01') {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              color: '#2e3a59',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>HRMS Admin Login</h2>
            <p style={{
              color: '#666',
              fontSize: '14px'
            }}>Please sign in to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '500'
              }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }} size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 45px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3f51b5'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '500'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 45px 12px 45px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3f51b5'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '0'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#303f9f'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3f51b5'}
            >
              Sign In
            </button>
          </form>
            
          <div style={{ textAlign: 'center' }}>
            <a href="#" style={{
              color: '#3f51b5',
              textDecoration: 'none',
              fontSize: '14px'
            }}>Forgot Password?</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f8f9fa'
    }}>
      <aside style={{
        width: '260px',
        backgroundColor: '#2e3a59',
        color: 'white',
        padding: '0',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '30px 25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '22px',
            color: '#ffca28',
            fontWeight: '700',
            margin: 0
          }}>HRMS Admin</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {['Dashboard', 'Employees', 'Attendance', 'Leaves', 'Payroll', 'Intern Portal', 'Settings'].map((item, index) => (
              <li key={item} style={{
                margin: '4px 0'
              }}>
                {item === 'Payroll' ? (
                  <a href="/payrollAdmin" style={{
                    display: 'block',
                    padding: '14px 25px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    borderLeft: '4px solid transparent'
                  }}>
                    {item}
                  </a>
                ) : (
                  <span style={{
                    display: 'block',
                    padding: '14px 25px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    borderLeft: index === 0 ? '4px solid #ffca28' : '4px solid transparent',
                    backgroundColor: index === 0 ? 'rgba(255, 202, 40, 0.1)' : 'transparent',
                    color: index === 0 ? '#ffca28' : 'white'
                  }}>
                    {item}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <div style={{
          padding: '20px 25px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={{
        marginLeft: '260px',
        padding: '30px',
        flex: 1
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '35px',
          padding: '0 5px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              color: '#2e3a59',
              marginBottom: '5px',
              fontWeight: '600'
            }}>Welcome, Admin</h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: 0
            }}>Here's a quick overview of your system</p>
          </div>
          <div style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Admin Portal
          </div>
        </header>

        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {[
            { title: 'Total Employees', value: '48', icon: '👥', color: '#3f51b5' },
            { title: 'Active Interns', value: '12', icon: '🎓', color: '#4caf50' },
            { title: 'Pending Leaves', value: '6', icon: '📅', color: '#ff9800' },
            { title: 'Payroll Pending', value: '3', icon: '💰', color: '#f44336' }
          ].map((card, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: card.color
              }}></div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '12px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>{card.title}</h3>
                  <p style={{
                    fontSize: '32px',
                    color: card.color,
                    fontWeight: '700',
                    margin: 0,
                    lineHeight: '1'
                  }}>{card.value}</p>
                </div>
                <div style={{
                  fontSize: '32px',
                  opacity: 0.3
                }}>{card.icon}</div>
              </div>
            </div>
          ))}
        </section>

        <section style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '20px',
              color: '#2e3a59',
              fontWeight: '600',
              margin: 0
            }}>Recent Activity</h2>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              color: '#3f51b5',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e3f2fd';
              e.target.style.borderColor = '#3f51b5';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#e1e5e9';
            }}>
              View All
            </button>
          </div>
          
          <div>
            {[
              { icon: '✅', text: 'John marked attendance', time: '2 hours ago', type: 'success' },
              { icon: '📝', text: 'Priya applied for leave', time: '4 hours ago', type: 'info' },
              { icon: '📄', text: 'Kumar generated payslip', time: '6 hours ago', type: 'warning' },
              { icon: '📢', text: 'Intern feedback submitted', time: '1 day ago', type: 'info' }
            ].map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: activity.type === 'success' ? '#e8f5e8' : 
                                  activity.type === 'warning' ? '#fff3e0' : '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '16px'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: '#333',
                    fontSize: '15px',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>{activity.text}</p>
                  <span style={{
                    color: '#999',
                    fontSize: '13px'
                  }}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;