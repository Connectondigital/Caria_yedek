/**
 * HTTP client with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AppError } from '../admin/domain/types/Common';

const API_BASE_URL = 'http://localhost:5001';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('admin_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - normalize errors
    this.client.interceptors.response.use(
      (response) => {
        // Log responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[HTTP] Response from ${response.config.url}`, response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        const normalizedError = this.normalizeError(error);
        
        // Log errors
        console.error('[HTTP] Error:', normalizedError);
        
        // Handle 401 - redirect to login
        if (normalizedError.statusCode === 401) {
          localStorage.removeItem('admin_token');
          window.location.href = '/connect-admin#login';
        }
        
        return Promise.reject(normalizedError);
      }
    );
  }

  private normalizeError(error: AxiosError): AppError {
    if (error.response) {
      // Server responded with error
      return {
        message: (error.response.data as any)?.message || error.message || 'Server error',
        statusCode: error.response.status,
        code: (error.response.data as any)?.code || 'SERVER_ERROR',
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
        statusCode: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  // Convenience methods
  public async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
export default httpClient;
