import React, { useEffect, useState } from 'react'
import './nav.css'
import { FaHeart } from "react-icons/fa";
// import {useGsap} from "@gsap/react"
import { useGSAP } from "@gsap/react"
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { ProfileCard } from '../ProfileCard';
export const Nav = () => {
  const [islogin, setIsLogin] = useState(JSON.parse(localStorage.getItem("currentUser")) !== null ? true : false)
  const [isclick, setIsClick] = useState(false)
  const user = islogin ? JSON.parse(localStorage.getItem("currentUser")) : "";
  const navigate = useNavigate()
  const colors = [
    "#D6C7B8",
    "#B8C4BB",
    "#C5C0B8",
    "#B7C3D0",
    "#C9B8B0",
    "#BFC6C2",
    "#D0C4B5",
    "#B9B0C4",
  ];
  const getbgcolor = () => {
    const idx = user?.name?.charCodeAt(0) % colors.length
    return colors[idx]
  } 
  
  const firstLetter = user.name?.[0].toUpperCase();
  const bgcolor = getbgcolor(user.name)
  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".nav-logo", {
      opacity: 0,
      scale: 0.2,
      duration: 0.5,
      delay: 1,
    })
    tl.from(".nav-btn", {
      opacity: 0,
      duration: 0.5,
      y: -20,
      stagger: 1
    })
  }, [])
  const clicklog = () => {
    if (isclick) {
      setIsClick(false)
    } else {
      setIsClick(true)
    }
  }
  const handleLogOut = () => {
    localStorage.removeItem("currentUser")
    setIsLogin(false)
    setIsClick(false)
    navigate("/")
  }

  return (
    <div className="nav-main">
      <div className="nav-top"><div className='heart'><FaHeart /></div>Make your forever unforgettable</div>
      <div className="nav-bottom">
        <div className="nav-logo">
          <div className="nav-logo-img"><img src="https://th.bing.com/th/id/OIP.TxNT0VObjzkCq9Q5UWUBPAHaHa?w=173&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"></img></div>
          <div className="nav-logo-text">WeddingPlanner</div>
        </div>
        <div className="nav-middle">
          <button className="nav-btn" onClick={()=>navigate("/palaces")}>Find a Palace</button>
          <button className="nav-btn">Wedding Packages</button>
          <button className="nav-btn">Inspiration</button>
          <button className="nav-btn">How it Works</button>
        </div>
        {!islogin ? <div className="nav-right">
          <button id="listbtn">List Your Venue</button>
          <button id="sbtn" onClick={() => { navigate("/login") }} >Sign In</button>
          <button id="getbtn">Get Started</button>
        </div>
          :
          <div className="nav-right">
            <button id="listbtn">List Your Venue</button>
            <button id="getbtn">Get Started</button>
            <div onClick={clicklog} style={{ backgroundColor: bgcolor }} className="profile-cicle justify-center rounded-[100%] h-10 w-25  text-center text-3xl font-semibold cursor-pointer
             transition-all duration-300
             hover:scale-105 hover:shadow-md hover:brightness-110">{firstLetter}</div>
          </div>
        }
      </div>
      {isclick ? <ProfileCard user={user} onLogot={handleLogOut}/> : <></>}
    </div>
  )
}
