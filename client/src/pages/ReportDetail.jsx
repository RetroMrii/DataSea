import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
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

    return [
      {
        label: 'Rows',
        value: report.rowCount,
        description: 'Total parsed dataset rows',
      },
      {
        label: 'Columns',
        value: report.columnCount,
        description: 'Detected dataset columns',
      },
      {
        label: 'Missing values',
        value: report.missingValues?.totalMissingValues ?? 0,
        description: 'Empty or unavailable cells',
      },
      {
        label: 'Duplicate rows',
        value: report.duplicateRowCount ?? 0,
        description: 'Exact duplicate row count',
      },
      {
        label: 'Outliers',
        value: report.outlierSummary?.totalOutliers ?? 0,
        description: 'Detected outlier values',
      },
      {
        label: 'Charts',
        value: report.chartData?.length ?? 0,
        description: 'Saved chart data objects',
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
    const confirmed = window.confirm(
      'Delete this report from your history? This uses soft delete and keeps the database record.'
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteReport(id));

    if (deleteReport.fulfilled.match(result)) {
      navigate('/reports', { replace: true });
    }
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <Link
          to="/reports"
          className="text-sm font-semibold text-sky-300 hover:text-sky-200"
        >
          ← Back to reports
        </Link>
      </div>

      {detailLoading && <LoadingSpinner message="Loading report..." />}

      {!detailLoading && error && !report && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!detailLoading && report && (
        <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                Saved report
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white">
                {report.title}
              </h1>
              <p className="mt-2 text-slate-400">
                Analysis saved from {report.originalFileName}.
              </p>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {summaryCards.map((card) => (
                <SummaryCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  description={card.description}
                />
              ))}
            </div>

            <ChartsGrid charts={report.chartData || []} />

            <InsightList insights={report.textualInsights || []} />

            <TablePreview tablePreview={report.tablePreview} />
          </div>

          <ReportMetaPanel
            report={report}
            saving={updateLoading}
            deleting={deleteLoading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}
    </AppLayout>
  );
}

export default ReportDetail;