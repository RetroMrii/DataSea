import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validateRegisterForm(formData) {
  const errors = {};
  const name = formData.name.trim();
  const email = formData.email.trim();

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2) {
    errors.name =
      'Name must be at least 2 characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email =
      'Enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 6) {
    errors.password =
      'Password must be at least 6 characters.';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword =
      'Confirm your password.';
  } else if (
    formData.confirmPassword !==
    formData.password
  ) {
    errors.confirmPassword =
      'Passwords do not match.';
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();

  const {
    register,
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
      validateRegisterForm(formData);

    setFormErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate('/dashboard', {
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
              Create your workspace
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
            Start generating reports from structured data.
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-400">
            Create an account to upload datasets, review generated analysis,
            and retain selected reports in your private history.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-950/55 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Account includes
            </p>

            <div className="mt-5 space-y-4">
              {[
                ['Private access', 'Reports remain associated with your authenticated account.'],
                ['Generated analysis', 'Receive summaries, charts, insights, and table previews.'],
                ['Saved history', 'Reopen, rename, categorize, or remove reports later.'],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="flex gap-3"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center lg:justify-end">
        <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur sm:p-8">
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
                Start analyzing
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Create your DataSea account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Use your real account name because destructive actions require
                typing it again for confirmation.
              </p>
            </div>

            {authError && (
              <div className="mt-6">
                <ErrorMessage message={authError} />
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 sm:grid-cols-2"
              noValidate
            >
              <div className="sm:col-span-2">
                <label
                  htmlFor="registerName"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Account name
                </label>

                <input
                  id="registerName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(
                    formErrors.name
                  )}
                  aria-describedby={
                    formErrors.name
                      ? 'registerNameError'
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${formErrors.name
                    ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400/20'
                    }`}
                  placeholder="Your name"
                />

                {formErrors.name && (
                  <p
                    id="registerNameError"
                    className="mt-2 text-sm text-red-300"
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="registerEmail"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="registerEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(
                    formErrors.email
                  )}
                  aria-describedby={
                    formErrors.email
                      ? 'registerEmailError'
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
                    id="registerEmailError"
                    className="mt-2 text-sm text-red-300"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="registerPassword"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="registerPassword"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(
                      formErrors.password
                    )}
                    aria-describedby={
                      formErrors.password
                        ? 'registerPasswordError'
                        : undefined
                    }
                    className={`w-full rounded-xl border bg-slate-900 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${formErrors.password
                      ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400/20'
                      }`}
                    placeholder="6+ characters"
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
                    id="registerPasswordError"
                    className="mt-2 text-sm text-red-300"
                  >
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="registerConfirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Confirm password
                </label>

                <input
                  id="registerConfirmPassword"
                  name="confirmPassword"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={Boolean(
                    formErrors.confirmPassword
                  )}
                  aria-describedby={
                    formErrors.confirmPassword
                      ? 'registerConfirmPasswordError'
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${formErrors.confirmPassword
                    ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-slate-700 focus:border-sky-400 focus:ring-sky-400/20'
                    }`}
                  placeholder="Repeat password"
                />

                {formErrors.confirmPassword && (
                  <p
                    id="registerConfirmPasswordError"
                    className="mt-2 text-sm text-red-300"
                  >
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              >
                {submitting
                  ? 'Creating account...'
                  : 'Create account'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-sky-300 transition-colors hover:text-sky-200"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;