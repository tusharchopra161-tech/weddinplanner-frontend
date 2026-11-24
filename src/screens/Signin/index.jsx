// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./signin.css";
// import { GoogleLogin } from "@react-oauth/google";
// export const Signin = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       setLoading(true);

//       const response = await fetch(
//         "https://weddingplanner-backend.onrender.com/user/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       const isuser = await response.json();

//       if (response.ok && isuser.success) {
//         localStorage.setItem("currentUser", JSON.stringify(isuser.user));
//         localStorage.setItem("token", isuser.token);

//         if (isuser.user.role === "owner") {
//           navigate("/owner-dashboard");
//         } else if (isuser.user.role === "admin") {
//           navigate("/admin-dashboard");
//         } else {
//           navigate("/");
//         }
//       } else {
//         setMessage(isuser.message || "Invalid email or password.");
//       }
//     } catch (err) {
//       setMessage("Unable to connect to the server. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleGoogleSuccess = async (googleResponse) => {
//     setMessage("");

//     try {
//       setLoading(true);

//       const response = await fetch(
//         "https://weddingplanner-backend.onrender.com/user/google-auth",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             credential: googleResponse.credential,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         setMessage(result.message || "Google login failed.");
//         return;
//       }
//      // New Google user: open profile completion
//       if (result.requiresProfileCompletion) {
//         sessionStorage.setItem("googleProfileToken", result.token);

//         navigate("/complete-google-profile", {
//           state: {
//             googleUser: result.googleUser,
//           },
//         });

//         return;
//       }

//       // Existing Google user: normal login
//       localStorage.setItem(
//         "currentUser",
//         JSON.stringify(result.user)
//       );
// console.log("result",result)
//       localStorage.setItem("token", result.token);
     
//       if (result.user.role === "owner") {
//         navigate("/owner-dashboard");
//       } else if (result.user.role === "admin") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/");
//       }

//     } catch (error) {
//       console.error("Google login error:", error);

//       setMessage("Unable to connect to the server. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     setMessage("Google login was unsuccessful. Please try again.");
//   };
//   return (
//     <main className="signin-page">
//       <form className="signin-card" onSubmit={handleSubmit}>
//         <div className="signin-content">
//           <div className="signin-heading">
//             <h1>Login</h1>
//             <p>Start planning your perfect wedding with us</p>
//           </div>

//           <div className="signin-fields">
//             <label className="signin-label" htmlFor="email">
//               Email
//             </label>
//             <input
//               className="signin-input"
//               type="email"
//               name="email"
//               id="email"
//               placeholder="Enter your email"
//               autoComplete="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />

//             <label className="signin-label" htmlFor="password">
//               Password
//             </label>
//             <input
//               className="signin-input"
//               type="password"
//               name="password"
//               id="password"
//               placeholder="Enter password"
//               autoComplete="current-password"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {message && (
//             <p className="signin-message" role="alert">
//               {message}
//             </p>
//           )}

//           <button className="signin-submit" type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </div>
//         <div className="signin-google">
//           <div className="signin-divider">
//             <span>OR</span>
//           </div>

//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={handleGoogleError}
//             useOneTap={false}
//             text="continue_with"
//             shape="rectangular"
//             theme="outline"
//             size="large"
//             width="100%"
//           />
//         </div>
//         <div className="signin-footer">
//           <span>Don't have an account?</span>
//           <button
//             className="signin-signup"
//             type="button"
//             onClick={() => navigate("/signup")}
//           >
//             Sign up
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// };

// export default Signin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./signin.css";

const API_URL = "https://weddingplanner-backend.onrender.com";

export const Signin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [accountLink, setAccountLink] = useState(null);
  const [accountPassword, setAccountPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect according to the user's existing role.
  const redirectUser = (user) => {
    if (user.role === "owner") {
      navigate("/owner-dashboard");
    } else if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  // Save the normal login response.
  const saveLogin = (result) => {
    localStorage.setItem("currentUser", JSON.stringify(result.user));
    localStorage.setItem("token", result.token);

    redirectUser(result.user);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Existing manual email/password login.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        saveLogin(result);
      } else {
        setMessage(result.message || "Invalid email or password.");
      }
    } catch (error) {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google authentication.
  const handleGoogleSuccess = async (googleResponse) => {
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: googleResponse.credential,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Google login failed.");
        return;
      }

      // New Google user: open profile completion.
      if (result.requiresProfileCompletion) {
        sessionStorage.setItem("googleProfileToken", result.token);

        navigate("/complete-google-profile", {
          state: {
            googleUser: result.googleUser,
          },
        });

        return;
      }

      // Existing account: request its password before linking.
      if (result.requiresAccountLink) {
        const googleLinkToken =
          result.googleLinkToken || result.token;

        if (!googleLinkToken) {
          setMessage("Unable to start account linking. Please try again.");
          return;
        }

        setAccountLink({
          token: googleLinkToken,
          email:
            result.googleUser?.email ||
            result.googleProfile?.email ||
            result.email ||
            "",
        });

        setAccountPassword("");
        setMessage("");

        return;
      }

      // Existing Google-linked user: normal login.
      if (result.user && result.token) {
        saveLogin(result);
      } else {
        setMessage("Invalid Google login response. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login was unsuccessful. Please try again.");
  };

  // Link the Google account to the existing website account.
  const handleGoogleLink = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!accountLink?.token) {
      setMessage("Your Google session has expired. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/user/google-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accountLink.token}`,
        },
        body: JSON.stringify({
          password: accountPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(
          result.message || "Unable to link your Google account."
        );
        return;
      }

      // The backend should return the normal access token and user.
      if (!result.user || !result.token) {
        setMessage("Account linked, but the login response is incomplete.");
        return;
      }

      // Clear the temporary linking data.
      setAccountLink(null);
      setAccountPassword("");

      saveLogin(result);
    } catch (error) {
      console.error("Google account linking error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel account linking and return to the login screen.
  const handleCancelLink = () => {
    setAccountLink(null);
    setAccountPassword("");
    setMessage("");
  };

  return (
    <main className="signin-page">
      <form
        className="signin-card"
        onSubmit={accountLink ? handleGoogleLink : handleSubmit}
      >
        <div className="signin-content">
          <div className="signin-heading">
            <h1>{accountLink ? "Link Your Account" : "Login"}</h1>

            <p>
              {accountLink
                ? "Enter your existing account password to continue with Google."
                : "Start planning your perfect wedding with us"}
            </p>
          </div>

          {accountLink ? (
            // Google account linking screen.
            <div className="signin-fields">
              <label className="signin-label" htmlFor="google-email">
                Google Email
              </label>

              <input
                className="signin-input"
                type="email"
                id="google-email"
                value={accountLink.email}
                readOnly
              />

              <label
                className="signin-label"
                htmlFor="google-link-password"
              >
                Existing Account Password
              </label>

              <input
                className="signin-input"
                type="password"
                id="google-link-password"
                placeholder="Enter your website password"
                autoComplete="current-password"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
          ) : (
            // Existing email/password login screen.
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
          )}

          {message && (
            <p className="signin-message" role="alert">
              {message}
            </p>
          )}

          <button
            className="signin-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : accountLink
                ? "Link Account & Login"
                : "Login"}
          </button>

          {accountLink && (
            <button
              className="signin-signup"
              type="button"
              onClick={handleCancelLink}
              disabled={loading}
            >
              Back to Login
            </button>
          )}
        </div>

        {!accountLink && (
          <>
            <div className="signin-google">
              <div className="signin-divider">
                <span>OR</span>
              </div>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                text="continue_with"
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
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
          </>
        )}
      </form>
    </main>
  );
};

export default Signin;
