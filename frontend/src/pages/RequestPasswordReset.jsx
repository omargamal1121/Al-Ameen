import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RequestPasswordReset = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(isAr ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${backendUrl}/api/Account/request-password-reset?Email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSent(true);
        // After 2s, redirect to reset-password with email pre-filled
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2500);
        setEmail('');
      } else {
        setError(
          data.responseBody?.message ||
            (isAr ? 'فشل إرسال الرابط. يرجى المحاولة مرة أخرى.' : 'Failed to send reset link. Please try again.')
        );
      }
    } catch (err) {
      console.error('Request password reset error:', err);
      setError(isAr ? 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.' : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#c9a227]/10 text-[#c9a227] flex items-center justify-center text-3xl">📧</div>
          <h2 className="text-2xl font-black text-[#0f3d1a]">
            {isAr ? 'تم إرسال رابط الاسترداد' : 'Reset Link Sent'}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {isAr
              ? 'إذا كان البريد الإلكتروني مسجلاً، ستصل رسالة برابط استرداد كلمة المرور. يتم توجيهك الآن...'
              : 'If that email is registered, you will receive a reset link shortly. Redirecting you now...'}
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#e8c445] text-[#0f3d1a] text-2xl mb-4 shadow-lg">
            📨
          </div>
          <h1 className="text-3xl font-black text-[#0f3d1a]">
            {isAr ? 'استرداد كلمة المرور' : 'Forgot Password?'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isAr
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'
              : "Enter your email and we'll send you a password reset link"}
          </p>
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
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="outline-none w-full border-2 border-gray-200 py-3 px-4 rounded-xl focus:border-[#1a6b2e] transition-colors bg-gray-50 text-sm"
              placeholder={isAr ? 'example@email.com' : 'your@email.com'}
              required
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#0f3d1a] to-[#1a6b2e] text-white font-extrabold rounded-2xl hover:from-[#1a6b2e] hover:to-[#0f3d1a] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isAr ? 'جاري الإرسال...' : 'Sending...'}
              </>
            ) : (
              isAr ? 'إرسال رابط الاسترداد' : 'Send Reset Link'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-center text-sm text-gray-400 hover:text-[#0f3d1a] transition-colors cursor-pointer font-medium"
          >
            {isAr ? '← العودة لتسجيل الدخول' : '← Back to Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestPasswordReset;
