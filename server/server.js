const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// MySQL Database Configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',     // Replace with your MySQL username
  password: 'SimeDarby@9095', // Replace with your MySQL password
  database: 'hrms_systems',          // Replace with your database name
  port: 3306
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error.message);
  }
}

// Initialize database connection
testConnection();

// Create payrolls table if it doesn't exist
async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS payrolls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pay_period_start DATE NOT NULL,
        pay_period_end DATE NOT NULL,
        pay_date DATE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        company_address TEXT,
        company_phone VARCHAR(20),
        company_email VARCHAR(255),
        employee_name VARCHAR(255) NOT NULL,
        employee_id VARCHAR(50) NOT NULL UNIQUE,
        position VARCHAR(255),
        department VARCHAR(255),
        employee_email VARCHAR(255),
        basic_salary DECIMAL(10,2) DEFAULT 0,
        overtime DECIMAL(10,2) DEFAULT 0,
        bonus DECIMAL(10,2) DEFAULT 0,
        allowances DECIMAL(10,2) DEFAULT 0,
        leave_deduction DECIMAL(10,2) DEFAULT 0,
        lop_deduction DECIMAL(10,2) DEFAULT 0,
        late_deduction DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await pool.execute(createTableQuery);
    console.log('✅ Payrolls table created/verified successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  }
}

// Initialize database
initializeDatabase();

// GET API - Fetch all payrolls
app.get('/api/payroll', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM payrolls ORDER BY created_at DESC');
    
    // Transform database rows to match frontend expected format
    const payrolls = rows.map(row => ({
      id: row.id,
      payPeriod: {
        start: row.pay_period_start,
        end: row.pay_period_end,
        payDate: row.pay_date
      },
      company: {
        name: row.company_name,
        address: row.company_address,
        phone: row.company_phone,
        email: row.company_email
      },
      employee: {
        name: row.employee_name,
        employeeId: row.employee_id,
        position: row.position,
        department: row.department,
        email: row.employee_email
      },
      salary: {
        basicSalary: parseFloat(row.basic_salary),
        overtime: parseFloat(row.overtime),
        bonus: parseFloat(row.bonus),
        allowances: parseFloat(row.allowances)
      },
      deductions: {
        LeaveDeduction: parseFloat(row.leave_deduction),
        LOP_Deduction: parseFloat(row.lop_deduction),
        Late_Deduction: parseFloat(row.late_deduction)
      }
    }));
    
    res.json(payrolls);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res.status(500).json({ message: 'Error fetching payrolls', error: error.message });
  }
});

// GET API - Fetch single payroll by ID
app.get('/api/payroll/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await pool.execute('SELECT * FROM payrolls WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    
    const row = rows[0];
    const payroll = {
      id: row.id,
      payPeriod: {
        start: row.pay_period_start,
        end: row.pay_period_end,
        payDate: row.pay_date
      },
      company: {
        name: row.company_name,
        address: row.company_address,
        phone: row.company_phone,
        email: row.company_email
      },
      employee: {
        name: row.employee_name,
        employeeId: row.employee_id,
        position: row.position,
        department: row.department,
        email: row.employee_email
      },
      salary: {
        basicSalary: parseFloat(row.basic_salary),
        overtime: parseFloat(row.overtime),
        bonus: parseFloat(row.bonus),
        allowances: parseFloat(row.allowances)
      },
      deductions: {
        LeaveDeduction: parseFloat(row.leave_deduction),
        LOP_Deduction: parseFloat(row.lop_deduction),
        Late_Deduction: parseFloat(row.late_deduction)
      }
    };
    
    res.json(payroll);
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ message: 'Error fetching payroll', error: error.message });
  }
});

// POST API - Create new payroll
app.post('/api/payroll', async (req, res) => {
  try {
    const { payPeriod, company, employee, salary, deductions } = req.body;
    
    const insertQuery = `
      INSERT INTO payrolls (
        pay_period_start, pay_period_end, pay_date,
        company_name, company_address, company_phone, company_email,
        employee_name, employee_id, position, department, employee_email,
        basic_salary, overtime, bonus, allowances,
        leave_deduction, lop_deduction, late_deduction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      payPeriod.start, payPeriod.end, payPeriod.payDate,
      company.name, company.address, company.phone, company.email,
      employee.name, employee.employeeId, employee.position, employee.department, employee.email,
      salary.basicSalary, salary.overtime, salary.bonus, salary.allowances,
      deductions.LeaveDeduction, deductions.LOP_Deduction, deductions.Late_Deduction
    ];
    
    const [result] = await pool.execute(insertQuery, values);
    
    // Fetch the created payroll to return
    const [newPayroll] = await pool.execute('SELECT * FROM payrolls WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: 'Payroll created successfully',
      id: result.insertId,
      payroll: newPayroll[0]
    });
  } catch (error) {
    console.error('Error creating payroll:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Employee ID already exists' });
    } else {
      res.status(500).json({ message: 'Error creating payroll', error: error.message });
    }
  }
});

// PUT API - Update payroll
app.put('/api/payroll/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { payPeriod, company, employee, salary, deductions } = req.body;
    
    const updateQuery = `
      UPDATE payrolls SET
        pay_period_start = ?, pay_period_end = ?, pay_date = ?,
        company_name = ?, company_address = ?, company_phone = ?, company_email = ?,
        employee_name = ?, employee_id = ?, position = ?, department = ?, employee_email = ?,
        basic_salary = ?, overtime = ?, bonus = ?, allowances = ?,
        leave_deduction = ?, lop_deduction = ?, late_deduction = ?
      WHERE id = ?
    `;
    
    const values = [
      payPeriod.start, payPeriod.end, payPeriod.payDate,
      company.name, company.address, company.phone, company.email,
      employee.name, employee.employeeId, employee.position, employee.department, employee.email,
      salary.basicSalary, salary.overtime, salary.bonus, salary.allowances,
      deductions.LeaveDeduction, deductions.LOP_Deduction, deductions.Late_Deduction,
      id
    ];
    
    const [result] = await pool.execute(updateQuery, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    
    // Fetch updated payroll
    const [updatedPayroll] = await pool.execute('SELECT * FROM payrolls WHERE id = ?', [id]);
    
    res.json({
      message: 'Payroll updated successfully',
      payroll: updatedPayroll[0]
    });
  } catch (error) {
    console.error('Error updating payroll:', error);
    res.status(500).json({ message: 'Error updating payroll', error: error.message });
  }
});

// DELETE API - Delete payroll
app.delete('/api/payroll/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const [result] = await pool.execute('DELETE FROM payrolls WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    
    res.status(200).json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({ message: 'Error deleting payroll', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 Make sure your MySQL database is running!`);
});