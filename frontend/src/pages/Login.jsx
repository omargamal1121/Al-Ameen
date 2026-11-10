import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import authService from "../services/authService";
import { useTranslation } from "react-i18next";
import { claimGuestOrder, getGuestOrderNumber, clearGuestOrderNumber } from "../services/guestOrderService";

const Login = () => {
  const { t } = useTranslation();
  const { setToken, backendUrl, setUser } = useContext(ShopContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${backendUrl}/api/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        setError("Server returned an invalid response. Please try again.");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful!");

        if (data.responseBody && data.responseBody.data) {
          const tokenData = data.responseBody.data;

          // ✅ Save tokens + user info
          localStorage.setItem("token", tokenData.token);
          localStorage.setItem("refreshToken", tokenData.refreshToken);

          // Prefer full user from API; fallback to email-only
          const userData = tokenData.user || { email: formData.email };
          localStorage.setItem("user", JSON.stringify(userData));

          // ✅ Update context
          setToken(tokenData.token);
          setUser(userData);

          // 🔀 Claim guest order if exists
          const guestOrderNumber = getGuestOrderNumber();
          if (guestOrderNumber) {
            try {
              await claimGuestOrder(guestOrderNumber, tokenData.token);
              clearGuestOrderNumber();
              console.log("Guest order claimed successfully");
            } catch (error) {
              console.error("Failed to claim guest order:", error);
              // Don't block login on claim failure
            }
          }

          // 🔀 Role-based redirect
          const rawRoles = userData.roles || userData.role || userData.userRoles || [];
          const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
          const norm = roles.map((r) => String(r || '').toLowerCase());

          const isAdmin = norm.includes('admin');
          const isDelivery = norm.includes('deliverycompany') || norm.includes('delivery');

          if (isAdmin) {
            const adminUrl = import.meta.env.VITE_ADMIN_URL;
            if (adminUrl) {
              window.location.href = adminUrl;
            } else {
              // Fallback: keep user on frontend home if admin panel URL not set
              navigate('/', { replace: true });
            }
          } else if (isDelivery) {
            navigate('/orders', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          // If no data envelope, fallback to home
          navigate('/', { replace: true });
        }
      } else {
        const errorMessage =
          data.responseBody?.message ||
          data.responseBody?.error?.message ||
          "Login failed. Please check your credentials.";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 pt-28 pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Brand Header Banner */}
          <div className="bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] px-8 py-7 text-center relative overflow-hidden">
            <div className="w-12 h-12 bg-[#c9a227] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-white font-black text-xl tracking-tight">Al-Ameen Cables & Wires</h1>
            <p className="text-[#c9a227] text-xs font-bold mt-1 uppercase tracking-widest">{t('LOGIN')}</p>
          </div>

          <form onSubmit={onSubmitHandler} className="p-6 sm:p-8 flex flex-col gap-4 text-gray-800">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm"
              >
                {success}
              </motion.div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_EMAIL')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="outline-none w-full border-2 border-gray-200 py-2.5 px-3.5 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                placeholder={t('ENTER_YOUR_EMAIL')}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_PASSWORD')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="outline-none w-full border-2 border-gray-200 py-2.5 px-3.5 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                placeholder={t('ENTER_YOUR_PASSWORD')}
                required
              />
            </div>

            <div className="w-full flex justify-between items-center text-xs text-gray-500 pt-1">
              <p>
                Don’t have an account?{" "}
                <Link to="/signup" className="text-[#1a6b2e] font-bold hover:text-[#c9a227] hover:underline">
                  {t('SIGN_UP')}
                </Link>
              </p>
              <Link
                to="/request-password"
                className="text-gray-500 hover:text-[#0f3d1a] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 px-6 mt-2 rounded-xl transition-all duration-300 shadow-md ${
                loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#0f3d1a] text-white hover:bg-[#c9a227] hover:shadow-lg active:scale-[0.99]"
              }`}
            >
              {loading ? "Logging in..." : t('LOGIN')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
