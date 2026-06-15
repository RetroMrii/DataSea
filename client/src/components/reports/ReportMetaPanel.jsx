import { useEffect, useState } from 'react';

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
    <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
      <h2 className="text-xl font-semibold text-white">Report metadata</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Original file</dt>
          <dd className="text-right text-slate-200">{report.originalFileName}</dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Type</dt>
          <dd className="text-slate-200">{report.fileType?.toUpperCase()}</dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Size</dt>
          <dd className="text-slate-200">{formatFileSize(report.fileSize)}</dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Created</dt>
          <dd className="text-right text-slate-200">
            {formatDate(report.createdAt)}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">File available until</dt>
          <dd className="text-right text-slate-200">
            {formatDate(report.fileRetentionExpiresAt)}
          </dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
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
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="sales, demo"
          />
          <p className="mt-2 text-xs text-slate-500">
            Separate tags with commas.
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
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
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
          className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving changes...' : 'Save changes'}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-800 pt-6">
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete from history'}
        </button>
      </div>
    </aside>
  );
}

export default ReportMetaPanel;