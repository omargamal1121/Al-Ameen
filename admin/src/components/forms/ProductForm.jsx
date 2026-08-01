import React from "react";
import FormInput from "./FormInput";
import { toast } from "react-toastify"; // Make sure react-toastify is installed and configured
import { useTranslation } from "react-i18next";

const ProductForm = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  loading,
  categories,
  submitButtonText = "Add Product",
  loadingButtonText = "Adding...",
  resetForm,
  previewProducts,
}) => {
  const { t } = useTranslation();
  const {
    name,
    arName,
    description,
    arDescription,
    categoryId,
    price,
    mainImage,
    additionalImages,
    isActive,
    inStock,
    onSale,
    status,
  } = formData;

  const validateForm = () => {
    if (!name) return t('productNameRequired');
    if (!price) return t('priceRequired');
    if (!categoryId) return t('categoryRequired');
    if (!description) return t('descriptionRequired');
    if (!mainImage) return t('mainImageRequired');
    return null;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    handleSubmit(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{t('productInformation')}</h2>

      {/* Main Image Upload */}
      <div>
        <p className="mb-2">{t('uploadMainImage')}</p>
        {mainImage && (
          <div className="mb-2">
            <img
              src={
                typeof mainImage === "string"
                  ? mainImage
                  : URL.createObjectURL(mainImage)
              }
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
        <FormInput
          type="file"
          name="mainImage"
          value={mainImage}
          onChange={(e) => handleFileChange("mainImage", e.target.files[0])}
          accept="image/*"
          required={!mainImage}
        />
      </div>

      {/* Additional Images Upload */}
      <div>
        <p className="mb-2">{t('uploadAdditionalImages')}</p>
        <FormInput
          type="file"
          name="additionalImages"
          value={additionalImages}
          onChange={(e) =>
            handleFileChange("additionalImages", Array.from(e.target.files))
          }
          multiple
          accept="image/*"
        />
      </div>

      {/* Basic Product Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={t('productName')}
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder={t('enterProductName')}
          required
        />

        <FormInput
          label={t('price')}
          type="number"
          name="price"
          value={price}
          onChange={handleInputChange}
          placeholder={t('enterPrice')}
          min="0"
          step="0.01"
          required
        />

        <FormInput
          label={t('category')}
          type="select"
          name="categoryId"
          value={categoryId}
          onChange={handleInputChange}
          options={categories}
          placeholder={t('selectCategory')}
          required
        />
      </div>

      {/* Description */}
      <FormInput
        label={t('description')}
        type="textarea"
        name="description"
        value={description}
        onChange={handleInputChange}
        placeholder={t('enterProductDescription')}
        required
      />

      {/* Arabic Name */}
      <FormInput
        label={t('arabicNameOptional')}
        name="arName"
        value={arName || ''}
        onChange={handleInputChange}
        placeholder={t('enterArabicName')}
      />

      {/* Arabic Description */}
      <FormInput
        label={t('arabicDescriptionOptional')}
        type="textarea"
        name="arDescription"
        value={arDescription || ''}
        onChange={handleInputChange}
        placeholder={t('enterArabicDescription')}
      />

      {/* Product Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label={t('status')}
          type="select"
          name="status"
          value={status || (isActive ? "active" : "inactive")}
          onChange={(e) => {
            const newStatus = e.target.value;
            const newIsActive = newStatus === "active";

            const syntheticEvent = {
              target: {
                name: "isActive",
                type: "checkbox",
                checked: newIsActive,
              },
            };

            handleInputChange(e);
            handleInputChange(syntheticEvent);
          }}
          options={[
            { id: "active", name: t('active') },
            { id: "inactive", name: t('inactive') },
          ]}
          placeholder={t('selectStatus')}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={inStock}
            onChange={(e) => {
              handleInputChange(e);
              if (
                e.target.checked &&
                (!formData.quantity || formData.quantity === 0)
              ) {
                const syntheticEvent = {
                  target: { name: "quantity", value: "1" },
                };
                handleInputChange(syntheticEvent);
              }
            }}
            className="mr-2"
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium text-gray-700"
          >
            {t('inStock')}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="onSale"
            name="onSale"
            checked={onSale}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="onSale" className="text-sm font-medium text-gray-700">
            {t('onSale')}
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full mt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? loadingButtonText : submitButtonText}
        </button>

        {resetForm && (
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            {t('resetForm')}
          </button>
        )}

        {previewProducts && (
          <button
            type="button"
            onClick={previewProducts}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            {t('previewProducts')}
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
