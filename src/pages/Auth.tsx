import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import type { UserRole } from '../types/models';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  const isRegister = mode === 'register';
  const MIN_PASSWORD_LENGTH = 6;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return false;
    }

    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ email, password, role });
        navigate('/login');
      } else {
        await login({ email, password });
        navigate('/');
      }
    } catch {
      setError(isRegister ? 'Registration failed.' : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="hidden w-1/2 bg-hero bg-cover bg-center lg:block" />

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-center text-3xl font-bold">OnlineFoods.</h1>
          <h2 className="mb-6 text-center text-xl font-semibold">{isRegister ? 'Create account' : 'Sign in'}</h2>

          {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                placeholder="••••••••"
                required
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value as UserRole)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-black py-2 text-white transition hover:opacity-90 disabled:bg-gray-400"
            >
              {submitting ? 'Please wait...' : isRegister ? 'Sign up' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-black underline">
              {isRegister ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
