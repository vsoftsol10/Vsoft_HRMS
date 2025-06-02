import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/dashboard/dashboard'


function App() {

  return (
    <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
    </Routes>
  )
}

export default App
