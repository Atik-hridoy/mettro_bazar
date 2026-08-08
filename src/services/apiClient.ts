const BASE_URL = 'http://localhost:8000/api';

export interface APIResponse<T> {
  data?: T;
  error?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, config);

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData.detail) {
        errorMessage = errData.detail;
      } else if (typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0];
        if (firstKey && Array.isArray(errData[firstKey])) {
          errorMessage = `${firstKey}: ${errData[firstKey][0]}`;
        }
      }
    } catch {
      // Ignore JSON parse error on non-json error responses
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
