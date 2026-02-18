/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiPost } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
  userType: "corista" | "admin";
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    userType: "corista" | "admin";
  };
}

export interface AuthError {
  message: string;
  code: "INVALID_CREDENTIALS" | "SERVER_ERROR" | "NETWORK_ERROR";
}

/**
 * Authenticate user with email and password
 * @param email - User email
 * @param password - User password
 * @param userType - User type (corista or admin)
 * @returns Promise with authentication response
 */
export async function login(
  email: string,
  password: string,
  userType: "corista" | "admin"
): Promise<{ data?: AuthResponse; error?: AuthError }> {
  // Validate inputs
  if (!email || !password) {
    return {
      error: {
        message: "Email and password are required",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  if (!email.includes("@")) {
    return {
      error: {
        message: "Invalid email format",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  try {
    const response = await apiPost<AuthResponse>("/auth/login", {
      email,
      password,
      userType,
    });

    if (response.error) {
      return {
        error: {
          message: response.error,
          code: "SERVER_ERROR",
        },
      };
    }

    // Store token in session storage
    if (response.data?.token) {
      sessionStorage.setItem("authToken", response.data.token);
      sessionStorage.setItem("userType", userType);
      sessionStorage.setItem("userEmail", email);
    }

    return { data: response.data };
  } catch (error) {
    return {
      error: {
        message: "Network error. Please try again.",
        code: "NETWORK_ERROR",
      },
    };
  }
}

/**
 * Log out current user
 */
export function logout(): void {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userType");
  sessionStorage.removeItem("userEmail");
}

/**
 * Get current user from session storage
 */
export function getCurrentUser(): { email: string; userType: "corista" | "admin" } | null {
  const email = sessionStorage.getItem("userEmail");
  const userType = sessionStorage.getItem("userType") as "corista" | "admin";

  if (!email || !userType) {
    return null;
  }

  return { email, userType };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem("authToken");
}
