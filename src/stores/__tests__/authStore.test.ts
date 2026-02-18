import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAuthStore } from "../authStore";
import * as authService from "../../services/auth";
import type { User, LoginResponse } from "../../types";

vi.mock("../../services/auth", () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  refreshToken: vi.fn(),
  getStoredUser: vi.fn(),
  isAuthenticated: vi.fn(),
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

describe("authStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isInitializing: true,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial state", () => {
    it("has correct initial state", () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isInitializing).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe("login action", () => {
    it("sets isLoading to true when login starts", async () => {
      vi.mocked(authService.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockLoginResponse }), 100))
      );

      const promise = act(async () => {
        return useAuthStore.getState().login("test@example.com", "password");
      });

      expect(useAuthStore.getState().isLoading).toBe(true);

      await promise;
    });

    it("returns true and sets user on successful login", async () => {
      vi.mocked(authService.login).mockResolvedValue({ data: mockLoginResponse });

      const result = await act(async () => {
        return useAuthStore.getState().login("test@example.com", "password");
      });

      expect(result).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().error).toBeNull();
    });

    it("returns false and sets error on failed login", async () => {
      vi.mocked(authService.login).mockResolvedValue({
        error: { message: "Invalid credentials", code: "INVALID_CREDENTIALS" },
      });

      const result = await act(async () => {
        return useAuthStore.getState().login("test@example.com", "wrong");
      });

      expect(result).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().error).toBe("Invalid credentials");
    });

    it("calls authService.login with correct parameters", async () => {
      vi.mocked(authService.login).mockResolvedValue({ data: mockLoginResponse });

      await act(async () => {
        await useAuthStore.getState().login("test@example.com", "password", "admin");
      });

      expect(authService.login).toHaveBeenCalledWith("test@example.com", "password", "admin");
    });

    it("clears error when login starts", async () => {
      useAuthStore.setState({ error: "Previous error" });
      vi.mocked(authService.login).mockResolvedValue({ data: mockLoginResponse });

      await act(async () => {
        await useAuthStore.getState().login("test@example.com", "password");
      });

      expect(useAuthStore.getState().error).toBeNull();
    });

    it("handles unknown error when no data or error returned", async () => {
      vi.mocked(authService.login).mockResolvedValue({});

      const result = await act(async () => {
        return useAuthStore.getState().login("test@example.com", "password");
      });

      expect(result).toBe(false);
      expect(useAuthStore.getState().error).toBe("Unknown error occurred");
    });
  });

  describe("register action", () => {
    it("sets isLoading to true when register starts", async () => {
      vi.mocked(authService.register).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockLoginResponse }), 100))
      );

      const promise = act(async () => {
        return useAuthStore.getState().register("test@example.com", "password123");
      });

      expect(useAuthStore.getState().isLoading).toBe(true);

      await promise;
    });

    it("returns true and sets user on successful register", async () => {
      vi.mocked(authService.register).mockResolvedValue({ data: mockLoginResponse });

      const result = await act(async () => {
        return useAuthStore.getState().register("test@example.com", "password123", "Test Name");
      });

      expect(result).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().error).toBeNull();
    });

    it("returns false and sets error on failed register", async () => {
      vi.mocked(authService.register).mockResolvedValue({
        error: { message: "Email already exists", code: "SERVER_ERROR" },
      });

      const result = await act(async () => {
        return useAuthStore.getState().register("existing@example.com", "password123");
      });

      expect(result).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().error).toBe("Email already exists");
    });

    it("calls authService.register with correct parameters", async () => {
      vi.mocked(authService.register).mockResolvedValue({ data: mockLoginResponse });

      await act(async () => {
        await useAuthStore.getState().register("test@example.com", "password123", "Test Name");
      });

      expect(authService.register).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "Test Name"
      );
    });

    it("handles unknown error when no data or error returned", async () => {
      vi.mocked(authService.register).mockResolvedValue({});

      const result = await act(async () => {
        return useAuthStore.getState().register("test@example.com", "password123");
      });

      expect(result).toBe(false);
      expect(useAuthStore.getState().error).toBe("Unknown error occurred");
    });
  });

  describe("logout action", () => {
    it("clears user and error on logout", () => {
      useAuthStore.setState({
        user: mockUser,
        error: "Some error",
      });

      act(() => {
        useAuthStore.getState().logout();
      });

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().error).toBeNull();
      expect(authService.logout).toHaveBeenCalled();
    });

    it("clears user even when already null", () => {
      act(() => {
        useAuthStore.getState().logout();
      });

      expect(useAuthStore.getState().user).toBeNull();
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe("clearError action", () => {
    it("clears error", () => {
      useAuthStore.setState({ error: "Some error" });

      act(() => {
        useAuthStore.getState().clearError();
      });

      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe("hydrate action", () => {
    it("sets user from stored user when authenticated", async () => {
      vi.mocked(authService.getStoredUser).mockReturnValue(mockUser);
      vi.mocked(authService.isAuthenticated).mockReturnValue(true);

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });

    it("fetches current user when authenticated but no stored user", async () => {
      vi.mocked(authService.getStoredUser).mockReturnValue(null);
      vi.mocked(authService.isAuthenticated).mockReturnValue(true);
      vi.mocked(authService.getCurrentUser).mockResolvedValue({ data: mockUser });

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });

    it("sets user to null when getCurrentUser fails", async () => {
      vi.mocked(authService.getStoredUser).mockReturnValue(null);
      vi.mocked(authService.isAuthenticated).mockReturnValue(true);
      vi.mocked(authService.getCurrentUser).mockResolvedValue({
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      });

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });

    it("sets user to null when not authenticated", async () => {
      vi.mocked(authService.getStoredUser).mockReturnValue(mockUser);
      vi.mocked(authService.isAuthenticated).mockReturnValue(false);

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isInitializing).toBe(false);
    });

    it("sets isInitializing to false when complete", async () => {
      useAuthStore.setState({ isInitializing: true });
      vi.mocked(authService.isAuthenticated).mockReturnValue(false);

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(useAuthStore.getState().isInitializing).toBe(false);
    });
  });

  describe("refreshUser action", () => {
    it("returns true and updates user on success", async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue({ data: mockUser });

      const result = await act(async () => {
        return useAuthStore.getState().refreshUser();
      });

      expect(result).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("returns false when getCurrentUser fails", async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue({
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      });

      const result = await act(async () => {
        return useAuthStore.getState().refreshUser();
      });

      expect(result).toBe(false);
    });
  });

  describe("checkAuth action", () => {
    it("returns true when authenticated", () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(true);

      const result = useAuthStore.getState().checkAuth();

      expect(result).toBe(true);
    });

    it("returns false when not authenticated", () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(false);

      const result = useAuthStore.getState().checkAuth();

      expect(result).toBe(false);
    });
  });
});
