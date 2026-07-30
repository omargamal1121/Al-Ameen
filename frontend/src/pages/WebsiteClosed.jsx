import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const WebsiteClosed = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getProducts } = useContext(ShopContext);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (retrying) return;
    try {
      setRetrying(true);
      await getProducts();
      // If products load successfully, navigate back to home
      window.location.href = "/";
    } catch (e) {
      console.error("Connection retry failed:", e);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B0B] text-white px-6 relative overflow-hidden">
      {/* Decorative luxury gradient ambient glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-neutral-900/40 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-neutral-900/40 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Brand/Logo Symbol */}
        <div className="mb-8 flex justify-center">
            <span className="text-xs font-bold tracking-widest text-[#c9a227]">AL-AMEEN</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extralight tracking-widest text-white uppercase mb-6 prata-regular">
          {t('STORE_CLOSED')}
        </h1>

        <p className="text-neutral-400 font-light leading-relaxed mb-10 text-sm sm:text-base max-w-md mx-auto">
          {t('STORE_CLOSED_MESSAGE')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-none font-medium hover:bg-neutral-200 transition duration-300 disabled:opacity-60 uppercase text-xs tracking-widest"
          >
            {retrying ? t('RECONNECTING') : t('CHECK_STATUS')}
          </button>

          <a
            href="mailto:info@alameenwires.com"
            className="w-full sm:w-auto border border-neutral-800 text-neutral-300 px-8 py-3 rounded-none font-medium hover:bg-white hover:text-black hover:border-white transition duration-300 uppercase text-xs tracking-widest text-center"
          >
            {t('CONTACT_SUPPORT')}
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-[10px] tracking-[0.2em] text-neutral-600 uppercase font-light">
          <p>© {new Date().getFullYear()} Al-Ameen Wires. {t('ALL_RIGHTS_RESERVED')}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default WebsiteClosed;
