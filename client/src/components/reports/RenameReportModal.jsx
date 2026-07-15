import { useEffect, useRef, useState } from 'react';

function RenameReportModal({
  open,
  initialTitle,
  saving,
  onCancel,
  onConfirm,
}) {
  const [title, setTitle] = useState(initialTitle || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setTitle(initialTitle || '');
  }, [initialTitle, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) {
        onCancel?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, saving, onCancel]);

  if (!open) {
    return null;
  }

  const cleanTitle = title.trim();
  const titleInvalid = cleanTitle.length > 0 && cleanTitle.length < 2;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cleanTitle.length < 2) {
      return;
    }

    onConfirm(cleanTitle);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onCancel?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-report-title"
        aria-describedby="rename-report-description"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-950 shadow-2xl shadow-black/50"
      >
        <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/15 text-sm font-bold text-sky-200"
            >
              DS
            </div>

            <div className="min-w-0">
              <h2
                id="rename-report-title"
                className="text-xl font-bold tracking-tight text-white"
              >
                Confirm report name
              </h2>

              <p
                id="rename-report-description"
                className="mt-2 text-sm leading-6 text-slate-400"
              >
                DataSea generated a suggested title. Confirm it or rename the report
                before saving.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <label
              htmlFor="reportTitle"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Report title
            </label>

            <input
              ref={inputRef}
              id="reportTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Report title"
              maxLength={120}
              aria-invalid={titleInvalid}
              aria-describedby={titleInvalid ? 'report-title-error' : undefined}
            />

            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                {titleInvalid && (
                  <p id="report-title-error" className="text-sm text-red-300">
                    Title must be at least 2 characters.
                  </p>
                )}
              </div>

              <p className="shrink-0 text-xs text-slate-500">
                {title.length}/120
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || cleanTitle.length < 2}
              className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
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