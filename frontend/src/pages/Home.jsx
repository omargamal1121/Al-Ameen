import React from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import MostWanted from "../components/MostWanted";
import OurPolicy from "../components/OurPolicy";
import NewLetterBox from '../components/NewLetterBox';
import { motion } from "framer-motion";
import { assets } from "../assets/frontend_assets/assets";
import ScrollSection from "../components/ScrollSection";
import TypeCollection from "../components/TypeCollection";
import ReelBaggey from "../components/ReelBaggey";
import TypeProduct from "../components/TypeProduct";
import HeroBanner from "../components/HeroBanner";
import TrustStrip from "../components/TrustStrip";
import StatsSection from "../components/StatsSection";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <div>
      {/* Hero full-width banner carousel */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <HeroBanner />
      </div>

      {/* Trust / certifications strip */}
      <TrustStrip />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <LatestCollection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <BestSeller />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <MostWanted />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <ScrollSection scroll1={assets.brand_img5} scroll2={assets.brand_img6} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <TypeProduct />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <TypeCollection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={itemVariants}>
        <ReelBaggey />
      </motion.div>

      {/* Stats + Why Choose section */}
      <StatsSection />

      {/* Policy strip */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <OurPolicy />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={itemVariants}>
        <NewLetterBox />
      </motion.div>

      {/* Floating WhatsApp button */}
      <WhatsAppButton />
    </div>
  );
};

export default Home;
