import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { LoginCredentials, SignCredentials } from '../types/auth';
import type { UserProfile, UserRole } from '../types/models';
import { AuthContext } from './authContext';
import { parseRoleClaim } from '../util/userRole';

interface JwtClaims {
  sub?: string;
  role?: string;
}

const decodeToken = (token: string): { email: string; role: UserRole } | null => {
  try {
    const decoded = jwtDecode<JwtClaims>(token);
    if (!decoded.sub) return null;
    return { email: decoded.sub, role: parseRoleClaim(decoded.role) };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateAuth = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await userService.findUserByEmail(decoded.email);
        if (profile) {
          setUser(profile);
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    queueMicrotask(() => {
      void hydrateAuth();
    });
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    setToken(response.token);
  };

  const register = async (credentials: SignCredentials) => {
    await authService.signup(credentials);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: !!token && !!user, loading, login, register, logout }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
