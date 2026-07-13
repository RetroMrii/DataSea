import AppLayout from '../components/layout/AppLayout.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function getInitials(user) {
  const name = user?.name?.trim();

  if (name) {
    return name
      .split(' ')
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

function Profile() {
  const { user, isAuthenticated } = useAuth();

  const displayName = user?.name || 'DataSea User';
  const displayEmail = user?.email || 'No email available';
  const role = user?.role || 'user';
  const initials = getInitials(user);

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Review your DataSea account details and workspace status."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-400/30 bg-sky-500/15 text-2xl font-bold text-sky-200 shadow-inner shadow-slate-950/40">
              {initials}
            </div>

            <h2 className="mt-5 max-w-full truncate text-xl font-bold text-white">
              {displayName}
            </h2>

            <p className="mt-1 max-w-full break-words text-sm text-slate-400">
              {displayEmail}
            </p>

            <div className="mt-4">
              <StatusBadge variant={isAuthenticated ? 'success' : 'warning'} showDot>
                {isAuthenticated ? 'Active session' : 'Session unavailable'}
              </StatusBadge>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-800 pt-6">
            <div className="rounded-2xl bg-slate-900/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Role
              </p>
              <p className="mt-1 text-sm font-medium capitalize text-white">
                {role}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Privacy
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                Private reports only
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Account ID
              </p>
              <p className="mt-1 break-all text-sm font-medium text-white">
                {user?._id || user?.id || 'Not available'}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Workspace summary
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                A quick overview of what this account can do in the MVP.
              </p>
            </div>

            <StatusBadge variant="info">MVP account</StatusBadge>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm text-slate-400">Supported uploads</p>
              <p className="mt-2 text-2xl font-bold text-white">3</p>
              <p className="mt-1 text-xs text-slate-500">CSV, JSON, XLSX</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm text-slate-400">Report visibility</p>
              <p className="mt-2 text-2xl font-bold text-white">Private</p>
              <p className="mt-1 text-xs text-slate-500">
                User-owned report history
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm text-slate-400">Analysis output</p>
              <p className="mt-2 text-2xl font-bold text-white">Charts</p>
              <p className="mt-1 text-xs text-slate-500">
                Visual summaries and insights
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm text-slate-400">File retention</p>
              <p className="mt-2 text-2xl font-bold text-white">7 days</p>
              <p className="mt-1 text-xs text-slate-500">
                Reports stay available
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-5">
            <p className="font-semibold text-sky-100">Account data source</p>
            <p className="mt-2 text-sm leading-6 text-sky-100/80">
              This profile reads the authenticated user from AuthContext and
              restores it from the saved session on refresh.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Profile;