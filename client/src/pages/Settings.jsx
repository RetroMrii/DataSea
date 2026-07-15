import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CredentialConfirmDialog from '../components/common/CredentialConfirmDialog.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import {
  clearReportsError,
  clearReportsState,
  deleteAllReports,
} from '../store/slices/reportsSlice.js';

const reportCategories = [
  'sales',
  'finance',
  'education',
  'operations',
  'research',
  'marketing',
  'personal',
  'other',
];

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between gap-5">
        <div className="min-w-0">
          <p className="font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          onClick={() => onChange(!checked)}
          className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${checked
            ? 'border-sky-400/50 bg-sky-400'
            : 'border-slate-700 bg-slate-800'
            }`}
        >
          <span
            className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked
              ? 'translate-x-5'
              : 'translate-x-0'
              }`}
          />
        </button>
      </div>
    </div>
  );
}

function SelectSetting({
  id,
  title,
  description,
  value,
  onChange,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5">
      <label
        htmlFor={id}
        className="font-semibold text-white"
      >
        {title}
      </label>

      <p className="mt-1 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <select
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
      >
        {children}
      </select>
    </div>
  );
}

function InformationCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-semibold text-white">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    logout,
    deleteAccount,
    clearAuthError,
    authError,
    accountDeleteLoading,
    isAuthenticated,
  } = useAuth();

  const {
    preferences,
    updatePreference,
    resetPreferences,
  } = usePreferences();

  const {
    deleteAllLoading,
    error: reportsError,
  } = useSelector((state) => state.reports);

  const [deleteReportsOpen, setDeleteReportsOpen] =
    useState(false);

  const [deleteAccountOpen, setDeleteAccountOpen] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  const accountName = user?.name || '';

  const handleLogout = () => {
    logout();
    dispatch(clearReportsState());
    navigate('/login', { replace: true });
  };

  const openDeleteReportsDialog = () => {
    setSuccessMessage('');
    dispatch(clearReportsError());
    setDeleteReportsOpen(true);
  };

  const closeDeleteReportsDialog = () => {
    if (deleteAllLoading) {
      return;
    }

    dispatch(clearReportsError());
    setDeleteReportsOpen(false);
  };

  const handleDeleteAllReports = async (
    credentials
  ) => {
    const result = await dispatch(
      deleteAllReports(credentials)
    );

    if (deleteAllReports.fulfilled.match(result)) {
      const count =
        result.payload?.deletedReports ?? 0;

      setDeleteReportsOpen(false);

      setSuccessMessage(
        count === 1
          ? '1 report was deleted from your history.'
          : `${count} reports were deleted from your history.`
      );
    }
  };

  const openDeleteAccountDialog = () => {
    setSuccessMessage('');
    clearAuthError();
    setDeleteAccountOpen(true);
  };

  const closeDeleteAccountDialog = () => {
    if (accountDeleteLoading) {
      return;
    }

    clearAuthError();
    setDeleteAccountOpen(false);
  };

  const handleDeleteAccount = async (
    credentials
  ) => {
    try {
      await deleteAccount(credentials);

      dispatch(clearReportsState());
      setDeleteAccountOpen(false);

      navigate('/login', {
        replace: true,
        state: {
          accountDeleted: true,
        },
      });
    } catch {
      // AuthContext exposes the server error through authError.
    }
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Customize interface behavior, report defaults, storage actions, and the active account session."
        action={
          <button
            type="button"
            onClick={resetPreferences}
            className="inline-flex rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white"
          >
            Reset preferences
          </button>
        }
      />

      {successMessage && (
        <div
          role="status"
          className="mb-6 rounded-3xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-100"
        >
          {successMessage}
        </div>
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_24rem)]" />

            <div className="relative">
              <div className="border-b border-slate-800 pb-5">
                <StatusBadge variant="info" showDot>
                  Interface
                </StatusBadge>

                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  Appearance and motion
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Changes are saved automatically in this browser.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleSetting
                  title="Animated background waves"
                  description="Display the moving wave layers behind the application interface."
                  checked={
                    preferences.backgroundWaves
                  }
                  onChange={(value) =>
                    updatePreference(
                      'backgroundWaves',
                      value
                    )
                  }
                />

                <ToggleSetting
                  title="Interface motion"
                  description="Enable chart animation, smooth scrolling, and interface transitions."
                  checked={
                    preferences.interfaceMotion
                  }
                  onChange={(value) =>
                    updatePreference(
                      'interfaceMotion',
                      value
                    )
                  }
                />

                <SelectSetting
                  id="tableDensity"
                  title="Table density"
                  description="Control spacing inside report preview tables."
                  value={preferences.tableDensity}
                  onChange={(value) =>
                    updatePreference(
                      'tableDensity',
                      value
                    )
                  }
                >
                  <option value="comfortable">
                    Comfortable
                  </option>

                  <option value="compact">
                    Compact
                  </option>
                </SelectSetting>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="border-b border-slate-800 pb-5">
              <StatusBadge variant="success">
                Report workflow
              </StatusBadge>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                Report defaults
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Configure how newly analyzed reports are prepared and saved.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <ToggleSetting
                title="Confirm report title"
                description="Open the title confirmation dialog before saving a generated report."
                checked={
                  preferences.confirmReportName
                }
                onChange={(value) =>
                  updatePreference(
                    'confirmReportName',
                    value
                  )
                }
              />

              <SelectSetting
                id="defaultReportCategory"
                title="Default report category"
                description="Automatically apply this category when saving a new analysis."
                value={
                  preferences.defaultReportCategory
                }
                onChange={(value) =>
                  updatePreference(
                    'defaultReportCategory',
                    value
                  )
                }
              >
                {reportCategories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category[0].toUpperCase() +
                        category.slice(1)}
                    </option>
                  )
                )}
              </SelectSetting>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="border-b border-slate-800 pb-5">
              <StatusBadge variant="warning">
                Data handling
              </StatusBadge>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                Storage information
              </h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InformationCard
                label="Original files"
                value="7-day retention"
                description="Uploaded source files are retained temporarily."
              />

              <InformationCard
                label="Saved reports"
                value="Persistent"
                description="Reports remain available until deleted."
              />

              <InformationCard
                label="Report access"
                value="Private"
                description="Reports are associated with the authenticated account."
              />

              <InformationCard
                label="Maximum upload"
                value="20 MB"
                description="Supported formats are CSV, JSON, and XLSX."
              />
            </div>
          </section>

          <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 shadow-xl shadow-red-950/10">
            <StatusBadge variant="danger">
              Destructive actions
            </StatusBadge>

            <h2 className="mt-4 text-xl font-semibold text-red-100">
              Data and account deletion
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-100/70">
              These actions require your exact account name and current password.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-red-500/20 bg-slate-950/50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      Delete all reports
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Hide every active report from your report history. Your account remains active.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openDeleteReportsDialog}
                    disabled={
                      deleteAllLoading ||
                      !isAuthenticated
                    }
                    className="shrink-0 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete all reports
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-red-100">
                      Delete account
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-red-100/70">
                      Permanently delete your account and all reports associated with it.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openDeleteAccountDialog}
                    disabled={
                      accountDeleteLoading ||
                      !isAuthenticated
                    }
                    className="shrink-0 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.1),transparent_20rem)]" />

            <div className="relative p-6">
              <StatusBadge
                variant={
                  isAuthenticated
                    ? 'success'
                    : 'warning'
                }
                showDot
              >
                {isAuthenticated
                  ? 'Active session'
                  : 'No active session'}
              </StatusBadge>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Account session
              </h2>

              <p className="mt-2 break-all text-sm leading-6 text-slate-400">
                {user?.email ||
                  'No account email available'}
              </p>

              <div className="mt-5 space-y-3">
                <InformationCard
                  label="User"
                  value={
                    user?.name || 'DataSea User'
                  }
                />

                <InformationCard
                  label="Role"
                  value={user?.role || 'user'}
                />
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={!isAuthenticated}
                className="mt-5 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sign out
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-sky-400/20 bg-sky-500/10 p-6">
            <StatusBadge variant="info">
              Local preferences
            </StatusBadge>

            <p className="mt-4 text-sm leading-6 text-sky-100/80">
              Interface preferences are stored in this browser. Signing in on another device will use the default settings until changed there.
            </p>
          </section>
        </aside>
      </div>

      <CredentialConfirmDialog
        open={deleteReportsOpen}
        title="Delete all reports?"
        description="Every active report will be removed from your report history. Your DataSea account will remain active."
        expectedName={accountName}
        confirmLabel="Delete all reports"
        loading={deleteAllLoading}
        error={reportsError}
        onCancel={closeDeleteReportsDialog}
        onConfirm={handleDeleteAllReports}
      />

      <CredentialConfirmDialog
        open={deleteAccountOpen}
        title="Delete your account?"
        description="This permanently deletes your account and all associated reports. This action cannot be reversed."
        expectedName={accountName}
        confirmLabel="Delete account permanently"
        loading={accountDeleteLoading}
        error={authError}
        onCancel={closeDeleteAccountDialog}
        onConfirm={handleDeleteAccount}
      />
    </AppLayout>
  );
}

export default Settings;