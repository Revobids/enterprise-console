'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Building2, 
  Users, 
  Home, 
  Mail, 
  Phone, 
  MapPin,
  ArrowLeft,
  Calendar,
  User,
  Shield,
  Briefcase,
  Activity,
  Target,
  BarChart3,
  Clock,
  Star,
  TrendingUp,
  Award,
  Globe,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { ApiManager } from '../../../../api/ApiManager';
import { useRequireAuth } from '../../../../hooks/useRequireAuth';

interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: string;
}

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber?: string;
  email?: string;
  isHeadOffice: boolean;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  status: string;
  projectType: string;
  propertyType: string;
  totalUnits: number;
  expectedCompletionDate: string;
  constructionStartDate: string;
}

interface DeveloperDetails {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employees?: Employee[];
  offices?: Office[];
  projects?: Project[];
}

export default function DeveloperDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  const [developer, setDeveloper] = useState<DeveloperDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'offices' | 'projects'>('overview');

  useEffect(() => {
    if (params.id && isAuthenticated) {
      fetchDeveloperDetails();
    }
  }, [params.id, isAuthenticated]);

  const fetchDeveloperDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getDeveloperById(params.id as string);
      setDeveloper(response);
    } catch (error) {
      console.error('Failed to fetch developer details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-slate-200 h-10 w-10 rounded"></div>
              <div className="space-y-2">
                <div className="animate-pulse bg-slate-200 h-8 w-64 rounded"></div>
                <div className="animate-pulse bg-slate-200 h-4 w-48 rounded"></div>
              </div>
            </div>
            <div className="animate-pulse bg-slate-200 h-6 w-20 rounded-full"></div>
          </div>
          
          {/* Hero Section Skeleton */}
          <div className="animate-pulse bg-slate-200 h-48 rounded-2xl"></div>
          
          {/* Tabs Skeleton */}
          <div className="border-b">
            <div className="flex space-x-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-slate-200 h-12 w-24 rounded"></div>
              ))}
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg h-64"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!developer) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Developer not found</p>
          <Button onClick={() => router.push('/dashboard/developers')}>
            Back to Developers
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700';
      case 'MANAGER': return 'bg-blue-100 text-blue-700';
      case 'EMPLOYEE': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate additional stats
  const stats = {
    totalEmployees: developer.employees?.length || 0,
    activeEmployees: developer.employees?.filter(e => e.isActive).length || 0,
    totalOffices: developer.offices?.length || 0,
    headOffice: developer.offices?.find(o => o.isHeadOffice),
    totalProjects: developer.projects?.length || 0,
    activeProjects: developer.projects?.filter(p => p.status === 'PUBLISHED').length || 0,
    totalUnits: developer.projects?.reduce((sum, p) => sum + (p.totalUnits || 0), 0) || 0
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/developers')}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{developer.name}</h1>
                <p className="text-slate-600">
                  Developer Partner • {stats.totalEmployees} employees • {stats.totalProjects} projects
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Badge 
              variant={developer.isActive ? 'default' : 'secondary'}
              className={`px-3 py-1 ${developer.isActive 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {developer.isActive ? 'Active Partner' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-300" />
                </div>
                <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                <p className="text-blue-200 text-sm">Total Employees</p>
                <p className="text-blue-300 text-xs">{stats.activeEmployees} active</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-6 w-6 text-emerald-300" />
                </div>
                <p className="text-3xl font-bold">{stats.totalOffices}</p>
                <p className="text-emerald-200 text-sm">Office Locations</p>
                <p className="text-emerald-300 text-xs">{stats.headOffice ? '1 head office' : 'No head office'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-purple-300" />
                </div>
                <p className="text-3xl font-bold">{stats.totalProjects}</p>
                <p className="text-purple-200 text-sm">Active Projects</p>
                <p className="text-purple-300 text-xs">{stats.activeProjects} published</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Home className="h-6 w-6 text-orange-300" />
                </div>
                <p className="text-3xl font-bold">{stats.totalUnits.toLocaleString()}</p>
                <p className="text-orange-200 text-sm">Total Units</p>
                <p className="text-orange-300 text-xs">Across all projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border-0">
          <nav className="flex space-x-2 p-2">
            {[
              { id: 'overview', label: 'Overview', icon: Building2, count: null },
              { id: 'employees', label: 'Employees', icon: Users, count: stats.totalEmployees },
              { id: 'offices', label: 'Offices', icon: Briefcase, count: stats.totalOffices },
              { id: 'projects', label: 'Projects', icon: Home, count: stats.totalProjects },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <Badge 
                      className={`ml-1 ${isActive 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Company Information</CardTitle>
                        <p className="text-sm text-slate-500">Partner details and contact information</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {developer.description && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-2">Description</p>
                        <p className="text-slate-900 leading-relaxed">{developer.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {developer.address && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mt-1">
                            <MapPin className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600">Address</p>
                            <p className="text-slate-900 mt-1">{developer.address}</p>
                          </div>
                        </div>
                      )}
                      {developer.email && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mt-1">
                            <Mail className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600">Email</p>
                            <p className="text-slate-900 mt-1">{developer.email}</p>
                          </div>
                        </div>
                      )}
                      {developer.phone && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mt-1">
                            <Phone className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600">Phone</p>
                            <p className="text-slate-900 mt-1">{developer.phone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mt-1">
                          <Clock className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-600">Member Since</p>
                          <p className="text-slate-900 mt-1">{new Date(developer.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
                        <p className="text-sm text-slate-500">Latest partner activities</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Partner account created</p>
                          <p className="text-xs text-slate-500">{new Date(developer.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-emerald-50 rounded-lg">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Profile last updated</p>
                          <p className="text-xs text-slate-500">{new Date(developer.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Performance Metrics */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Performance</CardTitle>
                        <p className="text-sm text-slate-500">Key metrics</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Employees</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="font-semibold text-slate-900">
                            {stats.activeEmployees}/{stats.totalEmployees}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Published Projects</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="font-semibold text-slate-900">
                            {stats.activeProjects}/{stats.totalProjects}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Head Office</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${stats.headOffice ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                          <span className="font-semibold text-slate-900">
                            {stats.headOffice ? 'Set' : 'Not Set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                        <p className="text-sm text-slate-500">Partner management</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Partner Details
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 h-4 w-4" />
                        View Public Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Performance Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <Card>
              <CardHeader>
                <CardTitle>Employees ({developer.employees?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {developer.employees && developer.employees.length > 0 ? (
                  <div className="space-y-4">
                    {developer.employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                            <p className="text-xs text-gray-400">@{employee.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getRoleBadgeColor(employee.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {employee.role}
                          </Badge>
                          <Badge variant={employee.isActive ? 'success' : 'secondary'}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No employees found</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'offices' && (
            <Card>
              <CardHeader>
                <CardTitle>Offices ({developer.offices?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {developer.offices && developer.offices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {developer.offices.map((office) => (
                      <div
                        key={office.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium">{office.name}</h4>
                          {office.isHeadOffice && (
                            <Badge variant="default">Head Office</Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <p className="text-gray-600">
                              {office.address}, {office.city}, {office.state}
                            </p>
                          </div>
                          {office.phoneNumber && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <p className="text-gray-600">{office.phoneNumber}</p>
                            </div>
                          )}
                          {office.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <p className="text-gray-600">{office.email}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No offices found</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'projects' && (
            <Card>
              <CardHeader>
                <CardTitle>Projects ({developer.projects?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {developer.projects && developer.projects.length > 0 ? (
                  <div className="space-y-4">
                    {developer.projects.map((project) => (
                      <div
                        key={project.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{project.name}</h4>
                            {project.description && (
                              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                            )}
                          </div>
                          <Badge variant={project.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500">Type</p>
                            <p className="text-sm font-medium">{project.projectType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Property</p>
                            <p className="text-sm font-medium">{project.propertyType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Units</p>
                            <p className="text-sm font-medium">{project.totalUnits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium">{project.city}, {project.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Started: {new Date(project.constructionStartDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Expected: {new Date(project.expectedCompletionDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No projects found</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}