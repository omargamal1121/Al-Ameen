import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../services/api";

const ProductAdd = ({ token }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "", arName: "", description: "", arDescription: "", categoryId: "", price: "",
    isActive: true, inStock: true, onSale: false, material: "", careInstructions: "", shippingInfo: ""
  });

  const [images, setImages] = useState({ main: null, additional: [] });
  const [previews, setPreviews] = useState({ main: null, additional: [] });
  const [variants, setVariants] = useState([{ color: "" }]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await API.categories.getAll(token);
        setCategories(cats);
      } catch (e) { toast.error("Failed to load categories"); }
    })();
  }, [token]);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res = await API.products.getById(editId, token);
        const p = res?.responseBody?.data;
        if (p) {
          setFormData({
            name: p.name || "",
            arName: p.arName || "",
            description: p.description || "",
            arDescription: p.arDescription || "",
            categoryId: p.categoryId?.toString() || "",
            price: p.price?.toString() || "",
            isActive: p.isActive ?? true,
            inStock: p.inStock ?? true,
            onSale: p.onSale ?? false,
            material: p.material || "",
            careInstructions: p.careInstructions || "",
            shippingInfo: p.shippingInfo || ""
          });

          // Set existing images for preview with backend URL resolution
          const normalizeUrl = (u) => u?.startsWith("http") ? u : (u ? `${import.meta.env.VITE_BACKEND_URL}/${u}` : null);
          
          const mainImg = p.images?.find(i => i.isMain);
          const extraImgs = p.images?.filter(i => !i.isMain) || [];
          setPreviews({
            main: normalizeUrl(mainImg?.url),
            additional: extraImgs.map(img => ({ 
              url: normalizeUrl(img.url), 
              id: img.id,
              isNew: false 
            }))
          });
        }
      } catch (e) { toast.error("Failed to load product details"); }
    })();
  }, [editId, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({ ...prev, main: file }));
      setPreviews(prev => ({ ...prev, main: URL.createObjectURL(file) }));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => ({ ...prev, additional: [...prev.additional, ...files] }));
    const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), isNew: true }));
    setPreviews(prev => ({ ...prev, additional: [...prev.additional, ...newPreviews] }));
  };

  const removeImage = async (imgId, isNew, idx) => {
    if (isNew) {
      setImages(prev => ({
        ...prev,
        additional: prev.additional.filter((_, i) => i !== idx)
      }));
      setPreviews(prev => ({
        ...prev,
        additional: prev.additional.filter((_, i) => i !== idx)
      }));
      return;
    }

    if (!editId) return;
    if (!window.confirm("Delete this image permanently?")) return;

    try {
      await API.images.delete(editId, imgId, token);
      toast.success("Image deleted");
      setPreviews(prev => ({
        ...prev,
        additional: prev.additional.filter(img => img.id !== imgId)
      }));
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productPayload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        arName: formData.arName || null,
        arDescription: formData.arDescription || null
      };

      let productId = editId;
      if (editId) {
        await API.products.update(editId, productPayload, token);
      } else {
        const res = await API.products.create(productPayload, token);
        productId = res.responseBody?.data?.id;
        
        // Create variants after product creation
        if (productId && variants.length > 0) {
          for (const variant of variants) {
            if (variant.color) {
              try {
                await API.variants.add(productId, { color: variant.color }, token);
              } catch (err) {
                console.error("Failed to add variant", err);
                toast.error(`Failed to add variant: ${variant.color}`);
              }
            }
          }
        }
      }

      if (productId && images.main) await API.images.uploadMain(productId, images.main, token);
      if (productId && images.additional.length) await API.images.uploadAdditional(productId, images.additional, token);

      toast.success(editId ? "Product updated successfully" : "Product created successfully");
      navigate("/products");
    } catch (err) {
      console.error("❌ Error saving product:", err);
      
      // Extract specific error message from API response
      let errorMessage = t('failedToSaveProduct');
      
      if (err.response?.data) {
        const responseData = err.response.data;
        
        // Check for validation errors in different response formats
        if (responseData.responseBody?.errors) {
          const errors = responseData.responseBody.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errorMessage = errors.join(", ");
          } else if (typeof errors === 'object') {
            errorMessage = Object.values(errors).join(", ");
          }
        } else if (responseData.errors) {
          const errors = responseData.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            errorMessage = errors.join(", ");
          } else if (typeof errors === 'object') {
            errorMessage = Object.values(errors).flat().join(", ");
          }
        } else if (responseData.responseBody?.message) {
          errorMessage = responseData.responseBody.message;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-10 animate-in slide-in-from-bottom-6 duration-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Product Details Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-orange-500 rounded-full" />
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Product Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name (English)</label>
                <input
                  name="name" value={formData.name} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-4 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-bold text-lg"
                  placeholder="e.g. 16mm 4-Core Armored Copper Cable"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name (Arabic) — اسم المنتج</label>
                <input
                  name="arName" value={formData.arName} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-4 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-bold text-lg"
                  placeholder="مثال: كابل نحاس مسلح 4 كور 16 مم"
                  dir="rtl"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description (English)</label>
                <textarea
                  name="description" value={formData.description} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-[32px] px-8 py-6 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-medium text-gray-600 min-h-[150px]"
                  placeholder="e.g. Heavy-duty XLPE insulated armored copper cable suitable for underground power distribution."
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description (Arabic) — الوصف</label>
                <textarea
                  name="arDescription" value={formData.arDescription} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-[32px] px-8 py-6 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-medium text-gray-600 min-h-[150px]"
                  placeholder="مثال: كابل نحاسي مسلح معزول بـ XLPE للاستخدام الشاق في تمديدات الطاقة الأرضية."
                  dir="rtl"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (EGP)</label>
                <input
                  name="price" type="number" value={formData.price} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-4 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-black text-xl"
                  placeholder="e.g. 150.00"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                <select
                  name="categoryId" value={formData.categoryId} onChange={handleInputChange} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-4 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-bold"
                >
                  <option value="">Select Category</option>
                  {categories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-orange-500 rounded-full" />
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Product Variants</h3>
            </div>

            <div className="flex flex-col gap-6">
              {variants.map((variant, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[idx].color = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-[24px] px-8 py-4 outline-none focus:ring-8 focus:ring-orange-50 focus:border-orange-300 transition-all font-bold"
                        placeholder="#FFFFFF or Black"
                      />
                      <div className="relative">
                        <input
                          type="color"
                          value={variant.color.startsWith('#') ? variant.color : "#000000"}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[idx].color = e.target.value.toUpperCase();
                            setVariants(newVariants);
                          }}
                          className="w-16 h-[52px] rounded-[24px] border border-gray-200 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newVariants = variants.filter((_, i) => i !== idx);
                        setVariants(newVariants);
                      }}
                      className="mt-6 p-4 bg-rose-100 text-rose-600 rounded-[24px] hover:bg-rose-200 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVariants([...variants, { color: "" }])}
                className="py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-black uppercase tracking-widest hover:border-orange-300 hover:text-orange-500 transition-all"
              >
                + Add Variant
              </button>
            </div>
          </div>

        </div>

        {/* Images & Settings */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Main Visual Uplink */}
          <div className="bg-orange-900 p-10 rounded-[48px] shadow-2xl shadow-orange-900/20 text-white flex flex-col gap-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Primary Image</h4>
            <div className="relative aspect-square rounded-[40px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group">
              {previews.main ? (
                <img src={previews.main} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="text-center p-6">
                  <div className="text-4xl mb-4 opacity-30">�</div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Upload Main Photo</p>
                </div>
              )}
              <input type="file" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              <div className="absolute bottom-6 right-6 p-4 bg-white text-orange-900 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              </div>
            </div>
          </div>

          {/* Gallery Assets */}
          <div className="bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm flex flex-col gap-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Gallery Images</h4>
            <div className="grid grid-cols-3 gap-3">
              {previews.additional.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
                  <img src={img.url || img} className="w-full h-full object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id, img.isNew, idx)}
                    className="absolute top-2 right-2 p-2 bg-rose-600/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-rose-700 active:scale-90"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {img.isNew && <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[7px] font-black uppercase rounded-full">New</div>}
                </div>
              ))}
              <div className="relative aspect-square rounded-[24px] bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group">
                <span className="text-2xl opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all">➕</span>
                <input type="file" multiple onChange={handleAdditionalImagesChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white rounded-[32px] text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-orange-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {editId ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
