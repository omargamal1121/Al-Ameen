import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import SmallNavbar from "./SmallNavbar";
import { useLocalization } from "../utils/localization";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
  FaWhatsapp,
  FaPhoneAlt,
  FaBolt,
  FaBoxes,
  FaShieldAlt,
  FaFileContract,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";

const Navbar = () => {
  const {
    user,
    setUser,
    setToken,
    setShowSearch,
    getCartCount,
    getWishlistCount,
    getCategories,
    categories,
  } = useContext(ShopContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpenMobile, setCategoriesOpenMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { getLocalizedName } = useLocalization();
  const isAr = i18n.language === "ar";
  const profileRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);

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
    setProfileMenuOpen(false);
    navigate("/login");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top running announcement bar */}
      <SmallNavbar />

      {/* Main navigation bar */}
      <nav
        className={`w-full transition-all duration-300 relative border-b border-[#c9a227]/40 ${
          scrolled ? "shadow-2xl py-2 sm:py-2.5" : "shadow-md py-2 sm:py-3.5"
        }`}
        style={{
          background:
            "linear-gradient(135deg, #092010 0%, #0f3d1a 50%, #175225 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* ================= LEFT SECTION (Desktop Nav Links / Mobile Brand) ================= */}
          {/* Mobile Start: Brand Logo & Title */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={assets.logo}
                className="w-10 h-10 object-contain rounded-full ring-2 ring-[#c9a227]/80 shadow-md group-hover:scale-105 transition-transform"
                alt="Al-Ameen Cables"
              />
              <div className="flex flex-col">
                <span className="text-sm font-black text-white tracking-tight leading-tight">
                  {isAr ? "الأمين للكابلات" : "Al-Ameen Cables"}
                </span>
                <span className="text-[9px] font-bold text-[#c9a227] tracking-wider">
                  {isAr ? "كابلات وأسلاك معتمدة" : "Certified Wires"}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Left: Navigation links */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-white/95">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-colors py-1 ${
                  isActive ? "text-[#f0c040]" : "hover:text-[#f0c040]"
                }`
              }
            >
              <span className="flex items-center gap-1.5">
                <FaHome className="text-xs text-[#c9a227]" />
                {t("HOME")}
              </span>
              <span className="w-0 h-[2px] bg-[#f0c040] transition-all duration-300 group-hover:w-full"></span>
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative group py-1">
              <NavLink
                to="/collection"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 transition-colors ${
                    isActive ? "text-[#f0c040]" : "hover:text-[#f0c040]"
                  }`
                }
              >
                <FaBolt className="text-xs text-[#c9a227]" />
                <span>{t("CATEGORY")}</span>
                <FaChevronDown className="text-[10px] group-hover:rotate-180 transition-transform duration-200" />
              </NavLink>

              {/* Mega Dropdown */}
              <div
                className={`absolute top-full mt-2 w-72 bg-white text-gray-900 shadow-2xl rounded-2xl border border-gray-100 p-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100] ${
                  isAr ? "right-0" : "left-0"
                }`}
              >
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <span className="text-xs font-black text-[#0f3d1a] uppercase tracking-wider block">
                    {isAr ? "تصنيفات الكابلات المعتمدة" : "Certified Cable Categories"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-[#0f3d1a] hover:text-[#f0c040] transition-all"
                      >
                        <span>{getLocalizedName(cat)}</span>
                        <span className="text-[10px] text-gray-400 group-hover:text-white">
                          {isAr ? "←" : "→"}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-gray-400 italic">
                      {isAr ? "جاري تحميل التصنيفات..." : "Loading categories..."}
                    </div>
                  )}
                  <div className="pt-2 mt-1 border-t border-gray-100">
                    <Link
                      to="/collection"
                      className="block text-center text-xs font-black text-[#1a6b2e] hover:text-[#0f3d1a] py-1"
                    >
                      {isAr ? "عرض جميع الكابلات والأسلاك ⚡" : "View Full Catalog ⚡"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors py-1 ${
                  isActive ? "text-[#f0c040]" : "hover:text-[#f0c040]"
                }`
              }
            >
              <FaBoxes className="text-xs text-[#c9a227]" />
              <span>{t("COLLECTION")}</span>
            </NavLink>

            <NavLink
              to="/policy"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors py-1 ${
                  isActive ? "text-[#f0c040]" : "hover:text-[#f0c040]"
                }`
              }
            >
              <FaShieldAlt className="text-xs text-[#c9a227]" />
              <span>{t("POLICY")}</span>
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors py-1 ${
                  isActive ? "text-[#f0c040]" : "hover:text-[#f0c040]"
                }`
              }
            >
              <FaFileContract className="text-xs text-[#c9a227]" />
              <span>{t("ORDERS")}</span>
            </NavLink>
          </ul>

          {/* ================= CENTER BRAND LOGO (Desktop) ================= */}
          <div className="hidden lg:flex items-center justify-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={assets.logo}
                className="w-14 h-14 xl:w-16 xl:h-16 object-contain rounded-full ring-2 ring-[#c9a227]/90 shadow-lg group-hover:scale-105 transition-all duration-300"
                alt="Al-Ameen Cables"
              />
              <div className="text-start">
                <p className="text-base font-black text-white leading-tight tracking-tight">
                  {isAr ? "الأمين للكابلات والأسلاك" : "Al-Ameen Wires & Cables"}
                </p>
                <p className="text-[10px] text-[#c9a227] font-extrabold uppercase tracking-widest">
                  {isAr ? "نحاس نقي 100% | جودة معتمدة" : "100% Pure Copper | Certified"}
                </p>
              </div>
            </Link>
          </div>

          {/* ================= RIGHT SECTION (Actions & Icons) ================= */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 sm:px-3 py-1 bg-[#c9a227]/90 hover:bg-[#f0c040] text-[#0a2310] font-black text-[11px] sm:text-xs rounded-full transition-all shadow-sm flex items-center gap-1 border border-yellow-200 active:scale-95 cursor-pointer"
              title="Toggle Language"
            >
              <span>🌐</span>
              <span className="font-extrabold">{isAr ? "EN" : "عربي"}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => {
                setShowSearch(true);
                navigate("/collection");
              }}
              className="p-2 text-white/90 hover:text-[#f0c040] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Search Cables"
              aria-label="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>

            {/* Wishlist Button (Hidden on tiny mobile to save space, available in drawer) */}
            <Link
              to="/wishlist"
              className="hidden sm:flex relative p-2 text-white/90 hover:text-[#f0c040] hover:bg-white/10 rounded-full transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <FaHeart className="w-4 h-4" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a227] text-[#0a2310] font-black text-[9px] rounded-full flex items-center justify-center shadow">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Profile Dropdown (Desktop) */}
            <div className="relative hidden sm:block" ref={profileRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="p-2 text-white/90 hover:text-[#f0c040] hover:bg-white/10 rounded-full transition-colors flex items-center cursor-pointer"
                    title="Account"
                    aria-label="Account"
                  >
                    <FaUser className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[110] text-gray-800 ${
                          isAr ? "left-0" : "right-0"
                        }`}
                      >
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs text-gray-400 font-semibold">
                            {isAr ? "مرحباً بك" : "Signed in as"}
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.name || user.email || "User"}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-xs font-bold hover:bg-[#0f3d1a] hover:text-[#f0c040] transition-colors"
                        >
                          {isAr ? "الملف الشخصي" : "My Profile"}
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-xs font-bold hover:bg-[#0f3d1a] hover:text-[#f0c040] transition-colors"
                        >
                          {isAr ? "طلباتي" : "My Orders"}
                        </Link>
                        <Link
                          to="/change-password"
                          className="block px-4 py-2 text-xs font-bold hover:bg-[#0f3d1a] hover:text-[#f0c040] transition-colors"
                        >
                          {isAr ? "تغيير كلمة المرور" : "Change Password"}
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-start px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            {isAr ? "تسجيل الخروج" : "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-white/90 hover:text-[#f0c040] hover:bg-white/10 rounded-full transition-colors flex items-center"
                  title="Sign In"
                  aria-label="Sign In"
                >
                  <FaUser className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-white/90 hover:text-[#f0c040] hover:bg-white/10 rounded-full transition-colors"
              title="Cart"
              aria-label="Cart"
            >
              <FaShoppingCart className="w-4 h-4" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a227] text-[#0a2310] font-black text-[9px] rounded-full flex items-center justify-center shadow">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:text-[#f0c040] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Open Menu"
              aria-label="Menu"
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE SLIDEOUT DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[200] lg:hidden"
            />

            {/* Drawer Content */}
            <motion.aside
              initial={{ x: isAr ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className={`fixed top-0 bottom-0 ${
                isAr ? "right-0" : "left-0"
              } w-[85%] max-w-sm bg-gradient-to-b from-[#0a2310] via-[#0f3d1a] to-[#07170b] text-white z-[201] shadow-2xl flex flex-col justify-between overflow-hidden lg:hidden`}
            >
              {/* Drawer Top / Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={assets.logo}
                    alt="Al-Ameen Cables"
                    className="w-10 h-10 rounded-full ring-2 ring-[#c9a227]"
                  />
                  <div>
                    <h3 className="font-black text-sm text-white leading-tight">
                      {isAr ? "الأمين للكابلات" : "Al-Ameen Cables"}
                    </h3>
                    <p className="text-[10px] text-[#c9a227] font-bold">
                      {isAr ? "المصدر الأول للأسلاك" : "Industrial Wires"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close Menu"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer User Status Card */}
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#c9a227] font-bold">
                        {isAr ? "حسابك المسجل" : "Logged in as"}
                      </p>
                      <p className="text-xs font-extrabold text-white truncate max-w-[180px]">
                        {user.name || user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 bg-red-950/40 rounded-lg"
                    >
                      {isAr ? "خروج" : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2 bg-[#c9a227] text-[#0a2310] font-black text-xs rounded-xl hover:bg-yellow-400 transition-colors shadow"
                    >
                      {isAr ? "تسجيل الدخول" : "Sign In"}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20 transition-colors"
                    >
                      {isAr ? "إنشاء حساب" : "Register"}
                    </Link>
                  </div>
                )}
              </div>

              {/* Drawer Nav Links (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <FaHome className="w-4 h-4 text-[#c9a227]" />
                  <span>{t("HOME")}</span>
                </NavLink>

                {/* Collapsible Categories Section on Mobile */}
                <div className="rounded-xl overflow-hidden bg-white/5">
                  <button
                    onClick={() => setCategoriesOpenMobile((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-gray-200 hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <FaBolt className="w-4 h-4 text-[#c9a227]" />
                      <span>{t("CATEGORY")}</span>
                    </span>
                    <FaChevronDown
                      className={`text-xs text-gray-400 transition-transform ${
                        categoriesOpenMobile ? "rotate-180 text-[#c9a227]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {categoriesOpenMobile && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-2 flex flex-col gap-1 border-t border-white/5 pt-1.5"
                      >
                        {Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/category/${cat.id}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="px-3 py-2 text-xs font-semibold text-gray-300 hover:text-[#f0c040] hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
                            >
                              <span>{getLocalizedName(cat)}</span>
                              <span className="text-[10px] text-gray-500">
                                {isAr ? "←" : "→"}
                              </span>
                            </Link>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic px-2 py-1">
                            {isAr ? "جاري التحميل..." : "Loading..."}
                          </span>
                        )}
                        <Link
                          to="/collection"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-2 text-xs font-bold text-[#c9a227] hover:underline"
                        >
                          {isAr ? "⚡ تصفح كل الكابلات" : "⚡ View All Cables"}
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink
                  to="/collection"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <FaBoxes className="w-4 h-4 text-[#c9a227]" />
                  <span>{t("COLLECTION")}</span>
                </NavLink>

                <NavLink
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <FaHeart className="w-4 h-4 text-[#c9a227]" />
                    <span>{t("WISHLIST")}</span>
                  </span>
                  {getWishlistCount() > 0 && (
                    <span className="bg-[#c9a227] text-[#0a2310] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {getWishlistCount()}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <FaFileContract className="w-4 h-4 text-[#c9a227]" />
                  <span>{t("ORDERS")}</span>
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <FaInfoCircle className="w-4 h-4 text-[#c9a227]" />
                  <span>{t("ABOUT")}</span>
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <FaPhoneAlt className="w-4 h-4 text-[#c9a227]" />
                  <span>{t("CONTACT")}</span>
                </NavLink>

                <NavLink
                  to="/policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#c9a227] text-[#0a2310] font-black"
                        : "text-gray-200 hover:bg-white/10"
                    }`
                  }
                >
                  <FaShieldAlt className="w-4 h-4 text-[#c9a227]" />
                  <span>{t("POLICY")}</span>
                </NavLink>
              </div>

              {/* Drawer Bottom / Contractor Quick Contact */}
              <div className="p-4 border-t border-white/10 bg-black/30 space-y-2">
                <a
                  href="https://wa.me/201010814995?text=Hello%20Al-Ameen%20Cables!%20I%20would%20like%20to%20inquire%20about%20a%20project%20quotation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow transition-colors"
                >
                  <FaWhatsapp className="text-base" />
                  <span>{isAr ? "واتساب المبيعات والمشاريع" : "WhatsApp Sales & Quotes"}</span>
                </a>

                <a
                  href="tel:+201010814995"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <FaPhoneAlt className="text-xs text-[#c9a227]" />
                  <span dir="ltr">+20 101 081 4995</span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
