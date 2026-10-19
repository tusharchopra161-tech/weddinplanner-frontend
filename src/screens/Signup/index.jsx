import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export const Signup = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobileno: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const res = await fetch("https://weddingplanner-backend.onrender.com/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const resjson = await res.json();

      if (res.ok && resjson.success) {
        navigate("/login");
      } else {
        setMessage(resjson.message || "Signup failed. Please check your details.");
      }
    } catch (err) {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <form className="signup-card" onSubmit={handleSubmit}>
        <div className="signup-heading">
          <h1>Create Your Account</h1>
          <p>Start planning your perfect wedding with us</p>
        </div>

        <div className="signup-fields">
          <label className="signup-label" htmlFor="signup-name">
            Full Name
          </label>
          <input
            className="signup-input"
            type="text"
            id="signup-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

          <label className="signup-label" htmlFor="signup-mobileno">
            Mobile Number
          </label>
          <input
            className="signup-input"
            type="tel"
            id="signup-mobileno"
            name="mobileno"
            value={form.mobileno}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />

          <label className="signup-label" htmlFor="signup-email">
            Email Address
          </label>
          <input
            className="signup-input"
            type="email"
            id="signup-email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            autoComplete="email"
            required
          />

          <label className="signup-label" htmlFor="signup-password">
            Password
          </label>
          <input
            className="signup-input"
            type="password"
            id="signup-password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />

          <label className="signup-label" htmlFor="signup-role">
            Create account as
          </label>
          <select
            className="signup-input signup-select"
            id="signup-role"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="user">User — Plan my wedding</option>
            <option value="owner">Palace Owner — List my palace</option>
          </select>
        </div>

        {message && (
          <p className="signup-message" role="alert">
            {message}
          </p>
        )}

        <button className="signup-submit" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="signup-footer">
          Already have an account?
          <button
            type="button"
            className="signup-login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </form>
    </main>
  );
};

export default Signup;
