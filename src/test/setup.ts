import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorage.clear();
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
