function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-950 shadow-2xl shadow-black/50"
      >
        <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg font-bold ${danger
                ? 'border-red-400/30 bg-red-500/15 text-red-200'
                : 'border-sky-400/30 bg-sky-500/15 text-sky-200'
                }`}
            >
              {danger ? '!' : '?'}
            </div>

            <div className="min-w-0">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-bold tracking-tight text-white"
              >
                {title}
              </h2>

              {description && (
                <p
                  id="confirm-dialog-description"
                  className="mt-2 text-sm leading-6 text-slate-400"
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${danger
              ? 'bg-red-500 text-white hover:bg-red-400'
              : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
              }`}
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;