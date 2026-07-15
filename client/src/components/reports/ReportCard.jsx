import { Link } from 'react-router-dom';

import StatusBadge from '../common/StatusBadge.jsx';
import formatDate from '../../utils/formatDate.js';
import formatFileSize from '../../utils/formatFileSize.js';

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '0';
  }

  return new Intl.NumberFormat('en').format(number);
}

function ReportMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/55 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function ReportCard({ report }) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/15 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-950/20 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.07),transparent_22rem)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge variant="info" showDot>
                {report.fileType?.toUpperCase() || 'DATASET'}
              </StatusBadge>

              {report.descriptionCategory && (
                <StatusBadge>{report.descriptionCategory}</StatusBadge>
              )}

              {report.isOriginalFileAvailable === false && (
                <StatusBadge variant="warning">File expired</StatusBadge>
              )}
            </div>

            <h2 className="mt-4 break-words text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {report.title || 'Untitled report'}
            </h2>

            <p className="mt-2 break-all text-sm leading-6 text-slate-400">
              {report.originalFileName || 'Unknown source file'}
            </p>
          </div>

          <Link
            to={`/reports/${report._id}`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300"
          >
            Open report
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReportMetric
            label="Rows"
            value={formatNumber(report.rowCount)}
          />

          <ReportMetric
            label="Columns"
            value={formatNumber(report.columnCount)}
          />

          <ReportMetric
            label="File size"
            value={formatFileSize(report.fileSize)}
          />

          <ReportMetric
            label="Created"
            value={formatDate(report.createdAt)}
          />
        </div>

        {report.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
            {report.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default ReportCard;