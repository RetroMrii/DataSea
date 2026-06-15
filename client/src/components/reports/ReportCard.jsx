import { Link } from 'react-router-dom';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue));
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return 'Unknown size';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ReportCard({ report }) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-sky-500/50 hover:bg-slate-950">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            {report.fileType?.toUpperCase() || 'DATASET'}
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            {report.title}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {report.originalFileName}
          </p>
        </div>

        <Link
          to={`/reports/${report._id}`}
          className="inline-flex rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
        >
          Open report
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 p-3">
          <p className="text-xs text-slate-500">Rows</p>
          <p className="mt-1 font-semibold text-white">{report.rowCount ?? 0}</p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-3">
          <p className="text-xs text-slate-500">Columns</p>
          <p className="mt-1 font-semibold text-white">
            {report.columnCount ?? 0}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-3">
          <p className="text-xs text-slate-500">File size</p>
          <p className="mt-1 font-semibold text-white">
            {formatFileSize(report.fileSize)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 p-3">
          <p className="text-xs text-slate-500">Created</p>
          <p className="mt-1 font-semibold text-white">
            {formatDate(report.createdAt)}
          </p>
        </div>
      </div>

      {report.tags?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {report.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default ReportCard;