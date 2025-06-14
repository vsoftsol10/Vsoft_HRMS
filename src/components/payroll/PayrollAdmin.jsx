import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, DollarSign, Calendar, Building } from 'lucide-react';

const PayrollAdmin = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [formData, setFormData] = useState({
    payPeriod: { start: '', end: '', payDate: '' },
    company: {
      name: 'VSoft Solutions',
      address: 'Tirunelveli, TN, India',
      phone: '+91-9876543210',
      email: 'info@thevsoft.com'
    },
    employee: {
      name: '',
      employeeId: '',
      position: '',
      department: 'Engineering',
      email: ''
    },
    salary: {
      basicSalary: 0,
      overtime: 0,
      bonus: 0,
      allowances: 0
    },
    deductions: {
      LeaveDeduction: 0,
      LOP_Deduction: 0,
      Late_Deduction: 0
    }
  });

  // Mock data for initial load
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
        company: {
          name: 'VSoft Solutions',
          address: 'Tirunelveli, TN, India',
          phone: '+91-9876543210',
          email: 'info@thevsoft.com'
        },
        employee: {
          name: 'Vigneshwaran',
          employeeId: 'EMP001',
          position: 'Software Developer',
          department: 'Engineering',
          email: 'vignesh@vsoft.com'
        },
        salary: {
          basicSalary: 30000,
          overtime: 1000,
          bonus: 2000,
          allowances: 3000
        },
        deductions: {
          LeaveDeduction: 0,
          LOP_Deduction: 316,
          Late_Deduction: 100
        }
      },
      {
        id: 2,
        payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
        company: {
          name: 'VSoft Solutions',
          address: 'Tirunelveli, TN, India',
          phone: '+91-9876543210',
          email: 'info@thevsoft.com'
        },
        employee: {
          name: 'Karthik',
          employeeId: 'EMP002',
          position: 'Graphics Designer',
          department: 'Engineering',
          email: 'karthik@vsoft.com'
        },
        salary: {
          basicSalary: 35000,
          overtime: 1000,
          bonus: 2000,
          allowances: 3000
        },
        deductions: {
          LeaveDeduction: 0,
          LOP_Deduction: 316,
          Late_Deduction: 100
        }
      }
    ];
    setPayrolls(mockData);
  }, []);

  const calculateTotal = (salary, deductions) => {
    const totalSalary = salary.basicSalary + salary.overtime + salary.bonus + salary.allowances;
    const totalDeductions = deductions.LeaveDeduction + deductions.LOP_Deduction + deductions.Late_Deduction;
    return totalSalary - totalDeductions;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: section === 'salary' || section === 'deductions' ? Number(value) || 0 : value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPayroll) {
      setPayrolls(prev => prev.map(p => 
        p.id === editingPayroll.id ? { ...formData, id: editingPayroll.id } : p
      ));
    } else {
      const newPayroll = {
        ...formData,
        id: Date.now()
      };
      setPayrolls(prev => [...prev, newPayroll]);
    }
    
    closeModal();
  };

  const handleEdit = (payroll) => {
    setEditingPayroll(payroll);
    setFormData(payroll);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payroll?')) {
      setPayrolls(prev => prev.filter(p => p.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPayroll(null);
    setFormData({
      payPeriod: { start: '', end: '', payDate: '' },
      company: {
        name: 'VSoft Solutions',
        address: 'Tirunelveli, TN, India',
        phone: '+91-9876543210',
        email: 'info@thevsoft.com'
      },
      employee: {
        name: '',
        employeeId: '',
        position: '',
        department: 'Engineering',
        email: ''
      },
      salary: {
        basicSalary: 0,
        overtime: 0,
        bonus: 0,
        allowances: 0
      },
      deductions: {
        LeaveDeduction: 0,
        LOP_Deduction: 0,
        Late_Deduction: 0
      }
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f3f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #80407c 0%, #6d356a 100%)',
        color: 'white',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(128, 64, 124, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Building size={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>VSoft Solutions</h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>Payroll Management System</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: '#d8c8d8',
              color: '#80407c',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c8b8c8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d8c8d8'}
          >
            <Plus size={20} />
            Add New Payroll
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(140, 139, 140, 0.1)',
            border: '1px solid #e8e8e8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: '#80407c', color: 'white', padding: '12px', borderRadius: '8px' }}>
                <Users size={24} />
              </div>
              <div>
                <p style={{ margin: 0, color: '#8c8b8c', fontSize: '14px' }}>Total Employees</p>
                <h3 style={{ margin: 0, color: '#80407c', fontSize: '24px', fontWeight: 'bold' }}>{payrolls.length}</h3>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(140, 139, 140, 0.1)',
            border: '1px solid #e8e8e8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: '#80407c', color: 'white', padding: '12px', borderRadius: '8px' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <p style={{ margin: 0, color: '#8c8b8c', fontSize: '14px' }}>Total Payroll</p>
                <h3 style={{ margin: 0, color: '#80407c', fontSize: '24px', fontWeight: 'bold' }}>
                  ₹{payrolls.reduce((sum, p) => sum + calculateTotal(p.salary, p.deductions), 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(140, 139, 140, 0.1)',
          border: '1px solid #e8e8e8',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e8e8e8' }}>
            <h2 style={{ margin: 0, color: '#80407c', fontSize: '20px', fontWeight: 'bold' }}>Employee Payrolls</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f6f8' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#80407c', fontWeight: 'bold' }}>Employee</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#80407c', fontWeight: 'bold' }}>Position</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#80407c', fontWeight: 'bold' }}>Pay Period</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#80407c', fontWeight: 'bold' }}>Gross Salary</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#80407c', fontWeight: 'bold' }}>Deductions</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#80407c', fontWeight: 'bold' }}>Net Salary</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#80407c', fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => {
                  const grossSalary = payroll.salary.basicSalary + payroll.salary.overtime + payroll.salary.bonus + payroll.salary.allowances;
                  const totalDeductions = payroll.deductions.LeaveDeduction + payroll.deductions.LOP_Deduction + payroll.deductions.Late_Deduction;
                  const netSalary = grossSalary - totalDeductions;
                  
                  return (
                    <tr key={payroll.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#333' }}>{payroll.employee.name}</div>
                          <div style={{ fontSize: '14px', color: '#8c8b8c' }}>{payroll.employee.employeeId}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: '#666' }}>{payroll.employee.position}</td>
                      <td style={{ padding: '16px', color: '#666' }}>
                        {new Date(payroll.payPeriod.start).toLocaleDateString()} - {new Date(payroll.payPeriod.end).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', color: '#28a745', fontWeight: 'bold' }}>₹{grossSalary.toLocaleString()}</td>
                      <td style={{ padding: '16px', color: '#dc3545', fontWeight: 'bold' }}>₹{totalDeductions.toLocaleString()}</td>
                      <td style={{ padding: '16px', color: '#80407c', fontWeight: 'bold', fontSize: '16px' }}>₹{netSalary.toLocaleString()}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(payroll)}
                            style={{
                              backgroundColor: '#d8c8d8',
                              color: '#80407c',
                              border: 'none',
                              padding: '8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c8b8c8'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#d8c8d8'}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(payroll.id)}
                            style={{
                              backgroundColor: '#ffe6e6',
                              color: '#dc3545',
                              border: 'none',
                              padding: '8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#ffd6d6'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ffe6e6'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e8e8e8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#80407c',
              color: 'white',
              borderRadius: '12px 12px 0 0'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>
                {editingPayroll ? 'Edit Payroll' : 'Add New Payroll'}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* Pay Period Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: '#80407c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} />
                  Pay Period
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Start Date</label>
                    <input
                      type="date"
                      value={formData.payPeriod.start}
                      onChange={(e) => handleInputChange('payPeriod', 'start', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>End Date</label>
                    <input
                      type="date"
                      value={formData.payPeriod.end}
                      onChange={(e) => handleInputChange('payPeriod', 'end', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Pay Date</label>
                    <input
                      type="date"
                      value={formData.payPeriod.payDate}
                      onChange={(e) => handleInputChange('payPeriod', 'payDate', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Employee Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: '#80407c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} />
                  Employee Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Employee Name</label>
                    <input
                      type="text"
                      value={formData.employee.name}
                      onChange={(e) => handleInputChange('employee', 'name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Employee ID</label>
                    <input
                      type="text"
                      value={formData.employee.employeeId}
                      onChange={(e) => handleInputChange('employee', 'employeeId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Position</label>
                    <input
                      type="text"
                      value={formData.employee.position}
                      onChange={(e) => handleInputChange('employee', 'position', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Email</label>
                    <input
                      type="email"
                      value={formData.employee.email}
                      onChange={(e) => handleInputChange('employee', 'email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: '#80407c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={20} />
                  Salary Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Basic Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.basicSalary}
                      onChange={(e) => handleInputChange('salary', 'basicSalary', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Overtime (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.overtime}
                      onChange={(e) => handleInputChange('salary', 'overtime', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Bonus (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.bonus}
                      onChange={(e) => handleInputChange('salary', 'bonus', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Allowances (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.allowances}
                      onChange={(e) => handleInputChange('salary', 'allowances', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: '#80407c', marginBottom: '16px' }}>Deductions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Leave Deduction (₹)</label>
                    <input
                      type="number"
                      value={formData.deductions.LeaveDeduction}
                      onChange={(e) => handleInputChange('deductions', 'LeaveDeduction', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>LOP Deduction (₹)</label>
                    <input
                      type="number"
                      value={formData.deductions.LOP_Deduction}
                      onChange={(e) => handleInputChange('deductions', 'LOP_Deduction', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>Late Deduction (₹)</label>
                    <input
                      type="number"
                      value={formData.deductions.Late_Deduction}
                      onChange={(e) => handleInputChange('deductions', 'Late_Deduction', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e8e8e8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #e8e8e8' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#8c8b8c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#7c7b7c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#8c8b8c'}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#80407c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#6d356a'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#80407c'}
                >
                  <Save size={16} />
                  {editingPayroll ? 'Update' : 'Save'} Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollAdmin;