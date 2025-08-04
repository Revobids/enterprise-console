// Base URLs
const isDev = process.env.NODE_ENV === 'development';
export const BASE_URL = isDev 
  ? 'http://localhost:3000/api'
  : 'https://revobricks-backend-core.onrender.com/';

// Admin Authentication Endpoints
export const adminEndpoints = {
  authenticate: `${BASE_URL}/admin/auth/authenticate`,
};

// Real Estate Developer Endpoints
export const developerEndpoints = {
  create: `${BASE_URL}/real-estate-developers`,
  getAll: `${BASE_URL}/real-estate-developers`,
  getById: (id: string) => `${BASE_URL}/real-estate-developers/${id}`,
  update: (id: string) => `${BASE_URL}/real-estate-developers/${id}`,
  delete: (id: string) => `${BASE_URL}/real-estate-developers/${id}`,
};

// Office Endpoints
export const officeEndpoints = {
  create: (developerId: string) => `${BASE_URL}/real-estate-developers/${developerId}/offices`,
  getAll: (developerId: string) => `${BASE_URL}/real-estate-developers/${developerId}/offices`,
  getById: (developerId: string, officeId: string) => `${BASE_URL}/real-estate-developers/${developerId}/offices/${officeId}`,
  update: (developerId: string, officeId: string) => `${BASE_URL}/real-estate-developers/${developerId}/offices/${officeId}`,
  delete: (developerId: string, officeId: string) => `${BASE_URL}/real-estate-developers/${developerId}/offices/${officeId}`,
};

// Project Endpoints
export const projectEndpoints = {
  getAll: `${BASE_URL}/projects`,
  getById: (id: string) => `${BASE_URL}/projects/${id}`,
  create: `${BASE_URL}/projects`,
  update: (id: string) => `${BASE_URL}/projects/${id}`,
  delete: (id: string) => `${BASE_URL}/projects/${id}`,
};

// User Endpoints
export const userEndpoints = {
  getAll: `${BASE_URL}/users`,
  getById: (id: string) => `${BASE_URL}/users/${id}`,
};