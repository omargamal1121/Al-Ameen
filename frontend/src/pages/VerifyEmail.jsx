import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
    const { i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state || {};
    const email = formData.email || '';

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!code.trim()) {
            setError(isAr ? 'يرجى إدخال رمز التحقق' : 'Please enter the verification code.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ ...formData, code }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2500);
            } else {
                setError(data.message || (isAr ? 'فشل التحقق. يرجى المحاولة مرة أخرى.' : 'Verification failed. Please try again.'));
            }
        } catch (err) {
            setError(isAr ? 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.' : 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">✓</div>
                    <h2 className="text-2xl font-black text-[#0f3d1a]">
                        {isAr ? 'تم التحقق بنجاح!' : 'Email Verified!'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isAr
                            ? 'تم إنشاء حسابك بنجاح. يتم توجيهك لتسجيل الدخول...'
                            : 'Your account has been created. Redirecting to login...'}
                    </p>
                    <div className="w-8 h-8 border-2 border-[#1a6b2e] border-t-transparent rounded-full animate-spin mt-2" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] text-white text-2xl mb-4 shadow-lg">
                        📧
                    </div>
                    <h1 className="text-3xl font-black text-[#0f3d1a]">
                        {isAr ? 'تحقق من البريد الإلكتروني' : 'Verify Your Email'}
                    </h1>
                    {email && (
                        <p className="text-gray-500 text-sm mt-2">
                            {isAr ? 'أُرسل رمز التحقق إلى' : 'Verification code sent to'}{' '}
                            <span className="font-bold text-[#1a6b2e]">{email}</span>
                        </p>
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col gap-5"
                    dir={isAr ? 'rtl' : 'ltr'}
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
                        >
                            <span className="mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            {isAr ? 'رمز التحقق' : 'Verification Code'}
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="outline-none w-full border-2 border-gray-200 py-3 px-4 rounded-xl focus:border-[#1a6b2e] transition-colors bg-gray-50 text-sm text-center tracking-[0.5em] font-bold text-lg"
                            placeholder="- - - - - -"
                            required
                            maxLength={8}
                            dir="ltr"
                        />
                    </div>

                    <p className="text-xs text-gray-400 text-center -mt-2">
                        {isAr
                            ? 'تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها'
                            : 'Check your inbox or spam folder for the code'}
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-1 bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] text-white font-extrabold rounded-2xl hover:from-[#1a6b2e] hover:to-[#0f3d1a] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {isAr ? 'جاري التحقق...' : 'Verifying...'}
                            </>
                        ) : (
                            isAr ? 'تحقق وإنشاء الحساب' : 'Verify & Create Account'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="w-full text-center text-sm text-gray-400 hover:text-[#0f3d1a] transition-colors cursor-pointer font-medium"
                    >
                        {isAr ? '← العودة للتسجيل' : '← Back to Sign Up'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
