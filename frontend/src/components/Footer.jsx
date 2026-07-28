import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const context = useContext(ShopContext);
  const setShowSearch = context?.setShowSearch;
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0a1e0f] text-white mt-0 border-t border-white/10">
      <div className="px-4 sm:px-[5vw] pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={assets.logo} alt="Al-Ameen Logo" className="h-12 w-12 object-contain rounded-full border-2 border-[#c9a227]/40" />
              <div>
                <p className="font-black text-lg text-[#c9a227] leading-tight">الأمين للكابلات</p>
                <p className="text-xs text-gray-400 tracking-widest">AL-AMEEN WIRES</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Egypt's trusted supplier of IEC & ISO certified electrical cables and wires for residential, industrial, and infrastructure projects.
            </p>
            {/* Contact info */}
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#c9a227]">📞</span>
                <a href="tel:+201234567890" className="hover:text-[#c9a227] transition-colors">+20 123 456 7890</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#c9a227]">📧</span>
                <a href="mailto:info@alameenwires.com" className="hover:text-[#c9a227] transition-colors">info@alameenwires.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#c9a227]">📍</span>
                <span className="text-gray-400">Cairo, Egypt — Industrial Zone</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="uppercase tracking-widest text-xs text-[#c9a227] font-bold mb-5">{t('QUICK_LINKS')}</p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a onClick={() => { setShowSearch(true); navigate("/collection"); }} className="hover:text-[#c9a227] transition-colors cursor-pointer">🔍 {t('SEARCH_PRODUCTS')}</a></li>
              <li><a href="/collection" className="hover:text-[#c9a227] transition-colors cursor-pointer">📦 {t('ALL_CABLES')}</a></li>
              <li><a href="/about" className="hover:text-[#c9a227] transition-colors cursor-pointer">🏭 {t('ABOUT_US')}</a></li>
              <li><a href="/contact" className="hover:text-[#c9a227] transition-colors cursor-pointer">📞 {t('CONTACT')}</a></li>
              <li><a href="/policy" className="hover:text-[#c9a227] transition-colors cursor-pointer">📋 {t('RETURN_POLICY')}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="uppercase tracking-widest text-xs text-[#c9a227] font-bold mb-5">{t('GET_BULK_QUOTES')}</p>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {t('SUBSCRIBE_NEWSLETTER')}
            </p>
            <div className="flex items-center bg-transparent border border-gray-600 focus-within:border-[#c9a227] transition-colors rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder={t('YOUR_EMAIL_ADDRESS')}
                className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 px-4 py-3 focus:outline-none text-sm"
              />
              <button className="px-5 py-3 bg-[#c9a227] text-[#0a1e0f] font-bold text-sm hover:bg-yellow-400 transition-colors" aria-label="Subscribe">
                →
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-3">⚡ {t('JOIN_ENGINEERS')}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-6" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© 2025 Al-Ameen Wires & Cables — {t('ALL_RIGHTS_RESERVED')}</span>
          <div className="flex items-center gap-2">
            <span className="text-[#c9a227]">⚡</span>
            <span>{t('IEC_CERTIFIED')}</span>
            <span className="mx-1">·</span>
            <span>{t('ISO_9001')}</span>
            <span className="mx-1">·</span>
            <span>{t('EGYPTIAN_STANDARD')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

