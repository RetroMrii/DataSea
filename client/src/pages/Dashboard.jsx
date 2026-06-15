import { Link } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
          Private workspace
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Welcome{user?.name ? `, ${user.name}` : ''}.
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Upload structured datasets, generate automatic analysis, and save
          private visual reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400">Next action</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Analyze a file
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Upload CSV, JSON, or XLSX and generate report data.
          </p>
          <Link
            to="/upload"
            className="mt-5 inline-flex rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
          >
            Go to upload
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400">Saved work</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Report history
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            View, rename, and manage saved analysis reports.
          </p>
          <Link
            to="/reports"
            className="mt-5 inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            View reports
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm text-slate-400">Account</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Profile and settings
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Account and UI preferences will be expanded later.
          </p>
          <Link
            to="/profile"
            className="mt-5 inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Open profile
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;