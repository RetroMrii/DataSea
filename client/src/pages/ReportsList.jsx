import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import EmptyState from '../components/common/EmptyState.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import ReportCard from '../components/reports/ReportCard.jsx';
import {
  clearReportsError,
  fetchReports,
} from '../store/slices/reportsSlice.js';

function ReportsList() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { reports, pagination, listLoading, error } = useSelector(
    (state) => state.reports
  );

  useEffect(() => {
    dispatch(fetchReports({ page, limit: 10 }));
  }, [dispatch, page]);

  useEffect(() => {
    return () => {
      dispatch(clearReportsError());
    };
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchReports({ page, limit: 10 }));
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Report history"
        title="Saved reports"
        description="Browse private analysis reports, reopen previous datasets, and manage report metadata."
        action={
          <Link
            to="/upload"
            className="inline-flex rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300"
          >
            Upload new file
          </Link>
        }
      />

      {!listLoading && !error && reports.length > 0 && (
        <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/15 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <StatusBadge variant="info" showDot>
              Report library
            </StatusBadge>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Showing {reports.length} report{reports.length === 1 ? '' : 's'} on this page.
            </p>
          </div>

          {pagination && (
            <div className="flex flex-wrap gap-2">
              <StatusBadge variant="neutral">
                {pagination.total ?? reports.length} total
              </StatusBadge>

              <StatusBadge variant="neutral">
                Page {pagination.page ?? page} of {pagination.totalPages ?? 1}
              </StatusBadge>
            </div>
          )}
        </section>
      )}

      {listLoading && (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60">
          <LoadingSpinner message="Loading reports..." />
        </div>
      )}

      {!listLoading && error && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!listLoading && !error && reports.length === 0 && (
        <EmptyState
          title="No saved reports yet"
          description="Upload and save your first dataset analysis to build your private report history."
          icon="▦"
          action={
            <Link
              to="/upload"
              className="inline-flex rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300"
            >
              Upload first file
            </Link>
          }
        />
      )}

      {!listLoading && !error && reports.length > 0 && (
        <>
          <div className="space-y-5">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>

          {pagination && (
            <nav
              aria-label="Reports pagination"
              className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/15 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Page {pagination.page} of {pagination.totalPages}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {pagination.total} total report{pagination.total === 1 ? '' : 's'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </>
      )}
    </AppLayout>
  );
}

export default ReportsList;