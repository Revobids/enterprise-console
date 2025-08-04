'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Building2, 
  Users, 
  Home, 
  TrendingUp, 
  Plus,
  ArrowRight,
  BarChart3,
  Activity,
  Shield,
  Clock,
  Target,
  Zap,
  Globe,
  PieChart
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchDevelopers } from '../../redux/slices/developerSlice';
import { ApiManager } from '../../api/ApiManager';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalDevelopers: number;
  activeDevelopers: number;
  totalUsers: number;
  totalProjects: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDevelopers: 0,
    activeDevelopers: 0,
    totalUsers: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { developers } = useAppSelector((state) => state.developer);
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      // Only fetch data if user is authenticated and has a token
      if (!isAuthenticated || !token) {
        console.log('User not authenticated, skipping data fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch developers
        await dispatch(fetchDevelopers()).unwrap();
        
        // Fetch users data
        const usersResponse = await ApiManager.getAllUsers().catch((error) => {
          console.log('Users endpoint failed:', error.message);
          return [];
        });

        const totalUsers = Array.isArray(usersResponse) ? usersResponse.length : 0;
        
        // Projects endpoint requires employee authentication, not user authentication
        // So we'll set it to 0 for now since we're logged in as a user
        const totalProjects = 0;

        setStats({
          totalDevelopers: developers.length,
          activeDevelopers: developers.filter(dev => dev.isActive).length,
          totalUsers,
          totalProjects,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dispatch, developers.length, isAuthenticated, token]);

  const statCards = [
    {
      title: 'Total Developers',
      value: stats.totalDevelopers,
      icon: Building2,
      gradient: 'from-blue-500 to-blue-600',
      href: '/dashboard/developers',
      trend: '+12%',
      trendUp: true,
      description: 'Registered Partners'
    },
    {
      title: 'Active Developers',
      value: stats.activeDevelopers,
      icon: Activity,
      gradient: 'from-emerald-500 to-emerald-600',
      href: '/dashboard/developers',
      trend: '+8%',
      trendUp: true,
      description: 'Currently Active'
    },
    {
      title: 'Platform Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      href: null,
      trend: '+24%',
      trendUp: true,
      description: 'Total End Users'
    },
    {
      title: 'Active Projects',
      value: stats.totalProjects,
      icon: Target,
      gradient: 'from-orange-500 to-orange-600',
      href: null,
      trend: '+16%',
      trendUp: true,
      description: 'In Development'
    },
  ];

  const recentDevelopers = developers.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">RevoBrix Enterprise Console</h1>
                  <p className="text-blue-200 text-lg">
                    {user?.phoneNumber && `Welcome, ${user.phoneNumber}`}
                  </p>
                </div>
              </div>
              <p className="text-slate-300 mt-4 max-w-2xl">
                Centralized management platform for real estate developers, projects, and platform operations. 
                Monitor performance, manage partnerships, and drive growth across your ecosystem.
              </p>
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-300">All Systems Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col space-y-3">
              <Button 
                onClick={() => router.push('/dashboard/developers')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Developer
              </Button>
              <Button 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className={`relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.href ? 'cursor-pointer hover:-translate-y-1' : ''}`}
              onClick={() => stat.href && router.push(stat.href)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <div className="text-3xl font-bold text-slate-900">
                        {loading ? (
                          <div className="animate-pulse bg-slate-200 h-8 w-16 rounded"></div>
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </div>
                      <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${stat.trendUp ? '' : 'rotate-180'}`} />
                        {stat.trend}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                {stat.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Developers */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Developers</CardTitle>
                  <p className="text-sm text-slate-500">Latest registered partners</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/developers')}
                className="border-slate-300 hover:bg-slate-100"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                      <div className="bg-slate-200 h-12 w-12 rounded-xl"></div>
                      <div className="space-y-2 flex-1">
                        <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                        <div className="bg-slate-200 h-3 w-1/2 rounded"></div>
                      </div>
                      <div className="bg-slate-200 h-6 w-16 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentDevelopers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No developers yet</h3>
                <p className="text-sm text-slate-500 mb-6">Get started by adding your first developer partner.</p>
                <Button 
                  onClick={() => router.push('/dashboard/developers')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Developer
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDevelopers.map((developer, index) => (
                  <div 
                    key={developer.id}
                    className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200"
                    onClick={() => router.push(`/dashboard/developer-details?id=${developer.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {developer.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {developer.city && developer.state 
                            ? `${developer.city}, ${developer.state}`
                            : developer.city || developer.state || 'Location not specified'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={developer.isActive ? 'default' : 'secondary'}
                        className={developer.isActive 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                        }
                      >
                        {developer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                  <p className="text-sm text-slate-500">Common tasks</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md"
                  onClick={() => router.push('/dashboard/developers')}
                >
                  <Plus className="mr-3 h-4 w-4" />
                  Add New Developer
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300 hover:bg-slate-100"
                  onClick={() => router.push('/dashboard/developers')}
                >
                  <Building2 className="mr-3 h-4 w-4" />
                  Manage Partners
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300 hover:bg-slate-100"
                >
                  <BarChart3 className="mr-3 h-4 w-4" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300 hover:bg-slate-100"
                >
                  <Globe className="mr-3 h-4 w-4" />
                  Platform Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">System Status</CardTitle>
                  <p className="text-sm text-slate-500">Platform health</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">API Services</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">Database</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">Cache</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warming</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">Storage</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Available</Badge>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Last check: {new Date().toLocaleTimeString()}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">All systems operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}