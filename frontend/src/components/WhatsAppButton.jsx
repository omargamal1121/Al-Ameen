import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const WHATSAPP_NUMBER = '201010814995';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const defaultMsg = encodeURIComponent(
    isAr
      ? 'مرحباً، أود الاستفسار عن كابلات وأسلاك شركة الأمين وطلب عرض أسعار للمشاريع.'
      : 'Hello Al-Ameen Cables! I would like to inquire about your cable products and bulk project quotes.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: isAr ? -15 : 15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isAr ? -15 : 15, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-3.5 max-w-[210px] border border-emerald-100 text-start"
          >
            <p className="text-xs font-black text-gray-900 mb-1 flex items-center gap-1.5">
              <span>💬</span>
              <span>{isAr ? "مبيعات المشاريع" : "Project Quotes"}</span>
            </p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {isAr
                ? "تواصل مباشرة مع مهندسي المبيعات لعروض الأسعار والكميات الكبيرة."
                : "Connect directly with our sales engineers for custom project bulk quotes."}
            </p>
            <div className="mt-2 h-0.5 w-8 bg-emerald-500 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20c05a] transition-colors cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="white" className="w-7 h-7 sm:w-8 sm:h-8">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.663 4.61 1.813 6.514L4 29l7.697-1.797A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm5.77 16.77c-.24.67-1.4 1.31-1.93 1.37-.49.06-1.09.08-1.76-.11-.41-.12-.94-.28-1.62-.55-2.85-1.15-4.71-4.01-4.86-4.19-.14-.18-1.16-1.55-1.16-2.97 0-1.41.74-2.1 1-2.38.26-.28.57-.35.76-.35.19 0 .38.002.54.01.18.008.42-.07.66.5.24.59.81 1.97.88 2.11.07.14.12.3.02.49-.1.19-.15.3-.29.46-.14.16-.3.36-.42.48-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.3 1.41.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.35z" />
        </svg>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
