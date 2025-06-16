import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
// import PayslipGenerator from './components/payroll/PaySlipGenerator'
import PayrollPage from './pages/PayrollPage'
import InternDashboardPage from './pages/InternDashboardPage'
import PayrollAdmin from './components/payroll/PayrollAdmin'
import AdminDashboard from './components/dashboard/AdminDashboard'
import EmployeeDashboard from './components/dashboard/Employeedashboard'
import InternPortal from './components/dashboard/InternPortal'
import LandingPage from './components/LandingPage/LandingPage'



function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/admin/dashboard' element={<AdminDashboard/>} />
      <Route path='/employee/dashboard' element={<EmployeeDashboard/>} />
      <Route path='/dashboard' element={<InternPortal/>} />
      <Route path='/payslip/:id' element={<PayrollPage/>} />
      <Route path='/payrollAdmin' element={<PayrollAdmin/>} />
      <Route path='/intern/dashboard' element={<InternDashboardPage/>} />
    </Routes>
  )
}

export default App
