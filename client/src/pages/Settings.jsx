import AppLayout from '../components/layout/AppLayout.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';

function Settings() {
  return (
    <AppLayout>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage workspace preferences for your DataSea analysis workflow."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Application</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Core interface preferences for the current MVP.
              </p>
            </div>

            <StatusBadge variant="info" showDot>
              Dark-first MVP
            </StatusBadge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">Theme</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    DataSea currently uses a permanent dark dashboard theme.
                  </p>
                </div>

                <StatusBadge variant="neutral">Dark enabled</StatusBadge>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">Report name confirmation</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Keep the rename confirmation step after generating an analysis report.
                  </p>
                </div>

                <StatusBadge variant="success">Enabled</StatusBadge>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">Original file retention</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Uploaded source files are retained temporarily while saved reports remain available.
                  </p>
                </div>

                <StatusBadge variant="warning">7 days</StatusBadge>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">MVP status</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              These settings are displayed now so the page feels complete. Interactive preference storage can be added later.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
                <span className="text-sm text-slate-300">Theme toggle</span>
                <StatusBadge variant="neutral">Deferred</StatusBadge>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
                <span className="text-sm text-slate-300">Report preferences</span>
                <StatusBadge variant="info">Planned</StatusBadge>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
                <span className="text-sm text-slate-300">Account controls</span>
                <StatusBadge variant="info">Planned</StatusBadge>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 shadow-xl shadow-red-950/10">
            <h2 className="text-lg font-semibold text-red-100">Danger zone</h2>
            <p className="mt-2 text-sm leading-6 text-red-100/80">
              Account deletion and destructive workspace actions are intentionally disabled for the MVP.
            </p>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

export default Settings;