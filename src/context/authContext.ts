import { createContext } from 'react';
import type { LoginCredentials, SignCredentials } from '../types/auth';
import type { UserProfile } from '../types/models';

export interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: SignCredentials) => Promise<void>;
  logout: () => void;
  isFallbackContext?: true;
}

const MISSING_PROVIDER_ERROR = 'AuthProvider is missing in the component tree.';

export const defaultAuthContext: AuthContextType = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  isFallbackContext: true,
  login: async () => {
    throw new Error(MISSING_PROVIDER_ERROR);
  },
  register: async () => {
    throw new Error(MISSING_PROVIDER_ERROR);
  },
  logout: () => {
    throw new Error(MISSING_PROVIDER_ERROR);
  },
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
