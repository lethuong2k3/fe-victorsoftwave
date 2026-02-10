import { getAccessToken } from './auth';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const request = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const accessToken = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error ${response.status}`);
  }
  
  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
      return null as T;
  }

  return response.json();
};

export const api = {
  get: <T = any>(endpoint: string, options: RequestInit = {}) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body: any, options: RequestInit = {}) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body: any, options: RequestInit = {}) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string, options: RequestInit = {}) => request<T>(endpoint, { ...options, method: 'DELETE' }),
  download: async (endpoint: string, options: RequestInit = {}) => {
    const accessToken = getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    };
    const config: RequestInit = { ...options, headers };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    return response.blob();
  },
};
