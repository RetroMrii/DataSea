function LoadingSpinner({ message = 'Loading...', compact = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 text-slate-300 ${compact ? 'min-h-24 py-6' : 'min-h-40 py-10'
        }`}
    >
      <div className="relative h-11 w-11">
        <div className="absolute inset-0 rounded-full border border-sky-400/20 bg-sky-400/5 blur-sm" />
        <div className="absolute inset-1 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
        <div className="absolute inset-4 rounded-full bg-sky-300/70" />
      </div>

      <p className="text-center text-sm font-medium text-slate-300">{message}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default LoadingSpinner;