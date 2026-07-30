import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAuthHeaders } from "../utils/apiUtils";

const ChangePassword = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleShow = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError(isAr ? "كلمة المرور الحالية مطلوبة" : "Current password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError(isAr ? "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" : "New password must be at least 6 characters");
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
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${backendUrl}/api/Account/change-password`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPass: formData.currentPassword,
          newPass: formData.newPassword,
          confirmNewPass: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isAr ? "تم تغيير كلمة المرور بنجاح!" : "Your password has been changed successfully!");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(
          data.responseBody?.message ||
            data.message ||
            (isAr ? "فشل تغيير كلمة المرور. حاول مجدداً." : "Failed to change password. Please try again.")
        );
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError(isAr ? "خطأ في الشبكة. يرجى المحاولة مرة أخرى." : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) => (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {visible ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </>
      )}
    </svg>
  );

  const PasswordField = ({ name, label, placeholder }) => (
    <div className="w-full">
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
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] text-white text-2xl mb-4 shadow-lg">
            🔑
          </div>
          <h1 className="text-3xl font-black text-[#0f3d1a]">
            {isAr ? "تغيير كلمة المرور" : "Change Password"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isAr
              ? "أدخل كلمة مرورك الحالية وكلمة المرور الجديدة"
              : "Enter your current password and choose a new one"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col gap-5"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Alerts */}
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
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm"
            >
              <span className="mt-0.5">✅</span>
              <span>{success}</span>
            </motion.div>
          )}

          <PasswordField
            name="currentPassword"
            label={isAr ? "كلمة المرور الحالية" : "Current Password"}
            placeholder={isAr ? "••••••••" : "Enter current password"}
          />
          <PasswordField
            name="newPassword"
            label={isAr ? "كلمة المرور الجديدة" : "New Password"}
            placeholder={isAr ? "••••••••" : "Min. 6 characters"}
          />
          <PasswordField
            name="confirmPassword"
            label={isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
            placeholder={isAr ? "••••••••" : "Repeat new password"}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] text-white font-extrabold rounded-2xl hover:from-[#1a6b2e] hover:to-[#0f3d1a] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isAr ? "جاري التغيير..." : "Changing..."}
              </>
            ) : (
              isAr ? "تغيير كلمة المرور" : "Change Password"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full text-center text-sm text-gray-400 hover:text-[#0f3d1a] transition-colors cursor-pointer font-medium"
          >
            {isAr ? "← رجوع" : "← Go back"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
