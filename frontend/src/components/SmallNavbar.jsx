import React from 'react';
import { useTranslation } from 'react-i18next';

const SmallNavbar = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const announcement = isAr
    ? '⚡ شركة الأمين للكابلات والأسلاك — نحاس نقي 100% مطابق للمواصفات القياسية IEC & ES | شحن لجميع المحافظات ومواقع المشاريع 🔌'
    : '⚡ Al-Ameen Cables & Wires — 100% Pure Copper, IEC & ES Certified | Fast Delivery to Job Sites Across Egypt 🔌';

  const repeats = 6;

  return (
    <div className="w-full bg-gradient-to-r from-[#b38a1f] via-[#f0c040] to-[#b38a1f] text-[#0a2310] text-[10px] sm:text-xs font-black py-1 sm:py-1.5 px-2 overflow-hidden relative shadow-sm border-b border-[#8f6e10]/30 select-none">
      <div
        className={`flex whitespace-nowrap ${isAr ? 'animate-marquee-rtl' : 'animate-marquee'} hover:[animation-play-state:paused]`}
        style={{ minWidth: '100%' }}
      >
        {Array.from({ length: repeats }).map((_, i) => (
          <span className="mx-4 sm:mx-8 inline-flex items-center gap-2 tracking-wide" key={i}>
            {announcement}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marqueeRtl 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SmallNavbar;

