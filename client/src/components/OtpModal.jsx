import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';

const OtpModal = ({ isOpen, onClose, onVerify, email, title, description, isLoading }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await onVerify(otp);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleClose = () => {
    setOtp('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <Mail className="text-green-600 mr-2" size={20} />
            <span className="text-sm text-gray-600">{email}</span>
          </div>

          <p className="text-gray-600 mb-6">{description}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setOtp(value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            OTP expires in 5 minutes. Didn't receive? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
