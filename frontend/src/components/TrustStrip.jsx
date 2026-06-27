import React from 'react';

const items = [
  { icon: '⚡', text: 'IEC 60502 Certified' },
  { icon: '🏅', text: 'ISO 9001 Quality System' },
  { icon: '🇪🇬', text: 'Egyptian Standard ES' },
  { icon: '🔌', text: '100% Pure Copper' },
  { icon: '📦', text: 'Free Shipping on Bulk Orders' },
  { icon: '🔧', text: '25 Years of Engineering Excellence' },
  { icon: '⚙️', text: 'Trusted by 500+ Contractors' },
  { icon: '🏗️', text: 'From 1.5mm² to 630mm²' },
];

const TrustStrip = () => {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="w-full bg-[#0f3d1a] text-[#c9a227] py-3 overflow-hidden relative group">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'trustScroll 30s linear infinite' }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-2 mx-8 text-sm font-semibold tracking-wide">
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
      `}</style>
    </div>
  );
};

export default TrustStrip;
