import React from 'react';
import { useTranslation } from 'react-i18next';

const TrustStrip = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const items = isAr ? [
    { icon: '⚡', text: 'معتمد بمعايير IEC 60502' },
    { icon: '🏅', text: 'نظام إدارة الجودة ISO 9001' },
    { icon: '🇪🇬', text: 'مطابق للمواصفات القياسية المصرية ES' },
    { icon: '🔌', text: 'نحاس نقي 100% مضمون' },
    { icon: '📦', text: 'شحن مجاني لطلبات الجملة' },
    { icon: '🔧', text: '25 عاماً من الخبرة الهندسية' },
    { icon: '⚙️', text: 'موثوق من أكثر من 500 مقاول' },
    { icon: '🏗️', text: 'مقاسات متنوعة من 1.5مم² إلى 630مم²' },
  ] : [
    { icon: '⚡', text: 'IEC 60502 Certified' },
    { icon: '🏅', text: 'ISO 9001 Quality System' },
    { icon: '🇪🇬', text: 'Egyptian Standard ES Compliant' },
    { icon: '🔌', text: '100% Pure Copper Guaranteed' },
    { icon: '📦', text: 'Free Delivery on Bulk Orders' },
    { icon: '🔧', text: '25 Years of Engineering Excellence' },
    { icon: '⚙️', text: 'Trusted by 500+ Contractors' },
    { icon: '🏗️', text: 'Full Range: 1.5mm² to 630mm²' },
  ];

  const repeated = [...items, ...items, ...items];

  return (
    <div className="w-full bg-[#0a1e0f] border-y border-[#c9a227]/30 text-[#c9a227] py-3.5 overflow-hidden relative group">
      <div
        className={`flex whitespace-nowrap ${isAr ? 'animate-trust-rtl' : 'animate-trust'} hover:[animation-play-state:paused]`}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-2 mx-8 text-xs sm:text-sm font-bold tracking-wide">
            <span className="text-base">{item.icon}</span>
            <span>{item.text}</span>
            <span className="text-[#c9a227]/40 ml-6">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes trustScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes trustScrollRtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-trust {
          animation: trustScroll 35s linear infinite;
        }
        .animate-trust-rtl {
          animation: trustScrollRtl 35s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TrustStrip;
