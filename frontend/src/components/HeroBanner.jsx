import React, { useState, useEffect, useContext, useMemo } from 'react';
import { assets } from '../assets/frontend_assets/assets.js'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';

const HeroBanner = () => {
  const { t, i18n } = useTranslation();
  const { backendUrl, categories, getCategories } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('none');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getCategories();
    setViewMode('categories');
    setLoading(false);
  }, []);

  const slidesData = useMemo(() => {
    const isAr = i18n.language === 'ar';
    if (viewMode === 'categories' && categories && categories.length > 0) {
      return categories.map(cat => ({
        name: isAr ? (cat.nameAr || cat.name) : cat.name,
        subtitleKey: 'FEATURED_SELECTION',
        image: cat.images && cat.images.length > 0 ? cat.images[0].url : assets.brand_hero_main,
        link: `/category/${cat.id || cat._id}`
      }));
    }
    
    return [
      { name: isAr ? "الأمين للكابلات والأسلاك" : "Al-Ameen Wires & Cables", subtitleKey: 'PREMIUM_CABLES', image: assets.brand_hero_main, link: "/collection" },
      { name: isAr ? "جودة عالمية معتمدة" : "ISO & IEC Certified Quality", subtitleKey: 'IEC_ISO_CERTIFIED', image: assets.brand_hero_2, link: "/collection" },
      { name: isAr ? "كابلات الطاقة والتوزيع" : "Power & Transmission Cables", subtitleKey: 'HIGH_VOLTAGE', image: assets.brand_img1, link: "/collection" },
      { name: isAr ? "أسلاك التحكم الصناعي" : "Industrial Control Wires", subtitleKey: 'INDUSTRIAL_CONTROL', image: assets.brand_img2, link: "/collection" },
      { name: isAr ? "كابلات الاتصالات والمحورية" : "Coaxial & Communication Series", subtitleKey: 'SIGNAL_COMMUNICATION', image: assets.brand_img3, link: "/collection" },
      { name: isAr ? "بكرات أسلاك وأطوال خاصة" : "Bulk Wire Spools & Custom Lengths", subtitleKey: 'BULK_CUSTOM', image: assets.brand_img4, link: "/collection" },
      { name: isAr ? "المورد الموثوق في كافة المحافظات" : "Egypt's Premier Electrical Supplier", subtitleKey: 'EGYPT_TRUSTED', image: assets.brand_img5, link: "/collection" },
      { name: isAr ? "كابلات مدرعة للاستخدام الثقيل" : "Heavy-Duty Armoured Cable Series", subtitleKey: 'HEAVY_DUTY', image: assets.brand_img6, link: "/collection" },
    ];
  }, [viewMode, categories, i18n.language, t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30, letterSpacing: "0.2em" },
    visible: {
      opacity: 1,
      y: 0,
      letterSpacing: "0em",
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] bg-[#0f3d1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] sm:h-[80vh] md:h-[90vh] relative overflow-hidden bg-[#0f3d1a]" dir="ltr">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        effect="coverflow"
        loop={true}
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        coverflowEffect={{ rotate: 10, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
        className="w-full h-full hero-banner-swiper"
      >
        {slidesData.map((item, index) => {
          const imgUrl = item.images ? (item.images.find(img => img.isMain)?.url || item.images[0]?.url) : item.image;


          return (
            <SwiperSlide key={index} className="w-full h-full overflow-hidden">
              <div className="group relative w-full h-full cursor-pointer">
                <img
                  src={imgUrl || assets.hero_banner_img}
                  alt={item.name}
                  className="w-full h-full object-cover object-center scale-100 transition-transform duration-[12000ms] ease-out swiper-zoom-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a2a10] via-black/35 to-transparent"></div>

                {/* Text overlay: restore RTL direction for Arabic text */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 md:pb-24 text-center text-white px-4 sm:px-8"
                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center max-w-4xl"
                      >
                        <motion.span variants={textVariants} className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-2 sm:mb-4 font-bold text-[#c9a227]">
                          {item.subtitleKey ? t(item.subtitleKey) : t('FEATURED_SELECTION')}
                        </motion.span>
                        <motion.h2
                          variants={textVariants}
                          className="text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 sm:mb-8 drop-shadow-2xl px-2 leading-tight"
                          style={{ letterSpacing: i18n.language === 'ar' ? '0' : '-0.02em' }}
                        >
                          {item.name}
                        </motion.h2>
                        <motion.div variants={textVariants}>
                          <Link to={item.link}>
                            <button className="btn-premium px-6 sm:px-12 py-2.5 sm:py-4 bg-[#c9a227] text-[#0f3d1a] font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full shadow-2xl hover:scale-110 hover:bg-yellow-300 active:scale-95 transition-all">
                              {viewMode === 'categories' ? t('SEE_COLLECTION') : t('SHOP_NOW')}
                            </button>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <style>{`
        .hero-banner-swiper .swiper-pagination-bullet { background: #c9a227 !important; width: 8px; height: 8px; transition: all 0.3s; opacity: 0.5; }
        .hero-banner-swiper .swiper-pagination-bullet-active { width: 24px; border-radius: 4px; opacity: 1 !important; }
        .hero-banner-swiper .swiper-slide-active img { transform: scale(1.06); }
      `}</style>
    </div>
  );
};

export default HeroBanner;
