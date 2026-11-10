import React, { useContext } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link } from "react-router-dom";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import { ShopContext } from "../context/ShopContext";
import { useLocalization } from "../utils/localization";

const TypeCollection = () => {
  const { t } = useTranslation();
  const { backendUrl, categories } = useContext(ShopContext);
  const { getLocalizedName, getLocalizedDescription } = useLocalization();

  // Map categories to display format
  const displayCategories = categories.map(cat => ({
    id: cat.id,
    name: getLocalizedName(cat),
    image: cat.images?.[0]?.url || assets.eniem,
    link: `/category/${cat.id}`,
    description: getLocalizedDescription(cat)
  }));

  // If no categories, return null to hide the section
  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <div className="my-12 overflow-hidden px-4 sm:px-[3vw] lg:px-[5vw]">
      <div className="text-center py-6 mb-6">
        <div className="text-2xl sm:text-3xl">
          <Title text1={t("OUR")} text2={t("CATEGORIES")} />
        </div>
        <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
          {t("BROWSE_CATEGORIES") || "Browse our full range of industrial-grade certified cables and wires"}
        </p>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {displayCategories.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="group relative block rounded-2xl overflow-hidden border border-gray-200 hover:border-[#c9a227]/60 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 bg-gray-100 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = assets.eniem;
                }}
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category name pill visible on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-xs font-bold text-white uppercase tracking-wider bg-[#c9a227]/90 px-2.5 py-1 rounded-full">
                  {t("EXPLORE") || "Explore"} →
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-black text-sm sm:text-base text-gray-900 group-hover:text-[#1a6b2e] transition-colors line-clamp-1">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {item.description || t("VIEW_PRODUCTS")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TypeCollection;
