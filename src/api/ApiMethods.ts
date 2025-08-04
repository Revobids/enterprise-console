import { adminEndpoints, developerEndpoints, officeEndpoints, projectEndpoints, userEndpoints } from './endpoints';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
}

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    console.log('Getting token from localStorage:', token ? `Token found (${token.substring(0, 20)}...)` : 'No token found');
    return token;
  }
  return null;
};

// Save token to localStorage
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
    console.log('Token saved to localStorage:', `${token.substring(0, 20)}...`);
  }
};

// Remove token from localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
};

// Create request options with authentication
const createRequestOptions = (method: string, body?: any, requireAuth: boolean = true): RequestOptions => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('⚠️ No token available for authorization');
    }
  }

  const options: RequestOptions = {
    method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Generic request handler
const makeRequest = async <T>(url: string, options: RequestOptions): Promise<T> => {
  try {
    console.log('Making request to:', url, 'with options:', {
      method: options.method,
      hasAuth: !!options.headers['Authorization'],
    });

    const response = await fetch(url, options);

    if (response.status === 401) {
      console.log('Unauthorized response, removing token and redirecting');
      // removeToken();
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login';
      // }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Request successful:', url);
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// Admin Authentication
export const adminAuthApi = {
  authenticate: async (idToken: string) => {
    const options = createRequestOptions('POST', { idToken }, false);
    return makeRequest(adminEndpoints.authenticate, options);
  },
};

// Real Estate Developer API
export const developerApi = {
  create: async (developerData: any) => {
    const options = createRequestOptions('POST', developerData);
    return makeRequest(developerEndpoints.create, options);
  },

  getAll: async () => {
    const options = createRequestOptions('GET');
    return makeRequest(developerEndpoints.getAll, options);
  },

  getById: async (id: string) => {
    const options = createRequestOptions('GET');
    return makeRequest(developerEndpoints.getById(id), options);
  },

  update: async (id: string, developerData: any) => {
    const options = createRequestOptions('PUT', developerData);
    return makeRequest(developerEndpoints.update(id), options);
  },

  delete: async (id: string) => {
    const options = createRequestOptions('DELETE');
    return makeRequest(developerEndpoints.delete(id), options);
  },
};

// Office API
export const officeApi = {
  create: async (developerId: string, officeData: any) => {
    const options = createRequestOptions('POST', officeData);
    return makeRequest(officeEndpoints.create(developerId), options);
  },

  getAll: async (developerId: string) => {
    const options = createRequestOptions('GET');
    return makeRequest(officeEndpoints.getAll(developerId), options);
  },

  getById: async (developerId: string, officeId: string) => {
    const options = createRequestOptions('GET');
    return makeRequest(officeEndpoints.getById(developerId, officeId), options);
  },

  update: async (developerId: string, officeId: string, officeData: any) => {
    const options = createRequestOptions('PUT', officeData);
    return makeRequest(officeEndpoints.update(developerId, officeId), options);
  },

  delete: async (developerId: string, officeId: string) => {
    const options = createRequestOptions('DELETE');
    return makeRequest(officeEndpoints.delete(developerId, officeId), options);
  },
};

// Project API
export const projectApi = {
  getAll: async () => {
    const options = createRequestOptions('GET');
    return makeRequest(projectEndpoints.getAll, options);
  },

  getById: async (id: string) => {
    const options = createRequestOptions('GET');
    return makeRequest(projectEndpoints.getById(id), options);
  },

  create: async (projectData: any) => {
    const options = createRequestOptions('POST', projectData);
    return makeRequest(projectEndpoints.create, options);
  },

  update: async (id: string, projectData: any) => {
    const options = createRequestOptions('PUT', projectData);
    return makeRequest(projectEndpoints.update(id), options);
  },

  delete: async (id: string) => {
    const options = createRequestOptions('DELETE');
    return makeRequest(projectEndpoints.delete(id), options);
  },
};

// User API
export const userApi = {
  getAll: async () => {
    const options = createRequestOptions('GET');
    return makeRequest(userEndpoints.getAll, options);
  },

  getById: async (id: string) => {
    const options = createRequestOptions('GET');
    return makeRequest(userEndpoints.getById(id), options);
  },
};