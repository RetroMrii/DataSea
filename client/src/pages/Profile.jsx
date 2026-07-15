import { Link } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function getInitials(user) {
  const name = user?.name?.trim();

  if (name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  const email = user?.email?.trim();

  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return 'DS';
}

function AccountDetail({ label, value, allowWrap = false }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-medium text-slate-100 ${allowWrap ? 'break-all' : 'break-words'
          }`}
      >
        {value}
      </p>
    </div>
  );
}

function CapabilityCard({ label, value, description, variant = 'info' }) {
  const styles = {
    info: {
      border: 'border-sky-400/20',
      background: 'bg-sky-500/10',
      accent: 'text-sky-300',
    },
    success: {
      border: 'border-emerald-400/20',
      background: 'bg-emerald-500/10',
      accent: 'text-emerald-300',
    },
    neutral: {
      border: 'border-slate-800',
      background: 'bg-slate-900/55',
      accent: 'text-slate-200',
    },
    warning: {
      border: 'border-amber-400/20',
      background: 'bg-amber-500/10',
      accent: 'text-amber-300',
    },
  };

  const style = styles[variant] || styles.neutral;

  return (
    <article
      className={`rounded-3xl border p-5 ${style.border} ${style.background}`}
    >
      <p className="text-sm text-slate-400">{label}</p>

      <p className={`mt-3 text-2xl font-bold tracking-tight ${style.accent}`}>
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function Profile() {
  const { user, isAuthenticated } = useAuth();

  const displayName = user?.name || 'DataSea User';
  const displayEmail = user?.email || 'No email available';
  const role = user?.role || 'user';
  const accountId = user?._id || user?.id || 'Not available';
  const initials = getInitials(user);

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Review your account identity, session status, and DataSea workspace access."
        action={
          <Link
            to="/settings"
            className="inline-flex rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
          >
            Open settings
          </Link>
        }
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_22rem)]" />

          <div className="relative px-6 py-7">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-sky-400/30 bg-sky-500/15 text-3xl font-bold text-sky-100 shadow-inner shadow-slate-950/50">
                {initials}
              </div>

              <h2 className="mt-5 max-w-full break-words text-2xl font-bold tracking-tight text-white">
                {displayName}
              </h2>

              <p className="mt-2 max-w-full break-all text-sm text-slate-400">
                {displayEmail}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <StatusBadge
                  variant={isAuthenticated ? 'success' : 'warning'}
                  showDot
                >
                  {isAuthenticated ? 'Session active' : 'Session unavailable'}
                </StatusBadge>

                <StatusBadge variant="neutral">
                  {role}
                </StatusBadge>
              </div>
            </div>

            <div className="mt-7 space-y-3 border-t border-slate-800 pt-6">
              <AccountDetail
                label="Account ID"
                value={accountId}
                allowWrap
              />

              <AccountDetail
                label="Report access"
                value="Private workspace"
              />

              <AccountDetail
                label="Authentication"
                value="Token-based session"
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <StatusBadge variant="info" showDot>
                  Account overview
                </StatusBadge>

                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  Personal information
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  These details are associated with the active DataSea account.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <AccountDetail
                label="Display name"
                value={displayName}
              />

              <AccountDetail
                label="Email address"
                value={displayEmail}
                allowWrap
              />

              <AccountDetail
                label="Role"
                value={role}
              />

              <AccountDetail
                label="Session status"
                value={isAuthenticated ? 'Authenticated' : 'Unavailable'}
              />
            </div>
          </section>

          <section>
            <div className="mb-5">
              <StatusBadge variant="neutral">
                Workspace capabilities
              </StatusBadge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Your DataSea workspace
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Core analysis and report features available to this account.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CapabilityCard
                label="Upload formats"
                value="3"
                description="CSV, JSON, and XLSX structured datasets."
                variant="info"
              />

              <CapabilityCard
                label="Report visibility"
                value="Private"
                description="Saved reports are scoped to the authenticated account."
                variant="success"
              />

              <CapabilityCard
                label="Analysis output"
                value="Visual"
                description="Charts, statistics, insights, and table previews."
                variant="neutral"
              />

              <CapabilityCard
                label="File retention"
                value="7 days"
                description="Original source files are retained temporarily."
                variant="warning"
              />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/upload"
              className="group rounded-3xl border border-sky-400/20 bg-sky-500/10 p-6 transition hover:border-sky-400/40 hover:bg-sky-500/15"
            >
              <StatusBadge variant="info">New analysis</StatusBadge>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Upload a dataset
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Start a new structured-data analysis and review the generated report.
              </p>

              <p className="mt-5 text-sm font-semibold text-sky-300 transition group-hover:text-sky-200">
                Open upload workflow →
              </p>
            </Link>

            <Link
              to="/reports"
              className="group rounded-3xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-slate-700 hover:bg-slate-950"
            >
              <StatusBadge variant="neutral">Report history</StatusBadge>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Browse saved reports
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Reopen analyses, review charts, and manage report metadata.
              </p>

              <p className="mt-5 text-sm font-semibold text-slate-300 transition group-hover:text-white">
                View reports →
              </p>
            </Link>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;