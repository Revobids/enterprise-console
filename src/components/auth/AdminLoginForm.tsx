'use client';

import { useState } from 'react';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'phone' 
              ? 'Enter your authorized phone number to continue'
              : 'Enter the OTP sent to your phone'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12"
                    maxLength={10}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSendOtp} 
                disabled={loading || !phoneNumber.trim()}
                className="w-full"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
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
                <p className="text-sm text-gray-600 text-center">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyOtp} 
                  disabled={loading || otp.length !== 6}
                  className="flex-1"
                >
                  {loading || isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Recaptcha container */}
          <div id="recaptcha-container"></div>
        </CardContent>
      </Card>
    </div>
  );
}