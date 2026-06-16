import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import EmptyState from '../components/common/EmptyState.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
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
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Report history
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">Saved reports</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Open previously saved analysis reports. Deleted reports are hidden
            from this list but remain soft-deleted in MongoDB.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300"
        >
          Upload new file
        </Link>
      </div>

      {listLoading && <LoadingSpinner message="Loading reports..." />}

      {!listLoading && error && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!listLoading && !error && reports.length === 0 && (
        <EmptyState
          title="No saved reports yet"
          description="Upload and save your first dataset analysis to see it here."
        />
      )}

      {!listLoading && !error && reports.length > 0 && (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>

          {pagination && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">
                Page {pagination.page} of {pagination.totalPages} ·{' '}
                {pagination.total} total reports
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}

export default ReportsList;