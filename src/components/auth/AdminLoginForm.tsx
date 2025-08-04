'use client';

import { useState } from 'react';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { auth, createRecaptchaVerifier } from '../../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { authenticateAdmin, setPhoneVerificationInProgress } from '../../redux/slices/authSlice';
import { logAuthAttempt } from '../../utils/testAuth';

export default function AdminLoginForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !cleanPhone.match(/^[6-9]/)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    const formattedPhone = `+91${cleanPhone}`;
    
    logAuthAttempt('Phone Number Validation', { 
      original: phoneNumber, 
      cleaned: cleanPhone, 
      formatted: formattedPhone 
    });

    try {
      setLoading(true);
      setError('');

      // Create recaptcha verifier
      const recaptchaVerifier = createRecaptchaVerifier('recaptcha-container');
      logAuthAttempt('Recaptcha Created', { containerId: 'recaptcha-container' });

      // Send OTP
      logAuthAttempt('Sending OTP', { phone: formattedPhone });
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
      dispatch(setPhoneVerificationInProgress(true));
      
      logAuthAttempt('OTP Sent Successfully', { phone: formattedPhone });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      logAuthAttempt('OTP Send Failed', { error: error.message });
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (!confirmationResult) {
      setError('Please request OTP first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Confirm OTP with Firebase
      logAuthAttempt('OTP Verification', { otp: '***', phone: phoneNumber });
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      logAuthAttempt('Firebase Auth Success', { 
        uid: userCredential.user.uid, 
        phone: userCredential.user.phoneNumber 
      });

      // Prepare auth data with device info
      const authData = {
        idToken,
        deviceInfo: {
          userAgent: navigator.userAgent,
        }
      };

      logAuthAttempt('Backend API Call', { endpoint: '/admin/auth/authenticate' });

      // Authenticate with backend API
      const result = await dispatch(authenticateAdmin(authData)).unwrap();
      
      logAuthAttempt('Backend Auth Success', { success: result.success });
      
      if (result.success) {
        console.log('✅ Full authentication successful:', result);
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (error.message?.includes('Unauthorized user')) {
        setError('Access denied. Your phone number is not authorized for admin access.');
      } else {
        setError(error.message || 'Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
      dispatch(setPhoneVerificationInProgress(false));
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setConfirmationResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-6">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-gray-900">RevoBricks</h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise Console</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Admin Login
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 'phone' 
                ? 'Enter your authorized phone number to continue'
                : 'Enter the OTP sent to your phone'
              }
            </p>
          </div>
          <div className="space-y-6">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendOtp} 
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Enter OTP
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    OTP sent to +91 {phoneNumber}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerifyOtp} 
                    disabled={loading || otp.length !== 6}
                    className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                  >
                    {loading || isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Recaptcha container */}
            <div id="recaptcha-container"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>Protected by advanced security measures</p>
          <p className="mt-1">© 2024 RevoBricks. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}