const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT ||5000;

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

// Add this route handler before your other routes or after your existing routes
// This should go before app.listen()

// Root route - API Status endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'VSOFT HRMS API Server is running successfully!',
    status: 'active',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: [
      'GET /api/payroll - Fetch all payrolls',
      'GET /api/payroll/:id - Fetch single payroll',
      'POST /api/payroll - Create new payroll',
      'PUT /api/payroll/:id - Update payroll',
      'DELETE /api/payroll/:id - Delete payroll',
      'POST /api/authenticate - Employee authentication',
      'GET /api/employee/:employeeId/dashboard - Employee dashboard',
      'GET /api/employees - Fetch all employees',
      'GET /api/employees/:id - Fetch single employee',
      'POST /api/employees - Create new employee',
      'PUT /api/employees/:id - Update employee',
      'DELETE /api/employees/:id - Delete employee',
      'GET /api/departments - Fetch departments',
      'GET /api/positions - Fetch positions',
      'GET /api/managers - Fetch managers',
      'GET /api/profile/:employeeCode - Fetch employee profile',
      'PUT /api/profile/:employeeCode - Update employee profile'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'VSOFT HRMS API',
    version: '1.0.0',
    documentation: 'API endpoints for HRMS system',
    base_url: req.protocol + '://' + req.get('host')
  });
});


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



//Authentication

// Add this authentication endpoint to your existing backend code

// POST API - Employee Authentication
app.post('/api/authenticate', async (req, res) => {
  try {
    const { employeeCode, password } = req.body;
    
    if (!employeeCode || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Employee code and password are required' 
      });
    }
    
    // Query to find employee by employee_id (employee code)
    const [rows] = await pool.execute(
      'SELECT * FROM payrolls WHERE employee_id = ? LIMIT 1', 
      [employeeCode]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid employee code or password' 
      });
    }
    
    const employee = rows[0];
    
    // For now, we'll use a simple password check
    // In production, you should hash passwords and compare hashed values
    // For demo purposes, let's assume password should be "password123"
    // You can modify this logic based on your requirements
    
    if (password !== 'password123') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid employee code or password' 
      });
    }
    
    // Calculate last salary (total of basic + overtime + bonus + allowances - deductions)
    const lastSalary = parseFloat(employee.basic_salary) + 
                      parseFloat(employee.overtime) + 
                      parseFloat(employee.bonus) + 
                      parseFloat(employee.allowances) - 
                      parseFloat(employee.leave_deduction) - 
                      parseFloat(employee.lop_deduction) - 
                      parseFloat(employee.late_deduction);
    
    // Return employee information (excluding sensitive data)
    const employeeInfo = {
      id: employee.id,
      name: employee.employee_name,
      employeeId: employee.employee_id,
      position: employee.position,
      department: employee.department,
      email: employee.employee_email,
      lastSalary: lastSalary
    };
    
    res.json({ 
      success: true, 
      message: 'Authentication successful',
      employee: employeeInfo 
    });
    
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
});

// Optional: Add endpoint to get employee dashboard data
app.get('/api/employee/:employeeId/dashboard', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    
    // Get employee's payroll records
    const [payrollRows] = await pool.execute(
      'SELECT * FROM payrolls WHERE employee_id = ? ORDER BY created_at DESC', 
      [employeeId]
    );
    
    if (payrollRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const latestPayroll = payrollRows[0];
    
    // Calculate dashboard metrics
    const dashboardData = {
      employee: {
        name: latestPayroll.employee_name,
        employeeId: latestPayroll.employee_id,
        position: latestPayroll.position,
        department: latestPayroll.department,
        email: latestPayroll.employee_email
      },
      payrollHistory: payrollRows.map(row => ({
        id: row.id,
        payPeriod: {
          start: row.pay_period_start,
          end: row.pay_period_end,
          payDate: row.pay_date
        },
        netSalary: parseFloat(row.basic_salary) + 
                  parseFloat(row.overtime) + 
                  parseFloat(row.bonus) + 
                  parseFloat(row.allowances) - 
                  parseFloat(row.leave_deduction) - 
                  parseFloat(row.lop_deduction) - 
                  parseFloat(row.late_deduction)
      })),
      summary: {
        totalPayrolls: payrollRows.length,
        averageSalary: payrollRows.reduce((sum, row) => {
          const netSalary = parseFloat(row.basic_salary) + 
                          parseFloat(row.overtime) + 
                          parseFloat(row.bonus) + 
                          parseFloat(row.allowances) - 
                          parseFloat(row.leave_deduction) - 
                          parseFloat(row.lop_deduction) - 
                          parseFloat(row.late_deduction);
          return sum + netSalary;
        }, 0) / payrollRows.length
      }
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Error fetching employee dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});



//Employee Management

// Add these employee management endpoints to your existing backend code

// GET API - Fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.*,
        d.name as department_name,
        p.title as position_title,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.status != 'terminated'
      ORDER BY e.created_at DESC
    `;
    
    const [rows] = await pool.execute(query);
    
    const employees = rows.map(row => ({
      id: row.id,
      employeeCode: row.employee_code,
      fullName: `${row.first_name} ${row.middle_name ? row.middle_name + ' ' : ''}${row.last_name}`,
      firstName: row.first_name,
      middleName: row.middle_name,
      lastName: row.last_name,
      personalEmail: row.personal_email,
      phone: row.phone,
      alternatePhone: row.alternate_phone,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      maritalStatus: row.marital_status,
      nationality: row.nationality,
      religion: row.religion,
      address: row.address,
      city: row.city,
      state: row.state,
      country: row.country,
      postalCode: row.postal_code,
      emergencyContactName: row.emergency_contact_name,
      emergencyContactPhone: row.emergency_contact_phone,
      emergencyContactRelationship: row.emergency_contact_relationship,
      departmentId: row.department_id,
      departmentName: row.department_name,
      positionId: row.position_id,
      positionTitle: row.position_title,
      managerId: row.manager_id,
      managerName: row.manager_name,
      hireDate: row.hire_date,
      probationEndDate: row.probation_end_date,
      confirmationDate: row.confirmation_date,
      employmentType: row.employment_type,
      workLocation: row.work_location,
      status: row.status,
      terminationDate: row.termination_date,
      terminationReason: row.termination_reason,
      profilePicture: row.profile_picture,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

// GET API - Fetch single employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const query = `
      SELECT 
        e.*,
        d.name as department_name,
        p.title as position_title,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = ?
    `;
    
    const [rows] = await pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const row = rows[0];
    const employee = {
      id: row.id,
      employeeCode: row.employee_code,
      fullName: `${row.first_name} ${row.middle_name ? row.middle_name + ' ' : ''}${row.last_name}`,
      firstName: row.first_name,
      middleName: row.middle_name,
      lastName: row.last_name,
      personalEmail: row.personal_email,
      phone: row.phone,
      alternatePhone: row.alternate_phone,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      maritalStatus: row.marital_status,
      nationality: row.nationality,
      religion: row.religion,
      address: row.address,
      city: row.city,
      state: row.state,
      country: row.country,
      postalCode: row.postal_code,
      emergencyContactName: row.emergency_contact_name,
      emergencyContactPhone: row.emergency_contact_phone,
      emergencyContactRelationship: row.emergency_contact_relationship,
      departmentId: row.department_id,
      departmentName: row.department_name,
      positionId: row.position_id,
      positionTitle: row.position_title,
      managerId: row.manager_id,
      managerName: row.manager_name,
      hireDate: row.hire_date,
      probationEndDate: row.probation_end_date,
      confirmationDate: row.confirmation_date,
      employmentType: row.employment_type,
      workLocation: row.work_location,
      status: row.status,
      terminationDate: row.termination_date,
      terminationReason: row.termination_reason,
      profilePicture: row.profile_picture,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
});

// POST API - Create new employee
app.post('/api/employees', async (req, res) => {
  try {
    const {
      employeeCode, firstName, middleName, lastName, dateOfBirth, gender,
      maritalStatus, nationality, religion, personalEmail, phone, alternatePhone,
      address, city, state, country, postalCode, emergencyContactName,
      emergencyContactPhone, emergencyContactRelationship, departmentId,
      positionId, managerId, hireDate, probationEndDate, confirmationDate,
      employmentType, workLocation, status, notes
    } = req.body;
    
    const insertQuery = `
      INSERT INTO employees (
        employee_code, first_name, middle_name, last_name, date_of_birth,
        gender, marital_status, nationality, religion, personal_email,
        phone, alternate_phone, address, city, state, country, postal_code,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        department_id, position_id, manager_id, hire_date, probation_end_date,
        confirmation_date, employment_type, work_location, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      employeeCode, firstName, middleName, lastName, dateOfBirth,
      gender, maritalStatus, nationality, religion, personalEmail,
      phone, alternatePhone, address, city, state, country || 'India', postalCode,
      emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
      departmentId, positionId, managerId, hireDate, probationEndDate,
      confirmationDate, employmentType || 'full-time', workLocation || 'office',
      status || 'active', notes
    ];
    
    const [result] = await pool.execute(insertQuery, values);
    
    res.status(201).json({
      message: 'Employee created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Employee code already exists' });
    } else {
      res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
  }
});

// PUT API - Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const {
      employeeCode, firstName, middleName, lastName, dateOfBirth, gender,
      maritalStatus, nationality, religion, personalEmail, phone, alternatePhone,
      address, city, state, country, postalCode, emergencyContactName,
      emergencyContactPhone, emergencyContactRelationship, departmentId,
      positionId, managerId, hireDate, probationEndDate, confirmationDate,
      employmentType, workLocation, status, notes
    } = req.body;

    // Format dates
    const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    // Add validation before the update
if (departmentId) {
  const [deptCheck] = await pool.execute('SELECT id FROM departments WHERE id = ?', [departmentId]);
  if (deptCheck.length === 0) {
    return res.status(400).json({ message: 'Invalid department ID' });
  }
}

if (positionId) {
  const [posCheck] = await pool.execute('SELECT id FROM positions WHERE id = ?', [positionId]);
  if (posCheck.length === 0) {
    return res.status(400).json({ message: 'Invalid position ID' });
  }
}

    const updateQuery = `
      UPDATE employees SET
        employee_code = ?, first_name = ?, middle_name = ?, last_name = ?,
        date_of_birth = ?, gender = ?, marital_status = ?, nationality = ?,
        religion = ?, personal_email = ?, phone = ?, alternate_phone = ?,
        address = ?, city = ?, state = ?, country = ?, postal_code = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?, emergency_contact_relationship = ?,
        department_id = ?, position_id = ?, manager_id = ?, hire_date = ?,
        probation_end_date = ?, confirmation_date = ?, employment_type = ?,
        work_location = ?, status = ?, notes = ?
      WHERE id = ?
    `;
    
    const values = [
  employeeCode || null, firstName || null, middleName || null, lastName || null,
  formatDate(dateOfBirth), gender || null, maritalStatus || null, nationality || null,
  religion || null, personalEmail || null, phone || null, alternatePhone || null,
  address || null, city || null, state || null, country || null, postalCode || null,
  emergencyContactName || null, emergencyContactPhone || null, emergencyContactRelationship || null,
  departmentId || null, positionId || null, managerId || null,
  formatDate(hireDate), formatDate(probationEndDate), formatDate(confirmationDate),
  employmentType || null, workLocation || null, status || null, notes || null, id
];
    
    console.log('Update values:', values); // Debug log
    
    const [result] = await pool.execute(updateQuery, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    console.error('Error details:', error.code, error.sqlMessage); // More detailed error info
    res.status(500).json({ 
      message: 'Error updating employee', 
      error: error.message,
      code: error.code 
    });
  }
});
// DELETE API - Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const [result] = await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

// GET API - Fetch departments for dropdown
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name FROM departments ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
});

// GET API - Fetch positions for dropdown
app.get('/api/positions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title FROM positions ORDER BY title');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: 'Error fetching positions', error: error.message });
  }
});

// GET API - Fetch managers for dropdown (active employees only)
app.get('/api/managers', async (req, res) => {
  try {
    const query = `
      SELECT id, CONCAT(first_name, ' ', last_name) as name 
      FROM employees 
      WHERE status = 'active' 
      ORDER BY first_name, last_name
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ message: 'Error fetching managers', error: error.message });
  }
});



// Add this endpoint to your existing backend code

// GET API - Fetch employee profile by employee code (for MyProfile component)
app.get('/api/profile/:employeeCode', async (req, res) => {
  try {
    const employeeCode = req.params.employeeCode;
    
    const query = `
      SELECT 
        e.*,
        d.name as department_name,
        p.title as position_title,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.employee_code = ? AND e.status != 'terminated'
    `;
    
    const [rows] = await pool.execute(query, [employeeCode]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    
    const row = rows[0];
    
    // Calculate age
    const calculateAge = (birthDate) => {
      if (!birthDate) return 0;
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    // Calculate years of service
    const calculateYearsOfService = (hireDate) => {
      if (!hireDate) return 0;
      const today = new Date();
      const hire = new Date(hireDate);
      const diffTime = Math.abs(today - hire);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      return Math.round(diffYears * 10) / 10; // Round to 1 decimal place
    };

    // Format the employee data to match your MyProfile component structure
    const profileData = {
      // Personal Information
      fullName: `${row.first_name} ${row.middle_name ? row.middle_name + ' ' : ''}${row.last_name}`,
      employeeId: row.employee_code,
      profilePhoto: row.profile_picture || '/api/placeholder/150/150',
      dateOfBirth: row.date_of_birth ? row.date_of_birth.toISOString().split('T')[0] : '',
      age: calculateAge(row.date_of_birth),
      gender: row.gender || '',
      maritalStatus: row.marital_status || '',
      nationality: row.nationality || '',
      personalEmail: row.personal_email || '',
      phoneNumber: row.phone || '',
      alternatePhone: row.alternate_phone || '',
      currentAddress: row.address || '',
      permanentAddress: row.address || '', // Using same address for both
      
      // Emergency Contact
      emergencyContactName: row.emergency_contact_name || '',
      emergencyContactRelation: row.emergency_contact_relationship || '',
      emergencyContactPhone: row.emergency_contact_phone || '',
      emergencyContactEmail: '', // Not in your current schema
      
      // Professional Information
      jobTitle: row.position_title || '',
      department: row.department_name || '',
      employeeType: row.employment_type || '',
      dateOfJoining: row.hire_date ? row.hire_date.toISOString().split('T')[0] : '',
      yearsOfService: calculateYearsOfService(row.hire_date),
      reportingManager: row.manager_name || '',
      workLocation: row.work_location || '',
      employeeStatus: row.status || 'Active',
      
      // Employment Details (You might need to add these to employees table or fetch from payroll)
      currentSalary: '$0', // You'll need to fetch this from payroll table
      workSchedule: 'Monday - Friday, 9:00 AM - 6:00 PM', // Default value
      benefits: ['Health Insurance', 'Dental Coverage', '401(k)', 'Paid Time Off'] // Default values
    };
    
    res.json(profileData);
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// PUT API - Update employee profile
app.put('/api/profile/:employeeCode', async (req, res) => {
  try {
    const employeeCode = req.params.employeeCode;
    const profileData = req.body;
    
    // Split full name into parts (basic implementation)
    const nameParts = profileData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[nameParts.length - 1] || '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
    
    const updateQuery = `
      UPDATE employees SET
        first_name = ?, middle_name = ?, last_name = ?,
        date_of_birth = ?, gender = ?, marital_status = ?, nationality = ?,
        personal_email = ?, phone = ?, alternate_phone = ?, address = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?, emergency_contact_relationship = ?
      WHERE employee_code = ?
    `;
    
    const values = [
      firstName,
      middleName || null,
      lastName,
      profileData.dateOfBirth || null,
      profileData.gender || null,
      profileData.maritalStatus || null,
      profileData.nationality || null,
      profileData.personalEmail || null,
      profileData.phoneNumber || null,
      profileData.alternatePhone || null,
      profileData.currentAddress || null,
      profileData.emergencyContactName || null,
      profileData.emergencyContactPhone || null,
      profileData.emergencyContactRelation || null,
      employeeCode
    ];
    
    const [result] = await pool.execute(updateQuery, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});



// Attendance API Routes

// Add these attendance API routes to your existing server.js file

// Helper function to calculate total hours from clock_in and clock_out
function calculateTotalHours(clockIn, clockOut, breakStart = null, breakEnd = null) {
  if (!clockIn || !clockOut) return 0;
  
  const [inHours, inMinutes] = clockIn.split(':').map(Number);
  const [outHours, outMinutes] = clockOut.split(':').map(Number);
  
  const clockInMinutes = inHours * 60 + inMinutes;
  const clockOutMinutes = outHours * 60 + outMinutes;
  
  let totalMinutes = clockOutMinutes - clockInMinutes;
  
  // Subtract break time if provided
  if (breakStart && breakEnd) {
    const [breakStartHours, breakStartMinutes] = breakStart.split(':').map(Number);
    const [breakEndHours, breakEndMinutes] = breakEnd.split(':').map(Number);
    
    const breakStartMin = breakStartHours * 60 + breakStartMinutes;
    const breakEndMin = breakEndHours * 60 + breakEndMinutes;
    
    const breakDuration = breakEndMin - breakStartMin;
    totalMinutes -= breakDuration;
  }
  
  return Math.max(0, totalMinutes / 60);
}

// Create attendance table if it doesn't exist
async function initializeAttendanceTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        clock_in TIME,
        clock_out TIME,
        break_start TIME,
        break_end TIME,
        total_hours DECIMAL(4,2) DEFAULT 0,
        break_hours DECIMAL(4,2) DEFAULT 0,
        overtime_hours DECIMAL(4,2) DEFAULT 0,
        late_minutes INT DEFAULT 0,
        early_leaving_minutes INT DEFAULT 0,
        status ENUM('present', 'absent', 'late', 'half-day', 'sick', 'leave') DEFAULT 'present',
        work_from_home BOOLEAN DEFAULT FALSE,
        location VARCHAR(255),
        notes TEXT,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_employee_date (employee_id, date),
        INDEX idx_employee_date (employee_id, date)
      )
    `;
    
    await pool.execute(createTableQuery);
    console.log('✅ Attendance table created/verified successfully!');
  } catch (error) {
    console.error('❌ Error creating attendance table:', error.message);
  }
}

// Call this function after your existing initializeDatabase() call
// initializeAttendanceTable();

// ATTENDANCE API ROUTES

// Get attendance data for a specific month and employee
app.get('/api/attendance/:employeeId/:year/:month', async (req, res) => {
  try {
    const { employeeId, year, month } = req.params;
    
    const query = `
      SELECT 
        id,
        date,
        clock_in,
        clock_out,
        break_start,
        break_end,
        total_hours,
        break_hours,
        overtime_hours,
        late_minutes,
        early_leaving_minutes,
        status,
        work_from_home,
        location,
        notes,
        is_approved
      FROM attendance 
      WHERE employee_id = ? 
        AND YEAR(date) = ? 
        AND MONTH(date) = ?
      ORDER BY date
    `;
    
    const [rows] = await pool.execute(query, [employeeId, year, month]);
    
    // Convert rows to object with date as key
    const attendanceData = {};
    rows.forEach(row => {
      const dateKey = row.date.toISOString().split('T')[0];
      attendanceData[dateKey] = {
        id: row.id,
        clockIn: row.clock_in,
        clockOut: row.clock_out,
        breakStart: row.break_start,
        breakEnd: row.break_end,
        totalHours: parseFloat(row.total_hours || 0),
        breakHours: parseFloat(row.break_hours || 0),
        overtimeHours: parseFloat(row.overtime_hours || 0),
        lateMinutes: row.late_minutes || 0,
        earlyLeavingMinutes: row.early_leaving_minutes || 0,
        status: row.status,
        workFromHome: row.work_from_home,
        location: row.location,
        notes: row.notes,
        isApproved: row.is_approved
      };
    });
    
    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance data',
      error: error.message
    });
  }
});

// Create or update attendance record
app.post('/api/attendance', async (req, res) => {
  try {
    const {
      employeeId,
      date,
      clockIn,
      clockOut,
      breakStart,
      breakEnd,
      status = 'present',
      workFromHome = false,
      location,
      notes
    } = req.body;

    // Calculate total hours
    const totalHours = calculateTotalHours(clockIn, clockOut, breakStart, breakEnd);
    
    // Calculate break hours
    let breakHours = 0;
    if (breakStart && breakEnd) {
      breakHours = calculateTotalHours(breakStart, breakEnd);
    }

    const query = `
      INSERT INTO attendance (
        employee_id, date, clock_in, clock_out, break_start, break_end,
        total_hours, break_hours, status, work_from_home, location, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        clock_in = VALUES(clock_in),
        clock_out = VALUES(clock_out),
        break_start = VALUES(break_start),
        break_end = VALUES(break_end),
        total_hours = VALUES(total_hours),
        break_hours = VALUES(break_hours),
        status = VALUES(status),
        work_from_home = VALUES(work_from_home),
        location = VALUES(location),
        notes = VALUES(notes),
        updated_at = CURRENT_TIMESTAMP
    `;

    const [result] = await pool.execute(query, [
      employeeId, date, clockIn, clockOut, breakStart, breakEnd,
      totalHours, breakHours, status, workFromHome, location, notes
    ]);

    res.json({
      success: true,
      message: 'Attendance record saved successfully',
      data: {
        id: result.insertId || result.affectedRows,
        totalHours
      }
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save attendance record',
      error: error.message
    });
  }
});

// Update attendance record by ID
app.put('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clockIn,
      clockOut,
      breakStart,
      breakEnd,
      status,
      workFromHome,
      location,
      notes
    } = req.body;

    // Calculate total hours
    const totalHours = calculateTotalHours(clockIn, clockOut, breakStart, breakEnd);
    
    // Calculate break hours
    let breakHours = 0;
    if (breakStart && breakEnd) {
      breakHours = calculateTotalHours(breakStart, breakEnd);
    }

    const query = `
      UPDATE attendance SET
        clock_in = ?,
        clock_out = ?,
        break_start = ?,
        break_end = ?,
        total_hours = ?,
        break_hours = ?,
        status = ?,
        work_from_home = ?,
        location = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, [
      clockIn, clockOut, breakStart, breakEnd, totalHours, breakHours,
      status, workFromHome, location, notes, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: { totalHours }
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance record',
      error: error.message
    });
  }
});

// Delete attendance record
app.delete('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM attendance WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attendance record',
      error: error.message
    });
  }
});

// Get monthly summary
app.get('/api/attendance/summary/:employeeId/:year/:month', async (req, res) => {
  try {
    const { employeeId, year, month } = req.params;
    
    const query = `
      SELECT 
        COUNT(*) as total_days,
        SUM(total_hours) as total_hours,
        AVG(total_hours) as average_hours,
        SUM(CASE WHEN total_hours >= 9 THEN 1 ELSE 0 END) as complete_days,
        SUM(CASE WHEN total_hours > 0 AND total_hours < 9 THEN 1 ELSE 0 END) as insufficient_days,
        SUM(overtime_hours) as total_overtime,
        SUM(late_minutes) as total_late_minutes
      FROM attendance 
      WHERE employee_id = ? 
        AND YEAR(date) = ? 
        AND MONTH(date) = ?
        AND status IN ('present', 'late', 'half-day')
    `;
    
    const [rows] = await pool.execute(query, [employeeId, year, month]);
    const summary = rows[0];
    
    res.json({
      success: true,
      data: {
        totalDays: summary.total_days || 0,
        totalHours: parseFloat(summary.total_hours || 0),
        averageHours: parseFloat(summary.average_hours || 0),
        completeDays: summary.complete_days || 0,
        insufficientDays: summary.insufficient_days || 0,
        totalOvertime: parseFloat(summary.total_overtime || 0),
        totalLateMinutes: summary.total_late_minutes || 0
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary data',
      error: error.message
    });
  }
});

// Get all employees for attendance (simplified version of your existing employees endpoint)
app.get('/api/attendance/employees', async (req, res) => {
  try {
    const query = `
      SELECT 
        employee_code as id, 
        CONCAT(first_name, ' ', last_name) as name,
        first_name, 
        last_name, 
        personal_email as email 
      FROM employees 
      WHERE status = 'active'
      ORDER BY first_name, last_name
    `;
    const [rows] = await pool.execute(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching employees for attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
});


// Geofencing Backend API Extensions
// Add these to your existing server.js file

// Create geofencing-related tables
async function initializeGeofencingTables() {
  try {
    // Work locations table
    const createLocationsTable = `
      CREATE TABLE IF NOT EXISTS work_locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        radius_meters INT DEFAULT 100,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Update attendance table to include location data
    const alterAttendanceTable = `
      ALTER TABLE attendance 
      ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
      ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
      ADD COLUMN IF NOT EXISTS location_accuracy DECIMAL(6, 2),
      ADD COLUMN IF NOT EXISTS is_within_geofence BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS work_location_id INT,
      ADD COLUMN IF NOT EXISTS distance_from_work DECIMAL(8, 2),
      ADD FOREIGN KEY IF NOT EXISTS (work_location_id) REFERENCES work_locations(id)
    `;

    await pool.execute(createLocationsTable);
    console.log('✅ Work locations table created successfully!');
    
    // Note: ALTER TABLE with IF NOT EXISTS might not work in all MySQL versions
    // You might need to check if columns exist first
    try {
      await pool.execute(alterAttendanceTable);
      console.log('✅ Attendance table updated with location fields!');
    } catch (error) {
      if (!error.message.includes('Duplicate column')) {
        console.error('❌ Error updating attendance table:', error.message);
      }
    }

    // Insert default work locations (example)
    const insertDefaultLocation = `
      INSERT IGNORE INTO work_locations (name, address, latitude, longitude, radius_meters)
      VALUES 
        ('Main Office', '123 Business Street, City', 40.7128, -74.0060, 100),
        ('Branch Office', '456 Corporate Ave, City', 40.7589, -73.9851, 150)
    `;
    
    await pool.execute(insertDefaultLocation);
    console.log('✅ Default work locations inserted!');

  } catch (error) {
    console.error('❌ Error initializing geofencing tables:', error.message);
  }
}

// Call this after your existing initialization
// initializeGeofencingTables();

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// Check if coordinates are within any work location
async function checkGeofence(latitude, longitude) {
  try {
    const query = `
      SELECT id, name, latitude, longitude, radius_meters 
      FROM work_locations 
      WHERE is_active = TRUE
    `;
    
    const [locations] = await pool.execute(query);
    
    for (const location of locations) {
      const distance = calculateDistance(
        latitude, longitude,
        parseFloat(location.latitude), parseFloat(location.longitude)
      );
      
      if (distance <= location.radius_meters) {
        return {
          isWithinGeofence: true,
          workLocation: location,
          distance: Math.round(distance)
        };
      }
    }
    
    // Find closest location for reference
    let closestLocation = null;
    let minDistance = Infinity;
    
    for (const location of locations) {
      const distance = calculateDistance(
        latitude, longitude,
        parseFloat(location.latitude), parseFloat(location.longitude)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = { ...location, distance: Math.round(distance) };
      }
    }
    
    return {
      isWithinGeofence: false,
      closestLocation,
      distance: Math.round(minDistance)
    };
    
  } catch (error) {
    console.error('Error checking geofence:', error);
    throw error;
  }
}

// GEOFENCING API ROUTES

// Get all work locations
app.get('/api/work-locations', async (req, res) => {
  try {
    const query = `
      SELECT id, name, address, latitude, longitude, radius_meters, is_active
      FROM work_locations
      ORDER BY name
    `;
    
    const [rows] = await pool.execute(query);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching work locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work locations',
      error: error.message
    });
  }
});

// Add new work location
app.post('/api/work-locations', async (req, res) => {
  try {
    const { name, address, latitude, longitude, radiusMeters = 100 } = req.body;
    
    if (!name || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Name, latitude, and longitude are required'
      });
    }
    
    const query = `
      INSERT INTO work_locations (name, address, latitude, longitude, radius_meters)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [name, address, latitude, longitude, radiusMeters]);
    
    res.json({
      success: true,
      message: 'Work location added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding work location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add work location',
      error: error.message
    });
  }
});

// Validate location for attendance
app.post('/api/validate-location', async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    // Check if accuracy is acceptable (less than 50 meters)
    if (accuracy && accuracy > 50) {
      return res.json({
        success: false,
        message: 'Location accuracy is too low. Please try again in an open area.',
        data: { accuracy, isAccurate: false }
      });
    }
    
    const geofenceResult = await checkGeofence(latitude, longitude);
    
    res.json({
      success: true,
      data: {
        ...geofenceResult,
        coordinates: { latitude, longitude },
        accuracy,
        isAccurate: !accuracy || accuracy <= 50
      }
    });
    
  } catch (error) {
    console.error('Error validating location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate location',
      error: error.message
    });
  }
});

// Enhanced attendance creation with geofencing
app.post('/api/attendance-with-location', async (req, res) => {
  try {
    const {
      employeeId,
      date,
      clockIn,
      clockOut,
      breakStart,
      breakEnd,
      status = 'present',
      workFromHome = false,
      location,
      notes,
      latitude,
      longitude,
      locationAccuracy
    } = req.body;

    let geofenceResult = null;
    let isWithinGeofence = false;
    let workLocationId = null;
    let distanceFromWork = null;

    // Only check geofence if not working from home and coordinates provided
    if (!workFromHome && latitude && longitude) {
      try {
        geofenceResult = await checkGeofence(latitude, longitude);
        isWithinGeofence = geofenceResult.isWithinGeofence;
        
        if (geofenceResult.workLocation) {
          workLocationId = geofenceResult.workLocation.id;
          distanceFromWork = geofenceResult.distance;
        } else if (geofenceResult.closestLocation) {
          distanceFromWork = geofenceResult.distance;
        }
        
        // If not within geofence, you might want to restrict attendance
        if (!isWithinGeofence && !workFromHome) {
          return res.status(400).json({
            success: false,
            message: `You are ${distanceFromWork}m away from the nearest work location. Please move closer to clock in.`,
            data: {
              geofenceInfo: geofenceResult,
              requiredDistance: geofenceResult.closestLocation?.radius_meters || 100
            }
          });
        }
        
      } catch (geofenceError) {
        console.error('Geofence check failed:', geofenceError);
        // Continue without geofence if there's an error
      }
    }

    // Calculate total hours
    const totalHours = calculateTotalHours(clockIn, clockOut, breakStart, breakEnd);
    
    // Calculate break hours
    let breakHours = 0;
    if (breakStart && breakEnd) {
      breakHours = calculateTotalHours(breakStart, breakEnd);
    }

    const query = `
      INSERT INTO attendance (
        employee_id, date, clock_in, clock_out, break_start, break_end,
        total_hours, break_hours, status, work_from_home, location, notes,
        latitude, longitude, location_accuracy, is_within_geofence,
        work_location_id, distance_from_work
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        clock_in = VALUES(clock_in),
        clock_out = VALUES(clock_out),
        break_start = VALUES(break_start),
        break_end = VALUES(break_end),
        total_hours = VALUES(total_hours),
        break_hours = VALUES(break_hours),
        status = VALUES(status),
        work_from_home = VALUES(work_from_home),
        location = VALUES(location),
        notes = VALUES(notes),
        latitude = VALUES(latitude),
        longitude = VALUES(longitude),
        location_accuracy = VALUES(location_accuracy),
        is_within_geofence = VALUES(is_within_geofence),
        work_location_id = VALUES(work_location_id),
        distance_from_work = VALUES(distance_from_work),
        updated_at = CURRENT_TIMESTAMP
    `;

    const [result] = await pool.execute(query, [
      employeeId, date, clockIn, clockOut, breakStart, breakEnd,
      totalHours, breakHours, status, workFromHome, location, notes,
      latitude, longitude, locationAccuracy, isWithinGeofence,
      workLocationId, distanceFromWork
    ]);

    res.json({
      success: true,
      message: 'Attendance record saved successfully',
      data: {
        id: result.insertId || result.affectedRows,
        totalHours,
        geofenceInfo: geofenceResult,
        isWithinGeofence
      }
    });
  } catch (error) {
    console.error('Error saving attendance with location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save attendance record',
      error: error.message
    });
  }
});

// Get attendance with location data
app.get('/api/attendance-with-location/:employeeId/:year/:month', async (req, res) => {
  try {
    const { employeeId, year, month } = req.params;
    
    const query = `
      SELECT 
        a.*,
        wl.name as work_location_name,
        wl.address as work_location_address
      FROM attendance a
      LEFT JOIN work_locations wl ON a.work_location_id = wl.id
      WHERE a.employee_id = ? 
        AND YEAR(a.date) = ? 
        AND MONTH(a.date) = ?
      ORDER BY a.date
    `;
    
    const [rows] = await pool.execute(query, [employeeId, year, month]);
    
    // Convert rows to object with date as key
    const attendanceData = {};
    rows.forEach(row => {
      const dateKey = row.date.toISOString().split('T')[0];
      attendanceData[dateKey] = {
        id: row.id,
        clockIn: row.clock_in,
        clockOut: row.clock_out,
        breakStart: row.break_start,
        breakEnd: row.break_end,
        totalHours: parseFloat(row.total_hours || 0),
        breakHours: parseFloat(row.break_hours || 0),
        overtimeHours: parseFloat(row.overtime_hours || 0),
        lateMinutes: row.late_minutes || 0,
        earlyLeavingMinutes: row.early_leaving_minutes || 0,
        status: row.status,
        workFromHome: row.work_from_home,
        location: row.location,
        notes: row.notes,
        isApproved: row.is_approved,
        // Location data
        latitude: row.latitude,
        longitude: row.longitude,
        locationAccuracy: row.location_accuracy,
        isWithinGeofence: row.is_within_geofence,
        workLocationId: row.work_location_id,
        workLocationName: row.work_location_name,
        workLocationAddress: row.work_location_address,
        distanceFromWork: row.distance_from_work
      };
    });
    
    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Error fetching attendance with location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance data',
      error: error.message
    });
  }
});