import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const MostWanted = () => {
    const { t } = useTranslation();
    const { backendUrl } = useContext(ShopContext);
    const [mostWantedProducts, setMostWantedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/Products/bestsellers?isActive=true&includeDeleted=false`);
                const data = await response.json();

                if (response.ok && data.responseBody) {
                    setMostWantedProducts(data.responseBody.data || []);
                } else {
                    console.error("Failed to fetch bestsellers:", data);
                    setMostWantedProducts([]);
                }
            } catch (error) {
                console.error("Error fetching bestsellers:", error);
                setMostWantedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, [backendUrl]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        },
    };

    if (loading) {
        return (
            <div className="my-20 px-4 sm:px-[5vw]">
                <div className="text-left py-8">
                    <Title text1={t('MOST')} text2={t('WANTED')} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-sm"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (mostWantedProducts.length === 0) return null;

    return (
        <div className="my-24 px-4 sm:px-[5vw]">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-left py-8 flex flex-col md:flex-row md:items-end justify-between items-start gap-4 mb-8"
            >
                <div>
                    <Title text1={t('MOST')} text2={t('WANTED')} />
                    <div className="h-1 w-20 bg-black mt-2"></div>
                </div>
                <p className="max-w-lg text-gray-500 font-light text-sm md:text-base">
                    {t('MOST_WANTED_DESC')}
                </p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-12"
            >
                {mostWantedProducts.map((item, index) => {
                    const productImages = Array.isArray(item.images)
                        ? item.images.map(img => img.url || img.imageUrl).filter(Boolean)
                        : Array.isArray(item.image)
                            ? item.image
                            : item.image
                                ? [item.image]
                                : item.mainImageUrl
                                    ? [item.mainImageUrl]
                                    : [];

                    // Create unique key using both id and index to avoid duplicates
                    const uniqueKey = `${item.productId || item.id || item._id || 'unknown'}-${index}`;

                    return (
                        <motion.div key={uniqueKey} variants={itemVariants} className="card-luxury">
                            <ProductItem
                                id={item.productId || item.id || item._id}
                                image={productImages}
                                name={item.productName || item.name}
                                arName={item.arName}
                                price={item.price}
                                finalPrice={item.finalPrice}
                                discountPrecentage={item.discountPrecentage}
                                hidePrice={true}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default MostWanted;
