import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admindashboard.css";

const API_URL = "https://weddingplanner-backend.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [palaces, setPalaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState("");
  const [activePage, setActivePage] = useState("Overview");

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  const fetchPendingPalaces = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log(token)
      const response = await fetch(`${API_URL}/palace/pending`,{
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch pending palaces.");
      }

      setPalaces(data.palaces || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingPalaces();
  }, [fetchPendingPalaces]);

  const handlePalaceStatus = async (palaceId, status) => {
    setActionId(palaceId);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/palace/${palaceId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Unable to ${status} palace.`);
      }

      setPalaces((previousPalaces) =>
        previousPalaces.filter((palace) => palace._id !== palaceId)
      );

      setMessage(
        `${data.palace?.name || "Palace"} ${status} successfully.`
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setActionId("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sidebarItems = [
    { name: "Overview", icon: "⌂" },
    { name: "Palace Approvals", icon: "♜" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">W</div>
          <div>
            <h2>Wedora</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            {(currentUser.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="admin-profile-info">
            <h4>{currentUser.name || "Administrator"}</h4>
            <p>Super Admin</p>
          </div>
          <span className="admin-online-dot" />
        </div>

        <p className="admin-menu-label">WORKSPACE</p>

        <nav className="admin-navigation">
          {sidebarItems.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`admin-nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Palace Approvals" && palaces.length > 0 && (
                <span className="admin-nav-count">{palaces.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-help-card">
            <span className="admin-help-icon">✦</span>
            <h4>Need assistance?</h4>
            <p>Manage your wedding platform with confidence.</p>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">Workspace / Admin</p>
            <h2>{activePage}</h2>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-date">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="admin-top-avatar">
              {(currentUser.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-welcome">
            <div>
              <p className="admin-eyebrow">YOUR WEDDING PLATFORM</p>
              <h1>
                Welcome back,{" "}
                <span>{currentUser.name || "Admin"}</span>!
              </h1>
              <p className="admin-welcome-text">
                Here's what's happening with your palace listings today.
              </p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={fetchPendingPalaces}
              disabled={loading}
            >
              ↻ {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="admin-stats-grid">
            <article className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Pending Palaces</span>
                <span className="admin-stat-icon gold">◷</span>
              </div>
              <h2>{loading ? "—" : palaces.length}</h2>
              <p>Require your review</p>
              <div className="admin-stat-line gold-line" />
            </article>

            <article className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Review Queue</span>
                <span className="admin-stat-icon purple">▤</span>
              </div>
              <h2>{loading ? "—" : palaces.length}</h2>
              <p>Listings awaiting a decision</p>
              <div className="admin-stat-line purple-line" />
            </article>

            <article className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Platform Status</span>
                <span className="admin-stat-icon green">✓</span>
              </div>
              <h2 className="admin-status-heading">Active</h2>
              <p>Admin workspace</p>
              <div className="admin-stat-line green-line" />
            </article>
          </div>

          <section className="admin-approval-section">
            <div className="admin-section-heading">
              <div>
                <p className="admin-eyebrow">LISTING MANAGEMENT</p>
                <h2>
                  {activePage === "Overview"
                    ? "Pending Palace Approvals"
                    : "Palace Review Queue"}
                </h2>
                <p>Review owner submissions before they go live.</p>
              </div>

              <span className="admin-pending-badge">
                {palaces.length} Pending
              </span>
            </div>

            {message && (
              <div className="admin-alert success-alert">{message}</div>
            )}

            {error && (
              <div className="admin-alert error-alert">
                {error}
                <button type="button" onClick={() => setError("")}>
                  ×
                </button>
              </div>
            )}

            {loading ? (
              <div className="admin-empty-state">
                <div className="admin-loader" />
                <h3>Loading palace listings...</h3>
                <p>Please wait while we fetch the review queue.</p>
              </div>
            ) : palaces.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">✓</div>
                <h3>You're all caught up!</h3>
                <p>There are no pending palace listings to review.</p>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={fetchPendingPalaces}
                >
                  Check again
                </button>
              </div>
            ) : (
              <div className="admin-palace-grid">
                {palaces.map((palace) => (
                  <article className="admin-palace-card" key={palace._id}>
                    <div className="admin-palace-image">
                      {palace.Images?.[0] ? (
                        <img
                          src={palace.Images[0]}
                          alt={palace.name}
                        />
                      ) : (
                        <div className="admin-image-placeholder">⌂</div>
                      )}

                      <span className="admin-image-status">Pending review</span>
                    </div>

                    <div className="admin-palace-details">
                      <div className="admin-palace-title-row">
                        <h3>{palace.name}</h3>
                        <span className="admin-pending-dot" />
                      </div>

                      <p className="admin-palace-location">
                        <span>⌖</span> {palace.location}
                      </p>

                      <p className="admin-palace-description">
                        {palace.description || "No description provided."}
                      </p>

                      <div className="admin-palace-meta">
                        <div>
                          <span>Starting price</span>
                          <strong>
                            ₹{Number(palace.price || 0).toLocaleString("en-IN")}
                          </strong>
                        </div>
                        <div>
                          <span>Guest capacity</span>
                          <strong>
                            {Number(palace.capacity || 0).toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </div>

                      {palace.owner && (
                        <div className="admin-owner-info">
                          <div className="admin-owner-avatar">
                            {(palace.owner.name || "O")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <span>Submitted by</span>
                            <strong>{palace.owner.name || "Palace owner"}</strong>
                            {palace.owner.email && (
                              <small>{palace.owner.email}</small>
                            )}
                          </div>
                        </div>
                      )}

                      {palace.facilities?.length > 0 && (
                        <div className="admin-facilities">
                          {palace.facilities.slice(0, 3).map((facility) => (
                            <span key={facility}>{facility}</span>
                          ))}
                        </div>
                      )}

                      <div className="admin-palace-actions">
                        <button
                          type="button"
                          className="admin-reject-btn"
                          disabled={actionId === palace._id}
                          onClick={() =>
                            handlePalaceStatus(palace._id, "rejected")
                          }
                        >
                          {actionId === palace._id
                            ? "Please wait..."
                            : "Reject"}
                        </button>

                        <button
                          type="button"
                          className="admin-approve-btn"
                          disabled={actionId === palace._id}
                          onClick={() =>
                            handlePalaceStatus(palace._id, "approved")
                          }
                        >
                          {actionId === palace._id
                            ? "Please wait..."
                            : "✓ Approve Palace"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="admin-footer">
            <span>© {new Date().getFullYear()} Wedora Admin</span>
            <span>Made for beautiful celebrations ♡</span>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;