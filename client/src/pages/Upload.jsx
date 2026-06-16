import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ErrorMessage from '../components/common/ErrorMessage.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import ChartsGrid from '../components/reports/ChartsGrid.jsx';
import InsightList from '../components/reports/InsightList.jsx';
import RenameReportModal from '../components/reports/RenameReportModal.jsx';
import SummaryCard from '../components/reports/SummaryCard.jsx';
import TablePreview from '../components/reports/TablePreview.jsx';
import FileUploadBox from '../components/upload/FileUploadBox.jsx';
import UploadProgress from '../components/upload/UploadProgress.jsx';
import {
  clearReportsError,
  clearUploadPreview,
  saveReport,
  uploadDataset,
} from '../store/slices/reportsSlice.js';

const defaultDescriptionCategory = 'other';

function Upload() {
  const dispatch = useDispatch();

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

    return [
      {
        label: 'Rows',
        value: analysis.rowCount,
        description: 'Total parsed dataset rows',
      },
      {
        label: 'Columns',
        value: analysis.columnCount,
        description: 'Detected dataset columns',
      },
      {
        label: 'Missing values',
        value: analysis.missingValues?.totalMissingValues ?? 0,
        description: 'Empty or unavailable cells',
      },
      {
        label: 'Duplicate rows',
        value: analysis.duplicateRowCount ?? 0,
        description: 'Exact duplicate row count',
      },
      {
        label: 'Outliers',
        value: analysis.outlierSummary?.totalOutliers ?? 0,
        description: 'Detected using backend method',
      },
      {
        label: 'Auto charts',
        value: analysis.chartData?.length ?? 0,
        description: 'Chart data generated for later display',
      },
    ];
  }, [analysis]);

  const handleFileSelect = (file, errorMessage) => {
    setSelectedFile(file);
    setFileError(errorMessage);
    dispatch(clearUploadPreview());
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError('Choose a file before uploading.');
      return;
    }

    setFileError('');
    dispatch(clearReportsError());
    await dispatch(uploadDataset(selectedFile));
  };

  const handleOpenSaveModal = () => {
    if (!uploadPreview) {
      return;
    }

    setRenameModalOpen(true);
  };

  const handleSaveReport = async (title) => {
    if (!uploadPreview?.file || !uploadPreview?.analysis) {
      return;
    }

    const result = await dispatch(
      saveReport({
        title,
        tags: [],
        descriptionCategory: defaultDescriptionCategory,
        file: uploadPreview.file,
        analysis: uploadPreview.analysis,
      })
    );

    if (saveReport.fulfilled.match(result)) {
      setRenameModalOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
          Upload and analyze
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Generate a private report
        </h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Upload a structured file. DataSea will analyze the dataset and show a
          preview before saving anything to your report history.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <FileUploadBox
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            error={fileError}
          />

          {uploadLoading && <UploadProgress progress={uploadProgress} />}

          {error && <ErrorMessage message={error} />}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploadLoading}
              className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadLoading ? 'Analyzing...' : 'Upload and analyze'}
            </button>

            {uploadPreview && (
              <button
                type="button"
                onClick={handleOpenSaveModal}
                disabled={saveLoading}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save report
              </button>
            )}
          </div>

          {savedReport && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
              <p className="font-semibold">Report saved successfully.</p>
              <p className="mt-1 text-sm text-emerald-200/80">
                The report is now stored in MongoDB and available in your
                history.
              </p>
              <Link
                to="/reports"
                className="mt-4 inline-flex rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Go to reports
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!uploadPreview && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8">
              <h2 className="text-xl font-semibold text-white">
                Analysis preview will appear here
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                The original file is uploaded first, then the backend returns
                analysis data. The report is only saved after you confirm the
                generated name.
              </p>
            </div>
          )}

          {uploadPreview && analysis && (
            <>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm text-slate-400">Suggested title</p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {uploadPreview.suggestedTitle || 'Untitled analysis'}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Original file: {uploadPreview.file?.originalFileName}
                </p>
              </div>

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

              <ChartsGrid charts={analysis.chartData || []} />

              <InsightList insights={analysis.textualInsights || []} />

              <TablePreview tablePreview={analysis.tablePreview} />
            </>
          )}
        </div>
      </div>

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