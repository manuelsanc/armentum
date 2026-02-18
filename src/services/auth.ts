import type { User, LoginResponse, RegisterRequest } from "../types";
import { apiPost, apiGet, setStoredTokens, clearStoredTokens, getStoredTokens } from "./api";

// Backend response format (different from frontend User type)
interface BackendUser {
  id: string;
  email: string;
  nombre?: string;
  roles?: string[];
  is_active?: boolean;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface BackendLoginResponse {
  user: BackendUser;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Map backend user to frontend User type
function mapBackendUserToUser(backendUser: BackendUser): User {
  // Determine userType from roles array
  let userType: "admin" | "corista" | "public" = "public";
  if (backendUser.roles && backendUser.roles.length > 0) {
    if (backendUser.roles.includes("admin") || backendUser.roles.includes("director")) {
      userType = "admin";
    } else if (backendUser.roles.includes("corista")) {
      userType = "corista";
    }
  }

  return {
    id: backendUser.id,
    email: backendUser.email,
    nombre: backendUser.nombre,
    userType,
    createdAt: backendUser.created_at || new Date().toISOString(),
    updatedAt: backendUser.updated_at || new Date().toISOString(),
  };
}

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

  const response = await apiPost<BackendLoginResponse>("/auth/login", {
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
    const mappedUser = mapBackendUserToUser(response.data.user);
    setStoredTokens({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
    sessionStorage.setItem("user", JSON.stringify(mappedUser));

    return {
      data: {
        user: mappedUser,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
    };
  }

  return { error: { message: "Unknown error", code: "SERVER_ERROR" } };
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
  const response = await apiPost<BackendLoginResponse>("/auth/register", registerData);

  if (response.error) {
    return {
      error: {
        message: response.error,
        code: "SERVER_ERROR",
      },
    };
  }

  if (response.data) {
    const mappedUser = mapBackendUserToUser(response.data.user);
    setStoredTokens({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
    sessionStorage.setItem("user", JSON.stringify(mappedUser));

    return {
      data: {
        user: mappedUser,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
    };
  }

  return { error: { message: "Unknown error", code: "SERVER_ERROR" } };
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

  const response = await apiGet<BackendUser>("/auth/me");

  if (response.error) {
    return {
      error: {
        message: response.error,
        code: response.status === 401 ? "UNAUTHORIZED" : "SERVER_ERROR",
      },
    };
  }

  if (response.data) {
    const mappedUser = mapBackendUserToUser(response.data);
    sessionStorage.setItem("user", JSON.stringify(mappedUser));
    return { data: mappedUser };
  }

  return { error: { message: "Unknown error", code: "SERVER_ERROR" } };
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

  const response = await apiPost<{ access_token: string; refresh_token: string }>("/auth/refresh", {
    refreshToken: tokens.refreshToken,
  });

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
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
  });

  return { success: true };
}

export function getStoredUser(): User | null {
  const userJson = sessionStorage.getItem("user");
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
