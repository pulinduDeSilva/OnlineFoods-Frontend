import { jwtDecode } from 'jwt-decode';
import type { UserRole } from '../types/models';

interface JwtClaims {
  sub?: string;
  role?: string;
}

export function parseRoleClaim(claim?: string): UserRole {
  if (claim?.includes('ADMIN')) return 'ADMIN';
  return 'CUSTOMER';
}

export function getUserFromToken(token: string | null): { email: string; role: UserRole } | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtClaims>(token);
    if (!decoded.sub) return null;

    return {
      email: decoded.sub,
      role: parseRoleClaim(decoded.role),
    };
  } catch {
    return null;
  }
}
