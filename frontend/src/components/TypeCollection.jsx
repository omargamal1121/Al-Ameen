import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { staticCategories } from "../assets/frontend_assets/staticData";
import { Link } from "react-router-dom";
import Title from "./Title";
import { useTranslation } from "react-i18next";
import { ShopContext } from "../context/ShopContext";

const TypeCollection = () => {
  const { t, i18n } = useTranslation();
  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCategories(staticCategories.map(cat => ({
      id: cat.id,
      name: i18n.language === 'ar' ? cat.nameAr : cat.name,
      image: cat.image,
      link: `/category/${cat.id}`,
      description: cat.description
    })));
    setLoading(false);
  }, [i18n.language]);

  // If loading, show nothing or a spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">{t("LOADING")}...</span>
      </div>
    );
  }

  // If no categories, return null to hide the section
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="my-10 overflow-hidden px-4 sm:px-[2vw] md:px-[2vw] lg:px-[3vw]">
      <div className="text-center text-2xl py-6 mb-6">
        <Title text1={t("OUR")} text2={t("CATEGORIES")} />
      </div>

      {/* ❌ حالة الخطأ */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{t("ERROR_LOADING_CATEGORIES")}</p>
        </div>
      )}

      {/* ✅ عرض البيانات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="block border border-gray-200 rounded-lg hover:shadow-lg transition-all"
          >
            <div className="overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center h-60">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.src = assets.eniem; // Fallback image if category image fails to load
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg text-gray-900">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
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
