import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 500, suffix: '+', label: 'Projects Powered', icon: '🏗️' },
  { value: 25, suffix: ' Yrs', label: 'Years of Experience', icon: '📅' },
  { value: 100, suffix: '%', label: 'Pure Copper Guaranteed', icon: '⚡' },
  { value: 1000, suffix: '+', label: 'Tons Delivered Yearly', icon: '🚛' },
];

const reasons = [
  {
    icon: '🔬',
    title: 'Certified Quality',
    desc: 'Every cable batch passes IEC 60502, ISO 9001, and Egyptian Standards testing before leaving our factory.',
  },
  {
    icon: '🤝',
    title: 'Trusted by Engineers',
    desc: 'Specified by electrical engineers and contractors across Egypt for residential, industrial, and infrastructure projects.',
  },
  {
    icon: '🏭',
    title: 'Direct from Factory',
    desc: 'No middlemen. Buy direct at competitive prices with full technical support and fast delivery across Egypt.',
  },
];

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const StatsSection = () => (
  <section className="my-0 bg-[#0a1e0f]">
    {/* Stats counters */}
    <div className="px-4 sm:px-[5vw] pt-16 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-4xl mb-2">{s.icon}</span>
            <p className="text-3xl sm:text-4xl font-black text-[#c9a227]">
              <Counter target={s.value} suffix={s.suffix} />
            </p>
            <p className="text-gray-300 text-sm mt-1 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Why Choose Al-Ameen */}
    <div className="px-4 sm:px-[5vw] pb-16 pt-8 border-t border-white/10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-2xl sm:text-3xl font-black text-white tracking-widest uppercase mb-10"
      >
        Why Choose <span className="text-[#c9a227]">Al-Ameen?</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center hover:border-[#c9a227]/50 hover:bg-white/8 transition-all duration-300 group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{r.icon}</div>
            <h3 className="text-white font-bold text-lg mb-3">{r.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
