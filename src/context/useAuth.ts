import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from './authContext';

export function useAuth() {
  const context = useContext(AuthContext);
  const hasWarnedMissingProvider = useRef(false);

  useEffect(() => {
    if (import.meta.env.DEV && context.isFallbackContext && !hasWarnedMissingProvider.current) {
      hasWarnedMissingProvider.current = true;
      console.warn('AuthProvider is missing in the component tree; using fallback auth context.');
    }
  }, [context]);

  return context;
}
