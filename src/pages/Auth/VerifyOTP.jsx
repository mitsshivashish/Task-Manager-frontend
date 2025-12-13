import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, verifyRegistrationOTP } from '../../utils/authApi';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  // Determine if this is for registration or password reset
  const isRegistration = location.state?.isRegistration;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      if (isRegistration) {
        // Registration OTP verification
        const res = await verifyRegistrationOTP(email, otp);
        // Store token and user info
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data));
        setMessage('Registration complete! Redirecting...');
        setTimeout(() => navigate('/user/dashboard'), 1500);
      } else {
        // Password reset OTP verification
        const res = await verifyOTP(email, otp);
        sessionStorage.setItem('resetToken', res.data.resetToken);
        setMessage('OTP verified! Redirecting to reset password...');
        setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      if (isRegistration) {
        // Resend registration OTP
        await axiosInstance.post(API_PATHS.AUTH.RESEND_REGISTRATION_OTP, { email });
        toast.success('New OTP sent to your email!');
        setMessage('New OTP sent to your email. Please check your inbox.');
      } else {
        // For password reset, we can reuse the forgot password endpoint
        await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
        toast.success('New OTP sent to your email!');
        setMessage('New OTP sent to your email. Please check your inbox.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            maxLength={6}
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-75' : ''}`}
            disabled={loading}
            style={loading ? { cursor: 'not-allowed' } : {}}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
            style={resendLoading ? { cursor: 'not-allowed' } : {}}
          >
            {resendLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                Sending...
              </div>
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>

        {message && <div className="mt-4 text-green-600">{message}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default VerifyOTP; 