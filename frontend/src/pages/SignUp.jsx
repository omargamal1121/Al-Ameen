import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import authService from '../services/authService';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
    const { t } = useTranslation();
    const { backendUrl } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        phoneNumber: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        // Name validation
        if (!formData.name.match(/^[a-zA-Z][a-zA-Z\s\-,]*[a-zA-Z]$/)) {
            setError(t('NAME_VALIDATION_ERROR'));
            return false;
        }

        // Username validation
        if (!formData.userName.match(/^(?![_\.])[a-zA-Z0-9._]+(?<![_\.])$/)) {
            setError(t('USERNAME_VALIDATION_ERROR'));
            return false;
        }

        // Phone number validation
        if (!formData.phoneNumber.match(/^01[0-9]{9}$/)) {
            setError(t('PHONE_VALIDATION_ERROR'));
            return false;
        }

        // Age validation
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 18 || age > 100) {
            setError(t('AGE_VALIDATION_ERROR'));
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError(t('EMAIL_VALIDATION_ERROR'));
            return false;
        }

        // Password validation
        if (formData.password.length < 6) {
            setError(t('PASSWORD_VALIDATION_ERROR'));
            return false;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            setError(t('CONFIRM_PASSWORD_ERROR'));
            return false;
        }

        return true;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // Register the user
            const response = await fetch(`${backendUrl}/api/Account/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    userName: formData.userName,
                    phoneNumber: formData.phoneNumber,
                    age: parseInt(formData.age),
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });
            const data = await response.json();
            if (response.ok) {
                // Handle Fashion-main API success response format
                const successMessage = data.responseBody?.message || t('USER_REGISTERED_SUCCESSFULLY');
                setSuccess(`${successMessage} ${t('REDIRECTING_TO_LOGIN')}`);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Handle Fashion-main API error response format
                const errorMessage = data.responseBody?.message ||
                    (data.responseBody?.error?.message) ||
                    t('FAILED_TO_REGISTER');
                setError(errorMessage);
            }
        } catch (error) {
            console.log(error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                t('FAILED_TO_REGISTER_CONNECTION');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 pt-28 pb-16">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={formVariants}
                className="w-full max-w-lg"
            >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Brand Header Banner */}
                    <div className="bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] px-8 py-7 text-center relative overflow-hidden">
                        <div className="w-12 h-12 bg-[#c9a227] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-white font-black text-xl tracking-tight">Al-Ameen Cables & Wires</h1>
                        <p className="text-[#c9a227] text-xs font-bold mt-1 uppercase tracking-widest">{t('SIGN_UP')}</p>
                    </div>

                    <form onSubmit={onSubmitHandler} className="p-6 sm:p-8 flex flex-col gap-4 text-gray-800">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm"
                            >
                                {success}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_FULL_NAME')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                    placeholder={t('ENTER_YOUR_FULL_NAME')}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_USERNAME')}</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                    placeholder={t('ENTER_YOUR_USERNAME')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_PHONE_NUMBER')}</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                    placeholder="01xxxxxxxxx"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_AGE')}</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                    placeholder={t('ENTER_YOUR_AGE')}
                                    min="18"
                                    max="100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_EMAIL')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                placeholder={t('ENTER_YOUR_EMAIL')}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('ENTER_YOUR_PASSWORD')}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t('CONFIRM_YOUR_PASSWORD')}</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="outline-none w-full border-2 border-gray-200 py-2.5 px-3 rounded-xl focus:border-[#c9a227] transition-colors text-sm bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="w-full flex justify-between text-xs text-gray-500 pt-1">
                            <p>
                                {t('ALREADY_HAVE_ACCOUNT')}{" "}
                                <Link to="/login" className="text-[#1a6b2e] font-bold hover:text-[#c9a227] hover:underline">
                                    {t('LOGIN')}
                                </Link>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-bold py-3 px-6 mt-2 rounded-xl transition-all duration-300 shadow-md ${
                                loading
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#0f3d1a] text-white hover:bg-[#c9a227] hover:shadow-lg active:scale-[0.99]"
                            }`}
                        >
                            {loading ? t('REGISTERING') : t('SIGN_UP')}
                        </button>

                        <div className="flex items-center gap-3 my-1">
                            <hr className="flex-1 border-gray-200" />
                            <span className="text-gray-400 text-xs font-bold">{t('OR')}</span>
                            <hr className="flex-1 border-gray-200" />
                        </div>

                        <button
                            type="button"
                            onClick={() => authService.initiateGoogleLogin()}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl hover:border-[#c9a227] hover:bg-gray-50 transition-all duration-300"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-4 h-4"
                            />
                            <span className="text-gray-700 font-bold text-xs">Sign up with Google</span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUp
