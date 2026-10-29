import React from 'react'
import { Route, Routes ,Navigate} from 'react-router-dom'
// import { Signup } from '../screens/Signup.jsx'
import { Home } from '../screens/Home/index'
import { Signup } from '../screens/Signup'
import { Signin } from '../screens/Signin'
import { Palaces } from '../screens/Palaces'
import { PalaceOwners } from '../screens/palaceOwners'
import AdminDashboard from '../components/AdminDashboard'
import ProtectedRoute from './ProtectedRoute'
import { PalaceDetails } from '../screens/PalaceDetails'
import { MyBookings } from '../screens/MyBookings'

const HomeRedirect = () => {
  const token = localStorage.getItem("token");

  let currentUser = {};

  try {
    currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    );
  } catch {
    currentUser = {};
  }

  if (token && currentUser.role === "owner") {
    return <Navigate to="/owner-dashboard" replace />;
  }

  if (token && currentUser.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Home />;
};

export const AppRoutes = () => {
  return (

    <Routes>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Signin />}></Route>
      <Route path="/" element={<HomeRedirect  />}></Route>
      <Route path="/palaces" element={<Palaces />}></Route>
      <Route path="/palace/:palaceId" element={<PalaceDetails />}></Route>
      <Route path="/owner-dashboard" element={<ProtectedRoute allowedRoles={["owner"]}><PalaceOwners /></ProtectedRoute>}></Route>
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<MyBookings />}></Route>
      <Route path="*" element={<Navigate to="/" replace />}/>
    </Routes>

  )
}
