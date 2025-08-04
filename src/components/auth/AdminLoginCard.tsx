'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminPhoneAuthForm from './AdminPhoneAuthForm';
import { Building } from 'lucide-react';

interface AdminLoginCardProps {
  onSuccess: () => void;
}

export default function AdminLoginCard({ onSuccess }: AdminLoginCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RevoBricks</h1>
          <p className="text-gray-600 mt-1">Enterprise Console</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Admin Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Secure access to the admin console
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <AdminPhoneAuthForm onSuccess={onSuccess} />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            Protected by advanced security measures
          </p>
          <p className="mt-1">
            © 2024 RevoBricks. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}