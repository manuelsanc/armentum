/**
 * Global Type Definitions
 * Centralized type definitions for the application
 */

export type UserRole = "admin" | "corista" | "public";

export interface User {
  id: string;
  email: string;
  userType: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  status: number;
}
