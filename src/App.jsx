import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
// import PayslipGenerator from './components/payroll/PaySlipGenerator'
import PayrollPage from './pages/PayrollPage'
import InternDashboardPage from './pages/InternDashboardPage'



function App() {

  return (
    <Routes>
      <Route path='/payslip/:id' element={<PayrollPage/>} />
      <Route path='/intern/dashboard' element={<InternDashboardPage/>} />
    </Routes>
  )
}

export default App
