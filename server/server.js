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