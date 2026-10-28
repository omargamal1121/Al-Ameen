import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const RandomProducts = () => {
  const { t } = useTranslation();
  const { getRandomProducts } = useContext(ShopContext);
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      setLoading(true);
      const products = await getRandomProducts(8);
      setRandomProducts(products);
      setLoading(false);
    };

    fetchRandomProducts();
  }, [getRandomProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const productBoxVariants = {
    hidden: { opacity: 0, y: 50, rotateY: 15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  };

  if (loading) {
    return (
      <div className="my-20 px-4 sm:px-[5vw]">
        <div className="flex flex-col items-center text-center mb-10">
          <Title text1={t('DISCOVER')} text2={t('OUR_COLLECTION')} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && randomProducts.length === 0) return null;

  return (
    <div className="my-28 bg-gray-50/50 py-20 px-4 sm:px-[5vw] border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="mb-4">
            <Title text1={t('DISCOVER')} text2={t('OUR_COLLECTION')} />
          </div>
          <p className="max-w-2xl text-gray-500 font-light italic text-lg shimmer-text">
            {t('DISCOVER_DESC') || "Discover something new from our curated selection"}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 perspective-1000"
        >
          {randomProducts.map((item) => {
            const productImages = Array.isArray(item.images)
              ? item.images.map(img => img.url || img.imageUrl).filter(Boolean)
              : Array.isArray(item.image)
                ? item.image
                : item.image
                  ? [item.image]
                  : item.mainImageUrl
                    ? [item.mainImageUrl]
                    : [];

            return (
              <motion.div
                key={item.id || item._id}
                variants={productBoxVariants}
                className="card-luxury"
              >
                <ProductItem
                  id={item.id || item._id}
                  image={productImages}
                  name={item.name}
                  arName={item.arName}
                  price={item.price}
                  finalPrice={item.finalPrice}
                  discountPrecentage={item.discountPrecentage}
                  discountName={item.discountName}
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <Link to="/collection" className="btn-premium px-12 py-4 bg-black text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            {t('VIEW_ALL_COLLECTION') || "Explore Selection"}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default RandomProducts;
