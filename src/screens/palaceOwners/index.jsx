
import { useEffect, useState } from "react";
import {
  RiBankLine,
} from "react-icons/ri";
import {
  MdOutlineDashboard,
  MdOutlinePhotoSizeSelectActual,
  MdOutlinePayment,
} from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCalendarCheck } from "react-icons/lu";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiPlus,
  FiMapPin,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiArrowUpRight,
  FiEdit2,
} from "react-icons/fi";
import { io } from "socket.io-client";
import { VenueCreation } from "../../components/VenueCreation";
import  "./palaceOwner.css"

const API_URL = "https://weddingplanner-backend.onrender.com";

const menuItems = [
  { name: "Overview", icon: MdOutlineDashboard },
  { name: "Palace Details", icon: RiBankLine },
  { name: "Photos", icon: MdOutlinePhotoSizeSelectActual },
  { name: "Bookings", icon: SlCalender },
  { name: "Availability", icon: LuCalendarCheck },
  { name: "Payments", icon: MdOutlinePayment },
  { name: "Settings", icon: IoSettingsOutline },
];

// Sample bookings for the dashboard UI.
// Replace with your real booking API when it is connected.
const initialBookings = [
  {
    id: "BK-1024",
    name: "Aarav Sharma",
    event: "Wedding Ceremony",
    date: "18 Oct 2026",
    guests: 500,
    amount: 125000,
    status: "Pending",
  },
  {
    id: "BK-1023",
    name: "Priya Mehta",
    event: "Engagement",
    date: "22 Oct 2026",
    guests: 250,
    amount: 75000,
    status: "Confirmed",
  },
  {
    id: "BK-1022",
    name: "Rohan Kapoor",
    event: "Reception",
    date: "25 Oct 2026",
    guests: 800,
    amount: 180000,
    status: "Pending",
  },
  {
    id: "BK-1021",
    name: "Ananya Verma",
    event: "Wedding Ceremony",
    date: "02 Nov 2026",
    guests: 400,
    amount: 110000,
    status: "Confirmed",
  },
];

const emptyPalace = {
  name: "",
  location: "",
  price: "",
  capacity: "",
  description: "",
  Images: [],
  facilities: [],
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "PO";
};

export const PalaceOwners = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [owner] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || {};
    } catch {
      return {};
    }
  });
  const [palaceForm, setPalaceForm] = useState(emptyPalace);
  const [palaceId, setPalaceId] = useState(null);
  const [palaceStatus, setPalaceStatus] = useState("");
  const [loadingPalace, setLoadingPalace] = useState(true);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let isMounted = true;

    const checkMyPalace = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in again to continue.");
        }

        const response = await fetch(`${API_URL}/palace/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load your palace.");
        }

        const myPalaces = Array.isArray(data.palace)
          ? data.palace
          : [];

        if (!isMounted) return;

        if (myPalaces.length === 0) {
          setShowCreateWizard(true);
          return;
        }

        const palace = myPalaces[0];

        setShowCreateWizard(false);
        setPalaceId(palace._id);
        setPalaceStatus(palace.status || "pending");

        setPalaceForm({
          name: palace.name || "",
          location: palace.location || "",
          price: palace.price ?? "",
          capacity: palace.capacity ?? "",
          description: palace.description || "",
          Images: Array.isArray(palace.Images) ? palace.Images : [],
          facilities: Array.isArray(palace.facilities)
            ? palace.facilities
            : [],
        });
      } catch (error) {
        console.error("Load palace error:", error);

        if (isMounted) {
          setNotice(error.message || "Unable to load your palace.");
        }
      } finally {
        if (isMounted) setLoadingPalace(false);
      }
    };

    checkMyPalace();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("palace-status-updated", (data) => {
      if (
        palaceId &&
        String(data.palaceId) !== String(palaceId)
      ) {
        return;
      }

      setPalaceStatus(data.status || "");
      setNotice(
        data.message ||
          `Your palace status is now ${data.status || "updated"}.`
      );
    });

    socket.on("connect_error", (error) => {
      console.error("Owner Socket.IO error:", error.message);
    });

    return () => socket.disconnect();
  }, [palaceId]);

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  );

  const totalBookingValue = confirmedBookings.reduce(
    (total, booking) => total + booking.amount,
    0
  );

  const filteredBookings = bookings.filter((booking) =>
    `${booking.name} ${booking.event} ${booking.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusInfo = (() => {
    switch (palaceStatus.toLowerCase()) {
      case "approved":
        return {
          label: "Approved",
          message:
            "Your palace has been approved and can be displayed to customers.",
          className: "po-status-approved",
        };

      case "rejected":
        return {
          label: "Rejected",
          message:
            "Your palace was rejected. Please contact the admin for further details.",
          className: "po-status-rejected",
        };

      default:
        return {
          label: "Pending Approval",
          message:
            "Your palace is waiting for admin approval.",
          className: "po-status-pending",
        };
    }
  })();

  const handleBooking = (id, status) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );

    setNotice(
      "Booking updated in this dashboard only. Connect the booking API to save this change."
    );
  };

  const handlePalaceField = (event) => {
    const { name, value } = event.target;

    setPalaceForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePalaceFormSubmit = (event) => {
    event.preventDefault();

    setNotice(
      "Changes are currently a local preview. A backend palace-update route is required to save them permanently."
    );
  };

  const handlePhotoSelection = (event) => {
    const files = Array.from(event.target.files || []);

    setSelectedPhotos((previous) => [
      ...previous,
      ...files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ]);

    event.target.value = "";
  };

  useEffect(() => {
    return () => {
      selectedPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [selectedPhotos]);

  const displayName = palaceForm.name || owner.name || "Palace Owner";
  const initials = getInitials(displayName);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loadingPalace) {
    return (
      <div className="po-loading">
        <div className="po-loader" />
        <p>Checking your palace...</p>
      </div>
    );
  }

  if (showCreateWizard) {
    return <VenueCreation />;
  }

  return (
    <div className="venue-workspace po-dashboard">
      {mobileMenu && (
        <button
          type="button"
          className="po-mobile-overlay"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`po-sidebar ${mobileMenu ? "po-sidebar-open" : ""}`}>
        <div className="po-brand">
          <div className="po-brand-icon">
            <RiBankLine />
          </div>
          <div>
            <strong>Wedora</strong>
            <span>PALACE PARTNER</span>
          </div>
        </div>

        <p className="po-sidebar-label">WORKSPACE</p>

        <nav className="po-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                type="button"
                key={item.name}
                className={`po-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.name);
                  setMobileMenu(false);
                }}
              >
                <Icon />
                <span>{item.name}</span>

                {item.name === "Bookings" && pendingCount > 0 && (
                  <span className="po-nav-count">{pendingCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="po-sidebar-bottom">
          <div className="po-upcoming-card">
            <div className="po-upcoming-heading">
              <FiCalendarIcon />
              <strong>Booking requests</strong>
            </div>

            <p className="po-upcoming-number">{pendingCount}</p>
            <p className="po-muted-text">
              Requests awaiting your response
            </p>

            <button
              type="button"
              className="po-text-button"
              onClick={() => setActiveTab("Bookings")}
            >
              View bookings <span>→</span>
            </button>
          </div>

          <div className="po-profile">
            <span className="po-profile-avatar">{initials}</span>
            <div className="po-profile-info">
              <strong>{displayName}</strong>
              <small>Palace Owner</small>
            </div>
            <button
              type="button"
              className="po-settings-button"
              title="Settings"
              onClick={() => setActiveTab("Settings")}
            >
              <IoSettingsOutline />
            </button>
          </div>
        </div>
      </aside>

      <main className="po-main">
        <header className="po-topbar">
          <div className="po-topbar-left">
            <button
              type="button"
              className="po-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open navigation menu"
            >
              <FiMenu />
            </button>

            <div>
              <p className="po-breadcrumb">Workspace / {activeTab}</p>
              <h2>{activeTab}</h2>
            </div>
          </div>

          <div className="po-topbar-right">
            <div className="po-search-box">
              <FiSearch />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search bookings..."
                aria-label="Search bookings"
              />
            </div>

            <button
              type="button"
              className="po-notification-button"
              title="Notifications"
              onClick={() =>
                setNotice(
                  palaceStatus
                    ? `Current palace status: ${statusInfo.label}`
                    : "No new palace status information."
                )
              }
            >
              <FiBell />
              {palaceStatus.toLowerCase() === "pending" && (
                <span className="po-notification-dot" />
              )}
            </button>

            <div className="po-topbar-profile">
              <div className="po-topbar-profile-copy">
                <strong>{displayName}</strong>
                <span>Palace Partner</span>
              </div>
              <span className="po-avatar">{initials}</span>
            </div>
          </div>
        </header>

        <div className="po-content">
          {notice && (
            <div className="po-notice" role="status">
              <span>{notice}</span>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                ×
              </button>
            </div>
          )}

          {palaceId && (
            <div className={`po-status-banner ${statusInfo.className}`}>
              <div>
                <strong>Palace Status: {statusInfo.label}</strong>
                <p>{statusInfo.message}</p>
              </div>
              <span className="po-status-icon">
                {palaceStatus.toLowerCase() === "approved" ? (
                  <FiCheckCircle />
                ) : (
                  <FiClock />
                )}
              </span>
            </div>
          )}

          {activeTab === "Overview" && (
            <>
              <section className="po-page-heading">
                <div>
                  <span className="po-eyebrow">OWNER DASHBOARD</span>
                  <h1>Welcome back, {displayName}</h1>
                  <p>
                    {today}. Here is an overview of your palace workspace.
                  </p>
                </div>

                <button
                  type="button"
                  className="po-primary-button"
                  onClick={() => setActiveTab("Palace Details")}
                >
                  <FiEdit2 /> Edit Palace Details
                </button>
              </section>

              <section className="po-stats-grid">
                <article className="po-stat-card">
                  <span className="po-stat-icon po-icon-brown">
                    <SlCalender />
                  </span>
                  <p>Total Bookings</p>
                  <h3>{bookings.length}</h3>
                  <small>Sample dashboard data</small>
                </article>

                <article className="po-stat-card">
                  <span className="po-stat-icon po-icon-gold">
                    <FiClock />
                  </span>
                  <p>Pending Requests</p>
                  <h3>{pendingCount}</h3>
                  <small>Awaiting your response</small>
                </article>

                <article className="po-stat-card">
                  <span className="po-stat-icon po-icon-green">
                    <FiTrendingUp />
                  </span>
                  <p>Confirmed Booking Value</p>
                  <h3>{money(totalBookingValue)}</h3>
                  <small>Based on sample bookings</small>
                </article>

                <article className="po-stat-card">
                  <span className="po-stat-icon po-icon-purple">
                    <FiCheckCircle />
                  </span>
                  <p>Confirmed Events</p>
                  <h3>{confirmedBookings.length}</h3>
                  <small>Sample dashboard data</small>
                </article>
              </section>

              <section className="po-overview-grid">
                <article className="po-panel po-palace-card">
                  <div className="po-panel-heading">
                    <div>
                      <h3>Your Palace</h3>
                      <p>Manage your venue profile</p>
                    </div>
                    <button
                      type="button"
                      className="po-outline-button"
                      onClick={() => setActiveTab("Palace Details")}
                    >
                      <FiEdit2 /> Edit
                    </button>
                  </div>

                  <div className="po-palace-cover">
                    <img
                      src={
                        palaceForm.Images?.[0] ||
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85"
                      }
                      alt={palaceForm.name || "Wedding palace"}
                    />
                    <div className="po-cover-shade" />
                    <div className="po-cover-content">
                      <span className="po-cover-badge">
                        {palaceStatus.toLowerCase() === "approved" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiClock />
                        )}
                        {statusInfo.label}
                      </span>
                      <h4>{palaceForm.name || "Your Palace"}</h4>
                      <p>
                        <FiMapPin />
                        {palaceForm.location || "Location not added"}
                      </p>
                    </div>
                  </div>

                  <div className="po-palace-facts">
                    <div>
                      <span>Starting price</span>
                      <strong>
                        {palaceForm.price !== ""
                          ? money(palaceForm.price)
                          : "Not added"}
                      </strong>
                    </div>
                    <div>
                      <span>Guest capacity</span>
                      <strong>
                        {palaceForm.capacity
                          ? `${palaceForm.capacity} guests`
                          : "Not added"}
                      </strong>
                    </div>
                    <div>
                      <span>Gallery photos</span>
                      <strong>{palaceForm.Images.length} photos</strong>
                    </div>
                  </div>
                </article>

                <article className="po-panel">
                  <div className="po-panel-heading">
                    <div>
                      <h3>Booking Overview</h3>
                      <p>Current request summary</p>
                    </div>
                    <button
                      type="button"
                      className="po-text-button"
                      onClick={() => setActiveTab("Bookings")}
                    >
                      View all →
                    </button>
                  </div>

                  <div className="po-summary-list">
                    <div>
                      <span className="po-summary-icon">
                        <FiClock />
                      </span>
                      <div>
                        <strong>Pending requests</strong>
                        <p>Waiting for your decision</p>
                      </div>
                      <b>{pendingCount}</b>
                    </div>

                    <div>
                      <span className="po-summary-icon">
                        <FiCheckCircle />
                      </span>
                      <div>
                        <strong>Confirmed bookings</strong>
                        <p>Bookings marked confirmed</p>
                      </div>
                      <b>{confirmedBookings.length}</b>
                    </div>

                    <div>
                      <span className="po-summary-icon">
                        <FiUsers />
                      </span>
                      <div>
                        <strong>Guest capacity</strong>
                        <p>Listed palace capacity</p>
                      </div>
                      <b>{palaceForm.capacity || "—"}</b>
                    </div>
                  </div>

                  <div className="po-tip-card">
                    <strong>Helpful tip</strong>
                    <p>
                      Keep your palace information, location and gallery
                      updated to help customers understand your venue.
                    </p>
                  </div>
                </article>
              </section>

              <BookingTable
                bookings={filteredBookings.slice(0, 4)}
                money={money}
                handleBooking={handleBooking}
                setActiveTab={setActiveTab}
                compact
              />
            </>
          )}

          {activeTab === "Palace Details" && (
            <section className="po-panel po-form-panel">
              <div className="po-section-heading">
                <h3>Palace Details</h3>
                <p>Review and edit your venue information.</p>
              </div>

              <form
                className="po-form-grid"
                onSubmit={handlePalaceFormSubmit}
              >
                <label>
                  Palace Name
                  <input
                    name="name"
                    value={palaceForm.name}
                    onChange={handlePalaceField}
                    placeholder="Enter palace name"
                    required
                  />
                </label>

                <label>
                  Location
                  <input
                    name="location"
                    value={palaceForm.location}
                    onChange={handlePalaceField}
                    placeholder="Enter palace location"
                    required
                  />
                </label>

                <label>
                  Starting Price (₹)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={palaceForm.price}
                    onChange={handlePalaceField}
                    placeholder="Enter price"
                    required
                  />
                </label>

                <label>
                  Guest Capacity
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={palaceForm.capacity}
                    onChange={handlePalaceField}
                    placeholder="Enter guest capacity"
                    required
                  />
                </label>

                <label className="po-full-width">
                  Palace Description
                  <textarea
                    name="description"
                    rows="5"
                    value={palaceForm.description}
                    onChange={handlePalaceField}
                    placeholder="Describe your palace, facilities and amenities..."
                  />
                </label>

                <label className="po-full-width">
                  Facilities
                  <input
                    value={palaceForm.facilities.join(", ")}
                    onChange={(event) =>
                      setPalaceForm((previous) => ({
                        ...previous,
                        facilities: event.target.value
                          .split(",")
                          .map((facility) => facility.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="Parking, Catering, AC, Rooms"
                  />
                  <small>Separate facilities with commas.</small>
                </label>

                <div className="po-full-width">
                  <button type="submit" className="po-primary-button">
                    Save Details
                  </button>
                  <p className="po-form-help">
                    The current backend update route has not been connected
                    in this component. This form currently updates the
                    local preview only.
                  </p>
                </div>
              </form>
            </section>
          )}

          {activeTab === "Photos" && (
            <section className="po-panel">
              <div className="po-section-heading po-section-heading-row">
                <div>
                  <h3>Palace Gallery</h3>
                  <p>View existing photos and preview selected images.</p>
                </div>

                <label className="po-primary-button po-file-button">
                  <FiPlus /> Choose Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelection}
                  />
                </label>
              </div>

              <div className="po-gallery-grid">
                {palaceForm.Images.map((photo, index) => (
                  <div className="po-gallery-item" key={`${photo}-${index}`}>
                    <img src={photo} alt={`Palace ${index + 1}`} />
                    <span>Saved palace photo</span>
                  </div>
                ))}

                {selectedPhotos.map((photo, index) => (
                  <div
                    className="po-gallery-item"
                    key={`${photo.name}-${index}`}
                  >
                    <img src={photo.url} alt={photo.name} />
                    <span>{photo.name}</span>
                  </div>
                ))}

                {palaceForm.Images.length === 0 &&
                  selectedPhotos.length === 0 && (
                    <div className="po-empty-state">
                      <MdOutlinePhotoSizeSelectActual />
                      <strong>No photos available</strong>
                      <p>Select photos to preview them here.</p>
                    </div>
                  )}
              </div>

              <p className="po-form-help">
                Selected photos are only previewed in this browser. A
                backend image-upload endpoint is required to save them.
              </p>
            </section>
          )}

          {activeTab === "Bookings" && (
            <BookingTable
              bookings={filteredBookings}
              money={money}
              handleBooking={handleBooking}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "Availability" && (
            <section className="po-panel po-form-panel">
              <div className="po-section-heading">
                <h3>Venue Availability</h3>
                <p>Select a date to review availability.</p>
              </div>

              <div className="po-availability-box">
                <label>
                  Select date
                  <input
                    type="date"
                    onChange={(event) => {
                      if (event.target.value) {
                        setNotice(
                          `Selected date: ${event.target.value}. No availability changes have been saved.`
                        );
                      }
                    }}
                  />
                </label>

                <p>
                  Availability is not yet connected to a backend endpoint.
                  Selecting a date does not change customer-facing availability.
                </p>
              </div>
            </section>
          )}

          {activeTab === "Payments" && (
            <section className="po-panel">
              <div className="po-section-heading">
                <h3>Payments & Earnings</h3>
                <p>
                  Summary calculated from the sample bookings currently
                  displayed in this dashboard.
                </p>
              </div>

              <div className="po-earnings-card">
                <span>Confirmed booking value</span>
                <strong>{money(totalBookingValue)}</strong>
                <small>This is not verified payment revenue.</small>
              </div>

              <div className="po-payment-list">
                {confirmedBookings.map((booking) => (
                  <div key={booking.id}>
                    <div>
                      <strong>{booking.name}</strong>
                      <p>{booking.id} · {booking.date}</p>
                    </div>
                    <strong>{money(booking.amount)}</strong>
                  </div>
                ))}

                {confirmedBookings.length === 0 && (
                  <div className="po-empty-state">
                    No confirmed bookings available.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "Settings" && (
            <section className="po-panel po-form-panel">
              <div className="po-section-heading">
                <h3>Account Settings</h3>
                <p>Account information loaded from your login session.</p>
              </div>

              <form
                className="po-form-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotice(
                    "Account settings are not connected to a backend update route yet."
                  );
                }}
              >
                <label className="po-full-width">
                  Owner Name
                  <input
                    defaultValue={owner.name || ""}
                    placeholder="Enter owner name"
                  />
                </label>

                <label>
                  Contact Email
                  <input
                    type="email"
                    defaultValue={owner.email || ""}
                    placeholder="Enter email"
                  />
                </label>

                <label>
                  Contact Number
                  <input
                    type="tel"
                    defaultValue={owner.mobileno || ""}
                    placeholder="Enter contact number"
                  />
                </label>

                <div className="po-full-width">
                  <button type="submit" className="po-primary-button">
                    Save Settings
                  </button>
                </div>
              </form>
            </section>
          )}

          <footer className="po-footer">
            <span>© {new Date().getFullYear()} Wedora · Palace Partner</span>
            <span>Making every celebration memorable.</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

function BookingTable({
  bookings,
  money,
  handleBooking,
  setActiveTab,
  compact = false,
}) {
  return (
    <section className="po-panel po-bookings-panel">
      <div className="po-panel-heading po-bookings-heading">
        <div>
          <h3>{compact ? "Recent Booking Requests" : "Manage Bookings"}</h3>
          <p>
            {compact
              ? "A quick look at the latest sample booking requests."
              : "Review and manage booking requests."}
          </p>
        </div>

        {compact && (
          <button
            type="button"
            className="po-outline-button"
            onClick={() => setActiveTab("Bookings")}
          >
            View all <FiArrowUpRight />
          </button>
        )}
      </div>

      <div className="po-table-wrap">
        <table className="po-bookings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Event</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <div className="po-customer">
                    <span className="po-customer-avatar">
                      {getInitials(booking.name)}
                    </span>
                    <div>
                      <strong>{booking.name}</strong>
                      <small>{booking.id}</small>
                    </div>
                  </div>
                </td>

                <td>
                  <strong>{booking.event}</strong>
                  <small className="po-table-subtext">
                    <FiUsers /> {booking.guests} guests
                  </small>
                </td>

                <td>{booking.date}</td>
                <td className="po-table-amount">{money(booking.amount)}</td>

                <td>
                  <span
                    className={`po-booking-status po-booking-${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td>
                  {booking.status === "Pending" ? (
                    <div className="po-booking-actions">
                      <button
                        type="button"
                        className="po-accept-button"
                        onClick={() =>
                          handleBooking(booking.id, "Confirmed")
                        }
                        title="Accept booking"
                      >
                        <FiCheckCircle />
                        Accept
                      </button>
                      <button
                        type="button"
                        className="po-reject-button"
                        onClick={() =>
                          handleBooking(booking.id, "Rejected")
                        }
                        title="Reject booking"
                      >
                        <FiXCircle />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="po-action-complete">
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="po-table-empty">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="po-table-footer">
        Showing {bookings.length} booking request(s).
        Booking rows currently use sample data.
      </div>
    </section>
  );
}

function FiCalendarIcon() {
  return <SlCalender />;
}

export default PalaceOwners;
