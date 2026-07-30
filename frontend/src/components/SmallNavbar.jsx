import React from 'react';
import { useTranslation } from 'react-i18next';

const SmallNavbar = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const announcement = isAr
    ? 'شحن مجاني لطلبات الجملة! ⚡ كابلات وأسلاك ذات موصفات صناعية ومعتمدة — المصدر الأول للمهندسين والمقاولين في مصر 🔌'
    : 'Free shipping on bulk orders! ⚡ Industrial-grade cables & wires — Trusted by engineers across Egypt 🔌';

  const repeats = 8;

  return (
    <div className="w-full bg-gradient-to-r from-[#c9a227] via-[#f0c040] to-[#c9a227] text-[#0f3d1a] text-xs font-extrabold py-2 px-2 overflow-hidden relative shadow-sm border-b border-[#a07d10]/30">
      <div
        className={`flex whitespace-nowrap ${isAr ? 'animate-marquee-rtl' : 'animate-marquee'} hover:[animation-play-state:paused]`}
        style={{ minWidth: '100%' }}
      >
        {Array.from({ length: repeats }).map((_, i) => (
          <span className="mx-6 inline-flex items-center gap-2 tracking-wide" key={i}>
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
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marqueeRtl 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SmallNavbar;
