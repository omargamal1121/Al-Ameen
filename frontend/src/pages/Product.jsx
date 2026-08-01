import { motion, AnimatePresence } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { toast } from "react-toastify";
import WishlistButton from "../components/WishlistButton";
import MostWanted from "../components/MostWanted";
import {
  FaPlus,
  FaMinus,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTimes,
  FaWhatsapp,
  FaFileDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBolt,
  FaBuilding,
} from "react-icons/fa";
import { useLocalization } from "../utils/localization";

const Product = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { getLocalizedName } = useLocalization();
  const { productId } = useParams();
  const { addToCart, backendUrl, currency } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // 'description', 'shipping'

  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref: relatedProductsRef, inView: isRelatedInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const res = await axios.get(
          `${backendUrl}/api/Products/${productId}?isActive=true&includeDeleted=false`
        );
        if (res.data?.responseBody?.data) {
          const product = res.data.responseBody.data;
          setProductData(product);

          const productImages = Array.isArray(product.images)
            ? product.images.map((img) => (typeof img === "object" ? img.url : img)).filter(Boolean)
            : [];
          setActiveImage(productImages[0] || "");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [productId, backendUrl]);

  useEffect(() => {
    const fetchVariants = async () => {
      if (!productId) return;
      try {
        const res = await axios.get(
          `${backendUrl}/api/Products/${productId}/Variants?isActive=true&includeDeleted=false`
        );
        if (res.data?.responseBody?.data) {
          const vData = res.data.responseBody.data;
          setVariants(vData);
          if (vData.length > 0) {
            setSelectedVariant(vData[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching variants", err);
      }
    };
    fetchVariants();
  }, [productId, backendUrl]);

  const handleAddToCart = async () => {
    if (!productData) return;
    setIsSubmitting(true);
    try {
      // Extract size and color from variant - handle different possible structures
      // If variant has both size and color, use them
      // If variant only has color (hex), use it as both size and color for now
      let sizeParam, colorParam;
      
      if (selectedVariant?.size && selectedVariant?.color) {
        sizeParam = selectedVariant.size;
        colorParam = selectedVariant.color;
      } else if (selectedVariant?.color) {
        // Only color available, use it as both for now
        sizeParam = selectedVariant.color.toString();
        colorParam = selectedVariant.color.toString();
      } else if (selectedVariant?.size) {
        // Only size available
        sizeParam = selectedVariant.size.toString();
        colorParam = "standard";
      } else {
        // No variant info, use defaults
        sizeParam = "default";
        colorParam = "standard";
      }
      
      console.log("Adding to cart with:", {
        productId: productData._id || productData.id,
        size: sizeParam,
        color: colorParam,
        quantity,
        variant: selectedVariant
      });
      
      await addToCart(
        productData._id || productData.id,
        sizeParam,
        colorParam,
        quantity
      );
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0f3d1a] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">
          {isAr ? "جاري تحميل تفاصيل المنتج..." : "Loading cable specifications..."}
        </p>
      </div>
    );
  }

  const displayName = getLocalizedName(productData) || (isAr ? "كابل كهربائي" : "Electrical Cable");
  const displayDescription =
    (isAr ? productData.arDescription || productData.description : productData.description || productData.arDescription) ||
    (isAr
      ? "كابلات وأسلاك ذات موصفات صناعية عالية الجودة مصنعة وفق المعايير الدولية IEC 60502 ومطابقة للمواصفات القياسية المصرية. مناسبة للتمديدات السكنية والتجارية والصناعية."
      : "Industrial-grade electrical cable manufactured to IEC 60502 standards. Designed for high durability, safety, and optimal conductivity across residential and commercial installations.");

  const originalPrice = selectedVariant?.price || productData.price || 0;
  const effectivePrice =
    selectedVariant?.finalPrice || productData.finalPrice || originalPrice;
  const hasDiscount = originalPrice > 0 && effectivePrice < originalPrice;
  const discountPercentage =
    productData.discountPrecentage ||
    (hasDiscount ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100) : 0);

  const imagesList = Array.isArray(productData.images)
    ? productData.images.map((img) => (typeof img === "object" ? img.url : img)).filter(Boolean)
    : [];

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً، أود الاستفسار عن توريد كميات بالجملة للمنتج: ${displayName} (كود: #${productData.id})`
      : `Hello, I would like to inquire about bulk ordering for: ${displayName} (ID: #${productData.id})`
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-28 pb-20">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-[#0f3d1a] transition-colors">
            {t("HOME")}
          </Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-[#0f3d1a] transition-colors">
            {isAr ? "المنتجات والمجموعات" : "Cable Catalog"}
          </Link>
          <span>/</span>
          <span className="text-[#0f3d1a] font-extrabold truncate max-w-xs">{displayName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4">
            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="col-span-2 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {imagesList.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all p-1 bg-white ${
                      activeImage === img ? "border-[#0f3d1a] shadow-md scale-95" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt={`Preview ${i}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}

            {/* Main Stage */}
            <div className={`${imagesList.length > 1 ? "col-span-10" : "col-span-12"} relative group bg-white border border-gray-200 rounded-3xl p-6 shadow-xl flex items-center justify-center min-h-[420px]`}>
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={activeImage || imagesList[0]}
                alt={displayName}
                className="max-h-[460px] w-auto object-contain cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
              />

              {/* Top Action Buttons */}
              <div className="absolute top-6 right-6 z-10 flex gap-2">
                <WishlistButton productId={productData._id || productData.id} variant="floating" size="lg" />
              </div>

              {/* Discount Tag */}
              {hasDiscount && (
                <div className="absolute top-6 left-6 z-10 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs py-1.5 px-4 rounded-full shadow-lg tracking-wider flex items-center gap-1.5">
                  <FaBolt />
                  <span>{isAr ? `خصم ${discountPercentage}%` : `SAVE ${discountPercentage}%`}</span>
                  {productData.discount?.name && (
                    <span className="opacity-90 text-[10px]">| {isAr ? (productData.discount?.arName || productData.discount.name) : productData.discount.name}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Technical Product Details Panel */}
          <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-8">
            {/* Header / Title */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#c9a227] bg-[#0f3d1a] px-3 py-1 rounded-full uppercase tracking-wider">
                  <FaShieldAlt /> {isAr ? "معتمد IEC 60502" : "IEC 60502 Certified"}
                </span>

                {typeof productData.availableQuantity === "number" && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <FaCheckCircle /> {isAr ? `متوفر بالمخزن (${productData.availableQuantity})` : `In Stock (${productData.availableQuantity})`}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] leading-tight mb-4">
                {displayName}
              </h1>

              {/* Price & Savings Block */}
              <div className="flex items-baseline gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-3xl sm:text-4xl font-black text-[#0f3d1a]">
                  {currency} {effectivePrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through font-bold">
                      {currency} {originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                      {isAr ? `توفير ${currency}${(originalPrice - effectivePrice).toLocaleString()}` : `Save ${currency}${(originalPrice - effectivePrice).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Color / Variant Options if available */}
            {variants.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  {isAr ? "اختيار المواصفة / اللون" : "Specification / Color Variant"}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 flex items-center gap-2 cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? "border-[#0f3d1a] bg-[#0f3d1a] text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {v.color && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                          style={{ backgroundColor: v.color.toLowerCase() }}
                        />
                      )}
                      <span>{v.color || v.size || `Variant #${v.id}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Main Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                {/* Quantity Controls */}
                <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-4 py-3 min-w-[140px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-xs hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="font-extrabold text-lg text-gray-900 px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-xs hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-8 bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] text-white font-extrabold rounded-2xl shadow-xl hover:from-[#1a6b2e] hover:to-[#0f3d1a] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isAr ? "جاري الإضافة..." : "Adding to Cart..."}
                    </>
                  ) : (
                    <>
                      <span>🛒</span>
                      <span>{isAr ? "أضف إلى عربة التسوق" : "Add to Cart"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bulk WhatsApp Order Button */}
              <a
                href={`https://wa.me/201000000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 border-2 border-emerald-600 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-xs"
              >
                <FaWhatsapp className="text-lg" />
                <span>{isAr ? "طلب أسعار بالجملة والمشاريع الكبرى" : "Request Bulk Order Quote (WhatsApp)"}</span>
              </a>
            </div>

            {/* Guarantee Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: <FaTruck className="text-[#c9a227]" />, title: isAr ? "توصيل سريع" : "Fast Delivery", desc: isAr ? "لكافة المحافظات" : "Nationwide shipping" },
                { icon: <FaShieldAlt className="text-[#c9a227]" />, title: isAr ? "ضمان مصنعي" : "Factory Warranty", desc: isAr ? "معايير دولية" : "ISO Certified" },
                { icon: <FaBuilding className="text-[#c9a227]" />, title: isAr ? "توريد مشاريع" : "Project Ready", desc: isAr ? "شهادات اختبار" : "Spec Sheets" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <span className="text-xs font-bold text-gray-900">{item.title}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE TABS: Specs & Full Description */}
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          <div className="flex border-b border-gray-200 gap-8 mb-8 overflow-x-auto">
            {[
              { id: "description", label: isAr ? "الوصف والتفاصيل" : "Detailed Description" },
              { id: "shipping", label: isAr ? "الشحن والتسليم" : "Shipping & Project Logistics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#0f3d1a] text-[#0f3d1a]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
              <p className="text-base font-medium">{displayDescription}</p>
            </motion.div>
          )}

          {activeTab === "shipping" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-sm text-gray-600">
              <p className="font-bold text-[#0f3d1a]">
                {isAr
                  ? "نوفر أسطول نقل مخصص لشحن بكرات وأحمال الكابلات لجميع المحافظات والمواقع الصناعية."
                  : "We operate dedicated transport logistics for bulk cable spools directly to project sites nationwide."}
              </p>
              <ul className="list-disc list-inside space-y-2 font-medium">
                <li>{isAr ? "التسليم داخل القاهرة الكبرى خلال 24 - 48 ساعة" : "Greater Cairo delivery within 24-48 hours"}</li>
                <li>{isAr ? "التوصيل للمحافظات والمناطق الصناعية خلال 3-4 أيام عمل" : "Industrial zone deliveries within 3-4 business days"}</li>
                <li>{isAr ? "إمكانية استلام المشتريات مباشرة من مستودع المصنع بالمدينة العاشرة من رمضان" : "Direct factory warehouse pickup available at 10th of Ramadan City"}</li>
              </ul>
            </motion.div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        <section ref={relatedProductsRef} className="mt-20 border-t border-gray-200 pt-16">
          {isRelatedInView && <MostWanted />}
        </section>
      </div>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 p-6 flex items-center justify-center backdrop-blur-md"
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-[#c9a227] transition-all cursor-pointer"
            >
              <FaTimes size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={activeImage || imagesList[0]}
              alt="Zoom view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;
