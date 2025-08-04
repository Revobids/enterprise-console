'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Home,
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  MapPin,
  Calendar,
  Target,
  Activity,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Mock data for projects since the API requires employee auth
const mockProjects = [
  {
    id: '1',
    name: 'Skyline Towers Phase 1',
    description: 'Luxury residential complex with modern amenities',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'PUBLISHED',
    projectType: 'Residential',
    propertyType: 'Apartment',
    totalUnits: 250,
    expectedCompletionDate: '2025-12-31',
    constructionStartDate: '2023-01-15',
    developerName: 'Premium Developers',
    createdAt: '2023-01-10T00:00:00Z'
  },
  {
    id: '2',
    name: 'Green Valley Villas',
    description: 'Eco-friendly villa community with garden spaces',
    address: '456 Garden Road',
    city: 'Pune',
    state: 'Maharashtra',
    status: 'UNDER_CONSTRUCTION',
    projectType: 'Residential',
    propertyType: 'Villa',
    totalUnits: 85,
    expectedCompletionDate: '2024-08-30',
    constructionStartDate: '2022-06-01',
    developerName: 'EcoHomes Ltd',
    createdAt: '2022-05-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Metro Business Hub',
    description: 'Commercial office complex in business district',
    address: '789 Business District',
    city: 'Bangalore',
    state: 'Karnataka',
    status: 'COMPLETED',
    projectType: 'Commercial',
    propertyType: 'Office',
    totalUnits: 120,
    expectedCompletionDate: '2023-03-31',
    constructionStartDate: '2021-01-15',
    developerName: 'Commercial Builders',
    createdAt: '2020-12-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Oceanview Apartments',
    description: 'Beachside luxury apartments with ocean views',
    address: '321 Coastal Highway',
    city: 'Goa',
    state: 'Goa',
    status: 'DRAFT',
    projectType: 'Residential',
    propertyType: 'Apartment',
    totalUnits: 45,
    expectedCompletionDate: '2026-06-30',
    constructionStartDate: '2024-01-01',
    developerName: 'Coastal Properties',
    createdAt: '2023-11-20T00:00:00Z'
  },
  {
    id: '5',
    name: 'Tech Park Central',
    description: 'Modern IT park with state-of-the-art facilities',
    address: '654 Tech Valley',
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'PUBLISHED',
    projectType: 'Commercial',
    propertyType: 'Office',
    totalUnits: 200,
    expectedCompletionDate: '2025-09-15',
    constructionStartDate: '2023-03-01',
    developerName: 'TechSpace Developers',
    createdAt: '2023-02-10T00:00:00Z'
  }
];

export default function ProjectsList() {
  const router = useRouter();
  const [projects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading] = useState(false);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesType = filterType === 'all' || project.projectType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="mr-1 h-3 w-3" />Published</Badge>;
      case 'UNDER_CONSTRUCTION':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200"><Activity className="mr-1 h-3 w-3" />Under Construction</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200"><Target className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'DRAFT':
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200"><Clock className="mr-1 h-3 w-3" />Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
            <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
    total: projects.length,
    published: projects.filter(p => p.status === 'PUBLISHED').length,
    underConstruction: projects.filter(p => p.status === 'UNDER_CONSTRUCTION').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    totalUnits: projects.reduce((sum, p) => sum + p.totalUnits, 0)
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
              <p className="text-slate-600">Manage and monitor all development projects</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">All projects</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <Home className="h-6 w-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-3xl font-bold text-slate-900">{stats.published}</p>
                <p className="text-xs text-slate-500">Live projects</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-3xl font-bold text-slate-900">{stats.underConstruction}</p>
                <p className="text-xs text-slate-500">Under construction</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                <p className="text-xs text-slate-500">Finished projects</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Units</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUnits.toLocaleString()}</p>
                <p className="text-xs text-slate-500">All properties</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search projects, cities, or developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-[140px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="all">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="UNDER_CONSTRUCTION">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DRAFT">Draft</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-[140px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="all">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Projects Directory</CardTitle>
                <p className="text-sm text-slate-500">
                  {filteredProjects.length} of {projects.length} projects
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' ? 'No matching projects' : 'No projects found'}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Get started by adding your first project.'
                }
              </p>
              {(!searchTerm && filterStatus === 'all' && filterType === 'all') && (
                <Button className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Project</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location</TableHead>
                    <TableHead className="font-semibold text-slate-700">Developer</TableHead>
                    <TableHead className="font-semibold text-slate-700">Type</TableHead>
                    <TableHead className="font-semibold text-slate-700">Units</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Timeline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Home className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 truncate">{project.name}</div>
                            {project.description && (
                              <div className="text-sm text-slate-500 mt-1">
                                {truncateText(project.description, 50)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                          <div>
                            <div>{project.city}, {project.state}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-slate-900 font-medium">{project.developerName}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm">
                          <div className="font-medium text-slate-900">{project.projectType}</div>
                          <div className="text-slate-500">{project.propertyType}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {project.totalUnits.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(project.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Ends {formatDate(project.expectedCompletionDate)}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Started {formatDate(project.constructionStartDate)}
                          </div>
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