import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Mock localStorage and sessionStorage
const createStorage = (): Storage => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key in store) delete store[key];
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: Object.keys(store).length,
  } as Storage;
};

// Always override to ensure consistent behavior
Object.defineProperty(window, "localStorage", {
  value: createStorage(),
  writable: true,
});

Object.defineProperty(window, "sessionStorage", {
  value: createStorage(),
  writable: true,
});

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  try {
    localStorage.clear();
  } catch {
    // Ignore if clear fails
  }
  try {
    sessionStorage.clear();
  } catch {
    // Ignore if clear fails
  }
  vi.clearAllMocks();
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

Object.defineProperty(window, "location", {
  value: {
    href: "",
    assign: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
    search: "",
    hash: "",
    origin: "http://localhost:5173",
  },
  writable: true,
});

vi.mock("import.meta.env", () => ({
  VITE_API_URL: "http://localhost:3000/api",
}));
