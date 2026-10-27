import React from 'react'
import { AppRoutes } from '../AppRoutes'
import { useLocation } from 'react-router-dom'
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

export const Layout = () => {
   const location= useLocation();
   const hideLayout=location.pathname==="/login"||location.pathname==="/signup"||location.pathname==="/owner-dashboard" ||location.pathname==="/admin-dashboard" ;
  return (
    <>
    {!hideLayout?<Nav/>:<></>}
    <AppRoutes/>
    {!hideLayout&&<Footer/>}
    </>
  )
}
