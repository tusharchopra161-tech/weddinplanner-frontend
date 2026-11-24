import React from 'react'
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./completeGoogleProfile.css"
const API_URL = "https://weddingplanner-backend.onrender.com";
export const CompleteGoogleProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const googleUser = location.state?.googleUser;

    const [form, setForm] = useState({
        password: "",
        mobileno: "",
        role: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Return to login if the user opens this page directly
    // without completing Google authentication.
    const token = sessionStorage.getItem("googleProfileToken");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!token || !googleUser) {
            navigate("/login", { replace: true });
            return;
        }

        if (form.mobileno.length !== 10) {
            setMessage("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (!form.role) {
            setMessage("Please select your account type.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/user/complete-profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: googleUser.name,
                        mobileno: form.mobileno,
                        password: form.password,
                        role: form.role,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                setMessage(
                    result.message || "Unable to complete your profile."
                );
                return;
            }

            // Registration succeeded. Remove the temporary token.
            sessionStorage.removeItem("googleProfileToken");

            // Save the normal login credentials returned by the backend.
            localStorage.setItem(
                "currentUser",
                JSON.stringify(result.user)
            );
            
            localStorage.setItem("token", result.token);
           
            if (result.user.role === "owner") {
                navigate("/owner-dashboard", { replace: true });
            } else if (result.user.role === "admin") {
                navigate("/admin-dashboard",{ replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error("Profile completion error:", error);

            setMessage("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !googleUser) {
        return (
            <div className="google-profile-page">
                <div className="google-profile-card">
                    <p>Your Google authentication session has expired.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/login", { replace: true })}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="google-profile-page">
            <div className="google-profile-card">
                <div className="google-logo">
                    <span className="google-g">G</span>
                    <span>Google</span>
                </div>

                <div className="google-profile-heading">
                    <h1>Complete your profile</h1>
                    <p>Continue to Wedding Planner</p>
                </div>

                <div className="google-user-info">
                    <img
                        className="google-user-avatar"
                        src={googleUser.profilePic}
                        alt="Google profile"
                        referrerPolicy="no-referrer"
                    />

                    <div className="google-user-details">
                        <span className="google-user-name">
                            {googleUser.name}
                        </span>

                        <span className="google-user-email">
                            {googleUser.email}
                        </span>
                    </div>
                </div>

                <form
                    className="google-profile-form"
                    onSubmit={handleSubmit}
                >
                    <div className="google-profile-field">
                        <label htmlFor="google-password">
                            Enter a password
                        </label>

                        <input
                            id="google-password"
                            type="password"
                            name="password"
                            placeholder="Enter a password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="google-profile-field">
                        <label htmlFor="google-mobile">
                            Mobile number
                        </label>

                        <input
                            id="google-mobile"
                            type="tel"
                            name="mobileno"
                            placeholder="Enter 10-digit mobile number"
                            value={form.mobileno}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");

                                if (value.length <= 10) {
                                    setForm((prev) => ({
                                        ...prev,
                                        mobileno: value,
                                    }));
                                }
                            }}
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={10}
                            required
                        />
                    </div>

                    <div className="google-profile-field">
                        <label htmlFor="google-role">
                            Account type
                        </label>

                        <select
                            id="google-role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select account type</option>
                            <option value="user">User</option>
                            <option value="owner">Palace Owner</option>
                        </select>
                    </div>

                    {message && (
                        <p className="google-profile-message" role="alert">
                            {message}
                        </p>
                    )}

                    <button
                        className="google-profile-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="google-profile-footer">
                    Your Google account is connected securely.
                </p>
            </div>
        </main>
    )
}
