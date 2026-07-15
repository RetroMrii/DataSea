import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import ChartsGrid from '../components/reports/ChartsGrid.jsx';
import InsightList from '../components/reports/InsightList.jsx';
import ReportMetaPanel from '../components/reports/ReportMetaPanel.jsx';
import SummaryCard from '../components/reports/SummaryCard.jsx';
import TablePreview from '../components/reports/TablePreview.jsx';
import {
  clearReportsError,
  clearSelectedReport,
  deleteReport,
  fetchReportById,
  updateReport,
} from '../store/slices/reportsSlice.js';

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '0';
  }

  return new Intl.NumberFormat('en').format(number);
}

function calculatePercentage(part, total) {
  const safePart = Number(part);
  const safeTotal = Number(total);

  if (!Number.isFinite(safePart) || !Number.isFinite(safeTotal) || safeTotal <= 0) {
    return 0;
  }

  return Math.min((safePart / safeTotal) * 100, 100);
}

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedReport: report,
    detailLoading,
    updateLoading,
    deleteLoading,
    error,
  } = useSelector((state) => state.reports);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReportById(id));

    return () => {
      dispatch(clearSelectedReport());
    };
  }, [dispatch, id]);

  const summaryCards = useMemo(() => {
    if (!report) {
      return [];
    }

    const rows = Number(report.rowCount) || 0;
    const columns = Number(report.columnCount) || 0;
    const estimatedCells = rows * columns;

    const missingValues =
      Number(report.missingValues?.totalMissingValues) || 0;

    const duplicateRows =
      Number(report.duplicateRowCount) || 0;

    const outliers =
      Number(report.outlierSummary?.totalOutliers) || 0;

    const charts =
      Array.isArray(report.chartData) ? report.chartData.length : 0;

    const completenessScore = Math.max(
      0,
      100 - calculatePercentage(missingValues, estimatedCells)
    );

    return [
      {
        label: 'Rows',
        value: formatNumber(rows),
        description: 'Total parsed dataset rows',
        variant: 'info',
      },
      {
        label: 'Columns',
        value: formatNumber(columns),
        description: 'Detected dataset columns',
        variant: 'neutral',
      },
      {
        label: 'Missing values',
        value: formatNumber(missingValues),
        description: 'Empty or unavailable cells',
        variant: missingValues > 0 ? 'warning' : 'success',
        progress: completenessScore,
      },
      {
        label: 'Duplicate rows',
        value: formatNumber(duplicateRows),
        description: 'Exact duplicate row count',
        variant: duplicateRows > 0 ? 'warning' : 'success',
      },
      {
        label: 'Outliers',
        value: formatNumber(outliers),
        description: 'Detected statistical outlier values',
        variant: outliers > 0 ? 'danger' : 'success',
      },
      {
        label: 'Charts',
        value: formatNumber(charts),
        description: 'Saved visual analysis objects',
        variant: 'info',
      },
    ];
  }, [report]);

  const handleRetry = () => {
    dispatch(clearReportsError());
    dispatch(fetchReportById(id));
  };

  const handleUpdate = async (updates) => {
    await dispatch(
      updateReport({
        reportId: id,
        updates,
      })
    );
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteReport(id));

    if (deleteReport.fulfilled.match(result)) {
      setDeleteDialogOpen(false);
      navigate('/reports', { replace: true });
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition-colors hover:text-sky-200"
        >
          <span aria-hidden="true">←</span>
          Back to reports
        </Link>
      </div>

      {detailLoading && <LoadingSpinner message="Loading report..." />}

      {!detailLoading && error && !report && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!detailLoading && report && (
        <div className="min-w-0 space-y-8">
          <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28rem)]" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge variant="info" showDot>
                    Saved report
                  </StatusBadge>

                  <StatusBadge variant="neutral">
                    {report.fileType?.toUpperCase() || 'DATASET'}
                  </StatusBadge>

                  {report.descriptionCategory && (
                    <StatusBadge>
                      {report.descriptionCategory}
                    </StatusBadge>
                  )}
                </div>

                <h1 className="mt-5 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {report.title}
                </h1>

                <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-slate-400 sm:text-base">
                  Analysis generated from{' '}
                  <span className="font-medium text-slate-200">
                    {report.originalFileName}
                  </span>
                  .
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Rows
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {formatNumber(report.rowCount)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Columns
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {formatNumber(report.columnCount)}
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 sm:col-span-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Charts
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {formatNumber(report.chartData?.length)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {error && <ErrorMessage message={error} />}

          <section>
            <div className="mb-5">
              <StatusBadge variant="neutral">Dataset overview</StatusBadge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Summary statistics
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Key structural and data-quality indicators detected during analysis.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {summaryCards.map((card) => (
                <SummaryCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  description={card.description}
                  variant={card.variant}
                  progress={card.progress}
                />
              ))}
            </div>
          </section>

          <ChartsGrid charts={report.chartData || []} />

          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0 space-y-6">
              <InsightList insights={report.textualInsights || []} />

              <TablePreview tablePreview={report.tablePreview} />
            </div>

            <div className="xl:sticky xl:top-28 xl:self-start">
              <ReportMetaPanel
                report={report}
                saving={updateLoading}
                deleting={deleteLoading}
                onUpdate={handleUpdate}
                onDelete={() => setDeleteDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete report from history?"
        description="This report will be removed from your history. You will need to upload the original file again to recreate it."
        confirmLabel="Delete report"
        danger
        loading={deleteLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </AppLayout>
  );
}

export default ReportDetail;