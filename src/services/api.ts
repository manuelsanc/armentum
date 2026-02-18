import type { Tokens } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function getStoredTokens(): Tokens | null {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
}

export function setStoredTokens(tokens: Tokens): void {
  sessionStorage.setItem("accessToken", tokens.accessToken);
  sessionStorage.setItem("refreshToken", tokens.refreshToken);
}

export function clearStoredTokens(): void {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
}

export async function refreshAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens();
  if (!tokens?.refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      clearStoredTokens();
      return null;
    }

    const data = await response.json();
    setStoredTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return data.accessToken;
  } catch {
    clearStoredTokens();
    return null;
  }
}

export async function apiCall<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
  headers?: Record<string, string>,
  skipAuthRefresh = false
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const tokens = getStoredTokens();

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(tokens?.accessToken && { Authorization: `Bearer ${tokens.accessToken}` }),
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && !skipAuthRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(async (token) => {
          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: `Bearer ${token}`,
            },
          });
          const retryData = await retryResponse.json();
          if (!retryResponse.ok) {
            return {
              data: undefined as unknown as T,
              error: retryData.message || "Unauthorized",
              status: retryResponse.status,
            };
          }
          return { data: retryData as T, status: retryResponse.status };
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          processQueue(null, newToken);

          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            return {
              data: undefined as unknown as T,
              error: retryData.message || "Unauthorized",
              status: retryResponse.status,
            };
          }

          return { data: retryData as T, status: retryResponse.status };
        } else {
          processQueue(new Error("Refresh failed"), null);
          clearStoredTokens();
          window.location.href = "/login";
          return { data: undefined as unknown as T, error: "Session expired", status: 401 };
        }
      } finally {
        isRefreshing = false;
      }
    }

    const data = (await response.json()) as T;

    if (!response.ok) {
      return {
        data: undefined as unknown as T,
        error: (data as { message?: string })?.message || response.statusText,
        status: response.status,
      };
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

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "GET");
}

export async function apiPost<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "POST", body);
}

export async function apiPut<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "PUT", body);
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, "DELETE");
}
