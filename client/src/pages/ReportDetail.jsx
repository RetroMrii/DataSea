import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import InsightList from '../components/reports/InsightList.jsx';
import ReportMetaPanel from '../components/reports/ReportMetaPanel.jsx';
import SummaryCard from '../components/reports/SummaryCard.jsx';
import ChartsGrid from '../components/reports/ChartsGrid.jsx';
import TablePreview from '../components/reports/TablePreview.jsx';
import api from '../services/api.js';

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setPageError('');

    try {
      const response = await api.get(`/reports/${id}`);
      const loadedReport =
        response.data?.data?.report || response.data?.report || null;

      setReport(loadedReport);
    } catch (requestError) {
      setPageError(
        requestError.response?.data?.message || 'Could not load this report.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

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

  const handleUpdate = async (updates) => {
    setSaving(true);
    setActionError('');

    try {
      const response = await api.put(`/reports/${id}`, updates);
      const updatedReport =
        response.data?.data?.report || response.data?.report || null;

      if (updatedReport) {
        setReport(updatedReport);
      }
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message || 'Could not update the report.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this report from your history? This uses soft delete and keeps the database record.'
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setActionError('');

    try {
      await api.delete(`/reports/${id}`);
      navigate('/reports', { replace: true });
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message || 'Could not delete the report.'
      );
    } finally {
      setDeleting(false);
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

      {loading && <LoadingSpinner message="Loading report..." />}

      {!loading && pageError && (
        <ErrorMessage message={pageError} onRetry={fetchReport} />
      )}

      {!loading && !pageError && report && (
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

            {actionError && <ErrorMessage message={actionError} />}

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
            saving={saving}
            deleting={deleting}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}
    </AppLayout>
  );
}

export default ReportDetail;