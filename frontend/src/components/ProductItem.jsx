import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import WishlistButton from "./WishlistButton";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalization } from "../utils/localization";
import { useTranslation } from "react-i18next";

const ProductItem = ({
  id,
  _id,
  productId: propProductId,
  image,
  images,
  name,
  arName,
  price,
  finalPrice,
  discountPrecentage,
  discountName,
  arDiscountName,
  availableQuantity,
  totalSold,
  hidePrice = false,
}) => {
  const { currency } = useContext(ShopContext);
  const { getLocalizedName } = useLocalization();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const productId = id || propProductId || _id;

  const localizedDiscountName = isAr ? arDiscountName : discountName;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Extract array of image URLs
  const rawImages = images || image;
  const imageArray = Array.isArray(rawImages)
    ? rawImages.map((img) => (typeof img === "object" ? img.url : img)).filter(Boolean)
    : [rawImages].filter(Boolean);

  const hasMultipleImages = imageArray.length > 1;

  useEffect(() => {
    let interval;
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
      }, 1600);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, imageArray.length]);

  const originalPrice = price || 0;
  const effectivePrice = typeof finalPrice === "number" && finalPrice > 0 ? finalPrice : originalPrice;

  const apiDiscountPercentage = discountPrecentage || 0;
  const calculatedDiscountPercentage =
    originalPrice > 0 && effectivePrice < originalPrice
      ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
      : 0;

  const discountPercentage = apiDiscountPercentage > 0 ? apiDiscountPercentage : calculatedDiscountPercentage;
  const hasDiscount = discountPercentage > 0;

  const displayName = getLocalizedName({ name, arName }) || (isAr ? "كابل كهربائي ممتاز" : "Premium Cable Product");

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-gray-100 hover:border-[#c9a227]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
    >
      <Link
        to={`/product/${productId}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="block"
      >
        <div className="overflow-hidden relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100/60 p-4 flex items-center justify-center">
          {/* 🔖 Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
              <span>-{discountPercentage}%</span>
              {localizedDiscountName && <span className="hidden sm:inline opacity-90 text-[9px]">| {localizedDiscountName}</span>}
            </div>
          )}

          {/* ❤️ Wishlist Button */}
          <div className="absolute top-3 right-3 z-20 opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            <WishlistButton
              productId={productId}
              size="small"
              variant="default"
            />
          </div>

          {/* 🖼️ Product Image with Smooth Transition */}
          <div className="w-full h-full relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              {imageArray[currentImageIndex] ? (
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0.8, scale: 0.96 }}
                  animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
                  exit={{ opacity: 0.8, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full object-contain p-2 transition-transform"
                  src={imageArray[currentImageIndex]}
                  alt={displayName}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                  <span className="text-3xl">🔌</span>
                  <span className="text-xs font-semibold text-gray-400">
                    {isAr ? "كابل الأمين" : "Al-Ameen Cable"}
                  </span>
                </div>
              )}
            </AnimatePresence>

            {/* Quality Standard Overlay Pill */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-gray-200 text-[10px] font-bold text-[#0f3d1a] shadow-xs">
              IEC 60502
            </div>

            {/* Image pagination dots */}
            {hasMultipleImages && isHovered && (
              <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                {imageArray.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex ? "bg-[#0f3d1a] w-3" : "bg-gray-300 w-1.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* 🏷️ Product Info & Pricing */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Sub-label & Sales count */}
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span className="text-[#c9a227]">{isAr ? "أسلاك وكابلات" : "Wires & Cables"}</span>
            {totalSold > 0 && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                🔥 {totalSold} {isAr ? "مباع" : "Sold"}
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/product/${productId}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1a6b2e] transition-colors line-clamp-2 leading-snug">
              {displayName}
            </h3>
          </Link>
        </div>

        {/* Stock Status & Price */}
        <div className="pt-2 border-t border-gray-100 flex items-end justify-between gap-2">
          {!hidePrice ? (
            <div>
              {hasDiscount ? (
                <div className="flex flex-col">
                  <span className="text-xs line-through text-gray-400 font-medium">
                    {currency} {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-base font-black text-[#0f3d1a]">
                    {currency} {effectivePrice.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-base font-black text-[#0f3d1a]">
                  {currency} {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-500">
              {isAr ? "تواصل للسعر" : "Contact for Quote"}
            </span>
          )}

          {/* Action button */}
          <Link
            to={`/product/${productId}`}
            className="px-3 py-1.5 bg-[#0f3d1a] text-white hover:bg-[#c9a227] hover:text-[#0f3d1a] text-xs font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1"
          >
            <span>{isAr ? "التفاصيل" : "Details"}</span>
            <span className="text-xs">{isAr ? "←" : "→"}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductItem;
