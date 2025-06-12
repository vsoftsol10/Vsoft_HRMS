-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_before_insert_payroll;
DROP TRIGGER IF EXISTS trg_before_update_payroll;

-- Create payroll table
CREATE TABLE IF NOT EXISTS payroll (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,

    -- Pay period
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_month INT NOT NULL,
    pay_year YEAR NOT NULL,

    -- Attendance & Leave Summary
    total_days INT NOT NULL,
    working_days INT NOT NULL,
    present_days DECIMAL(4,1) NOT NULL,
    absent_days DECIMAL(4,1) NOT NULL,
    leave_days DECIMAL(4,1) NOT NULL,
    holiday_days INT NOT NULL,

    -- Earnings & Components
    basic_salary DECIMAL(12,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    overtime_hours DECIMAL(6,2) DEFAULT 0.00,
    overtime_rate DECIMAL(8,2) DEFAULT 0.00,
    overtime_amount DECIMAL(12,2) GENERATED ALWAYS AS (overtime_hours * overtime_rate) STORED,
    bonus_amount DECIMAL(12,2) DEFAULT 0.00,
    incentive_amount DECIMAL(12,2) DEFAULT 0.00,
    gross_earnings DECIMAL(12,2) DEFAULT 0.00,

    -- Deductions
    tax_deduction DECIMAL(10,2) DEFAULT 0.00,
    insurance_deduction DECIMAL(10,2) DEFAULT 0.00,
    other_deductions DECIMAL(10,2) DEFAULT 0.00,
    total_deductions DECIMAL(12,2) DEFAULT 0.00,
    taxable_income DECIMAL(12,2) DEFAULT 0.00,
    tax_deducted DECIMAL(12,2) DEFAULT 0.00,

    -- Net Pay
    net_salary DECIMAL(12,2) DEFAULT 0.00,

    -- Payment Info
    payment_date DATE NULL,
    payment_method ENUM('bank_transfer', 'cash', 'cheque') DEFAULT 'bank_transfer',
    payment_reference VARCHAR(100),
    payment_status ENUM('pending', 'processed', 'paid', 'failed', 'cancelled') DEFAULT 'pending',

    -- Status & Approval Flow
    status ENUM('draft', 'calculated', 'approved', 'locked') DEFAULT 'draft',
    processed_by INT NULL,
    approved_by INT NULL,
    locked_by INT NULL,

    -- Audit Trail
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id),
    FOREIGN KEY (locked_by) REFERENCES employees(id),

    -- Indexes
    UNIQUE KEY unique_employee_payroll (employee_id, pay_month, pay_year),
    INDEX idx_employee_id (employee_id),
    INDEX idx_pay_period (pay_month, pay_year),
    INDEX idx_status (status)
);

-- Create triggers to auto-update calculations
DELIMITER $$

CREATE TRIGGER trg_before_insert_payroll
BEFORE INSERT ON payroll
FOR EACH ROW
BEGIN
    SET NEW.gross_earnings = NEW.basic_salary + NEW.allowances + NEW.overtime_amount + NEW.bonus_amount + NEW.incentive_amount;
    SET NEW.total_deductions = NEW.tax_deduction + NEW.insurance_deduction + NEW.other_deductions;
    SET NEW.taxable_income = NEW.gross_earnings - NEW.insurance_deduction;
    SET NEW.net_salary = NEW.gross_earnings - NEW.total_deductions;
END$$

CREATE TRIGGER trg_before_update_payroll
BEFORE UPDATE ON payroll
FOR EACH ROW
BEGIN
    SET NEW.gross_earnings = NEW.basic_salary + NEW.allowances + NEW.overtime_amount + NEW.bonus_amount + NEW.incentive_amount;
    SET NEW.total_deductions = NEW.tax_deduction + NEW.insurance_deduction + NEW.other_deductions;
    SET NEW.taxable_income = NEW.gross_earnings - NEW.insurance_deduction;
    SET NEW.net_salary = NEW.gross_earnings - NEW.total_deductions;
END$$

DELIMITER ;

-- Sample data
INSERT INTO payroll (
    employee_id, pay_period_start, pay_period_end, pay_month, pay_year,
    total_days, working_days, present_days, absent_days, leave_days, holiday_days,
    basic_salary, allowances, overtime_hours, overtime_rate,
    bonus_amount, incentive_amount,
    tax_deduction, insurance_deduction, other_deductions,
    payment_status
) VALUES
(1, '2024-01-01', '2024-01-31', 1, 2024, 31, 26, 22.0, 2.0, 2.0, 5,
 50000.00, 5000.00, 10.00, 500.00,
 2000.00, 1500.00,
 8000.00, 2000.00, 500.00, 'pending');
