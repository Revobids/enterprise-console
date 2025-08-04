'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Plus, Building2, Globe, Mail, Phone, MapPin, Eye, Edit, Trash2, Search, Filter, MoreHorizontal, Download, Users, BarChart3, Shield, Target } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchDevelopers, deleteDeveloper } from '../../redux/slices/developerSlice';
import { formatDate, formatPhoneNumber, truncateText } from '../../lib/utils';
import CreateDeveloperForm from './CreateDeveloperForm';
import { RealEstateDeveloper } from '../../types/api';

export default function DevelopersList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { developers, isLoading, error, deleteLoading } = useAppSelector((state) => state.developer);
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  // Filter developers based on search and status
  const filteredDevelopers = developers.filter(developer => {
    const matchesSearch = developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         developer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         developer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         developer.state?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && developer.isActive) ||
                         (filterStatus === 'inactive' && !developer.isActive);
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    // Only fetch developers if user is authenticated
    if (isAuthenticated && token) {
      dispatch(fetchDevelopers());
    }
  }, [dispatch, isAuthenticated, token]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this developer?')) {
      try {
        await dispatch(deleteDeveloper(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete developer:', error);
      }
    }
  };

  const handleViewDetails = (developerId: string) => {
    router.push(`/dashboard/developer-details?id=${developerId}`);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    dispatch(fetchDevelopers());
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="animate-pulse bg-slate-200 h-8 w-64 rounded"></div>
            <div className="animate-pulse bg-slate-200 h-4 w-96 rounded"></div>
          </div>
          <div className="animate-pulse bg-slate-200 h-10 w-32 rounded"></div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="bg-slate-200 h-4 w-20 rounded"></div>
                  <div className="bg-slate-200 h-8 w-12 rounded"></div>
                </div>
                <div className="bg-slate-200 h-12 w-12 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-slate-200 h-6 w-32 rounded"></div>
              <div className="bg-slate-200 h-10 w-64 rounded"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-slate-50 h-16 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: developers.length,
    active: developers.filter(d => d.isActive).length,
    inactive: developers.filter(d => !d.isActive).length,
    thisMonth: developers.filter(d => {
      const createdAt = new Date(d.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Developer Partners</h1>
              <p className="text-slate-600">Manage and onboard real estate development partners</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Developer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Developer Partner</DialogTitle>
              </DialogHeader>
              <CreateDeveloperForm 
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Partners</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">All registered</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Active Partners</p>
                <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-xs text-slate-500">Currently operating</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Inactive Partners</p>
                <p className="text-3xl font-bold text-slate-900">{stats.inactive}</p>
                <p className="text-xs text-slate-500">Dormant accounts</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">This Month</p>
                <p className="text-3xl font-bold text-slate-900">{stats.thisMonth}</p>
                <p className="text-xs text-slate-500">New registrations</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search developers, locations, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-600">
                {filteredDevelopers.length} of {developers.length} developers
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developers Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Developer Partners ({filteredDevelopers.length})
                </CardTitle>
                <p className="text-sm text-slate-500">Comprehensive partner management</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredDevelopers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching developers' : 'No developers found'}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Get started by adding your first developer partner.'
                }
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Developer
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Company</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Created</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevelopers.map((developer, index) => (
                    <TableRow 
                      key={developer.id} 
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/dashboard/developer-details?id=${developer.id}`)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 truncate">{developer.name}</div>
                            {developer.description && (
                              <div className="text-sm text-slate-500 mt-1">
                                {truncateText(developer.description, 60)}
                              </div>
                            )}
                            {developer.website && (
                              <div className="flex items-center text-sm text-blue-600 mt-1">
                                <Globe className="mr-1 h-3 w-3" />
                                <a 
                                  href={developer.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline truncate"
                                >
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          {developer.email && (
                            <div className="flex items-center text-sm text-slate-600">
                              <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center mr-2">
                                <Mail className="h-3 w-3" />
                              </div>
                              <span className="truncate">{developer.email}</span>
                            </div>
                          )}
                          {developer.phone && (
                            <div className="flex items-center text-sm text-slate-600">
                              <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center mr-2">
                                <Phone className="h-3 w-3" />
                              </div>
                              <span>{formatPhoneNumber(developer.phone)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {developer.city || developer.state ? (
                          <div className="flex items-center text-sm text-slate-600">
                            <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center mr-2">
                              <MapPin className="h-3 w-3" />
                            </div>
                            <span>{[developer.city, developer.state].filter(Boolean).join(', ')}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant={developer.isActive ? 'default' : 'secondary'}
                          className={developer.isActive 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                          }
                        >
                          {developer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-500">
                        {formatDate(developer.createdAt)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(developer.id)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(developer.id)}
                            disabled={deleteLoading}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                            title="Delete Developer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}