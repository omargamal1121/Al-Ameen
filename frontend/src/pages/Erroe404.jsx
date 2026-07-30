import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { assets } from "../assets/frontend_assets/assets";

const Erroe404 = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const { getProducts } = useContext(ShopContext);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (retrying) return;
    try {
      setRetrying(true);
      await getProducts();
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a1e0f] text-white px-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1a6b2e]/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center relative z-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <img src={assets.logo} alt="Al-Ameen" className="h-16 w-16 object-contain rounded-full ring-2 ring-[#c9a227]" />
        </div>

        <h1 className="text-7xl font-black text-[#c9a227] tracking-wider mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          {isAr ? "الصفحة غير موجودة أو متعذرة حالياً" : "Page Not Found / Connection Issue"}
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-8">
          {isAr
            ? "عفواً، يبدو أن الصفحة المطلوبة غير متاحة حالياً أو يوجد انقطاع مؤقت في الاتصال بالخادم."
            : "We couldn’t reach our servers right now. Please check your internet connection or try again."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-8 py-3 bg-[#c9a227] text-[#0f3d1a] font-extrabold rounded-full hover:bg-yellow-300 transition-all shadow-lg text-sm cursor-pointer disabled:opacity-60"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? (isAr ? "جاري المحاولة..." : "Retrying...") : (isAr ? "إعادة المحاولة" : "Retry Connection")}
          </button>

          <button
            className="px-8 py-3 border border-white/40 text-white font-bold rounded-full hover:bg-white hover:text-[#0f3d1a] transition-all text-sm cursor-pointer"
            onClick={() => navigate("/", { replace: true })}
          >
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Al-Ameen Wires & Cables</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Erroe404;


