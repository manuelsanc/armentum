import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as authService from "../auth";
import * as api from "../api";
import type { LoginResponse, User } from "../../types";

vi.mock("../api", () => ({
  apiPost: vi.fn(),
  apiGet: vi.fn(),
  setStoredTokens: vi.fn(),
  clearStoredTokens: vi.fn(),
  getStoredTokens: vi.fn(),
}));

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  nombre: "Test User",
  userType: "corista",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockLoginResponse: LoginResponse = {
  user: mockUser,
  accessToken: "test-access-token",
  refreshToken: "test-refresh-token",
};

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("returns error when email is empty", async () => {
      const result = await authService.login("", "password");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Email y contraseña son requeridos");
    });

    it("returns error when password is empty", async () => {
      const result = await authService.login("test@example.com", "");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Email y contraseña son requeridos");
    });

    it("returns error when email format is invalid", async () => {
      const result = await authService.login("invalid-email", "password");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Formato de email inválido");
    });

    it("calls apiPost with correct parameters", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({ data: mockLoginResponse, status: 200 });

      await authService.login("test@example.com", "password", "admin");

      expect(api.apiPost).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password",
        userType: "admin",
      });
    });

    it("stores tokens and user on successful login", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({ data: mockLoginResponse, status: 200 });

      const result = await authService.login("test@example.com", "password");

      expect(result.data).toEqual(mockLoginResponse);
      expect(api.setStoredTokens).toHaveBeenCalledWith({
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      });
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    });

    it("returns error with INVALID_CREDENTIALS on 401 response", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({
        error: "Unauthorized",
        status: 401,
      });

      const result = await authService.login("test@example.com", "wrong");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Unauthorized");
    });

    it("returns error with SERVER_ERROR on non-401 error", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({
        error: "Internal Server Error",
        status: 500,
      });

      const result = await authService.login("test@example.com", "password");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("SERVER_ERROR");
      expect(result.error?.message).toBe("Internal Server Error");
    });
  });

  describe("register", () => {
    it("returns error when email is empty", async () => {
      const result = await authService.register("", "password123");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Email y contraseña son requeridos");
    });

    it("returns error when password is empty", async () => {
      const result = await authService.register("test@example.com", "");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Email y contraseña son requeridos");
    });

    it("returns error when email format is invalid", async () => {
      const result = await authService.register("invalid-email", "password123");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("Formato de email inválido");
    });

    it("returns error when password is less than 8 characters", async () => {
      const result = await authService.register("test@example.com", "short");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
      expect(result.error?.message).toBe("La contraseña debe tener al menos 8 caracteres");
    });

    it("calls apiPost with correct parameters", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({ data: mockLoginResponse, status: 200 });

      await authService.register("test@example.com", "password123", "Test Name");

      expect(api.apiPost).toHaveBeenCalledWith("/auth/register", {
        email: "test@example.com",
        password: "password123",
        nombre: "Test Name",
      });
    });

    it("stores tokens and user on successful register", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({ data: mockLoginResponse, status: 200 });

      const result = await authService.register("test@example.com", "password123");

      expect(result.data).toEqual(mockLoginResponse);
      expect(api.setStoredTokens).toHaveBeenCalledWith({
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      });
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    });

    it("returns SERVER_ERROR on failed register", async () => {
      vi.mocked(api.apiPost).mockResolvedValue({
        error: "Email already exists",
        status: 400,
      });

      const result = await authService.register("existing@example.com", "password123");

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("SERVER_ERROR");
      expect(result.error?.message).toBe("Email already exists");
    });
  });

  describe("logout", () => {
    it("calls clearStoredTokens", () => {
      authService.logout();

      expect(api.clearStoredTokens).toHaveBeenCalled();
    });
  });

  describe("getCurrentUser", () => {
    it("returns UNAUTHORIZED error when no tokens", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue(null);

      const result = await authService.getCurrentUser();

      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("UNAUTHORIZED");
      expect(result.error?.message).toBe("No authenticated");
    });

    it("calls apiGet with correct endpoint", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "token",
        refreshToken: "refresh",
      });
      vi.mocked(api.apiGet).mockResolvedValue({ data: mockUser, status: 200 });

      await authService.getCurrentUser();

      expect(api.apiGet).toHaveBeenCalledWith("/auth/me");
    });

    it("stores user in localStorage on success", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "token",
        refreshToken: "refresh",
      });
      vi.mocked(api.apiGet).mockResolvedValue({ data: mockUser, status: 200 });

      const result = await authService.getCurrentUser();

      expect(result.data).toEqual(mockUser);
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    });

    it("returns UNAUTHORIZED error on 401 response", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "token",
        refreshToken: "refresh",
      });
      vi.mocked(api.apiGet).mockResolvedValue({
        error: "Unauthorized",
        status: 401,
      });

      const result = await authService.getCurrentUser();

      expect(result.error?.code).toBe("UNAUTHORIZED");
    });

    it("returns SERVER_ERROR on non-401 error", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "token",
        refreshToken: "refresh",
      });
      vi.mocked(api.apiGet).mockResolvedValue({
        error: "Server Error",
        status: 500,
      });

      const result = await authService.getCurrentUser();

      expect(result.error?.code).toBe("SERVER_ERROR");
    });
  });

  describe("refreshToken", () => {
    it("returns failure when no refresh token", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue(null);

      const result = await authService.refreshToken();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("UNAUTHORIZED");
      expect(result.error?.message).toBe("No refresh token available");
    });

    it("calls apiPost with correct parameters", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "old-access",
        refreshToken: "old-refresh",
      });
      vi.mocked(api.apiPost).mockResolvedValue({
        data: { accessToken: "new-access", refreshToken: "new-refresh" },
        status: 200,
      });

      await authService.refreshToken();

      expect(api.apiPost).toHaveBeenCalledWith("/auth/refresh", {
        refreshToken: "old-refresh",
      });
    });

    it("stores new tokens on success", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "old-access",
        refreshToken: "old-refresh",
      });
      vi.mocked(api.apiPost).mockResolvedValue({
        data: { accessToken: "new-access", refreshToken: "new-refresh" },
        status: 200,
      });

      const result = await authService.refreshToken();

      expect(result.success).toBe(true);
      expect(api.setStoredTokens).toHaveBeenCalledWith({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      });
    });

    it("clears tokens and returns failure on error", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "old-access",
        refreshToken: "old-refresh",
      });
      vi.mocked(api.apiPost).mockResolvedValue({
        error: "Invalid refresh token",
        status: 401,
      });

      const result = await authService.refreshToken();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("UNAUTHORIZED");
      expect(api.clearStoredTokens).toHaveBeenCalled();
    });

    it("clears tokens when no data returned", async () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "old-access",
        refreshToken: "old-refresh",
      });
      vi.mocked(api.apiPost).mockResolvedValue({ status: 200 });

      const result = await authService.refreshToken();

      expect(result.success).toBe(false);
      expect(api.clearStoredTokens).toHaveBeenCalled();
    });
  });

  describe("getStoredUser", () => {
    it("returns null when no user in localStorage", () => {
      const result = authService.getStoredUser();

      expect(result).toBeNull();
    });

    it("returns parsed user from localStorage", () => {
      localStorage.setItem("user", JSON.stringify(mockUser));

      const result = authService.getStoredUser();

      expect(result).toEqual(mockUser);
    });

    it("returns null when JSON is invalid", () => {
      localStorage.setItem("user", "invalid-json");

      const result = authService.getStoredUser();

      expect(result).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns false when no tokens", () => {
      vi.mocked(api.getStoredTokens).mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it("returns true when access token exists", () => {
      vi.mocked(api.getStoredTokens).mockReturnValue({
        accessToken: "token",
        refreshToken: "refresh",
      });

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });
  });
});
