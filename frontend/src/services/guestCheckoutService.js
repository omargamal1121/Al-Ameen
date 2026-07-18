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
      `${backendUrl}/api/order/guest`,
      payload,
      { headers }
    );

    const data = response.data;
    
    // Handle different response formats
    const result = data.data || data.responseBody?.data || data;
    
    // Save guest token if provided in response
    if (result.guestToken) {
      saveGuestToken(result.guestToken);
    }

    return {
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.orderId,
      guestToken: result.guestToken,
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
        paymentMethod,
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
