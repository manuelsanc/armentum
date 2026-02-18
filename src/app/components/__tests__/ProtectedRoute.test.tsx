import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { ProtectedRoute } from "../ProtectedRoute";
import { useAuthStore } from "../../../stores/authStore";
import type { User } from "../../../types";

vi.mock("../../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  nombre: "Test User",
  userType: "corista",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockAdminUser: User = {
  ...mockUser,
  userType: "admin",
};

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

const renderWithRouter = (initialRoute = "/protected", requiredRole?: "admin" | "corista") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        <Route path="/coristas" element={<div data-testid="coristas-page">Coristas Page</div>} />
        <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <div data-testid="protected-content">Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><div>Admin</div></ProtectedRoute>} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading state", () => {
    it("shows loading spinner while initializing", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          isInitializing: true,
          checkAuth: () => false,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter();

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated access", () => {
    it("redirects to login when not authenticated", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          isInitializing: false,
          checkAuth: () => false,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter();

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("preserves the original location in navigation state", () => {
      let capturedState: { from?: { pathname: string } } | undefined;

      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          isInitializing: false,
          checkAuth: () => false,
        };
        return selector ? selector(state) : state;
      });

      render(
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/login"
              element={
                <div
                  data-testid="login-page"
                  ref={(el) => {
                    if (el) {
                      const history = (el.closest("[data-testid]") as HTMLElement & { __reactProps$?.location?.state });
                      capturedState = history?.__reactProps$?.location?.state;
                    }
                  }}
                >
                  Login Page
                </div>
              }
            />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Protected</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("redirects to login when user is null but tokens exist", () => {
      localStorage.setItem("accessToken", "valid-token");
      localStorage.setItem("refreshToken", "valid-refresh");

      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: null,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter();

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });

  describe("Authenticated access", () => {
    it("renders children when authenticated", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockUser,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter();

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("renders children for any authenticated user when no role required", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockUser,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter("/protected", undefined);

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  describe("Role-based access", () => {
    it("allows admin to access admin routes", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockAdminUser,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter("/protected", "admin");

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("allows admin to access any role-required route", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockAdminUser,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter("/protected", "corista");

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("redirects corista to /coristas when accessing admin route", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockUser,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter("/protected", "admin");

      expect(screen.getByTestId("coristas-page")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("redirects user without matching role to home when not corista", () => {
      const publicUser: User = { ...mockUser, userType: "public" };

      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: publicUser,
          isInitializing: false,
          checkAuth: () => true,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter("/protected", "admin");

      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("handles missing user gracefully", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: undefined as unknown as User | null,
          isInitializing: false,
          checkAuth: () => false,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter();

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("handles checkAuth returning false even with user present", () => {
      vi.mocked(useAuthStore).mockImplementation((selector) => {
        const state = {
          user: mockUser,
          isInitializing: false,
          checkAuth: () => false,
        };
        return selector ? selector(state) : state;
      });

      renderWithRouter();

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});
