'use client';

import AdminPhoneAuthForm from './AdminPhoneAuthForm';
import { Building } from 'lucide-react';

interface AdminLoginCardProps {
  onSuccess: () => void;
}

export default function AdminLoginCard({ onSuccess }: AdminLoginCardProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-6">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-gray-900">RevoBricks</h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise Console</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Admin Login
            </h2>
            <p className="text-gray-500 text-sm">
              Secure access to the admin console
            </p>
          </div>
          <AdminPhoneAuthForm onSuccess={onSuccess} />
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