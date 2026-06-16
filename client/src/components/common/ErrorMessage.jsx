function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm">
          !
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-red-100">Error</p>
          <p className="mt-1 break-words text-sm leading-6 text-red-100/90">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;