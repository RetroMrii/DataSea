function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-slate-300">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default LoadingSpinner;