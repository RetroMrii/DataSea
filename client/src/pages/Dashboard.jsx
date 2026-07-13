import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/layout/AppLayout.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ReportCard from '../components/reports/ReportCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchReports } from '../store/slices/reportsSlice.js';

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en').format(value);
}

function getTotalRows(reports) {
  return reports.reduce((total, report) => total + (Number(report.rowCount) || 0), 0);
}

function getTotalColumns(reports) {
  return reports.reduce((total, report) => total + (Number(report.columnCount) || 0), 0);
}

function getFileTypes(reports) {
  return new Set(
    reports
      .map((report) => report.fileType?.toUpperCase())
      .filter(Boolean)
  ).size;
}

function DashboardStatCard({ label, value, description, variant = 'info' }) {
  return (
    <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        <StatusBadge variant={variant} showDot>
          Live
        </StatusBadge>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </div>
  );
}

function WorkflowCard({ title, description, to, actionLabel, primary = false }) {
  return (
    <article className="group rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:border-sky-400/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-sm font-bold text-sky-300">
        DS
      </div>

      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

      <Link
        to={to}
        className={`mt-5 inline-flex rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${primary
          ? 'bg-sky-400 text-slate-950 hover:bg-sky-300'
          : 'border border-slate-700 text-white hover:bg-slate-900'
          }`}
      >
        {actionLabel}
      </Link>
    </article>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { reports, pagination, listLoading, error } = useSelector(
    (state) => state.reports
  );

  useEffect(() => {
    dispatch(fetchReports({ page: 1, limit: 3 }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalReports = pagination?.total ?? reports.length;
    const visibleRows = getTotalRows(reports);
    const visibleColumns = getTotalColumns(reports);
    const fileTypeCount = getFileTypes(reports);

    return {
      totalReports,
      visibleRows,
      visibleColumns,
      fileTypeCount,
    };
  }, [reports, pagination]);

  const firstName = user?.name?.split(' ')?.[0] || 'there';

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Private workspace"
        title={`Welcome back, ${firstName}.`}
        description="Monitor your saved analysis reports, upload new datasets, and continue exploring your structured data."
        action={
          <Link
            to="/upload"
            className="inline-flex rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300"
          >
            Upload dataset
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Saved reports"
          value={formatNumber(stats.totalReports)}
          description="Reports available in your private workspace."
          variant="info"
        />

        <DashboardStatCard
          label="Rows analyzed"
          value={formatNumber(stats.visibleRows)}
          description="Rows counted from the latest loaded reports."
          variant="success"
        />

        <DashboardStatCard
          label="Columns mapped"
          value={formatNumber(stats.visibleColumns)}
          description="Columns detected across recent report previews."
          variant="warning"
        />

        <DashboardStatCard
          label="File types"
          value={formatNumber(stats.fileTypeCount)}
          description="Unique dataset formats in the recent report set."
          variant="neutral"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent reports</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Open your latest saved reports or upload a new dataset to generate another analysis.
              </p>
            </div>

            <Link
              to="/reports"
              className="inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
            >
              View all
            </Link>
          </div>

          <div className="mt-5">
            {listLoading && <LoadingSpinner message="Loading recent reports..." compact />}

            {!listLoading && error && (
              <ErrorMessage
                message={error}
                onRetry={() => dispatch(fetchReports({ page: 1, limit: 3 }))}
              />
            )}

            {!listLoading && !error && reports.length === 0 && (
              <EmptyState
                title="No reports yet"
                description="Upload your first CSV, JSON, or XLSX file to generate a visual analysis report."
                icon="↗"
                action={
                  <Link
                    to="/upload"
                    className="inline-flex rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
                  >
                    Upload dataset
                  </Link>
                }
              />
            )}

            {!listLoading && !error && reports.length > 0 && (
              <div className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <WorkflowCard
            title="Analyze a new file"
            description="Upload CSV, JSON, or XLSX and let DataSea generate summary statistics, chart data, table preview, and insights."
            to="/upload"
            actionLabel="Start upload"
            primary
          />

          <WorkflowCard
            title="Review report history"
            description="Return to saved reports, check previous analysis results, and manage report metadata."
            to="/reports"
            actionLabel="Open reports"
          />

          <div className="rounded-3xl border border-sky-400/20 bg-sky-500/10 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-sky-100">MVP focus</h2>
                <p className="mt-2 text-sm leading-6 text-sky-100/80">
                  DataSea focuses on structured datasets first. PDF extraction and custom chart building should stay deferred until the report flow is stable.
                </p>
              </div>

              <StatusBadge variant="info">Stable core</StatusBadge>
            </div>
          </div>
        </aside>
      </section>
    </AppLayout>
  );
}

export default Dashboard;