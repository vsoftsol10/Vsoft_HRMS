const mysql = require('mysql2/promise');
const db = require('../config/database');

class Payroll {
  constructor(data) {
    this.id = data.id;
    this.employee_id = data.employee_id;
    this.pay_period_start = data.pay_period_start;
    this.pay_period_end = data.pay_period_end;
    this.basic_salary = data.basic_salary;
    this.allowances = data.allowances || 0;
    this.overtime_hours = data.overtime_hours || 0;
    this.overtime_rate = data.overtime_rate || 0;
    this.gross_salary = data.gross_salary;
    this.tax_deduction = data.tax_deduction || 0;
    this.insurance_deduction = data.insurance_deduction || 0;
    this.other_deductions = data.other_deductions || 0;
    this.total_deductions = data.total_deductions;
    this.net_salary = data.net_salary;
    this.payment_status = data.payment_status || 'pending';
    this.payment_date = data.payment_date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new payroll record
  static async create(payrollData) {
    try {
      const connection = await db.getConnection();
      
      // Calculate gross salary
      const overtimePay = payrollData.overtime_hours * payrollData.overtime_rate;
      const grossSalary = payrollData.basic_salary + payrollData.allowances + overtimePay;
      
      // Calculate total deductions
      const totalDeductions = 
        payrollData.tax_deduction + 
        payrollData.insurance_deduction + 
        payrollData.other_deductions;
      
      // Calculate net salary
      const netSalary = grossSalary - totalDeductions;

      const [result] = await connection.execute(
        `INSERT INTO payroll (
          employee_id, pay_period_start, pay_period_end, basic_salary, 
          allowances, overtime_hours, overtime_rate, gross_salary,
          tax_deduction, insurance_deduction, other_deductions, 
          total_deductions, net_salary, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payrollData.employee_id,
          payrollData.pay_period_start,
          payrollData.pay_period_end,
          payrollData.basic_salary,
          payrollData.allowances || 0,
          payrollData.overtime_hours || 0,
          payrollData.overtime_rate || 0,
          grossSalary,
          payrollData.tax_deduction || 0,
          payrollData.insurance_deduction || 0,
          payrollData.other_deductions || 0,
          totalDeductions,
          netSalary,
          payrollData.payment_status || 'pending'
        ]
      );

      connection.release();
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating payroll: ${error.message}`);
    }
  }

  // Find payroll by ID
  static async findById(id) {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.execute(
        `SELECT p.*, 
         e.first_name, e.last_name, e.employee_id as emp_code,
         d.name as department_name
         FROM payroll p
         JOIN employees e ON p.employee_id = e.id
         LEFT JOIN departments d ON e.department_id = d.id
         WHERE p.id = ?`,
        [id]
      );
      connection.release();
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Payroll(rows[0]);
    } catch (error) {
      throw new Error(`Error finding payroll: ${error.message}`);
    }
  }

  // Get all payroll records with pagination
  static async findAll(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        employee_id, 
        status, 
        pay_period_start, 
        pay_period_end 
      } = options;
      
      const offset = (page - 1) * limit;
      let whereClause = '1=1';
      const params = [];

      // Add filters
      if (employee_id) {
        whereClause += ' AND p.employee_id = ?';
        params.push(employee_id);
      }
      
      if (status) {
        whereClause += ' AND p.payment_status = ?';
        params.push(status);
      }
      
      if (pay_period_start) {
        whereClause += ' AND p.pay_period_start >= ?';
        params.push(pay_period_start);
      }
      
      if (pay_period_end) {
        whereClause += ' AND p.pay_period_end <= ?';
        params.push(pay_period_end);
      }

      const connection = await db.getConnection();
      
      // Get total count
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total 
         FROM payroll p 
         JOIN employees e ON p.employee_id = e.id
         WHERE ${whereClause}`,
        params
      );

      // Get paginated results
      const [rows] = await connection.execute(
        `SELECT p.*, 
         e.first_name, e.last_name, e.employee_id as emp_code,
         d.name as department_name
         FROM payroll p
         JOIN employees e ON p.employee_id = e.id
         LEFT JOIN departments d ON e.department_id = d.id
         WHERE ${whereClause}
         ORDER BY p.pay_period_end DESC, p.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      );

      connection.release();

      return {
        payrolls: rows.map(row => new Payroll(row)),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching payrolls: ${error.message}`);
    }
  }

  // Update payroll record
  static async updateById(id, updateData) {
    try {
      const connection = await db.getConnection();
      
      // If salary components are being updated, recalculate totals
      if (updateData.basic_salary || updateData.allowances || 
          updateData.overtime_hours || updateData.overtime_rate ||
          updateData.tax_deduction || updateData.insurance_deduction ||
          updateData.other_deductions) {
        
        const current = await this.findById(id);
        if (!current) {
          throw new Error('Payroll record not found');
        }

        const basicSalary = updateData.basic_salary || current.basic_salary;
        const allowances = updateData.allowances || current.allowances;
        const overtimeHours = updateData.overtime_hours || current.overtime_hours;
        const overtimeRate = updateData.overtime_rate || current.overtime_rate;
        
        const grossSalary = basicSalary + allowances + (overtimeHours * overtimeRate);
        
        const taxDeduction = updateData.tax_deduction || current.tax_deduction;
        const insuranceDeduction = updateData.insurance_deduction || current.insurance_deduction;
        const otherDeductions = updateData.other_deductions || current.other_deductions;
        
        const totalDeductions = taxDeduction + insuranceDeduction + otherDeductions;
        const netSalary = grossSalary - totalDeductions;
        
        updateData.gross_salary = grossSalary;
        updateData.total_deductions = totalDeductions;
        updateData.net_salary = netSalary;
      }

      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);

      await connection.execute(
        `UPDATE payroll SET ${fields}, updated_at = NOW() WHERE id = ?`,
        [...values, id]
      );

      connection.release();
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating payroll: ${error.message}`);
    }
  }

  // Delete payroll record
  static async deleteById(id) {
    try {
      const connection = await db.getConnection();
      const [result] = await connection.execute(
        'DELETE FROM payroll WHERE id = ?',
        [id]
      );
      connection.release();
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting payroll: ${error.message}`);
    }
  }

  // Get payroll summary for employee
  static async getEmployeePayrollSummary(employeeId, year) {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.execute(
        `SELECT 
          COUNT(*) as total_payrolls,
          SUM(gross_salary) as total_gross,
          SUM(total_deductions) as total_deductions,
          SUM(net_salary) as total_net,
          AVG(net_salary) as avg_net_salary
         FROM payroll 
         WHERE employee_id = ? AND YEAR(pay_period_end) = ?`,
        [employeeId, year]
      );
      connection.release();
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting payroll summary: ${error.message}`);
    }
  }

  // Update payment status
  static async updatePaymentStatus(id, status, paymentDate = null) {
    try {
      const connection = await db.getConnection();
      
      const updateData = { payment_status: status };
      if (paymentDate) {
        updateData.payment_date = paymentDate;
      }
      
      await connection.execute(
        'UPDATE payroll SET payment_status = ?, payment_date = ?, updated_at = NOW() WHERE id = ?',
        [status, paymentDate, id]
      );
      
      connection.release();
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }
}

module.exports = Payroll;