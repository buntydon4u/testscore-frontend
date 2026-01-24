import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Use the proxy in development, or direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('Mode:', import.meta.env.MODE);

interface ApiResponse<T> {
  message: string;
  data?: T;
}

interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private unwrapResponseData<T>(responseData: any): T {
    if (!responseData || typeof responseData !== 'object') {
      return responseData as T;
    }

    const hasData = Object.prototype.hasOwnProperty.call(responseData, 'data');

    // Check if response has a 'data' property and looks like a wrapped response
    // Common patterns: { success: true, data: [...] }, { message: "...", data: [...] }
    if (hasData && (responseData.success !== undefined || responseData.message !== undefined)) {
      console.log('Unwrapping response data:', responseData);
      return responseData.data as T;
    }

    return responseData as T;
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.error || error.response?.data?.message || 'An error occurred',
          status: error.response?.status || 500,
        };
        throw apiError;
      }
    );
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      console.log(`Making GET request to: ${endpoint}`);
      const response = await this.axiosInstance.get(endpoint);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      const unwrapped = this.unwrapResponseData<T>(response.data);
      console.log('Unwrapped data:', unwrapped);
      return unwrapped;
    } catch (error: any) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.axiosInstance.post(endpoint, data);
    return this.unwrapResponseData<T>(response.data);
  }

  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.axiosInstance.put(endpoint, data);
    return this.unwrapResponseData<T>(response.data);
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.axiosInstance.patch(endpoint, data);
    return this.unwrapResponseData<T>(response.data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete(endpoint);
    return this.unwrapResponseData<T>(response.data);
  }
}

export const apiClient = ApiClient.getInstance();
