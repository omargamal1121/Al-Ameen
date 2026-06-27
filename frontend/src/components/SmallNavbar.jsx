import React from 'react';

const announcement = 'Free shipping on bulk orders! ⚡  Industrial-grade cables & wires — Trusted by engineers across Egypt 🔌';

const SmallNavbar = () => {
  // Repeat the announcement 12 times for a long marquee
  const repeats = 12;
  return (
    <div className="w-full bg-[#c9a227] text-[#0f3d1a] text-xs font-bold px-2 py-3 overflow-hidden relative group cursor-pointer shadow-inner">
      <div
        className="flex whitespace-nowrap animate-marquee group-hover:paused"
        style={{ minWidth: '100%', animationPlayState: 'running' }}
      >
        {Array.from({ length: repeats }).map((_, i) => (
          <span className="mx-4" key={i}>{announcement}</span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};

export default SmallNavbar;
