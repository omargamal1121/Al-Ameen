import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import GuestCheckoutForm from '../components/GuestCheckoutForm';
import { placeGuestOrder, initiateGuestPayment } from '../services/guestCheckoutService';
import { clearAllGuestData } from '../utils/guestSession';

const GuestCheckout = () => {
  const navigate = useNavigate();
  const { token, cartItems, products, productsLoaded, resolveVariantId, backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Redirect authenticated users to /place-order
  useEffect(() => {
    if (token) {
      navigate('/place-order', { replace: true });
    }
  }, [token, navigate]);

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/Enums/PaymentMethods`);
        const data = await response.json();
        const methods = data.data || data.responseBody?.data || data;
        setPaymentMethods(Array.isArray(methods) ? methods : ['COD', 'Card', 'MobileWallet']);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setPaymentMethods(['COD', 'Card', 'MobileWallet']);
      }
    };

    fetchPaymentMethods();
  }, [backendUrl]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const fadeLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  // Prepare cart items for API
  const prepareCartItems = async () => {
    const items = [];
    
    for (const productId in cartItems) {
      for (const itemKey in cartItems[productId]) {
        const cartItem = cartItems[productId][itemKey];
        
        // Handle both old format (just quantity) and new format (object with quantity and variantId)
        const quantity = typeof cartItem === 'object' ? cartItem.quantity : cartItem;
        const variantId = typeof cartItem === 'object' ? cartItem.variantId : null;
        const [size, color] = itemKey.split('_');
        
        // Use stored variantId if available, otherwise resolve it
        let productVariantId = variantId;
        if (!productVariantId) {
          productVariantId = await resolveVariantId(productId, size);
        }
        
        if (productVariantId) {
          items.push({
            productId: Number(productId),
            productVariantId: productVariantId,
            quantity: typeof quantity === 'object' ? quantity.quantity : quantity
          });
        }
      }
    }
    
    return items;
  };

  const handleSubmit = async (formData) => {
    if (Object.keys(cartItems).length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Prepare cart items
      const items = await prepareCartItems();
      
      if (items.length === 0) {
        toast.error('Unable to prepare cart items. Please try again.');
        setLoading(false);
        return;
      }

      // Prepare order payload
      const orderPayload = {
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        governorate: formData.governorate,
        city: formData.city,
        street: formData.street,
        building: formData.building,
        notes: formData.notes,
        items: items
      };

      // Place guest order
      const orderResponse = await placeGuestOrder(orderPayload);

      if (!orderResponse.success) {
        setLoading(false);
        return;
      }

      const { orderNumber, guestToken } = orderResponse;

      // Store order number in localStorage before payment redirect
      localStorage.setItem('pendingGuestOrderNumber', orderNumber);

      // Clear guest cart
      clearAllGuestData();

      // Handle payment based on method
      if (formData.paymentMethod === 'COD') {
        // For COD, navigate directly to success page
        navigate(`/checkout/success?orderNumber=${orderNumber}`, { replace: true });
      } else {
        // For Card or Mobile Wallet, initiate payment
        const paymentResponse = await initiateGuestPayment(
          orderNumber,
          formData.paymentMethod,
          formData.walletPhone,
          formData.paymentNotes
        );

        if (!paymentResponse.success) {
          setLoading(false);
          return;
        }

        // If redirectUrl is provided, the initiateGuestPayment function will handle the redirect
        // If no redirectUrl (e.g., payment already processed), navigate to success
        if (!paymentResponse.redirectUrl) {
          navigate(`/checkout/success?orderNumber=${orderNumber}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get product details for order summary
  const getOrderSummaryItems = () => {
    const items = [];
    
    console.log('Cart items:', cartItems);
    console.log('Products available:', products);
    console.log('Products loaded:', productsLoaded);
    
    for (const productId in cartItems) {
      const product = products.find(p => String(p.id) === String(productId) || String(p._id) === String(productId));
      console.log(`Looking for product ID ${productId}, found:`, product);
      
      if (!product) {
        console.warn(`Product with ID ${productId} not found in products array`);
        continue;
      }

      for (const itemKey in cartItems[productId]) {
        const cartItem = cartItems[productId][itemKey];
        
        // Handle both old format (just quantity) and new format (object with quantity and variantId)
        const quantity = typeof cartItem === 'object' ? cartItem.quantity : cartItem;
        const [size, color] = itemKey.split('_');
        
        items.push({
          product,
          size,
          color,
          quantity
        });
      }
    }
    
    console.log('Order summary items:', items);
    return items;
  };

  const orderSummaryItems = getOrderSummaryItems();
  const deliveryFee = 10; // EGP

  // Show loading state if products are not loaded yet AND we have cart items
  if (!productsLoaded && Object.keys(cartItems).length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message if no items
  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Calculate total
  const calculateSubtotal = () => {
    return orderSummaryItems.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee;

  if (token) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Checkout</h1>
          <p className="text-gray-600">Complete your order without creating an account</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div variants={fadeLeft} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <GuestCheckoutForm onSubmit={handleSubmit} loading={loading} />
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={fadeRight} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {orderSummaryItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 text-black font-medium hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {orderSummaryItems.map((item, index) => {
                    const productImage = Array.isArray(item.product.images) 
                      ? item.product.images[0]?.url 
                      : item.product.image;
                    
                    const sizeStr = typeof item.size === 'object' ? JSON.stringify(item.size) : item.size;
                    const colorStr = typeof item.color === 'object' ? JSON.stringify(item.color) : item.color;
                    
                    return (
                      <motion.div
                        key={`${item.product.id}-${sizeStr}-${colorStr}-${index}`}
                        variants={fadeUp}
                        className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={item.product.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.product.name || 'Product'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Size: {sizeStr || 'N/A'} {colorStr && `• Color: ${colorStr}`}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {backendUrl ? 'EGP ' : ''}{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{backendUrl ? 'EGP ' : ''}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{backendUrl ? 'EGP ' : ''}{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>{backendUrl ? 'EGP ' : ''}{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GuestCheckout;
