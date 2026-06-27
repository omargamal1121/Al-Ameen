import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '201234567890'; // Replace with real number
const WHATSAPP_MESSAGE = encodeURIComponent('Hello Al-Ameen Wires! I would like to inquire about your cable products.');

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-4 max-w-[220px] border border-green-100"
          >
            <p className="text-sm font-bold text-gray-800 mb-1">💬 Order via WhatsApp</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get instant quotes, bulk pricing & technical support from our team.
            </p>
            <div className="mt-2 h-0.5 w-8 bg-green-500 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-16 h-16 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20c05a] transition-colors"
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="white" className="w-9 h-9">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.663 4.61 1.813 6.514L4 29l7.697-1.797A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm5.77 16.77c-.24.67-1.4 1.31-1.93 1.37-.49.06-1.09.08-1.76-.11-.41-.12-.94-.28-1.62-.55-2.85-1.15-4.71-4.01-4.86-4.19-.14-.18-1.16-1.55-1.16-2.97 0-1.41.74-2.1 1-2.38.26-.28.57-.35.76-.35.19 0 .38.002.54.01.18.008.42-.07.66.5.24.59.81 1.97.88 2.11.07.14.12.3.02.49-.1.19-.15.3-.29.46-.14.16-.3.36-.42.48-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.3 1.41.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.35z" />
        </svg>

        {/* Pulse ring */}
        <span className="absolute w-16 h-16 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
