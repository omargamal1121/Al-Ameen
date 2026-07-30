import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ScrollSection = () => {
    const { i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    return (
        <div className="my-16 py-16 px-6 bg-gradient-to-r from-[#0f3d1a] via-[#1a6b2e] to-[#0f3d1a] text-white rounded-3xl shadow-2xl relative overflow-hidden text-center border border-[#c9a227]/30">
            {/* Subtle background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c9a227]/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto space-y-6 relative z-10"
            >
                {/* Brand Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/50 text-[#c9a227] text-xs font-black uppercase tracking-[0.25em]">
                    ⚡ {isAr ? "الأمين للكابلات والأسلاك" : "Al-Ameen Wires & Cables"}
                </div>

                {/* Main Headline */}
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                    {isAr ? "وصل عالمك بالطاقة والجهد المعتمد" : "Wire Your World With Certified Power & Precision"}
                </h2>

                {/* Supporting Statement */}
                <p className="text-gray-200 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                    {isAr
                        ? "نضمن أعلى مستويات السلامة الكهربائية والكفاءة العالية بكابلات مطابقة لمعايير ISO و IEC لتغطية كافة المجمعات الصناعية والمشاريع القومية."
                        : "Delivering industrial-grade conductivity, zero-defect insulation, and international IEC compliance for major engineering and infrastructure developments nationwide."}
                </p>

                {/* Stat Highlights Row */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 max-w-xl mx-auto">
                    <div>
                        <span className="block text-2xl sm:text-3xl font-black text-[#c9a227]">100%</span>
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                            {isAr ? "اختبار الجودة" : "Quality Tested"}
                        </span>
                    </div>
                    <div>
                        <span className="block text-2xl sm:text-3xl font-black text-[#c9a227]">IEC / ISO</span>
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                            {isAr ? "معايير معتمدة" : "Certified Standard"}
                        </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <span className="block text-2xl sm:text-3xl font-black text-[#c9a227]">24 / 7</span>
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                            {isAr ? "دعم المشاريع" : "Project Support"}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ScrollSection;
