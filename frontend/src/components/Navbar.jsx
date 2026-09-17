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
        className={`w-full transition-all duration-300 ${scrolled ? "shadow-xl" : "shadow-md"
          } border-b border-[#c9a227]/40 flex items-center py-3 font-medium px-4 sm:px-[2vw] md:px-[2vw] lg:px-[3vw] relative`}
      >
        {/* Background: rich green gradient for maximum contrast and legibility */}
        <div
          className="absolute inset-0 z-[-1] transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, #0f3d1a 0%, #165524 50%, #0f3d1a 100%)',
          }}
        />

        {/* --- الروابط الرئيسية --- */}
        <ul
          className={`hidden sm:flex gap-6 text-sm text-white flex-1 ${i18n.language === 'ar' ? 'justify-end' : 'justify-start'}`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 group font-semibold transition-colors ${isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
              }`
            }
          >
            <p>{t("HOME")}</p>
            <span className="w-2/4 h-[2px] transition-all duration-300 bg-yellow-400 group-hover:w-full group-hover:bg-yellow-300 group-hover:opacity-100 opacity-0"></span>
          </NavLink>

          <div className="relative group">
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `flex items-center gap-1 focus:outline-none uppercase tracking-widest font-semibold transition-colors ${isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
                }`
              }
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
                        className="flex justify-between items-center px-4 py-3.5 hover:bg-[#0f3d1a] hover:text-yellow-300 rounded-xl cursor-pointer text-gray-800 font-black transition-all duration-200"
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
              `flex flex-col items-center gap-1 group font-semibold transition-colors ${isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
              }`
            }
          >
            <p>{t("POLICY")}</p>
            <span className="w-2/4 h-[2px] transition-all duration-300 bg-yellow-400 group-hover:w-full group-hover:bg-yellow-300 group-hover:opacity-100 opacity-0"></span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 group font-semibold transition-colors ${isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
              }`
            }
          >
            <p>{t("ORDERS")}</p>
            <span className="w-2/4 h-[2px] transition-all duration-300 bg-yellow-400 group-hover:w-full group-hover:bg-yellow-300 group-hover:opacity-100 opacity-0"></span>
          </NavLink>
        </ul>

        {/* --- اللوجو --- */}
        <div className="flex-1 flex justify-center">
          <Link to={"/"}>
            <img
              src={assets.logo}
              className={`w-16 h-16 object-contain rounded-full transition-all duration-300 ring-2 ring-yellow-400/80 shadow-md ${scrolled || hovered ? "scale-105" : "opacity-95"
                }`}
              alt="الأمين Logo"
            />
          </Link>
        </div>

        {/* --- أيقونات يمين --- */}
        <div className="flex items-center gap-5 flex-1 justify-end">
          {/* Language Switcher Badge */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c9a227] hover:bg-yellow-400 text-[#0f3d1a] font-extrabold text-xs rounded-full transition-all duration-300 shadow-md cursor-pointer border border-yellow-300 active:scale-95"
            title="Switch Language / تغيير اللغة"
          >
            <span className="text-sm">🌐</span>
            <span>{i18n.language === "en" ? "العربية" : "English"}</span>
          </button>

          {/* البحث */}
          <button
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="Search"
          >
            <img
              src={assets.search_icon}
              className="w-5 h-5 cursor-pointer brightness-0 invert"
              alt="Search"
            />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors text-white hover:text-yellow-300">
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
              <p className="absolute right-[-2px] bottom-[-2px] w-4 text-center leading-4 bg-[#c9a227] text-[#0f3d1a] font-black aspect-square rounded-full text-[9px] shadow">
                {getWishlistCount()}
              </p>
            )}
          </Link>

          {/* قائمة البروفايل */}
          <div className="relative z-50" ref={profileRef}>
            {user ? (
              <>
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                >
                  <img
                    src={assets.profile_icon}
                    className="w-5 h-5 cursor-pointer brightness-0 invert"
                    alt="Profile"
                  />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white shadow-2xl border border-gray-100 rounded-xl py-2 transition-all duration-200 z-[110]">
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-[#0f3d1a] hover:text-yellow-300 rounded-lg mx-1"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/change-email"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-[#0f3d1a] hover:text-yellow-300 rounded-lg mx-1"
                    >
                      Change Email
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-[#0f3d1a] hover:text-yellow-300 rounded-lg mx-1"
                    >
                      Change Password
                    </Link>
                    <Link
                      to="/upload-photo"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-[#0f3d1a] hover:text-yellow-300 rounded-lg mx-1"
                    >
                      Upload Photo
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg mx-1 mt-1 border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                <img
                  src={assets.profile_icon}
                  className="w-5 h-5 cursor-pointer brightness-0 invert"
                  alt="Login"
                />
              </Link>
            )}
          </div>

          {/* عربة التسوق */}
          <Link to="/cart" className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <img src={assets.cart_icon} className="w-5 min-w-5 h-5 brightness-0 invert" alt="Cart" />
            <p className="absolute right-[-2px] bottom-[-2px] w-4 text-center leading-4 bg-[#c9a227] text-[#0f3d1a] font-black aspect-square rounded-full text-[9px] shadow">
              {getCartCount()}
            </p>
          </Link>

          {/* القائمة للموبايل */}
          <button onClick={() => setvisible(true)} className="p-1.5 sm:hidden hover:bg-white/10 rounded-full">
            <img
              src={assets.menu_icon}
              className="w-5 h-5 cursor-pointer brightness-0 invert"
              alt="Menu"
            />
          </button>
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
