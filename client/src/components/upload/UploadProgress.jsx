function UploadProgress({ progress = 0 }) {
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);
  const analyzing = safeProgress >= 100;

  return (
    <section
      aria-live="polite"
      className="overflow-hidden rounded-3xl border border-sky-400/20 bg-slate-950/70 shadow-xl shadow-slate-950/20 backdrop-blur"
    >
      <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
        <div className="relative mt-0.5 h-11 w-11 shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sky-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold text-white">
                {analyzing ? 'Analyzing dataset' : 'Uploading file'}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {analyzing
                  ? 'Upload complete. DataSea is parsing columns, calculating statistics, and generating charts.'
                  : 'Transferring the selected file securely to the analysis service.'}
              </p>
            </div>

            {!analyzing && (
              <span className="shrink-0 text-sm font-semibold text-sky-300">
                {Math.round(safeProgress)}%
              </span>
            )}
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full bg-sky-400 transition-all duration-300 ${analyzing ? 'animate-pulse' : ''
                }`}
              style={{ width: analyzing ? '100%' : `${safeProgress}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div
              className={`rounded-xl border px-3 py-2 ${analyzing
                ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                : 'border-sky-400/20 bg-sky-500/10 text-sky-200'
                }`}
            >
              <span className="font-semibold">1. Upload</span>
              <span className="ml-2">
                {analyzing ? 'Complete' : 'In progress'}
              </span>
            </div>

            <div
              className={`rounded-xl border px-3 py-2 ${analyzing
                ? 'border-sky-400/20 bg-sky-500/10 text-sky-200'
                : 'border-slate-800 bg-slate-900/50 text-slate-500'
                }`}
            >
              <span className="font-semibold">2. Analysis</span>
              <span className="ml-2">
                {analyzing ? 'In progress' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadProgress;