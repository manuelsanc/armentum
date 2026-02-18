import type { User, LoginResponse, RegisterRequest } from "../types";
import { apiPost, apiGet, setStoredTokens, clearStoredTokens, getStoredTokens } from "./api";

export interface AuthError {
  message: string;
  code: "INVALID_CREDENTIALS" | "SERVER_ERROR" | "NETWORK_ERROR" | "UNAUTHORIZED";
}

export interface LoginResult {
  data?: LoginResponse;
  error?: AuthError;
}

export interface RegisterResult {
  data?: LoginResponse;
  error?: AuthError;
}

export interface UserResult {
  data?: User;
  error?: AuthError;
}

export async function login(
  email: string,
  password: string,
  userType?: "corista" | "admin"
): Promise<LoginResult> {
  if (!email || !password) {
    return {
      error: {
        message: "Email y contraseña son requeridos",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  if (!email.includes("@")) {
    return {
      error: {
        message: "Formato de email inválido",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  const response = await apiPost<LoginResponse>("/auth/login", {
    email,
    password,
    userType,
  });

  if (response.error) {
    return {
      error: {
        message: response.error,
        code: response.status === 401 ? "INVALID_CREDENTIALS" : "SERVER_ERROR",
      },
    };
  }

  if (response.data) {
    setStoredTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return { data: response.data };
}

export async function register(
  email: string,
  password: string,
  nombre?: string
): Promise<RegisterResult> {
  if (!email || !password) {
    return {
      error: {
        message: "Email y contraseña son requeridos",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  if (!email.includes("@")) {
    return {
      error: {
        message: "Formato de email inválido",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  if (password.length < 8) {
    return {
      error: {
        message: "La contraseña debe tener al menos 8 caracteres",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  const registerData: RegisterRequest = { email, password, nombre };
  const response = await apiPost<LoginResponse>("/auth/register", registerData);

  if (response.error) {
    return {
      error: {
        message: response.error,
        code: "SERVER_ERROR",
      },
    };
  }

  if (response.data) {
    setStoredTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return { data: response.data };
}

export function logout(): void {
  clearStoredTokens();
}

export async function getCurrentUser(): Promise<UserResult> {
  const tokens = getStoredTokens();
  if (!tokens) {
    return {
      error: {
        message: "No authenticated",
        code: "UNAUTHORIZED",
      },
    };
  }

  const response = await apiGet<User>("/auth/me");

  if (response.error) {
    return {
      error: {
        message: response.error,
        code: response.status === 401 ? "UNAUTHORIZED" : "SERVER_ERROR",
      },
    };
  }

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return { data: response.data };
}

export async function refreshToken(): Promise<{ success: boolean; error?: AuthError }> {
  const tokens = getStoredTokens();
  if (!tokens?.refreshToken) {
    return {
      success: false,
      error: {
        message: "No refresh token available",
        code: "UNAUTHORIZED",
      },
    };
  }

  const response = await apiPost<{ accessToken: string; refreshToken: string }>(
    "/auth/refresh",
    { refreshToken: tokens.refreshToken }
  );

  if (response.error || !response.data) {
    clearStoredTokens();
    return {
      success: false,
      error: {
        message: response.error || "Refresh failed",
        code: "UNAUTHORIZED",
      },
    };
  }

  setStoredTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  });

  return { success: true };
}

export function getStoredUser(): User | null {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getStoredTokens()?.accessToken;
}
