import { useEffect, useState } from 'react';

function RenameReportModal({
  open,
  initialTitle,
  saving,
  onCancel,
  onConfirm,
}) {
  const [title, setTitle] = useState(initialTitle || '');

  useEffect(() => {
    setTitle(initialTitle || '');
  }, [initialTitle, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (cleanTitle.length < 2) {
      return;
    }

    onConfirm(cleanTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/40">
        <h2 className="text-2xl font-bold text-white">Confirm report name</h2>
        <p className="mt-2 text-sm text-slate-400">
          DataSea generated a suggested title. Confirm it or rename the report
          before saving.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="reportTitle"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Report title
            </label>
            <input
              id="reportTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Report title"
            />
            {title.trim().length > 0 && title.trim().length < 2 && (
              <p className="mt-2 text-sm text-red-300">
                Title must be at least 2 characters.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || title.trim().length < 2}
              className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameReportModal;