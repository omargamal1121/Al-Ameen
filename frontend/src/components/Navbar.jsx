import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SmallNavbar from "./SmallNavbar";
import { useLocalization } from "../utils/localization";

const Navbar = () => {
  const {
    backendUrl,
    user,
    setUser,
    setToken,
    setShowSearch,
    getCartCount,
    getWishlistCount,
    getCategories,
    categories
  } = useContext(ShopContext);
  const [visible, setvisible] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { getLocalizedName } = useLocalization();
  const [hovered, setHovered] = useState(false);

  // 🔹 لإدارة القائمة
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // 🔹 إغلاق القائمة عند الضغط برّه
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Removed N+1 fetchCategoriesWithSubcategories using new subCategorySimples array

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Small Navbar at the top */}
      <SmallNavbar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-full transition-all duration-300 ${scrolled ? "shadow-lg" : ""
          } border-b border-green-800/20 flex items-center py-3 font-medium px-4 sm:px-[2vw] md:px-[2vw] lg:px-[3vw]
        relative `}
      >
        {/* Background: green gradient on scroll/hover, transparent on top */}
        <div
          className="absolute inset-0 z-[-1] transition-all duration-500"
          style={{
            background: scrolled || hovered
              ? 'linear-gradient(135deg, #0f3d1a 0%, #1a6b2e 100%)'
              : 'transparent',
          }}
        />

        {/* --- الروابط الرئيسية --- */}
        <ul
          className={`hidden sm:flex gap-5 text-sm ${scrolled || hovered ? "text-yellow-300" : "text-white"
            } flex-1 ${i18n.language === 'ar' ? 'justify-end' : 'justify-start'}`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 group ${isActive ? "font-bold" : ""
              }`
            }
          >
            <p>{t("HOME")}</p>
            <span className="w-2/4 h-[2px] transition-all duration-300 bg-yellow-400 group-hover:w-full group-hover:bg-yellow-300 group-hover:opacity-100 opacity-0"></span>
          </NavLink>

          <div className="relative group">
            <NavLink
              to="/collection"
              className="flex items-center gap-1 focus:outline-none uppercase tracking-widest"
            >
              {t("CATEGORY")}
            </NavLink>

            {/* Main Categories Dropdown */}
            <div className={`absolute mt-2 w-72 bg-white shadow-2xl z-[100] hidden group-hover:block transition-all duration-300 border border-gray-100 rounded-b-2xl ${i18n.language === 'ar' ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
              <ul className="flex flex-col py-3">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id} className="px-3">
                      <Link
                        to={`/category/${cat.id}`}
                        className="flex justify-between items-center px-4 py-3.5 hover:bg-black hover:text-white rounded-xl cursor-pointer text-gray-800 font-black transition-all duration-200"
                      >
                        <span className="text-sm tracking-tight">{getLocalizedName(cat)}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center italic">
                    Loading Categories...
                  </li>
                )}
              </ul>
            </div>
          </div>

          <NavLink
            to="/policy"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 group ${isActive ? "font-bold" : ""
              }`
            }
          >
            <p>{t("POLICY")}</p>
            <span className="w-2/4 h-[2px] transition-all duration-300 bg-yellow-400 group-hover:w-full group-hover:bg-yellow-300 group-hover:opacity-100 opacity-0"></span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 group ${isActive ? "font-bold" : ""
              }`
            }
          >
            <p>{t("ORDERS")}</p>
            <span className="w-2/4 h-[2px] transition-all duration-300 bg-gray-700 group-hover:w-full group-hover:bg-gray-300 group-hover:opacity-100 opacity-0"></span>
          </NavLink>
        </ul>

        {/* --- اللوجو --- */}
        <div className="flex-1 flex justify-center">
          <Link to={"/"}>
            <img
              src={assets.logo}
              className={`w-16 h-16 object-contain rounded-full transition-all duration-300 ring-2 ring-yellow-400/60 ${scrolled || hovered ? "opacity-100 scale-105" : "opacity-90"
                }`}
              alt="الأمين Logo"
            />
          </Link>
        </div>

        {/* --- أيقونات يمين --- */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          {/* Language Switcher Badge */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-[#c9a227] hover:text-[#0f3d1a] border border-white/20 text-xs font-bold text-white rounded-full transition-all duration-300 shadow-sm cursor-pointer"
            title="Switch Language / تغيير اللغة"
          >
            <span className="text-sm">🌐</span>
            <span>{i18n.language === "en" ? "العربية" : "English"}</span>
          </button>

          {/* البحث */}
          <img
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt=""
          />

          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {getWishlistCount() > 0 && (
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px]">
                {getWishlistCount()}
              </p>
            )}
          </Link>

          {/* قائمة البروفايل */}
          <div className="relative z-50" ref={profileRef}>
            {user ? (
              <>
                <img
                  src={assets.profile_icon}
                  className="w-5 cursor-pointer"
                  alt=""
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                />

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-green-100 rounded-lg py-2 transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/change-email"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                    >
                      Change Email
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                    >
                      Change Password
                    </Link>
                    <Link
                      to="/upload-photo"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                    >
                      Upload Photo
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <img
                  src={assets.profile_icon}
                  className="w-5 cursor-pointer"
                  alt=""
                />
              </Link>
            )}
          </div>

          {/* عربة التسوق */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          {/* القائمة للموبايل */}
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt=""
            onClick={() => setvisible(true)}
          />
        </div>

        {/* Sidebar menu for small screen — uses translateX so RTL doesn't bleed */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-green-900 to-green-800 transition-transform duration-300 ease-in-out z-[200] ${
            visible ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ direction: 'ltr' }}
        >
          <div className="flex flex-col text-white h-full overflow-y-auto">
            {/* Close button row */}
            <div
              onClick={() => setvisible(false)}
              className="flex items-center gap-4 p-4 cursor-pointer border-b border-green-700"
            >
              <img
                src={assets.dropdown_icon}
                className="h-4 rotate-180 invert"
                alt="close"
              />
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">
                {i18n.language === 'ar' ? 'إغلاق القائمة' : 'Close Menu'}
              </span>
            </div>
            <NavLink
              onClick={() => setvisible(false)}
              to="/"
              className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
            >
              {t("HOME")}
            </NavLink>
            <NavLink
              onClick={() => setvisible(false)}
              to="/collection"
              className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
            >
              {t("COLLECTION")}
            </NavLink>
            <NavLink
              onClick={() => setvisible(false)}
              to="/about"
              className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
            >
              {t("ABOUT")}
            </NavLink>
            <NavLink
              onClick={() => setvisible(false)}
              to="/contact"
              className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
            >
              {t("CONTACT")}
            </NavLink>
            <NavLink
              onClick={() => setvisible(false)}
              to="/policy"
              className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
            >
              {t("POLICY")}
            </NavLink>
            {user && (
              <NavLink
                onClick={() => setvisible(false)}
                to="/orders"
                className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
              >
                {t("ORDERS")}
              </NavLink>
            )}
            <NavLink
              onClick={() => setvisible(false)}
              to="/wishlist"
              className="py-3 px-6 border-b border-green-700/50 hover:bg-green-700/40 transition-colors"
            >
              {t("WISHLIST")}
            </NavLink>
          </div>
        </div>
        {/* Backdrop overlay when sidebar is open */}
        {visible && (
          <div
            className="fixed inset-0 bg-black/40 z-[199] sm:hidden"
            onClick={() => setvisible(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Navbar;
