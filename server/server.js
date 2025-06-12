
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const payrolls = [
  {
    id: 1,
    payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
    company: {
      name: 'VSoft Solutions',
      address: 'Tirunelveli, TN, India',
      phone: '+91-9876543210',
      email: 'hr@vsoftsolutions.com'
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
      tax: 5000,
      insurance: 1500,
      retirement: 2000,
      other: 500
    },
    netPay: 28000
  },
  {
    id: 2,
    payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
    company: {
      name: 'VSoft Solutions',
      address: 'Tirunelveli, TN, India',
      phone: '+91-9876543210',
      email: 'hr@vsoftsolutions.com'
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
      tax: 5000,
      insurance: 1500,
      retirement: 2000,
      other: 500
    },
    netPay: 32000
  },
  {
    id: 3,
    payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
    company: {
      name: 'VSoft Solutions',
      address: 'Tirunelveli, TN, India',
      phone: '+91-9876543210',
      email: 'hr@vsoftsolutions.com'
    },
    employee: {
      name: 'Hameed Sufiyan',
      employeeId: 'EMP003',
      position: 'Digital Marketing Manager',
      department: 'Engineering',
      email: 'sufiyan@vsoft.com'
    },
    salary: {
      basicSalary: 45000,
      overtime: 500,
      bonus: 1500,
      allowances: 3000
    },
    deductions: {
      tax: 5000,
      insurance: 1500,
      retirement: 2000,
      other: 500
    },
    netPay: 41000
  },
  {
    id: 4,
    payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
    company: {
      name: 'VSoft Solutions',
      address: 'Tirunelveli, TN, India',
      phone: '+91-9876543210',
      email: 'hr@vsoftsolutions.com'
    },
    employee: {
      name: 'Nirmal',
      employeeId: 'EMP004',
      position: 'Application Developer',
      department: 'Engineering',
      email: 'nirmal@vsoft.com'
    },
    salary: {
      basicSalary: 30000,
      overtime: 1000,
      bonus: 2000,
      allowances: 3000
    },
    deductions: {
      tax: 5000,
      insurance: 1500,
      retirement: 2000,
      other: 500
    },
    netPay: 27000
  }
];

// API route
app.get('/api/payroll/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const payroll = payrolls.find(p => p.id === id);
  if (payroll) {
    res.json(payroll);
  } else {
    res.status(404).json({ message: 'Payroll not found' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
