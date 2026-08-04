import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [rateLimited, setRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [accountLocked, setAccountLocked] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (rateLimited) {
      setRateLimited(false);
    }
  }, [countdown, rateLimited]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!email || !password) {
      toast.warn("Please enter both email and password");
      return;
    }

    if (rateLimited || accountLocked) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/Account/admin-login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            Accept: "text/plain",
          },
          skipAuthRefresh: true,
        }
      );

      const { statuscode, responseBody } = response.data || {};
      const token = responseBody?.data?.token;
      const roles = responseBody?.data?.roles || [];

      if (statuscode === 200 && token) {
        setToken(token);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("roles", JSON.stringify(roles));
        toast.success(responseBody?.message || "Login successful");
      } else {
        const errMsg =
          responseBody?.message ||
          (responseBody?.errors?.messages && responseBody.errors.messages.join(", ")) ||
          "Login failed. Please check your credentials.";
        toast.error(errMsg);
      }
    } catch (error) {
      console.error("Admin Login Error:", error);

      if (error.response) {
        const { status, data } = error.response;
        const body = data?.responseBody || data;
        const apiMessage =
          body?.message ||
          (body?.errors?.messages && body.errors.messages.join(", ")) ||
          (body?.errors && Object.values(body.errors).flat().join(", ")) ||
          "Unexpected error occurred.";

        switch (status) {
          case 400: {
            const validationErrors = {};
            if (body?.errors && typeof body.errors === "object" && !body.errors.messages) {
              Object.keys(body.errors).forEach((key) => {
                validationErrors[key] = Array.isArray(body.errors[key])
                  ? body.errors[key][0]
                  : body.errors[key];
              });
            }
            setFormErrors(validationErrors);
            toast.error(apiMessage || "Invalid email or password.");
            break;
          }

          case 403: {
            const msg = (apiMessage || "").toLowerCase();
            if (msg.includes("admin") || msg.includes("privilege")) {
              toast.error(
                "This account does not have admin access. Please use a different account or contact a SuperAdmin."
              );
            } else if (msg.includes("locked") || msg.includes("lockout")) {
              setAccountLocked(true);
              toast.error(
                "Account locked due to too many failed attempts. Please try again in 15 minutes or reset your password."
              );
            } else {
              toast.error(apiMessage || "Access denied.");
            }
            break;
          }

          case 429: {
            setRateLimited(true);
            setCountdown(60);
            toast.error("Too many attempts. Please wait 60 seconds before trying again.");
            break;
          }

          case 500: {
            toast.error(apiMessage || "Server error. Please try again later.");
            break;
          }

          default:
            toast.error(apiMessage || `Server returned status ${status}`);
        }
      } else if (error.request) {
        toast.error("No response from the server. Please check your connection.");
      } else {
        toast.error(`Error setting up the request: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (accountLocked) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="bg-white shadow-md rounded-lg px-8 py-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Account Locked</h1>
          <p className="text-sm text-gray-600 mb-6">
            This account has been temporarily locked due to too many failed login attempts.
            Please try again in 15 minutes or reset your password.
          </p>
          <button
            type="button"
            onClick={() => {
              setAccountLocked(false);
              setPassword("");
            }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md w-full transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Panel</h1>

        {rateLimited && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 text-center">
            Too many attempts. Please wait <span className="font-bold">{countdown}s</span> before trying again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
            <input
              type="email"
              className={`rounded-md w-full px-3 py-2 border outline-none ${
                formErrors.email || formErrors.Email
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
              placeholder="Enter Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || rateLimited}
            />
            {(formErrors.email || formErrors.Email) && (
              <p className="text-xs text-red-500 mt-1">{formErrors.email || formErrors.Email}</p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              type="password"
              className={`rounded-md w-full px-3 py-2 border outline-none ${
                formErrors.password || formErrors.Password
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-500"
              }`}
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || rateLimited}
            />
            {(formErrors.password || formErrors.Password) && (
              <p className="text-xs text-red-500 mt-1">{formErrors.password || formErrors.Password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || rateLimited}
            className={`${
              loading || rateLimited
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } text-white px-4 py-2 rounded-md w-full transition`}
          >
            {loading
              ? "Logging in..."
              : rateLimited
              ? `Wait ${countdown}s`
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
