
import React, { useEffect, useState } from 'react'
import { FaHeart, FaBars, FaTimes } from "react-icons/fa"
import { FiBell } from "react-icons/fi";
import './nav.css'
import { io } from "socket.io-client";
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
  const API_URL = "https://weddingplanner-backend.onrender.com";

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationStorageKey = user?.email
    ? `bookingNotifications_${user.email}`
    : null;
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;
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
  
  useEffect(() => {
    if (!notificationStorageKey) {
      setNotifications([]);
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(notificationStorageKey) || "[]"
      );

      setNotifications(Array.isArray(saved) ? saved : []);
    } catch {
      setNotifications([]);
    }
  }, [notificationStorageKey]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("User notification socket: token not found");
      return undefined;
    }

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("User notification socket connected:", socket.id);
    });

    socket.on("booking-status-updated", (data) => {
      console.log("User received booking status:", data);

      const status = String(data?.bookingStatus || "").toLowerCase();

      if (
        !data?.bookingId ||
        !["confirmed", "rejected", "expired"].includes(status)
      ) {
        console.warn("Unexpected booking notification payload:", data);
        return;
      }

      setNotifications((previous) => {
        const alreadyExists = previous.some(
          (item) =>
            String(item.bookingId) === String(data.bookingId) &&
            item.bookingStatus === status
        );

        if (alreadyExists) return previous;

        return [
          {
            id: `${data.bookingId}-${status}`,
            bookingId: String(data.bookingId),
            palaceId: data.palaceId,
            bookingStatus: status,
            message:
              data.message ||
              `Your booking request has been ${status}.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...previous,
        ].slice(0, 30);
      });
    });

    socket.on("connect_error", (error) => {
      console.error("User Socket.IO connection error:", error.message);
    });

    return () => {
      socket.off("booking-status-updated");
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  // Persist notifications across page refreshes.
  useEffect(() => {
    if (!notificationStorageKey) return;

    localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(notifications)
    );
  }, [notifications, notificationStorageKey]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const socket = io(API_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  socket.on("booking-status-updated", () => {
    fetchMyBookings();
  });

  return () => socket.disconnect();
}, []);
  const toggleNotifications = () => {
    if (!islogin) {
      navigate("/login");
      closeMenu();
      return;
    }

    setShowNotifications((previous) => !previous);
    closeMenu();
  };

  const openNotification = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
      )
    );

    setShowNotifications(false);
    navigate("/my-bookings");
  };

  const markAllNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };
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
              onClick={() => {
                navigate('/my-bookings')
                closeMenu()
              }}>
              My Bookings
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
                type="button"
                className="nav-notification-btn"
                aria-label="Notifications"
                title="Notifications"
                onClick={toggleNotifications}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
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
                type="button"
                className="nav-notification-btn"
                aria-label="Notifications"
                title="Notifications"
                onClick={toggleNotifications}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
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

              {isMenuOpen ? <></> : <div
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
            type="button"
            className="mobile-notification-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={toggleNotifications}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <button
            className="hamburger-btn"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {showNotifications && (
        <>
          <div
            className="notification-dismiss"
            onClick={() => setShowNotifications(false)}
          />

          <div className="notification-panel">
            <div className="notification-panel-header">
              <h3>Notifications</h3>

              <button
                type="button"
                onClick={markAllNotificationsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="notification-empty">
                <FiBell size={25} />
                <p>No notifications yet</p>
                <span>Your booking updates will appear here.</span>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    className={`notification-item ${notification.read ? "is-read" : "is-unread"
                      }`}
                    onClick={() => openNotification(notification)}
                  >
                    <span
                      className={`notification-status ${notification.bookingStatus}`}
                    >
                      {notification.bookingStatus === "confirmed"
                        ? "✓"
                        : notification.bookingStatus === "rejected"
                          ? "×"
                          : "!"}
                    </span>

                    <span className="notification-content">
                      <strong>
                        Booking {notification.bookingStatus}
                      </strong>

                      <span>{notification.message}</span>

                      <small>
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </span>

                    {!notification.read && (
                      <span className="notification-unread-dot" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="notification-view-all"
              onClick={() => {
                setShowNotifications(false);
                navigate("/my-bookings");
              }}
            >
              View My Bookings
            </button>
          </div>
        </>
      )}
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
