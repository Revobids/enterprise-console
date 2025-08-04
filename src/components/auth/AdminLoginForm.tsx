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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-6 shadow-xl">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600 text-base mt-2">Sign in to RevoBricks Enterprise Console</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                {step === 'phone' ? 'Admin Access' : 'Verify Your Identity'}
              </h2>
              <p className="text-slate-600">
                {step === 'phone' 
                  ? 'Enter your authorized phone number to receive a verification code'
                  : 'Enter the 6-digit code sent to your phone'
                }
              </p>
            </div>
          <div className="space-y-6">
            {step === 'phone' ? (
              <>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-14 h-12 border-slate-300 focus:border-slate-900 focus:ring-slate-900 rounded-xl text-base bg-slate-50 focus:bg-white transition-colors"
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendOtp} 
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending Code...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-5">
                  <div className="text-center">
                    <Label htmlFor="otp" className="text-sm font-semibold text-slate-700">
                      Verification Code
                    </Label>
                    <div className="mt-4 flex justify-center">
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
                    <p className="text-sm text-slate-600 text-center mt-3">
                      Code sent to +91 {phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="flex-1 h-12 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerifyOtp} 
                    disabled={loading || otp.length !== 6}
                    className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {loading || isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recaptcha container */}
            <div id="recaptcha-container"></div>
          </div>
        </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-slate-500">
              Protected by enterprise-grade security
            </p>
            <p className="text-xs text-slate-400 mt-2">© 2024 RevoBricks. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:flex-1 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-12 text-white w-full">
          <div className="max-w-lg text-center space-y-8">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Real Estate Excellence Starts Here
              </h1>
              <p className="text-xl text-slate-300">
                Powerful tools for modern real estate developers and property management
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 gap-6 mt-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Secure Admin Access</h3>
                    <p className="text-sm text-slate-400">Enterprise-grade authentication</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Complete Management</h3>
                    <p className="text-sm text-slate-400">Developers, projects, and more</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <div className="pt-8">
              <p className="text-sm text-slate-400">
                Trusted by leading real estate developers across India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}