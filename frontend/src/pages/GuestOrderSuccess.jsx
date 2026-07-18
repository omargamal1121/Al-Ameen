import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGuestOrderByNumber } from '../services/guestCheckoutService';

const GuestOrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        navigate('/');
        return;
      }

      try {
        const response = await getGuestOrderByNumber(orderNumber);
        if (response.success) {
          setOrderData(response.data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Success Icon */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <motion.path
                  variants={checkmarkVariants}
                  initial="hidden"
                  animate="visible"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </motion.div>

        {/* Order Number Card */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{orderNumber || 'N/A'}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(orderNumber || '');
                // Could add toast notification here
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy order number"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Order Status Steps */}
        <motion.div variants={fadeUp} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Processing', description: 'Your order is being prepared', icon: '📦' },
              { title: 'Shipping', description: 'Your order is on the way', icon: '🚚' },
              { title: 'Delivery', description: 'Your order has been delivered', icon: '✅' }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemFade}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Details (if available) */}
        {orderData && (
          <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium text-gray-900">{orderData.customerName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{orderData.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">{orderData.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium text-gray-900 text-right max-w-xs truncate">
                  {orderData.street ? `${orderData.city}, ${orderData.street}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">{orderData.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">
                  {orderData.totalPrice ? `EGP ${orderData.totalPrice.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-black border-2 border-black rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Create Account
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div variants={fadeUp} className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Save your order number to track your order status. You can also create an account to link this order to your profile.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GuestOrderSuccess;
