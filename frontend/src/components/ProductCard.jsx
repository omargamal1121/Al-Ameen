import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import WishlistButton from "./WishlistButton";
import { useLocalization } from "../utils/localization";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const { currency } = useContext(ShopContext);
  const { getLocalizedName } = useLocalization();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  if (!product) return null;

  const mainImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isMain)?.url || product.images[0].url
      : product.image
      ? Array.isArray(product.image)
        ? product.image[0]
        : product.image
      : null;

  const price = product.price || 0;
  const finalPrice = product.finalPrice || price;
  const hasDiscount = price > 0 && finalPrice < price;
  const discountPercentage =
    product.discountPrecentage ||
    (hasDiscount ? Math.round(((price - finalPrice) / price) * 100) : 0);

  const displayName = getLocalizedName(product) || (isAr ? "كابل كهربائي ممتاز" : "Premium Cable");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-gray-100 hover:border-[#c9a227]/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
    >
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100/60 p-3 flex items-center justify-center overflow-hidden">
          {hasDiscount && (
            <div className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercentage}%
            </div>
          )}

          <div className="absolute top-2.5 right-2.5 z-10">
            <WishlistButton
              productId={product.id}
              size="small"
              variant="default"
              isInWishlist={product.isInWishlist}
            />
          </div>

          {mainImage ? (
            <img
              src={mainImage}
              alt={displayName}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
              <span className="text-2xl">⚡</span>
              <span className="text-[10px] font-bold text-gray-400">
                {isAr ? "كابل معتمد" : "Certified Cable"}
              </span>
            </div>
          )}

          {/* Cable Standard Pill */}
          <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-[#0f3d1a] border border-gray-200">
            IEC 60502
          </div>
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between gap-2.5">
        <div>
          <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-wider block mb-0.5">
            {isAr ? "أسلاك وكابلات" : "Wires & Cables"}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#1a6b2e] transition-colors line-clamp-2 leading-snug">
              {displayName}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-[10px] line-through text-gray-400 font-medium leading-none">
                  {currency} {price.toLocaleString()}
                </span>
                <span className="text-sm font-black text-[#0f3d1a] leading-tight">
                  {currency} {finalPrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-sm font-black text-[#0f3d1a]">
                {currency} {price.toLocaleString()}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="px-2.5 py-1 bg-[#0f3d1a] text-white hover:bg-[#c9a227] hover:text-[#0f3d1a] text-[11px] font-bold rounded-lg transition-colors shadow-xs"
          >
            {isAr ? "تفاصيل" : "Specs"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
