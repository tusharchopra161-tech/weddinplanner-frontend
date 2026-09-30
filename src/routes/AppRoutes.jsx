import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import { Signup } from '../screens/Signup.jsx'
import { Home } from '../screens/Home/index'
import { Signup } from '../screens/Signup'
import { Signin } from '../screens/Signin'

export const AppRoutes = () => {
  return (
    
    <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Signin/>}></Route>
        <Route path="/" element={<Home/>}></Route>
    </Routes>
    
  )
}
