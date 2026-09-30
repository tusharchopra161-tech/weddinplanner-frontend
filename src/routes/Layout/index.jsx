import React from 'react'
import { AppRoutes } from '../AppRoutes'
import { useLocation } from 'react-router-dom'
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

export const Layout = () => {
   const location= useLocation();
   const hideLayout=location.pathname==="/login"||location.pathname==="/signup";

   console.log(!hideLayout)
  return (
    <>
    {!hideLayout?<Nav/>:<></>}
    <AppRoutes/>
    {!hideLayout&&<Footer/>}
    </>
    
  )
}
