import type { UserRole } from './models';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
}
