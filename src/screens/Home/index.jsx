import React from 'react'
import './home.css'
import { StartPLannigSearch } from '../../components/StartPlannigSearch'
import { HeroSection } from '../../components/HeroSection'
import { HomeMiddle } from '../../components/HomeMiddle'
import { useLocation } from 'react-router-dom'
export const Home = () => {
  const location=useLocation()
  const googleUser=location.state?.googleUser
console.log("this is from state",googleUser)
  return (

    <div className="homepage">
    <HeroSection/>
    <StartPLannigSearch/>
    <HomeMiddle/>
    </div>
  )
}
