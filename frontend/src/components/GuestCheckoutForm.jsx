import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const GuestCheckoutForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    governorate: '',
    city: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    state: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'COD',
    walletPhone: '',
    paymentNotes: ''
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [errors, setErrors] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch payment methods from API
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/Enums/PaymentMethods`);
        const data = await response.json();
        const methods = data.data || data.responseBody?.data || data;
        
        // Handle different API response formats - extract payment method names
        const processedMethods = Array.isArray(methods) 
          ? methods.map(m => typeof m === 'object' ? (m.name || m.value || m.id || JSON.stringify(m)) : m)
          : [];
        
        setPaymentMethods(processedMethods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        // Fallback to default payment methods if API fails
        setPaymentMethods(['COD', 'Card', 'MobileWallet']);
      }
    };

    fetchPaymentMethods();
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.governorate.trim()) {
      newErrors.governorate = 'Governorate is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    // Wallet phone validation if wallet payment method is selected
    if (formData.paymentMethod === 'MobileWallet' && !formData.walletPhone.trim()) {
      newErrors.walletPhone = 'Wallet phone number is required for mobile wallet payment';
    } else if (formData.paymentMethod === 'MobileWallet' && formData.walletPhone.trim() && 
               !/^[0-9]{10,15}$/.test(formData.walletPhone.replace(/\s/g, ''))) {
      newErrors.walletPhone = 'Please enter a valid wallet phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
              Governorate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="governorate"
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                errors.governorate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter governorate"
            />
            {errors.governorate && (
              <p className="mt-1 text-sm text-red-500">{errors.governorate}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
              errors.street ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter street address"
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-500">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
              Building <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Building number"
            />
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
              Floor <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Floor number"
            />
          </div>

          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
              Apartment <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Apartment number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State/Region <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="State or region"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Postal code"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Order Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
            placeholder="Any special instructions for your order"
          />
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        
        <div className="space-y-3">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <label
                key={`payment-${index}-${typeof method === 'object' ? JSON.stringify(method) : method}`}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === method
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                  className="w-5 h-5 text-black border-gray-300 focus:ring-black"
                />
                <span className="ml-3 font-medium text-gray-900">{method}</span>
              </label>
            ))
          ) : (
            // Fallback payment methods if API fails
            ['COD', 'Card', 'MobileWallet'].map((method, index) => (
              <label
                key={`fallback-payment-${index}`}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === method
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                  className="w-5 h-5 text-black border-gray-300 focus:ring-black"
                />
                <span className="ml-3 font-medium text-gray-900">{method}</span>
              </label>
            ))
          )}
        </div>

        {/* Conditional wallet phone input */}
        {formData.paymentMethod === 'MobileWallet' && (
          <div>
            <label htmlFor="walletPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="walletPhone"
              name="walletPhone"
              value={formData.walletPhone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                errors.walletPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter wallet phone number"
            />
            {errors.walletPhone && (
              <p className="mt-1 text-sm text-red-500">{errors.walletPhone}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="paymentNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="paymentNotes"
            name="paymentNotes"
            value={formData.paymentNotes}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
            placeholder="Any notes for payment"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};

export default GuestCheckoutForm;
