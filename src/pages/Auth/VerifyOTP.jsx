import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, verifyRegistrationOTP } from '../../utils/authApi';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        {message && <div className="mt-4 text-green-600">{message}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default VerifyOTP; 