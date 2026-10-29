import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { enablePushNotifications } from "../../utils/pushNotifications";
import "./EnablePushNotification.css";

export const EnablePushNotification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      await enablePushNotifications();
      setSuccess(true);
      setMessage("Notifications enabled");
    } catch (error) {
      setMessage(error.message || "Unable to enable notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="push-enable-wrapper">
      <button
        type="button"
        className={`push-enable-btn ${success ? "enabled" : ""}`}
        onClick={handleEnable}
        disabled={loading}
        title="Enable notifications on this device"
      >
        <IoNotificationsOutline />
        <span>
          {loading
            ? "Enabling..."
            : success
            ? "Enabled"
            : "Enable Alerts"}
        </span>
      </button>

      {message && (
        <span
          className={`push-enable-message ${
            success ? "success" : "error"
          }`}
          role="status"
        >
          {message}
        </span>
      )}
    </div>
  );
};