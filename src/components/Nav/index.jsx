
import React, { useEffect, useState } from 'react'
import { FaHeart, FaBars, FaTimes } from "react-icons/fa"
import './nav.css'

import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { useNavigate } from 'react-router-dom'
import { ProfileCard } from '../ProfileCard'

export const Nav = () => {
  const [islogin, setIsLogin] = useState(
    JSON.parse(localStorage.getItem("currentUser")) !== null
  )

  const [isclick, setIsClick] = useState(false)
  const user = islogin
    ? JSON.parse(localStorage.getItem("currentUser"))
    : ""

  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
  ]

  const getbgcolor = () => {
    const idx = user?.name?.charCodeAt(0) % colors.length
    return colors[idx]
  }

  const firstLetter = user?.name?.[0]?.toUpperCase() || ""
  const bgcolor = getbgcolor()

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
    setIsClick(prev => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogOut = () => {
    localStorage.removeItem("currentUser")
    setIsLogin(false)
    setIsClick(false)
    setIsMenuOpen(false)
    navigate("/")
  }

  return (
    <div className="nav-main">
      <div className="nav-top">
        <div className="heart">
          <FaHeart />
        </div>
        Make your forever unforgettable
      </div>

      <div className={`nav-bottom ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="nav-logo">
          <div className="nav-logo-img">
            <img
              src="https://th.bing.com/th/id/OIP.TxNT0VObjzkCq9Q5UWUBPAHaHa?w=173&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3"
              alt="WeddingPlanner logo"
            />
          </div>

          <div className="nav-logo-text">
            WeddingPlanner
          </div>
        </div>

        <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>

          {/* Mobile profile header */}
          {islogin && (
            <div className="mobile-profile-header">
              <div
                className="mobile-profile-circle"
                style={{ backgroundColor: bgcolor }}
              >
                {firstLetter}
              </div>

              <div className="mobile-profile-info">
                <div className="mobile-profile-name">
                  {user?.name}
                </div>

                <div className="mobile-profile-email">
                  {user?.email}
                </div>
              </div>
            </div>
          )}
          <div className="nav-middle">
            <button
              className="nav-btn"
              onClick={() => {
                navigate("/palaces")
                closeMenu()
              }}
            >
              Find a Palace
            </button>

            <button
              className="nav-btn"
              onClick={closeMenu}
            >
              Wedding Packages
            </button>

            <button
              className="nav-btn"
              onClick={closeMenu}
            >
              Inspiration
            </button>

            <button
              className="nav-btn"
              onClick={closeMenu}
            >
              How it Works
            </button>
          </div>

          {!islogin ? (
            <div className="nav-right">
              <button
                id="listbtn"
                onClick={() => {
                  navigate("/login")
                  closeMenu()
                }}
              >
                List Your Venue
              </button>

              <button
                id="sbtn"
                onClick={() => {
                  navigate("/login")
                  closeMenu()
                }}
              >
                Sign In
              </button>

              <button
                className="desktop-getbtn"
                onClick={() => {
                  navigate("/login")
                  closeMenu()
                }}
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="nav-right">
              <button
                id="listbtn"
                onClick={() => {
                  navigate("/login")
                  closeMenu()
                }}
              >
                List Your Venue
              </button>

              <button
                className="desktop-getbtn"
                onClick={() => {
                  navigate("/palaces")
                  closeMenu()
                }}
              >
                Get Started
              </button>

              {isMenuOpen?<></>:<div
                onClick={() => {
                  clicklog()
                  closeMenu()
                }}
                style={{ backgroundColor: bgcolor }}
                className="profile-cicle"
                role="button"
                tabIndex={0}
                aria-label="Open profile"
              >
                {firstLetter}
              </div>}

              {/* Visible only in the mobile sidebar */}
              <button
                className="mobile-logout-btn"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="mobile-actions">
          <button
            className="mobile-getbtn"
            onClick={() => {
              navigate(islogin ? "/palaces" : "/login")
              closeMenu()
            }}
          >
            Get Started
          </button>

          <button
            className="hamburger-btn"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(prev => !prev)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="nav-overlay"
          onClick={closeMenu}
        />
      )}

      {isclick && (
        <ProfileCard
          user={user}
          onLogot={handleLogOut}
        />
      )}
    </div>
  )
}
