import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  email: '',
  password: '',
};

function validateLoginForm(formData) {
  const errors = {};
  const email = formData.email.trim();

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 6) {
    errors.password =
      'Password must be at least 6 characters.';
  }

  return errors;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    authError,
    loading: authLoading,
    clearAuthError,
  } = useAuth();

  const [formData, setFormData] =
    useState(initialForm);

  const [formErrors, setFormErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const redirectTo =
    location.state?.from?.pathname || '/dashboard';

  const accountDeleted =
    location.state?.accountDeleted === true;

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

    const validationErrors =
      validateLoginForm(formData);

    setFormErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    setSubmitting(true);

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate(redirectTo, {
        replace: true,
      });
    } catch {
      // AuthContext exposes the request error.
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <LoadingSpinner message="Checking session..." />
    );
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="hidden lg:block">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              Secure workspace
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
            Continue working with your saved reports.
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-400">
            Log in to upload new datasets, inspect generated analyses, and
            reopen reports associated with your account.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Private reports linked to your account',
              'Automatic charts and data-quality summaries',
              'Responsive report history and detail views',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/50 px-4 py-3"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
                  ✓
                </span>

                <p className="text-sm leading-6 text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex justify-center lg:justify-end">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_22rem)]" />

          <div className="relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              <span aria-hidden="true">←</span>
              Back to home
            </Link>

            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Log in to DataSea
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter the credentials associated with your account.
              </p>
            </div>

            {accountDeleted && (
              <div
                role="status"
                className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
              >
                Your account was deleted successfully.
              </div>
            )}

            {authError && (
              <div className="mt-6">
                <ErrorMessage message={authError} />
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="loginEmail"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={
                    formErrors.email
                      ? 'loginEmailError'
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${formErrors.email
                    ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400/20'
                    }`}
                  placeholder="you@example.com"
                />

                {formErrors.email && (
                  <p
                    id="loginEmailError"
                    className="mt-2 text-sm text-red-300"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="loginPassword"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="loginPassword"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(
                      formErrors.password
                    )}
                    aria-describedby={
                      formErrors.password
                        ? 'loginPasswordError'
                        : undefined
                    }
                    className={`w-full rounded-xl border bg-slate-900 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${formErrors.password
                      ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400/20'
                      }`}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute inset-y-0 right-3 my-auto h-fit rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {formErrors.password && (
                  <p
                    id="loginPasswordError"
                    className="mt-2 text-sm text-red-300"
                  >
                    {formErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Logging in...'
                  : 'Log in'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-6 text-center">
              <p className="text-sm text-slate-400">
                No account yet?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-sky-300 transition-colors hover:text-sky-200"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;