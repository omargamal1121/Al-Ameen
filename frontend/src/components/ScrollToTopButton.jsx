import React, { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "";
  const whatsappMessage = encodeURIComponent("Hello! I need some help with my order.");

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label="Scroll to top"
      onClick={handleClick}
      className={`fixed bottom-6 left-6 z-40 rounded-full border border-gray-300 bg-white/95 backdrop-blur-xs text-[#0f3d1a] shadow-lg p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#c9a227] hover:bg-yellow-50 active:translate-y-0 cursor-pointer ${
        isVisible ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-90"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;


