export type UserRole = "admin" | "corista" | "public";

export interface User {
  id: string;
  email: string;
  nombre?: string;
  userType: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre?: string;
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
