import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { Link, useParams } from "react-router-dom";
import TypeCollection from "../components/TypeCollection";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const { t } = useTranslation();
    const [showFilter, setShowFilter] = useState(false);
    const [sortOption, setSortOption] = useState("featured");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [inStock, setInStock] = useState(false);

    const { type } = useParams();
    const normalize = str => str.toLowerCase().replace(/[\s-]+/g, '');
    const collectionType = type ? type : 'All Products';
    const displayName = collectionType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // If type is present, filter by it. Otherwise show all.
    let filteredProducts = type
        ? products.filter((item) => item.category && normalize(item.category) === normalize(collectionType))
        : products;

    // Apply Search Filter
    if (showSearch && search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Apply filters
    if (inStock) {
        filteredProducts = filteredProducts.filter((item) => item.inStock);
    }
    if (minPrice) {
        filteredProducts = filteredProducts.filter((item) => Number(item.price) >= Number(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter((item) => Number(item.price) <= Number(maxPrice));
    }

    // Apply sorting
    if (sortOption === "price-low-high") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortOption === "az") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "za") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "date-old-new") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.date - b.date);
    } else if (sortOption === "date-new-old") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.date - a.date);
    }

    return (
        <motion.div
            className="max-w-screen-2xl mx-auto px-4 py-8 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            {/* Breadcrumbs */}
            <div className="text-xs text-gray-500 mb-4 flex gap-2">
                <Link to="/" className="hover:underline">{t('HOME')}</Link> /
                <Link to="/collection" className="hover:underline">{t('SHOP')}</Link> /
                <span className="text-black">{displayName}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-center my-20 tracking-widest">{displayName}</h1>


            {/* Filter/Sort Row */}
            <div className="flex justify-between items-center mb-8">
                <button
                    className="text-xs font-semibold tracking-widest flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowFilter(true)}
                >
                    {/* Tune SVG icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17h6m0 0v-2m0 2v2m6-6h6m0 0v-2m0 2v2M3 7h6m0 0V5m0 2v2m6 6h6m0 0v-2m0 2v2" /></svg>
                    {t('FILTER_AND_SORT')}
                </button>
                <div className="flex items-center gap-8">
                    <select
                        className="text-xs w-[100px] font-semibold tracking-widest border-none outline-none bg-transparent cursor-pointer"
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                    >
                        <option value="featured">{t('FEATURED')}</option>
                        <option value="best-selling">{t('BEST_SELLING')}</option>
                        <option value="az">{t('ALPHABETICALLY_AZ')}</option>
                        <option value="za">{t('ALPHABETICALLY_ZA')}</option>
                        <option value="price-low-high">{t('PRICE_LOW_HIGH')}</option>
                        <option value="price-high-low">{t('PRICE_HIGH_LOW')}</option>
                        <option value="date-old-new">{t('DATE_OLD_NEW')}</option>
                        <option value="date-new-old">{t('DATE_NEW_OLD')}</option>
                    </select>
                    <span className="text-xs text-gray-500">{filteredProducts.length} {t('PRODUCTS_COUNT')}</span>
                </div>
            </div>

            {/* Filter Sidebar/Modal */}
            <AnimatePresence>
                {showFilter && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setShowFilter(false)}
                            style={{ pointerEvents: 'auto' }}
                        />
                        {/* Sidebar */}
                        <motion.div
                            className="fixed top-0 left-0 h-full w-100 bg-white p-6 shadow-lg z-50"
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -380 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        >
                            <button className="absolute top-4 right-4 text-xl" onClick={() => setShowFilter(false)}>×</button>
                            <h2 className="text-lg font-bold mb-4">{t('FILTER_AND_SORT')}</h2>
                            <div className="mb-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                                    {t('AVAILABILITY_IN_STOCK')}
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">{t('PRICE')}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder={t('MIN')}
                                        className="border border-gray-200 outline-none px-2 py-1 w-1/2"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder={t('MAX')}
                                        className="border border-gray-200 outline-none px-2 py-1 w-1/2"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">{t('SORT_BY')}</label>
                                <select
                                    className="w-full border border-gray-200 outline-none px-2 py-1"
                                    value={sortOption}
                                    onChange={e => setSortOption(e.target.value)}
                                >
                                    <option value="featured">{t('FEATURED')}</option>
                                    <option value="best-selling">{t('BEST_SELLING')}</option>
                                    <option value="az">{t('ALPHABETICALLY_AZ')}</option>
                                    <option value="za">{t('ALPHABETICALLY_ZA')}</option>
                                    <option value="price-low-high">{t('PRICE_LOW_HIGH')}</option>
                                    <option value="price-high-low">{t('PRICE_HIGH_LOW')}</option>
                                    <option value="date-old-new">{t('DATE_OLD_NEW')}</option>
                                    <option value="date-new-old">{t('DATE_NEW_OLD')}</option>
                                </select>
                            </div>
                            <div className="flex justify-between mt-8">
                                <button className="text-xs cursor-pointer" onClick={() => {
                                    setInStock(false);
                                    setMinPrice("");
                                    setMaxPrice("");
                                    setSortOption("featured");
                                }}>{t('CLEAR')}</button>
                                <button className="bg-black text-white px-4 py-2 text-xs cursor-pointer" onClick={() => setShowFilter(false)}>{t('APPLY')}</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductItem
                            key={product._id || product.id}
                            id={product._id || product.id}
                            name={product.name}
                            arName={product.arName}
                            price={product.price}
                            finalPrice={product.finalPrice}
                            image={product.image || product.images}
                            images={product.images}
                            discountPrecentage={product.discountPrecentage}
                            discountName={product.discountName}
                            availableQuantity={product.availableQuantity}
                            totalSold={product.totalSold}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400">{t('NO_PRODUCTS_FOUND')}</p>
                )}
            </div>

            {/* Type Collection Row */}
            <div className="mt-12">
                <TypeCollection />
                <div className='border-2 border-gray-200 mt-20' />
                <div className='border-2 border-gray-200 mt-20' />
            </div>
        </motion.div>
    );
};

export default Collection;
