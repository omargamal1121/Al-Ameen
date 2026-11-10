import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';

const SERVICE_ID = 'service_2xwqrpt'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_l82of3z'; // Replace with your EmailJS template ID
const PUBLIC_KEY = 'WANwSLs9otwlMWH-H'; // Replace with your EmailJS public key

const NewLetterBox = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const { t } = useTranslation();

  const onSubmitHanndler = (event) => {
    event.preventDefault();
    setStatus("");
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { user_email: email }, PUBLIC_KEY)
      .then(() => {
        setStatus(t('NEWSLETTER_SUCCESS'));
        setEmail("");
      })
      .catch(() => {
        setStatus(t('NEWSLETTER_FAIL'));
      });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={itemVariants}
      className="relative overflow-hidden my-16 py-14 px-5 sm:px-8 mx-4 sm:mx-auto max-w-4xl rounded-3xl shadow-xl bg-gradient-to-br from-[#0a2010] via-[#0f3d1a] to-[#092010] border border-[#c9a227]/30 text-white text-center"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#c9a227]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <span className="inline-block bg-[#c9a227]/15 border border-[#c9a227]/40 text-[#c9a227] text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full mb-4">
          ⚡ {status === t('NEWSLETTER_SUCCESS') ? '✅' : ''} Newsletter
        </span>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
          Stay Ahead with Al-Ameen Cables Updates
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-7">
          Get alerts on new cable arrivals, bulk pricing deals &amp; technical product sheets direct to your inbox.
        </p>

        <form
          onSubmit={onSubmitHanndler}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <input
            className="flex-1 w-full bg-white/10 border border-white/20 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/40 outline-none py-3 px-4 rounded-xl text-white placeholder-white/40 text-sm transition-colors"
            type="email"
            placeholder={t('NEWSLETTER_PLACEHOLDER') || "Enter your work email"}
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#c9a227] hover:bg-yellow-400 text-[#0a2010] font-black px-7 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-lg"
          >
            {t('NEWSLETTER_SUBSCRIBE')}
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-sm font-semibold ${status === t('NEWSLETTER_SUCCESS') ? 'text-emerald-400' : 'text-red-400'}`}>
            {status}
          </p>
        )}

        <p className="text-gray-600 text-xs mt-5">🔒 No spam. Unsubscribe anytime.</p>
      </div>
    </motion.div>
  );
};

export default NewLetterBox;
