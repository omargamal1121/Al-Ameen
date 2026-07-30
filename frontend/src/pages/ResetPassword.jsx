import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tokenParam = queryParams.get("token");
  const emailParam = queryParams.get("email");

  const [formData, setFormData] = useState({
    email: emailParam || "",
    token: tokenParam || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleShow = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    if (!formData.email) {
      setError(isAr ? "البريد الإلكتروني مطلوب" : "Email is required");
      return false;
    }
    if (!formData.token) {
      setError(isAr ? "رمز إعادة التعيين مطلوب" : "Reset token is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError(isAr ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${backendUrl}/api/Account/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(
          data.responseBody?.message ||
            data.message ||
            (isAr ? "فشل إعادة تعيين كلمة المرور. حاول مجدداً." : "Failed to reset password. Please try again.")
        );
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(isAr ? "خطأ في الشبكة. يرجى المحاولة مرة أخرى." : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {visible ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  );

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">✓</div>
          <h2 className="text-2xl font-black text-[#0f3d1a]">
            {isAr ? "تم إعادة تعيين كلمة المرور" : "Password Reset Successful"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isAr
              ? "تم تغيير كلمة مرورك بنجاح. سيتم تحويلك لصفحة تسجيل الدخول..."
              : "Your password has been reset. Redirecting you to login..."}
          </p>
          <div className="w-8 h-8 border-2 border-[#1a6b2e] border-t-transparent rounded-full animate-spin mt-2" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#e8c445] text-[#0f3d1a] text-2xl mb-4 shadow-lg">
            🔒
          </div>
          <h1 className="text-3xl font-black text-[#0f3d1a]">
            {isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isAr
              ? "أدخل كلمة المرور الجديدة لحسابك"
              : "Enter your new password below to reset your account"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col gap-5"
          dir={isAr ? "rtl" : "ltr"}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
            >
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              {isAr ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="outline-none w-full border-2 border-gray-200 py-3 px-4 rounded-xl focus:border-[#1a6b2e] transition-colors bg-gray-50 text-sm disabled:opacity-60"
              placeholder={isAr ? "example@email.com" : "your@email.com"}
              required
              disabled={!!emailParam}
              dir="ltr"
            />
          </div>

          {/* New Password */}
          {[
            {
              name: "newPassword",
              label: isAr ? "كلمة المرور الجديدة" : "New Password",
              placeholder: isAr ? "••••••••" : "Min. 6 characters",
            },
            {
              name: "confirmPassword",
              label: isAr ? "تأكيد كلمة المرور" : "Confirm Password",
              placeholder: isAr ? "••••••••" : "Repeat new password",
            },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                {label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[name] ? "text" : "password"}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="outline-none w-full border-2 border-gray-200 py-3 px-4 rounded-xl focus:border-[#1a6b2e] transition-colors bg-gray-50 text-sm"
                  placeholder={placeholder}
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(name)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <EyeIcon visible={showPasswords[name]} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] text-white font-extrabold rounded-2xl hover:from-[#1a6b2e] hover:to-[#0f3d1a] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isAr ? "جاري التعيين..." : "Resetting..."}
              </>
            ) : (
              isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-center text-sm text-gray-400 hover:text-[#0f3d1a] transition-colors cursor-pointer font-medium"
          >
            {isAr ? "← العودة لتسجيل الدخول" : "← Back to Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
