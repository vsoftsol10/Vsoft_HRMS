import React, { useState, useEffect } from 'react';
import { Download, Printer, Mail, Calendar, User, Building, DollarSign } from 'lucide-react';
import './PayslipGenerator.css';
import payrollService from '../../services/PayrollServies';

const PayslipGenerator = ({ payrollId, onClose }) => {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchPayroll = async () => {
    try {
      setLoading(true);
      console.log('Fetching payroll with ID:', payrollId);
      const data = await payrollService.getPayrollById(payrollId);
      console.log('Fetched payroll:', data);
      setPayroll(data);
      console.log("Received payrollId:", payrollId);

    } catch (err) {
      console.error('Error fetching payroll:', err);
      setError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  if (payrollId) {
    fetchPayroll();
  }
}, [payrollId]);


  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Convert to PDF or implement download logic
    alert('Download functionality would be implemented here');
  };

  const handleEmail = () => {
    if (payroll?.employee?.email) {
      const subject = `Payslip for ${payroll.payPeriod.start} to ${payroll.payPeriod.end}`;
      const body = `Dear ${payroll.employee.name},\n\nPlease find your payslip attached.\n\nBest regards,\nHR Department`;
      window.open(`mailto:${payroll.employee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="payslip-overlay">
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading payslip...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payslip-overlay">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Error</h3>
            <p className="error-message">{error}</p>
            <button onClick={onClose} className="error-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payroll) return null;

  const totalEarnings = payroll.salary.basicSalary + 
                       payroll.salary.overtime + 
                       payroll.salary.bonus + 
                       payroll.salary.allowances;

  const totalDeductions = payroll.deductions.tax + 
                         payroll.deductions.insurance + 
                         payroll.deductions.retirement + 
                         payroll.deductions.other;

  return (
    <div className="payslip-overlay">
      <div className="payslip-container">
        {/* Header with actions */}
        <div className="payslip-header">
          <h2 className="payslip-title">Payslip Generator</h2>
          <div className="action-buttons">
            <button onClick={handlePrint} className="action-btn print-btn">
              <Printer className="btn-icon" />
              Print
            </button>
            <button onClick={handleDownload} className="action-btn download-btn">
              <Download className="btn-icon" />
              Download
            </button>
            <button onClick={handleEmail} className="action-btn email-btn">
              <Mail className="btn-icon" />
              Email
            </button>
            <button onClick={onClose} className="action-btn close-btn">
              Close
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div className="payslip-content">
          {/* Company Header */}
          <div className="company-header">
            <div className="company-title">
              <Building className="company-icon" />
              <h1 className="company-name">{payroll.company.name}</h1>
            </div>
            <p className="company-address">{payroll.company.address}</p>
            <p className="company-contact">{payroll.company.phone} • {payroll.company.email}</p>
            <h2 className="payroll-statement-title">PAYROLL STATEMENT</h2>
          </div>

          {/* Employee and Pay Period Info */}
          <div className="info-grid">
            <div className="info-section">
              <h3 className="section-title">
                <User className="section-icon" />
                Employee Information
              </h3>
              <div className="info-details">
                <p><span className="label">Name:</span> {payroll.employee.name}</p>
                <p><span className="label">Employee ID:</span> {payroll.employee.employeeId}</p>
                <p><span className="label">Position:</span> {payroll.employee.position}</p>
                <p><span className="label">Department:</span> {payroll.employee.department}</p>
                <p><span className="label">Email:</span> {payroll.employee.email}</p>
              </div>
            </div>
            <div className="info-section">
              <h3 className="section-title">
                <Calendar className="section-icon" />
                Pay Period Information
              </h3>
              <div className="info-details">
                <p><span className="label">Pay Period:</span> {formatDate(payroll.payPeriod.start)} - {formatDate(payroll.payPeriod.end)}</p>
                <p><span className="label">Pay Date:</span> {formatDate(payroll.payPeriod.payDate)}</p>
              </div>
            </div>
          </div>

          {/* Earnings and Deductions */}
          <div className="earnings-deductions-grid">
            {/* Earnings */}
            <div className="earnings-section">
              <h3 className="earnings-title">
                <DollarSign className="section-icon" />
                Earnings
              </h3>
              <div className="earnings-details">
                <div className="earnings-row">
                  <span>Basic Salary</span>
                  <span className="amount">{formatCurrency(payroll.salary.basicSalary)}</span>
                </div>
                <div className="earnings-row">
                  <span>Overtime</span>
                  <span className="amount">{formatCurrency(payroll.salary.overtime)}</span>
                </div>
                <div className="earnings-row">
                  <span>Bonus</span>
                  <span className="amount">{formatCurrency(payroll.salary.bonus)}</span>
                </div>
                <div className="earnings-row">
                  <span>Allowances</span>
                  <span className="amount">{formatCurrency(payroll.salary.allowances)}</span>
                </div>
                <div className="earnings-total">
                  <span>Total Earnings</span>
                  <span className="total-amount">{formatCurrency(totalEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="deductions-section">
              <h3 className="deductions-title">
                <DollarSign className="section-icon" />
                Deductions
              </h3>
              <div className="deductions-details">
                <div className="deductions-row">
                  <span>Income Tax (TDS)</span>
                  <span className="amount">{formatCurrency(payroll.deductions.tax)}</span>
                </div>
                <div className="deductions-row">
                  <span>Health Insurance</span>
                  <span className="amount">{formatCurrency(payroll.deductions.insurance)}</span>
                </div>
                <div className="deductions-row">
                  <span>Provident Fund (PF)</span>
                  <span className="amount">{formatCurrency(payroll.deductions.retirement)}</span>
                </div>
                <div className="deductions-row">
                  <span>Other Deductions</span>
                  <span className="amount">{formatCurrency(payroll.deductions.other)}</span>
                </div>
                <div className="deductions-total">
                  <span>Total Deductions</span>
                  <span className="total-amount">{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="net-pay-section">
            <h3 className="net-pay-title">Net Pay</h3>
            <p className="net-pay-amount">{formatCurrency(payroll.netPay)}</p>
            <p className="net-pay-description">Amount to be deposited to your account</p>
          </div>

          {/* Footer */}
          <div className="payslip-footer">
            <p>This is a computer-generated payslip and does not require a signature.</p>
            <p>For any queries, please contact HR at {payroll.company.email}</p>
            <p className="generated-date">Generated on {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;