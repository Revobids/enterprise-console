import { auth } from '../config/firebase.config';
import { adminAuthApi, developerApi, officeApi, projectApi, userApi, saveToken, removeToken } from './ApiMethods';

export class ApiManager {
  // Admin Authentication with Firebase
  static async authenticateWithFirebase(authData: { idToken: string; deviceInfo?: any }) {
    try {
      console.log('🔐 Calling backend authentication API...');
      const response = await adminAuthApi.authenticate(authData.idToken);
      console.log('🔐 Backend response:', { 
        success: response.success, 
        hasToken: !!response.token,
        hasAdmin: !!response.admin 
      });
      
      if (response.token) {
        console.log('💾 Saving token to localStorage...');
        saveToken(response.token);
        console.log('✅ Token saved successfully');
      } else {
        console.error('❌ No token in response!', response);
      }
      return response;
    } catch (error) {
      console.error('Admin authentication failed:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await auth.signOut();
      removeToken();
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Real Estate Developer Management
  static async createDeveloper(developerData: any) {
    try {
      return await developerApi.create(developerData);
    } catch (error) {
      console.error('Create developer failed:', error);
      throw error;
    }
  }

  static async getAllDevelopers() {
    try {
      return await developerApi.getAll();
    } catch (error) {
      console.error('Get all developers failed:', error);
      throw error;
    }
  }

  static async getDeveloperById(id: string) {
    try {
      return await developerApi.getById(id);
    } catch (error) {
      console.error('Get developer by ID failed:', error);
      throw error;
    }
  }

  static async updateDeveloper(id: string, developerData: any) {
    try {
      return await developerApi.update(id, developerData);
    } catch (error) {
      console.error('Update developer failed:', error);
      throw error;
    }
  }

  static async deleteDeveloper(id: string) {
    try {
      return await developerApi.delete(id);
    } catch (error) {
      console.error('Delete developer failed:', error);
      throw error;
    }
  }

  // Office Management
  static async createOffice(developerId: string, officeData: any) {
    try {
      return await officeApi.create(developerId, officeData);
    } catch (error) {
      console.error('Create office failed:', error);
      throw error;
    }
  }

  static async getAllOffices(developerId: string) {
    try {
      return await officeApi.getAll(developerId);
    } catch (error) {
      console.error('Get all offices failed:', error);
      throw error;
    }
  }

  static async getOfficeById(developerId: string, officeId: string) {
    try {
      return await officeApi.getById(developerId, officeId);
    } catch (error) {
      console.error('Get office by ID failed:', error);
      throw error;
    }
  }

  static async updateOffice(developerId: string, officeId: string, officeData: any) {
    try {
      return await officeApi.update(developerId, officeId, officeData);
    } catch (error) {
      console.error('Update office failed:', error);
      throw error;
    }
  }

  static async deleteOffice(developerId: string, officeId: string) {
    try {
      return await officeApi.delete(developerId, officeId);
    } catch (error) {
      console.error('Delete office failed:', error);
      throw error;
    }
  }

  // Project Management
  static async getAllProjects() {
    try {
      return await projectApi.getAll();
    } catch (error) {
      console.error('Get all projects failed:', error);
      throw error;
    }
  }

  static async getProjectById(id: string) {
    try {
      return await projectApi.getById(id);
    } catch (error) {
      console.error('Get project by ID failed:', error);
      throw error;
    }
  }

  static async createProject(projectData: any) {
    try {
      return await projectApi.create(projectData);
    } catch (error) {
      console.error('Create project failed:', error);
      throw error;
    }
  }

  static async updateProject(id: string, projectData: any) {
    try {
      return await projectApi.update(id, projectData);
    } catch (error) {
      console.error('Update project failed:', error);
      throw error;
    }
  }

  static async deleteProject(id: string) {
    try {
      return await projectApi.delete(id);
    } catch (error) {
      console.error('Delete project failed:', error);
      throw error;
    }
  }

  // User Management
  static async getAllUsers() {
    try {
      return await userApi.getAll();
    } catch (error) {
      console.error('Get all users failed:', error);
      throw error;
    }
  }

  static async getUserById(id: string) {
    try {
      return await userApi.getById(id);
    } catch (error) {
      console.error('Get user by ID failed:', error);
      throw error;
    }
  }
}