// Firebase Authentication Types
export interface FirebaseAuthDto {
  idToken: string;
  deviceInfo?: {
    userAgent: string;
  };
}

// Admin Authentication Types
export interface AdminAuthResponse {
  success: boolean;
  token: string;
  admin: {
    id: string;
    phoneNumber: string;
    isAdmin: boolean;
    firebaseUid: string;
    authProvider: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// User Types
export interface User {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  authProvider: 'phone' | 'google';
  firebaseUid: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Real Estate Developer Types
export interface RealEstateDeveloper {
  id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  offices?: Office[];
  projects?: Project[];
}

export interface CreateDeveloperDto {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  // Owner information - required fields
  ownerName: string;
  ownerUsername: string;
  ownerPassword: string;
  ownerEmail: string;
}

// Office Types
export interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  isHeadOffice: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  realEstateDeveloperId: string;
  realEstateDeveloper?: RealEstateDeveloper;
}

export interface CreateOfficeDto {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  isHeadOffice?: boolean;
}

// Project Types
export enum ProjectStatus {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
}

export enum ProjectType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  MIXED_USE = 'MIXED_USE',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  OFFICE = 'OFFICE',
  RETAIL = 'RETAIL',
  WAREHOUSE = 'WAREHOUSE',
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  propertyType: PropertyType;
  status: ProjectStatus;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  startingPrice?: number;
  endingPrice?: number;
  totalUnits?: number;
  availableUnits?: number;
  amenities?: string[];
  images?: string[];
  brochureUrl?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  launchDate?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  realEstateDeveloperId: string;
  realEstateDeveloper?: RealEstateDeveloper;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  type: ProjectType;
  propertyType: PropertyType;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  startingPrice?: number;
  endingPrice?: number;
  totalUnits?: number;
  availableUnits?: number;
  amenities?: string[];
  images?: string[];
  brochureUrl?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  launchDate?: string;
  completionDate?: string;
  realEstateDeveloperId: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}