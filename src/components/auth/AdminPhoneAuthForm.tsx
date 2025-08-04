'use client';

import { useState, useRef, useEffect } from 'react';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  phoneVerificationStart,
  firebaseAuthStart,
  firebaseAuthSuccess,
  firebaseAuthFailure 
} from '@/redux/slices/adminAuthSlice';
import { auth, createRecaptchaVerifier } from '@/config/firebase.config';
import ApiManager from '@/api/ApiManager';
import { formatPhoneNumber, displayPhoneNumber, validatePhoneNumber } from '@/lib/utils';
import { Shield, Phone, KeyRound } from 'lucide-react';

interface AdminPhoneAuthFormProps {
  onSuccess: () => void;
}

export default function AdminPhoneAuthForm({ onSuccess }: AdminPhoneAuthFormProps) {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.adminAuth);
  
  // Simple state management
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const recaptchaVerifierRef = useRef<import('firebase/auth').RecaptchaVerifier | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const sendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phone);
    
    if (!validatePhoneNumber(formattedPhone)) {
      dispatch(firebaseAuthFailure('Please enter a valid Indian phone number (+91XXXXXXXXXX)'));
      return;
    }

    try {
      setSendingOtp(true);
      dispatch(firebaseAuthFailure(''));
      
      // Clear any existing verifier before creating a new one
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
        recaptchaVerifierRef.current = null;
      }
      
      // Create new reCAPTCHA verifier
      recaptchaVerifierRef.current = createRecaptchaVerifier('admin-recaptcha-container');

      // Send OTP via Firebase
      const confirmation = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        recaptchaVerifierRef.current
      );
      
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setOtp(''); // Reset OTP field
      setSendingOtp(false);
      dispatch(phoneVerificationStart());
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error instanceof Error) {
        dispatch(firebaseAuthFailure(error.message || 'Failed to send OTP. Please check your phone number.'));
      } else {
        dispatch(firebaseAuthFailure('Failed to send OTP. Please check your phone number.'));
      }
      setSendingOtp(false);
      // Clear verifier on error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
        recaptchaVerifierRef.current = null;
      }
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      dispatch(firebaseAuthFailure('No confirmation result found. Please try again.'));
      return;
    }

    if (!otp || otp.length !== 6) {
      dispatch(firebaseAuthFailure('Please enter a valid 6-digit OTP'));
      return;
    }

    try {
      setVerifyingOtp(true);
      dispatch(firebaseAuthStart());

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      console.log('Admin Firebase ID Token received');

      // Send Firebase ID token to backend with device info
      const response = await ApiManager.authenticateWithFirebase({
        idToken,
        deviceInfo: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        }
      });

      // Update Redux state with admin data
      dispatch(firebaseAuthSuccess({ 
        admin: response.admin,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }));
      setVerifyingOtp(false);
      onSuccess();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error instanceof Error) {
        const errorMessage = error.message.includes('invalid-verification-code') 
          ? 'Invalid OTP. Please check and try again.'
          : error.message.includes('session-expired')
          ? 'OTP expired. Please request a new code.'
          : error.message || 'Failed to verify OTP';
        dispatch(firebaseAuthFailure(errorMessage));
      } else {
        dispatch(firebaseAuthFailure('Failed to verify OTP. Please try again.'));
      }
      setVerifyingOtp(false);
    }
  };

  const resetFlow = () => {
    setConfirmationResult(null);
    setPhone('');
    setOtp('');
    setShowOtpInput(false);
    setSendingOtp(false);
    setVerifyingOtp(false);
    dispatch(firebaseAuthFailure(''));
    // Clear the recaptcha verifier when resetting
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch {
        // Ignore cleanup errors
      }
      recaptchaVerifierRef.current = null;
    }
  };

  return (
    <div className="space-y-8">
      {!showOtpInput ? (
        // Step 1: Phone Number Entry
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
              <p className="text-gray-600">Enter your registered phone number to continue</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="admin-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={sendingOtp}
                  autoComplete="tel"
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Only authorized admin numbers can access this console
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button 
              onClick={sendOtp}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
              disabled={sendingOtp || !phone.trim()}
            >
              {sendingOtp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </div>
        </div>
      ) : (
        // Step 2: OTP Verification
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
              <p className="text-gray-600">
                Enter the 6-digit code sent to <br />
                <span className="font-semibold text-gray-900">{displayPhoneNumber(phone)}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="admin-otp" className="text-sm font-medium text-gray-700 text-center block">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={verifyingOtp}
                  autoComplete="off"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-12 w-12 border-gray-300 text-lg font-medium" />
                    <InputOTPSlot index={1} className="h-12 w-12 border-gray-300 text-lg font-medium" />
                    <InputOTPSlot index={2} className="h-12 w-12 border-gray-300 text-lg font-medium" />
                    <InputOTPSlot index={3} className="h-12 w-12 border-gray-300 text-lg font-medium" />
                    <InputOTPSlot index={4} className="h-12 w-12 border-gray-300 text-lg font-medium" />
                    <InputOTPSlot index={5} className="h-12 w-12 border-gray-300 text-lg font-medium" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 border border-red-200 rounded-md text-center">
                {error}
              </div>
            )}

            <Button 
              onClick={verifyOtp}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
              disabled={verifyingOtp || otp.length !== 6}
            >
              {verifyingOtp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify & Access Console'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Didn&apos;t receive the code?</p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendingOtp}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {sendingOtp ? 'Sending...' : 'Resend code'}
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={resetFlow}
                  disabled={verifyingOtp}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium hover:underline"
                >
                  Change number
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* reCAPTCHA container */}
      <div id="admin-recaptcha-container"></div>
    </div>
  );
}