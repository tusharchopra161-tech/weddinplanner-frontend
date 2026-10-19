import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signin.css";

export const Signin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

      const response = await fetch(
        "https://weddingplanner-backend.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const isuser = await response.json();

      if (response.ok && isuser.success) {
        localStorage.setItem("currentUser", JSON.stringify(isuser.user));
        localStorage.setItem("token", isuser.token);

        if (isuser.user.role === "owner") {
          navigate("/owner-dashboard");
        } else if (isuser.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setMessage(isuser.message || "Invalid email or password.");
      }
    } catch (err) {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signin-page">
      <form className="signin-card" onSubmit={handleSubmit}>
        <div className="signin-content">
          <div className="signin-heading">
            <h1>Login</h1>
            <p>Start planning your perfect wedding with us</p>
          </div>

          <div className="signin-fields">
            <label className="signin-label" htmlFor="email">
              Email
            </label>
            <input
              className="signin-input"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className="signin-label" htmlFor="password">
              Password
            </label>
            <input
              className="signin-input"
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <p className="signin-message" role="alert">
              {message}
            </p>
          )}

          <button className="signin-submit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="signin-footer">
          <span>Don't have an account?</span>
          <button
            className="signin-signup"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </form>
    </main>
  );
};

export default Signin;
