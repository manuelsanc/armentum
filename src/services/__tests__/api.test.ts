import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
  refreshAccessToken,
} from "../api";

const API_BASE_URL = "http://localhost:3000/api";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("api service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getStoredTokens", () => {
    it("returns null when no tokens stored", () => {
      const result = getStoredTokens();

      expect(result).toBeNull();
    });

    it("returns tokens when both are stored", () => {
      localStorage.setItem("accessToken", "access-token");
      localStorage.setItem("refreshToken", "refresh-token");

      const result = getStoredTokens();

      expect(result).toEqual({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("returns null when only access token is stored", () => {
      localStorage.setItem("accessToken", "access-token");

      const result = getStoredTokens();

      expect(result).toBeNull();
    });

    it("returns null when only refresh token is stored", () => {
      localStorage.setItem("refreshToken", "refresh-token");

      const result = getStoredTokens();

      expect(result).toBeNull();
    });
  });

  describe("setStoredTokens", () => {
    it("stores both tokens in localStorage", () => {
      setStoredTokens({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      });

      expect(localStorage.getItem("accessToken")).toBe("new-access");
      expect(localStorage.getItem("refreshToken")).toBe("new-refresh");
    });
  });

  describe("clearStoredTokens", () => {
    it("removes all auth data from localStorage", () => {
      localStorage.setItem("accessToken", "token");
      localStorage.setItem("refreshToken", "refresh");
      localStorage.setItem("user", JSON.stringify({ id: "1" }));

      clearStoredTokens();

      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("refreshAccessToken", () => {
    it("returns null when no refresh token", async () => {
      const result = await refreshAccessToken();

      expect(result).toBeNull();
    });

    it("calls refresh endpoint with refresh token", async () => {
      localStorage.setItem("accessToken", "old-access");
      localStorage.setItem("refreshToken", "old-refresh");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ accessToken: "new-access", refreshToken: "new-refresh" }),
      });

      await refreshAccessToken();

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: "old-refresh" }),
      });
    });

    it("stores new tokens and returns access token on success", async () => {
      localStorage.setItem("accessToken", "old-access");
      localStorage.setItem("refreshToken", "old-refresh");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ accessToken: "new-access", refreshToken: "new-refresh" }),
      });

      const result = await refreshAccessToken();

      expect(result).toBe("new-access");
      expect(localStorage.getItem("accessToken")).toBe("new-access");
      expect(localStorage.getItem("refreshToken")).toBe("new-refresh");
    });

    it("clears tokens and returns null on failure", async () => {
      localStorage.setItem("accessToken", "old-access");
      localStorage.setItem("refreshToken", "old-refresh");

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });

    it("clears tokens and returns null on network error", async () => {
      localStorage.setItem("accessToken", "old-access");
      localStorage.setItem("refreshToken", "old-refresh");

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(localStorage.getItem("accessToken")).toBeNull();
    });
  });

  describe("apiCall", () => {
    it("makes GET request without body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", name: "Test" }),
      });

      const result = await apiCall<{ id: string; name: string }>("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result.data).toEqual({ id: "1", name: "Test" });
      expect(result.status).toBe(200);
    });

    it("makes POST request with body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: "1", created: true }),
      });

      const result = await apiCall<{ id: string; created: boolean }>(
        "/test",
        "POST",
        { name: "Test" }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "Test" }),
        })
      );
      expect(result.data).toEqual({ id: "1", created: true });
    });

    it("includes authorization header when tokens exist", async () => {
      localStorage.setItem("accessToken", "my-token");
      localStorage.setItem("refreshToken", "my-refresh");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiCall("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        })
      );
    });

    it("returns error on failed request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({ message: "Invalid data" }),
      });

      const result = await apiCall("/test");

      expect(result.error).toBe("Invalid data");
      expect(result.status).toBe(400);
    });

    it("returns statusText as error when no message in response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.resolve({}),
      });

      const result = await apiCall("/test");

      expect(result.error).toBe("Internal Server Error");
      expect(result.status).toBe(500);
    });

    it("returns network error message on fetch failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network failed"));

      const result = await apiCall("/test");

      expect(result.error).toBe("Network failed");
      expect(result.status).toBe(500);
    });

    it("returns unknown error on non-Error rejection", async () => {
      mockFetch.mockRejectedValueOnce("Unknown");

      const result = await apiCall("/test");

      expect(result.error).toBe("Unknown error");
      expect(result.status).toBe(500);
    });
  });

  describe("401 response and token refresh", () => {
    beforeEach(() => {
      localStorage.setItem("accessToken", "expired-token");
      localStorage.setItem("refreshToken", "valid-refresh");
    });

    it("attempts token refresh on 401 response", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Token expired" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ accessToken: "new-token", refreshToken: "new-refresh" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ id: "1" }),
        });

      const result = await apiCall("/protected");

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(1, `${API_BASE_URL}/protected`, expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(2, `${API_BASE_URL}/auth/refresh`, expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(3, `${API_BASE_URL}/protected`, expect.any(Object));
      expect(result.data).toEqual({ id: "1" });
    });

    it("retries request with new token after refresh", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Unauthorized" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ accessToken: "new-token", refreshToken: "new-refresh" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        });

      await apiCall("/protected");

      const lastCall = mockFetch.mock.calls[2];
      expect(lastCall[1].headers).toMatchObject({
        Authorization: "Bearer new-token",
      });
    });

    it("redirects to login on refresh failure", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Unauthorized" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      const result = await apiCall("/protected");

      expect(result.error).toBe("Session expired");
      expect(result.status).toBe(401);
      expect(window.location.href).toBe("/login");
    });

    it("clears tokens on refresh failure", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Unauthorized" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      await apiCall("/protected");

      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });

    it("skips refresh when skipAuthRefresh is true", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized" }),
      });

      const result = await apiCall("/auth/refresh", "POST", { refreshToken: "token" }, {}, true);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.error).toBe("Unauthorized");
      expect(result.status).toBe(401);
    });
  });

  describe("concurrent requests during refresh", () => {
    beforeEach(() => {
      localStorage.setItem("accessToken", "expired-token");
      localStorage.setItem("refreshToken", "valid-refresh");
    });

    it("queues concurrent requests during refresh", async () => {
      let refreshResolve: (value: unknown) => void;
      const refreshPromise = new Promise((resolve) => {
        refreshResolve = resolve;
      });

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Unauthorized" }),
        })
        .mockImplementationOnce(() => refreshPromise.then(() => ({
          ok: true,
          json: () => Promise.resolve({ accessToken: "new-token", refreshToken: "new-refresh" }),
        })))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ id: "1" }),
        });

      const request1 = apiCall("/protected1");
      const request2 = apiCall("/protected2");

      refreshResolve!({ ok: true, json: () => Promise.resolve({ accessToken: "new-token", refreshToken: "new-refresh" }) });

      const results = await Promise.all([request1, request2]);

      expect(results[0].status).toBe(200);
    });
  });

  describe("convenience methods", () => {
    it("apiGet calls apiCall with GET method", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "test" }),
      });

      const result = await apiGet("/users");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "GET" })
      );
      expect(result.data).toEqual({ data: "test" });
    });

    it("apiPost calls apiCall with POST method and body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ created: true }),
      });

      const result = await apiPost("/users", { name: "Test" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "Test" }),
        })
      );
      expect(result.data).toEqual({ created: true });
    });

    it("apiPut calls apiCall with PUT method and body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ updated: true }),
      });

      const result = await apiPut("/users/1", { name: "Updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ name: "Updated" }),
        })
      );
      expect(result.data).toEqual({ updated: true });
    });

    it("apiDelete calls apiCall with DELETE method", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ deleted: true }),
      });

      const result = await apiDelete("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "DELETE" })
      );
      expect(result.data).toEqual({ deleted: true });
    });
  });
});
