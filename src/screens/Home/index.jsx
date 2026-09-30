import React from 'react'
import './home.css'
import { StartPLannigSearch } from '../../components/StartPlannigSearch'
import { HeroSection } from '../../components/HeroSection'
import { HomeMiddle } from '../../components/HomeMiddle'
export const Home = () => {
  return (
    <div className="homepage">
    <HeroSection/>
    <StartPLannigSearch/>
    <HomeMiddle/>
    </div>
  )
}
