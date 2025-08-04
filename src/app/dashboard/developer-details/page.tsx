'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '../../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
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
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAppSelector } from '../../../redux/hooks';
import { useRequireAuth } from '../../../hooks/useRequireAuth';

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

export default function DeveloperDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { developers } = useAppSelector((state) => state.developer);
  
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'offices' | 'projects'>('overview');

  useEffect(() => {
    const developerId = searchParams?.get('id');
    if (developerId && developers.length > 0) {
      const foundDeveloper = developers.find(dev => dev.id === developerId);
      if (foundDeveloper) {
        // Add mock data for demo purposes
        const enhancedDeveloper = {
          ...foundDeveloper,
          employees: [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              username: 'johndoe',
              role: 'ADMIN' as const,
              isActive: true,
              createdAt: '2023-01-15T00:00:00Z'
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              username: 'janesmith',
              role: 'MANAGER' as const,
              isActive: true,
              createdAt: '2023-02-01T00:00:00Z'
            }
          ],
          offices: [
            {
              id: '1',
              name: 'Head Office',
              address: '123 Business Street',
              city: foundDeveloper.city || 'Mumbai',
              state: foundDeveloper.state || 'Maharashtra',
              country: 'India',
              phoneNumber: foundDeveloper.phone,
              email: foundDeveloper.email,
              isHeadOffice: true
            }
          ],
          projects: [
            {
              id: '1',
              name: 'Skyline Towers',
              description: 'Luxury residential complex',
              address: '456 Project Road',
              city: foundDeveloper.city || 'Mumbai',
              state: foundDeveloper.state || 'Maharashtra',
              status: 'PUBLISHED',
              projectType: 'Residential',
              propertyType: 'Apartment',
              totalUnits: 150,
              expectedCompletionDate: '2025-12-31T00:00:00Z',
              constructionStartDate: '2023-01-01T00:00:00Z'
            }
          ]
        };
        setDeveloper(enhancedDeveloper);
      }
      setLoading(false);
    } else if (!developerId) {
      setLoading(false);
    }
  }, [searchParams, developers]);

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="h-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!developer) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Developer Not Found</h3>
          <p className="text-slate-600 mb-4">The developer you're looking for doesn't exist or couldn't be loaded.</p>
          <Button onClick={() => router.push('/dashboard/developers')} className="bg-slate-900 hover:bg-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Developers
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-50 text-red-700 border-red-200';
      case 'MANAGER': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'EMPLOYEE': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-50 text-green-700 border-green-200';
      case 'DRAFT': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Calculate stats
  const stats = {
    totalEmployees: developer.employees?.length || 0,
    activeEmployees: developer.employees?.filter((e: Employee) => e.isActive).length || 0,
    totalOffices: developer.offices?.length || 0,
    headOffice: developer.offices?.find((o: Office) => o.isHeadOffice),
    totalProjects: developer.projects?.length || 0,
    activeProjects: developer.projects?.filter((p: Project) => p.status === 'PUBLISHED').length || 0,
    totalUnits: developer.projects?.reduce((sum: number, p: Project) => sum + (p.totalUnits || 0), 0) || 0
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/developers')}
                className="p-2 hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{developer.name}</h1>
                  <p className="text-slate-600 mt-1">
                    Partner ID: {developer.id.slice(0, 8)}... • Member since {new Date(developer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant="outline"
                className={developer.isActive 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
                }
              >
                {developer.isActive ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Inactive
                  </>
                )}
              </Badge>
              <Button variant="outline" size="sm" className="border-slate-200">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalEmployees}</p>
                  <p className="text-xs text-slate-500 mt-1">{stats.activeEmployees} active</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Office Locations</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalOffices}</p>
                  <p className="text-xs text-slate-500 mt-1">{stats.headOffice ? '1 head office' : 'No head office'}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Projects</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalProjects}</p>
                  <p className="text-xs text-slate-500 mt-1">{stats.activeProjects} published</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Units</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUnits.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">Across all projects</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Home className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <nav className="flex border-b border-slate-200">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
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
                    flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all
                    ${isActive
                      ? 'text-slate-900 border-b-2 border-slate-900'
                      : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Company Information */}
                  <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="text-lg">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {developer.description && (
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Description</p>
                          <p className="text-slate-900">{developer.description}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {developer.city && (
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600">Location</p>
                              <p className="text-slate-900">{developer.city}, {developer.state}</p>
                            </div>
                          </div>
                        )}
                        {developer.email && (
                          <div className="flex items-start space-x-3">
                            <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600">Email</p>
                              <p className="text-slate-900">{developer.email}</p>
                            </div>
                          </div>
                        )}
                        {developer.phone && (
                          <div className="flex items-start space-x-3">
                            <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600">Phone</p>
                              <p className="text-slate-900">{developer.phone}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-slate-600">Last Updated</p>
                            <p className="text-slate-900">{new Date(developer.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div>
                  <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                      <Button className="w-full justify-start bg-slate-900 hover:bg-slate-800">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-4">
                {developer.employees && developer.employees.length > 0 ? (
                  developer.employees.map((employee: Employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.name}</p>
                          <p className="text-sm text-slate-600">{employee.email}</p>
                          <p className="text-xs text-slate-500">@{employee.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleBadgeColor(employee.role)}>
                          <Shield className="h-3 w-3 mr-1" />
                          {employee.role}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={employee.isActive 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                          }
                        >
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No employees found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'offices' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {developer.offices && developer.offices.length > 0 ? (
                  developer.offices.map((office: Office) => (
                    <Card key={office.id} className="border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-slate-900">{office.name}</h4>
                          {office.isHeadOffice && (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                              Head Office
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                            <p className="text-slate-600">
                              {office.address}, {office.city}, {office.state}
                            </p>
                          </div>
                          {office.phoneNumber && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <p className="text-slate-600">{office.phoneNumber}</p>
                            </div>
                          )}
                          {office.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <p className="text-slate-600">{office.email}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No offices found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {developer.projects && developer.projects.length > 0 ? (
                  developer.projects.map((project: Project) => (
                    <Card key={project.id} className="border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg text-slate-900">{project.name}</h4>
                            {project.description && (
                              <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                            )}
                          </div>
                          <Badge className={getStatusBadgeColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500">Type</p>
                            <p className="text-sm font-medium text-slate-900">{project.projectType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Property</p>
                            <p className="text-sm font-medium text-slate-900">{project.propertyType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Units</p>
                            <p className="text-sm font-medium text-slate-900">{project.totalUnits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Location</p>
                            <p className="text-sm font-medium text-slate-900">{project.city}, {project.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            <span>Started: {new Date(project.constructionStartDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            <span>Expected: {new Date(project.expectedCompletionDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No projects found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}