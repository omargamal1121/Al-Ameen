import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CheckoutModeSelector = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.03,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const cardTapVariants = {
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const checkoutOptions = [
    {
      id: 'guest',
      title: 'Guest Checkout',
      description: 'Fast checkout, no password needed, link orders later',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      route: '/guest-checkout',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200'
    },
    {
      id: 'signin',
      title: 'Sign In',
      description: 'Order tracking, saved addresses, wishlist access',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      route: '/login',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200'
    },
    {
      id: 'signup',
      title: 'Create Account',
      description: 'All member benefits, exclusive offers, faster checkout',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      route: '/signup',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Checkout Mode</h1>
          <p className="text-lg text-gray-600">Select how you'd like to proceed with your order</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {checkoutOptions.map((option) => (
            <motion.div
              key={option.id}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(option.route)}
              className={`${option.bgColor} ${option.borderColor} border-2 rounded-2xl p-8 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="text-gray-900 mb-6">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {option.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate('/cart')}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            ← Return to Cart
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutModeSelector;
