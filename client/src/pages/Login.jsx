import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  email: '',
  password: '',
};

function validateLoginForm(formData) {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!formData.email.includes('@')) {
    errors.email = 'Enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError, loading: authLoading, clearAuthError } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [name]: '',
    }));

    clearAuthError();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch {
      // Error is already stored in AuthContext.
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Checking session..." />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl shadow-sky-950/20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">Log in</h1>
          <p className="mt-2 text-sm text-slate-400">
            Access your private DataSea reports and upload new datasets.
          </p>
        </div>

        {authError && (
          <div className="mt-6">
            <ErrorMessage message={authError} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="you@example.com"
            />
            {formErrors.email && (
              <p className="mt-2 text-sm text-red-300">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="At least 6 characters"
            />
            {formErrors.password && (
              <p className="mt-2 text-sm text-red-300">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          No account yet?{' '}
          <Link to="/register" className="font-semibold text-sky-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;