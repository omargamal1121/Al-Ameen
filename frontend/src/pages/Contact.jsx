import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewLetterBox from '../components/NewLetterBox'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const Contact = () => {
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

  const contactInfoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="mt-[100px] mb-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Contact Title */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className='text-2xl sm:text-3xl text-center pt-8 border-t border-gray-200 font-bold'>
        <Title text1={t('CONTACT')} text2={t('US')} />
      </motion.div>

      {/* Contact Content */}
      <div className='my-12 flex flex-col md:flex-row gap-12 mb-20 items-stretch justify-center'>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariants}
          className="w-full md:w-1/2 relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 min-h-[350px]"
        >
          <img
            src={assets.contact_img || assets.brand_hero_2}
            alt="Al-Ameen Contact"
            className='w-full h-full object-cover'
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f3d1a]/90 via-[#0f3d1a]/40 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-[#c9a227] text-xs font-black uppercase tracking-widest mb-1">HQ & Main Showroom</span>
            <h3 className="text-2xl font-black mb-2">Industrial Zone, 10th of Ramadan</h3>
            <p className="text-gray-200 text-sm">Cairo, Egypt — Serving all governorates with fast cable delivery.</p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={contactInfoVariants}
          className='w-full md:w-1/2 flex flex-col justify-between gap-6'>
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col gap-6 shadow-sm">
            <div>
              <p className='font-black text-xl text-gray-900 mb-2 flex items-center gap-2'>
                <span>🏢</span> {t('OUR_STORE')}
              </p>
              <p className='text-gray-600 text-sm leading-relaxed' dangerouslySetInnerHTML={{ __html: t('STORE_ADDRESS') }} />
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <p className='font-black text-xl text-gray-900 mb-2 flex items-center gap-2'>
                <span>📞</span> Direct Contact
              </p>
              <p className='text-gray-600 text-sm leading-relaxed' dangerouslySetInnerHTML={{ __html: t('STORE_CONTACT') }} />
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <p className='font-black text-xl text-gray-900 mb-1 flex items-center gap-2'>
                <span>💼</span> {t('CAREERS')}
              </p>
              <p className='text-gray-600 text-sm mb-4 leading-relaxed'>{t('CAREERS_DESC')}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/201234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] text-white font-bold text-xs rounded-full hover:bg-green-600 transition-all flex items-center gap-2 shadow-md"
                >
                  💬 Chat on WhatsApp
                </a>
                <a
                  href="mailto:info@alameenwires.com"
                  className="px-6 py-3 bg-[#0f3d1a] text-white font-bold text-xs rounded-full hover:bg-[#1a6b2e] transition-all flex items-center gap-2 shadow-md"
                >
                  ✉️ Email Sales Team
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Newsletter Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}>
        <NewLetterBox />
      </motion.div>
    </div>
  )
}

export default Contact
