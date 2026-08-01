import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderFilters = ({ 
  searchTerm, 
  handleSearchChange, 
  statusFilter, 
  handleStatusFilterChange, 
  sortBy, 
  handleSortChange 
}) => {
  const { t } = useTranslation();
  const STATUS_LABELS = {
    0: 'PendingPayment',
    1: 'Confirmed',
    2: 'Processing',
    3: 'Shipped',
    4: 'Delivered',
    5: 'CancelledByUser',
    6: 'Refunded',
    7: 'Returned',
    8: 'PaymentExpired',
    9: 'CancelledByAdmin',
    10: 'Complete',
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">{t('filters')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('searchOrders')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('searchByCustomerOrId')}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('status')}
          </label>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
          >
            <option value="">{t('allStatuses')}</option>
            {Object.entries(STATUS_LABELS).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('sortBy')}
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
          >
            <option value="newest">{t('newestFirst')}</option>
            <option value="oldest">{t('oldestFirst')}</option>
            <option value="amount-high">{t('amountHighLow')}</option>
            <option value="amount-low">{t('amountLowHigh')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;