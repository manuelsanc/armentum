/**
 * API Client Service
 * Centralized HTTP client for all API requests
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

/**
 * Make an API request
 * @param endpoint - API endpoint path (relative to base URL)
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param body - Optional request body
 * @param headers - Optional custom headers
 * @returns Promise with API response
 */
export async function apiCall<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = sessionStorage.getItem("authToken");

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json() as T;

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      data: undefined as unknown as T,
      error: errorMessage,
      status: 500,
    };
  }
}

/**
 * Convenience method for GET requests
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "GET");
}

/**
 * Convenience method for POST requests
 */
export async function apiPost<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "POST", body);
}

/**
 * Convenience method for PUT requests
 */
export async function apiPut<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "PUT", body);
}

/**
 * Convenience method for DELETE requests
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "DELETE");
}
