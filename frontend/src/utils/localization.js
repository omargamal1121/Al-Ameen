import { useTranslation } from 'react-i18next';

/**
 * Helper functions for bilingual content support (English/Arabic)
 */

/**
 * Get localized name based on current language
 * Falls back to English if Arabic field is null/undefined
 */
export const getLocalizedName = (item, language) => {
  if (!item) return '';
  return language === 'ar' && item.nameAr ? item.nameAr : item.name;
};

/**
 * Get localized description based on current language
 * Falls back to English if Arabic field is null/undefined
 */
export const getLocalizedDescription = (item, language) => {
  if (!item) return '';
  return language === 'ar' && item.descriptionAr ? item.descriptionAr : item.description;
};

/**
 * Get localized category based on current language
 */
export const getLocalizedCategory = (item, language) => {
  if (!item) return '';
  return language === 'ar' && item.categoryAr ? item.categoryAr : item.category;
};

/**
 * Get localized subcategory based on current language
 */
export const getLocalizedSubcategory = (item, language) => {
  if (!item) return '';
  return language === 'ar' && item.subCategoryAr ? item.subCategoryAr : item.subCategory;
};

/**
 * Get localized discount name based on current language
 */
export const getLocalizedDiscountName = (item, language) => {
  if (!item) return '';
  return language === 'ar' && item.discountNameAr ? item.discountNameAr : item.discountName;
};

/**
 * Get localized sizes based on current language
 */
export const getLocalizedSizes = (item, language) => {
  if (!item || !item.sizes) return [];
  return language === 'ar' && item.sizesAr ? item.sizesAr : item.sizes;
};

/**
 * Hook for accessing localized text helpers with current language
 */
export const useLocalization = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  return {
    language,
    getLocalizedName: (item) => getLocalizedName(item, language),
    getLocalizedDescription: (item) => getLocalizedDescription(item, language),
    getLocalizedCategory: (item) => getLocalizedCategory(item, language),
    getLocalizedSubcategory: (item) => getLocalizedSubcategory(item, language),
    getLocalizedDiscountName: (item) => getLocalizedDiscountName(item, language),
    getLocalizedSizes: (item) => getLocalizedSizes(item, language),
    isRTL: language === 'ar',
  };
};
