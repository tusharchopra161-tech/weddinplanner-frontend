import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import { Signup } from '../screens/Signup.jsx'
import { Home } from '../screens/Home/index'
import { Signup } from '../screens/Signup'
import { Signin } from '../screens/Signin'
import { Palaces } from '../screens/Palaces'
import { PalaceOwners } from '../screens/palaceOwners'
import AdminDashboard from '../components/AdminDashboard'
import ProtectedRoute from './ProtectedRoute'
import { PalaceDetails } from '../screens/PalaceDetails'
export const AppRoutes = () => {
  return (
    
    <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Signin/>}></Route>
        <Route path="/palaces" element={<Palaces/>}></Route>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/palace/:palaceId" element={<PalaceDetails/>}></Route>
        <Route path="/owner-dashboard" element={<PalaceOwners/>}></Route>
        <Route path="/admin-dashboard"element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}/>
    </Routes>
    
  )
}
