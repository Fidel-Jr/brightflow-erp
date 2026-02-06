import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import { loginAccount } from '../../api/auth-api';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext.jsx';


function LoginPage() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // ✅ for API error messages
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

  /* Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "", // clear field error on change
    }));

    setApiError(""); // clear API error when typing
  };

  /* Validation logic */
  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } 


    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Submit handler */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setApiError("");
    
    try {
      const response = await loginAccount(form);

      localStorage.setItem("accessToken", response.data.token);
      console.log("Login successful:", response.data);
      // Redirect
      login(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setApiError(
          error.response.data.message || 
          error.response.data.errors?.join(", ") || 
          "Login failed. Please try again or check internet connection."
        );
      } else {
        setApiError("Network error. Please try again.");
      }
    }finally {
      setLoading(false);
    } 
  };

  return (
    <div className="login-container">
      <div className="row g-0 h-100">
        {/* Left Section - Branding */}
        <div className="col-md-6 left-section">
          <div className="branding-content">
            <div className="logo-section">
              <div className="logo-icon">
                <svg
                width="100"
                height="100"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="25" cy="25" r="25" fill="#fff" />
                <path
                d="M15 20C15 20 20 15 25 20C30 25 35 20 35 20V30C35 30 30 35 25 30C20 25 15 30 15 30V20Z"
                fill="#3B82F6"
                />
            </svg>
              </div>
              <h1 className="brand-name">
                Bright<span className="brand-highlight">Flow</span> Logistics
              </h1>
            </div>
            <div className="branding-text">
              <h2>Welcome Back!</h2>
              <p>Streamline your logistics operations with our comprehensive management platform.</p>
            </div>
            {/* <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Real-time tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Automated workflows</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Analytics dashboard</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="col-md-6 right-section">
          <div className="form-content">
            {/* Mobile Logo - Only visible on small screens */}
            <div className="mobile-logo-section">
              <div className="mobile-logo-icon">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="25" cy="25" r="25" fill="#4A90E2" />
                  <path
                    d="M15 20C15 20 20 15 25 20C30 25 35 20 35 20V30C35 30 30 35 25 30C20 25 15 30 15 30V20Z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <h1 className="mobile-brand-name mb-5">
                Bright<span className="mobile-brand-highlight">Flow</span> Logistics
              </h1>
            </div>

            <div className="form-wrapper">
              <h2 className="form-title">Sign in to your account</h2>
              <p className="form-subtitle">Enter your credentials to access your account</p>
              {/* Display API error above the form */}
              {apiError && (
                <div className="alert alert-danger alert-dismissible fade show p-3" role="alert">
                  {apiError}
                  {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
                </div>
              )}  
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className={`input-group ${errors.email ? "has-error" : ""}`}>
                    <span className="input-group-text">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="#6c757d" strokeWidth="1.5" />
                        <path d="M2 5l8 5 8-5" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name='email'
                      id="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                    {errors.email && <small className="error">{errors.email}</small>}

                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className={`input-group ${errors.password ? "has-error" : ""}`}>
                    <span className="input-group-text">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="9" width="14" height="9" rx="1" stroke="#6c757d" strokeWidth="1.5" />
                        <path d="M6 9V6a4 4 0 018 0v3" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      name='password'
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                    {errors.password && <small className="error">{errors.password}</small>}

                </div>

                {/* <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div> */}

                <button
                  type="submit"
                  className="btn btn-primary w-100 sign-in-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

              </form>

              {/* <div className="signup-link">
                Don't have an account? <a href="#">Sign up</a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;