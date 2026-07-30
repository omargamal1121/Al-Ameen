import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/frontend_assets/assets";

const ConfirmEmail = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId") || queryParams.get("id") || queryParams.get("Id");
  const token = queryParams.get("token") || queryParams.get("Token") || queryParams.get("code");

  useEffect(() => {
    const confirmUserEmail = async () => {
      if (!userId || !token) {
        setLoading(false);
        setStatus("error");
        setMessage(
          isAr
            ? "رابط التأكيد غير مكتمل أو منتهي الصلاحية."
            : "Invalid or incomplete email confirmation link."
        );
        return;
      }

      setLoading(true);
      try {
        // Try GET endpoint first
        let response = await fetch(
          `${backendUrl}/api/Account/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        // If GET isn't accepted, try POST
        if (!response.ok && response.status === 405) {
          response = await fetch(`${backendUrl}/api/Account/confirm-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ userId, token }),
          });
        }

        const data = await response.json().catch(() => ({}));

        if (response.ok || data.statuscode === 200 || data.statusCode === 200) {
          setStatus("success");
          setMessage(
            data.responseBody?.message ||
              data.message ||
              (isAr
                ? "تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول."
                : "Your email has been confirmed successfully! You can now log in.")
          );
        } else {
          // If token was already confirmed, treat as success
          const msg = data.responseBody?.message || data.message || "";
          if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("confirmed")) {
            setStatus("success");
            setMessage(
              isAr
                ? "تم تأكيد حسابك سابقاً. يمكنك تسجيل الدخول الآن."
                : "Your email is already confirmed. You can log in now."
            );
          } else {
            setStatus("error");
            setMessage(
              msg ||
                (isAr
                  ? "فشل تأكيد البريد الإلكتروني. قد يكون الرابط منتهي الصلاحية."
                  : "Email confirmation failed. The link may be expired.")
            );
          }
        }
      } catch (err) {
        console.error("Email confirmation error:", err);
        setStatus("error");
        setMessage(
          isAr
            ? "حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى."
            : "Network error. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    confirmUserEmail();
  }, [userId, token, backendUrl, isAr]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full p-8 rounded-3xl bg-white border border-gray-200 shadow-2xl text-center"
      >
        <div className="flex justify-center mb-6">
          <img src={assets.logo} alt="Al-Ameen" className="h-16 w-16 object-contain rounded-full ring-2 ring-[#c9a227]" />
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a6b2e]"></div>
            <p className="text-gray-600 font-medium">
              {isAr ? "جاري التأكد من البريد الإلكتروني..." : "Verifying your email address..."}
            </p>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mb-2">
              ✓
            </div>
            <h2 className="text-2xl font-black text-[#0f3d1a]">
              {isAr ? "تم التأكيد بنجاح" : "Email Confirmed"}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 bg-[#c9a227] text-[#0f3d1a] font-extrabold rounded-full hover:bg-yellow-300 transition-all shadow-lg text-sm cursor-pointer"
            >
              {isAr ? "تسجيل الدخول الآن" : "Go to Login"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mb-2">
              ✕
            </div>
            <h2 className="text-2xl font-black text-red-600">
              {isAr ? "فشل التأكيد" : "Verification Failed"}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{message}</p>
            <div className="flex flex-col w-full gap-3">
              <Link
                to="/login"
                className="w-full py-3 bg-[#0f3d1a] text-white font-bold rounded-full hover:bg-[#1a6b2e] transition-all text-sm block text-center"
              >
                {isAr ? "الذهاب لصفحة تسجيل الدخول" : "Go to Login Page"}
              </Link>
              <Link
                to="/contact"
                className="w-full py-3 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-all text-sm block text-center"
              >
                {isAr ? "تواصل مع الدعم الفني" : "Contact Support"}
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfirmEmail;
