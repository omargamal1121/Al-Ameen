import axios from 'axios';
import { getGuestToken, saveGuestToken } from '../utils/guestSession';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Place a guest order
 * @param {Object} payload - Order payload
 * @returns {Promise<Object>} - API response
 */
export const placeGuestOrder = async (payload) => {
  try {
    const guestToken = getGuestToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (guestToken) {
      headers['X-Guest-Token'] = guestToken;
    }

    const response = await axios.post(
      `${backendUrl}/api/Order/guest`,
      payload,
      { headers }
    );

    const data = response.data;
    
    // Handle different response formats
    const result = data.data || data.responseBody?.data || data;
    
    // Save guest token if provided in response (handle both camelCase and PascalCase)
    const responseGuestToken = result.guestToken || result.GuestToken;
    if (responseGuestToken) {
      saveGuestToken(responseGuestToken);
    }

    return {
      success: true,
      orderNumber: result.orderNumber || result.OrderNumber,
      orderId: result.orderId || result.OrderId,
      guestToken: responseGuestToken,
      message: result.message || 'Order placed successfully'
    };
  } catch (error) {
    console.error('Place guest order error:', error);
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.responseBody?.message ||
                         'Failed to place order';
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Initiate payment for a guest order
 * @param {string} orderNumber - The order number
 * @param {string} paymentMethod - Payment method (COD, Card, MobileWallet)
 * @param {string} walletPhone - Wallet phone number (for mobile wallet)
 * @param {string} notes - Payment notes
 * @returns {Promise<Object>} - API response with redirect URL if applicable
 */
const resolvePaymentMethodEnum = (method) => {
  if (typeof method === 'number' && !isNaN(method)) return method;
  if (!method) return 1;
  const num = parseInt(method);
  if (!isNaN(num) && num > 0) return num;
  
  const clean = String(method).trim().toLowerCase().replace(/[\s_]+/g, '');
  if (clean === 'cashondelivery' || clean === 'cod' || clean === 'cash') return 1;
  if (clean === 'visa' || clean === 'card') return 2;
  if (clean === 'meeza') return 3;
  if (clean === 'wallet' || clean === 'mobilewallet') return 4;
  return 1;
};

export const initiateGuestPayment = async (orderNumber, paymentMethod, walletPhone = '', notes = '') => {
  try {
    const guestToken = getGuestToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (guestToken) {
      headers['X-Guest-Token'] = guestToken;
    }

    const payload = {
      orderNumber,
      paymentDetails: {
        paymentMethod: resolvePaymentMethodEnum(paymentMethod),
        currency: 'EGP',
        walletPhoneNumber: walletPhone,
        notes
      }
    };

    const response = await axios.post(
      `${backendUrl}/api/payment`,
      payload,
      { headers }
    );

    const data = response.data;
    
    // Handle different response formats
    const result = data.data || data.responseBody?.data || data;

    // Handle redirect for online payments
    if (result.redirectUrl) {
      window.location.href = result.redirectUrl;
    }

    return {
      success: true,
      redirectUrl: result.redirectUrl,
      message: result.message || 'Payment initiated successfully'
    };
  } catch (error) {
    console.error('Initiate guest payment error:', error);
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.responseBody?.message ||
                         'Failed to initiate payment';
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Get guest order by order number
 * @param {string} orderNumber - The order number
 * @returns {Promise<Object>} - API response with order data
 */
export const getGuestOrderByNumber = async (orderNumber) => {
  try {
    const guestToken = getGuestToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (guestToken) {
      headers['X-Guest-Token'] = guestToken;
    }

    const response = await axios.get(
      `${backendUrl}/api/Order/guest/number/${orderNumber}`,
      { headers }
    );

    const data = response.data;
    
    // Handle different response formats
    const result = data.data || data.responseBody?.data || data;

    return {
      success: true,
      data: result,
      message: result.message || 'Order retrieved successfully'
    };
  } catch (error) {
    console.error('Get guest order error:', error);
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.responseBody?.message ||
                         'Failed to retrieve order';
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
};
