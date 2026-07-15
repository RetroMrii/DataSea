import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import ChartsGrid from '../components/reports/ChartsGrid.jsx';
import InsightList from '../components/reports/InsightList.jsx';
import RenameReportModal from '../components/reports/RenameReportModal.jsx';
import SummaryCard from '../components/reports/SummaryCard.jsx';
import TablePreview from '../components/reports/TablePreview.jsx';
import FileUploadBox from '../components/upload/FileUploadBox.jsx';
import UploadProgress from '../components/upload/UploadProgress.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import {
  clearReportsError,
  clearUploadPreview,
  saveReport,
  uploadDataset,
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

  if (
    !Number.isFinite(safePart) ||
    !Number.isFinite(safeTotal) ||
    safeTotal <= 0
  ) {
    return 0;
  }

  return Math.min((safePart / safeTotal) * 100, 100);
}

function Upload() {
  const dispatch = useDispatch();
  const { preferences } = usePreferences();

  const {
    uploadPreview,
    savedReport,
    uploadLoading,
    saveLoading,
    uploadProgress,
    error,
  } = useSelector((state) => state.reports);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const analysis = uploadPreview?.analysis;

  useEffect(() => {
    return () => {
      dispatch(clearReportsError());
    };
  }, [dispatch]);

  const summaryCards = useMemo(() => {
    if (!analysis) {
      return [];
    }

    const rows = Number(analysis.rowCount) || 0;
    const columns = Number(analysis.columnCount) || 0;
    const estimatedCells = rows * columns;
    const missingValues =
      Number(analysis.missingValues?.totalMissingValues) || 0;
    const duplicateRows = Number(analysis.duplicateRowCount) || 0;
    const outliers =
      Number(analysis.outlierSummary?.totalOutliers) || 0;
    const chartCount = Array.isArray(analysis.chartData)
      ? analysis.chartData.length
      : 0;

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
        value: formatNumber(chartCount),
        description: 'Generated visual analysis objects',
        variant: 'info',
      },
    ];
  }, [analysis]);

  const handleFileSelect = (file, errorMessage) => {
    setSelectedFile(file);
    setFileError(errorMessage || '');
    setRenameModalOpen(false);
    dispatch(clearUploadPreview());
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError('Choose a file before starting the analysis.');
      return;
    }

    setFileError('');
    dispatch(clearReportsError());

    await dispatch(uploadDataset(selectedFile));
  };

  const saveGeneratedReport = async (
    title = uploadPreview?.suggestedTitle || 'Untitled analysis'
  ) => {
    if (!uploadPreview?.file || !uploadPreview?.analysis) {
      return;
    }

    const result = await dispatch(
      saveReport({
        title,
        tags: [],
        descriptionCategory: preferences.defaultReportCategory,
        file: uploadPreview.file,
        analysis: uploadPreview.analysis,
      })
    );

    if (saveReport.fulfilled.match(result)) {
      setRenameModalOpen(false);
    }
  };

  const handleSaveAction = () => {
    if (!uploadPreview || saveLoading) {
      return;
    }

    if (preferences.confirmReportName) {
      setRenameModalOpen(true);
      return;
    }

    saveGeneratedReport();
  };

  const handleSaveReport = async (title) => {
    await saveGeneratedReport(title);
  };

  const handleStartAnother = () => {
    setSelectedFile(null);
    setFileError('');
    setRenameModalOpen(false);

    dispatch(clearUploadPreview());

    window.scrollTo({
      top: 0,
      behavior: preferences.interfaceMotion ? 'smooth' : 'auto',
    });
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Upload and analyze"
        title="Generate a data report"
        description="Upload a structured dataset, review the generated analysis, and save it to your private report history."
      />

      <section className="mx-auto max-w-4xl">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-400/25 bg-sky-500/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
              Step 1
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Choose dataset
            </p>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${uploadLoading || uploadPreview
              ? 'border-sky-400/25 bg-sky-500/10'
              : 'border-slate-800 bg-slate-950/60'
              }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.14em] ${uploadLoading || uploadPreview
                ? 'text-sky-300'
                : 'text-slate-600'
                }`}
            >
              Step 2
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${uploadLoading || uploadPreview
                ? 'text-white'
                : 'text-slate-500'
                }`}
            >
              Analyze file
            </p>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${savedReport
              ? 'border-emerald-400/25 bg-emerald-500/10'
              : uploadPreview
                ? 'border-sky-400/25 bg-sky-500/10'
                : 'border-slate-800 bg-slate-950/60'
              }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.14em] ${savedReport
                ? 'text-emerald-300'
                : uploadPreview
                  ? 'text-sky-300'
                  : 'text-slate-600'
                }`}
            >
              Step 3
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${uploadPreview || savedReport
                ? 'text-white'
                : 'text-slate-500'
                }`}
            >
              Review and save
            </p>
          </div>
        </div>

        <FileUploadBox
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          error={fileError}
          disabled={uploadLoading}
        />

        <div className="mt-4 space-y-4">
          {uploadLoading && (
            <UploadProgress progress={uploadProgress} />
          )}

          {error && <ErrorMessage message={error} />}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploadLoading}
              className="inline-flex justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadLoading
                ? 'Processing dataset...'
                : 'Upload and analyze'}
            </button>

            {uploadPreview && !savedReport && (
              <button
                type="button"
                onClick={handleSaveAction}
                disabled={saveLoading}
                className="inline-flex justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveLoading ? 'Saving...' : 'Save report'}
              </button>
            )}

            {uploadPreview && (
              <button
                type="button"
                onClick={handleStartAnother}
                disabled={uploadLoading || saveLoading}
                className="inline-flex justify-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Start another
              </button>
            )}
          </div>
        </div>
      </section>

      {!uploadPreview && !uploadLoading && (
        <section className="mx-auto mt-8 max-w-4xl rounded-3xl border border-slate-800/80 bg-slate-950/50 p-6 text-center">
          <StatusBadge variant="neutral">
            Preview workspace
          </StatusBadge>

          <h2 className="mt-4 text-xl font-semibold text-white">
            Your analysis will appear below
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Nothing is added to report history until you review the generated
            result and save the report.
          </p>
        </section>
      )}

      {savedReport && (
        <section className="mx-auto mt-8 max-w-4xl rounded-3xl border border-emerald-400/25 bg-emerald-500/10 p-6 shadow-xl shadow-emerald-950/10">
          <StatusBadge variant="success" showDot>
            Saved successfully
          </StatusBadge>

          <h2 className="mt-4 text-xl font-semibold text-emerald-50">
            Report added to your history
          </h2>

          <p className="mt-2 text-sm leading-6 text-emerald-100/75">
            The analysis has been saved and can now be reopened from your
            reports page.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/reports/${savedReport._id}`}
              className="inline-flex justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
            >
              Open saved report
            </Link>

            <Link
              to="/reports"
              className="inline-flex justify-center rounded-xl border border-emerald-400/30 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/10"
            >
              View report history
            </Link>
          </div>
        </section>
      )}

      {uploadPreview && analysis && (
        <section className="mt-10 min-w-0 space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28rem)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <StatusBadge variant="info" showDot>
                  Analysis ready
                </StatusBadge>

                <h2 className="mt-5 break-words text-3xl font-bold tracking-tight text-white">
                  {uploadPreview.suggestedTitle || 'Untitled analysis'}
                </h2>

                <p className="mt-3 break-all text-sm leading-6 text-slate-400">
                  Generated from{' '}
                  <span className="font-medium text-slate-200">
                    {uploadPreview.file?.originalFileName}
                  </span>
                </p>
              </div>

              {!savedReport && (
                <button
                  type="button"
                  onClick={handleSaveAction}
                  disabled={saveLoading}
                  className="inline-flex shrink-0 justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveLoading ? 'Saving...' : 'Save this report'}
                </button>
              )}
            </div>
          </div>

          <section>
            <div className="mb-5">
              <StatusBadge variant="neutral">
                Dataset overview
              </StatusBadge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Summary statistics
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Structural and data-quality indicators detected during analysis.
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

          <ChartsGrid charts={analysis.chartData || []} />

          <InsightList insights={analysis.textualInsights || []} />

          <TablePreview tablePreview={analysis.tablePreview} />
        </section>
      )}

      <RenameReportModal
        open={renameModalOpen}
        initialTitle={uploadPreview?.suggestedTitle || ''}
        saving={saveLoading}
        onCancel={() => setRenameModalOpen(false)}
        onConfirm={handleSaveReport}
      />
    </AppLayout>
  );
}

export default Upload;