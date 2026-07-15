import { useEffect, useState } from 'react';

import StatusBadge from '../common/StatusBadge.jsx';

const categories = [
  'sales',
  'finance',
  'education',
  'operations',
  'research',
  'marketing',
  'personal',
  'other',
  '',
];

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue));
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return 'Unknown';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ReportMetaPanel({ report, saving, deleting, onUpdate, onDelete }) {
  const [title, setTitle] = useState(report?.title || '');
  const [tagsText, setTagsText] = useState(report?.tags?.join(', ') || '');
  const [descriptionCategory, setDescriptionCategory] = useState(
    report?.descriptionCategory || ''
  );

  useEffect(() => {
    setTitle(report?.title || '');
    setTagsText(report?.tags?.join(', ') || '');
    setDescriptionCategory(report?.descriptionCategory || '');
  }, [report]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    onUpdate({
      title: title.trim(),
      tags,
      descriptionCategory,
    });
  };

  return (
    <aside className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_22rem)]" />

      <div className="relative">
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <StatusBadge variant="neutral" showDot>
                Report controls
              </StatusBadge>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                Report metadata
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Review source details and update the report title, tags, or category.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 px-6 py-5">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Original file
              </dt>
              <dd className="mt-1 break-words text-slate-200">
                {report.originalFileName}
              </dd>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Type
                </dt>
                <dd className="mt-1 text-slate-200">
                  {report.fileType?.toUpperCase() || 'Unknown'}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Size
                </dt>
                <dd className="mt-1 text-slate-200">
                  {formatFileSize(report.fileSize)}
                </dd>
              </div>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Created
              </dt>
              <dd className="mt-1 text-slate-200">
                {formatDate(report.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Original file available until
              </dt>
              <dd className="mt-1 text-slate-200">
                {formatDate(report.fileRetentionExpiresAt)}
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Title
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Report title"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Tags
            </label>

            <input
              id="tags"
              value={tagsText}
              onChange={(event) => setTagsText(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="sales, demo"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Separate multiple tags with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="descriptionCategory"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Category
            </label>

            <select
              id="descriptionCategory"
              value={descriptionCategory}
              onChange={(event) => setDescriptionCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            >
              {categories.map((category) => (
                <option key={category || 'none'} value={category}>
                  {category || 'None'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving || title.trim().length < 2}
            className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving changes...' : 'Save changes'}
          </button>
        </form>

        <div className="border-t border-red-500/20 bg-red-500/5 px-6 py-5">
          <h3 className="text-sm font-semibold text-red-100">Danger zone</h3>

          <p className="mt-2 text-xs leading-5 text-red-100/70">
            Removing this report hides it from your history. You may need to upload
            the original file again to recreate the analysis.
          </p>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="mt-4 w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete from history'}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default ReportMetaPanel;