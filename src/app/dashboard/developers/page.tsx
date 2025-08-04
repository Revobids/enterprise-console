'use client';

import AdminLayout from '../../../components/layout/AdminLayout';
import DevelopersList from '../../../components/developers/DevelopersList';
import { useRequireAuth } from '../../../hooks/useRequireAuth';

export default function DevelopersPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <DevelopersList />
    </AdminLayout>
  );
}