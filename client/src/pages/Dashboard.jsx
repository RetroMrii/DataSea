import { Link } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';

function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Private workspace"
        title={`Welcome${user?.name ? `, ${user.name}` : ''}.`}
        description="Upload structured datasets, generate automatic analysis, and save visual reports."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400">Primary workflow</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Analyze a file
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Upload CSV, JSON, or XLSX and generate report statistics,
            automatic charts data, and textual insights.
          </p>
          <Link
            to="/upload"
            className="mt-5 inline-flex rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
          >
            Upload dataset
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400">Saved work</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Report history
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Open saved reports, review previous analysis, and manage report
            metadata.
          </p>
          <Link
            to="/reports"
            className="mt-5 inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            View reports
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400">Current support</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            CSV, JSON, XLSX
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            PDF table extraction is intentionally later. The MVP focuses on
            structured data first.
          </p>
          <Link
            to="/settings"
            className="mt-5 inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Settings
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;