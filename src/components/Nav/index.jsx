import React, { useEffect } from 'react'
import './nav.css'
import { FaHeart } from "react-icons/fa";
// import {useGsap} from "@gsap/react"
import {useGSAP} from "@gsap/react"
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
export const Nav = () => {
  const navigate=useNavigate()
  useGSAP(()=>{
    const tl=gsap.timeline()
    tl.from(".nav-logo",{
      opacity:0,
      scale:0.2,
      duration:0.5,
      delay:1,
    })
    tl.from(".nav-btn",{
    opacity:0,
    duration:0.5,
    
    y:-20,
    stagger:1
  })
  },[]) 
  return (
    <div className="nav-main">
        <div className="nav-top"><div className='heart'><FaHeart/></div>Make your forever unforgettable</div>
        <div className="nav-bottom">
            <div className="nav-logo">
                <div className="nav-logo-img"><img src="https://th.bing.com/th/id/OIP.TxNT0VObjzkCq9Q5UWUBPAHaHa?w=173&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"></img></div>
                <div className="nav-logo-text">WeddingPlanner</div>
            </div>
            <div className="nav-middle">
              <button className="nav-btn">Find a Palace</button>
              <button className="nav-btn">Wedding Packages</button>
              <button className="nav-btn">Inspiration</button>
              <button className="nav-btn">How it Works</button>
            </div>
            <div className="nav-right">
              <button id="listbtn">List Your Venue</button>
              <button id="sbtn" onClick={()=>{navigate("/login")}} >Sign In</button>
              <button id="getbtn">Get Started</button>
            </div>
        </div>
    </div>
  )
}
