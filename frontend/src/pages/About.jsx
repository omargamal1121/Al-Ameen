import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewLetterBox from '../components/NewLetterBox'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  };

  const chooseUsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const chooseUsItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="mt-[100px] mb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* About Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className='text-2xl sm:text-3xl text-center pt-8 border-t border-gray-200 font-bold'>
        <Title text1={t('ABOUT')} text2={t('US')} />
      </motion.div>

      <div className='my-12 flex flex-col md:flex-row items-center gap-12 lg:gap-16'>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariants}
          className="w-full md:w-1/2 relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
        >
          <img
            src={assets.brand_hero_main || assets.about_img}
            alt="Al-Ameen Wires Facility"
            className='w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700'
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <div className="text-white">
              <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest">Al-Ameen Headquarters</p>
              <p className="text-lg font-black">Industrial Zone — 10th of Ramadan</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariants}
          className='flex flex-col gap-6 justify-center md:w-1/2 text-gray-600 leading-relaxed'>
          <p className="text-base sm:text-lg font-normal text-gray-700">{t('ABOUT_DESC_1')}</p>
          <p className="text-sm sm:text-base">{t('ABOUT_DESC_2')}</p>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] text-white shadow-lg border border-[#c9a227]/30">
            <h3 className='text-[#c9a227] font-extrabold text-lg mb-2 flex items-center gap-2'>
              <span>⚡</span> {t('OUR_MISSION')}
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">{t('ABOUT_DESC_3')}</p>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className='text-2xl sm:text-3xl text-center pt-12 border-t border-gray-200 font-bold'>
        <Title text1={t('WHY')} text2={t('CHOOSE_US')} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={chooseUsContainerVariants}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 my-16'>
        <motion.div variants={chooseUsItemVariants} className='border border-gray-200 rounded-2xl p-8 flex flex-col gap-4 hover:border-[#c9a227] hover:shadow-xl transition-all duration-300 bg-white group'>
          <span className="text-3xl">🔬</span>
          <b className="text-gray-900 text-lg group-hover:text-[#1a6b2e] transition-colors">{t('QUALITY_ASSURANCE')}</b>
          <p className='text-gray-600 text-sm leading-relaxed'>{t('QUALITY_ASSURANCE_DESC')}</p>
        </motion.div>
        <motion.div variants={chooseUsItemVariants} className='border border-gray-200 rounded-2xl p-8 flex flex-col gap-4 hover:border-[#c9a227] hover:shadow-xl transition-all duration-300 bg-white group'>
          <span className="text-3xl">⚡</span>
          <b className="text-gray-900 text-lg group-hover:text-[#1a6b2e] transition-colors">{t('CONVENIENCE')}</b>
          <p className='text-gray-600 text-sm leading-relaxed'>{t('CONVENIENCE_DESC')}</p>
        </motion.div>
        <motion.div variants={chooseUsItemVariants} className='border border-gray-200 rounded-2xl p-8 flex flex-col gap-4 hover:border-[#c9a227] hover:shadow-xl transition-all duration-300 bg-white group'>
          <span className="text-3xl">📞</span>
          <b className="text-gray-900 text-lg group-hover:text-[#1a6b2e] transition-colors">{t('EXCEPTIONAL_CUSTOMER_SERVICE')}</b>
          <p className='text-gray-600 text-sm leading-relaxed'>{t('EXCEPTIONAL_CUSTOMER_SERVICE_DESC')}</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}>
        <NewLetterBox />
      </motion.div>
    </div>
  );
};

export default About;
