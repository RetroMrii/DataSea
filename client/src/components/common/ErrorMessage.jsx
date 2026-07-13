function ErrorMessage({ message = 'Something went wrong.', onRetry, title = 'Error' }) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-red-500/25 bg-red-500/10 p-4 text-red-100 shadow-lg shadow-red-950/10 sm:p-5"
    >
      <div className="flex gap-4">
        <div
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/15 text-sm font-bold text-red-200"
        >
          !
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-red-100">{title}</p>

          <p className="mt-1 break-words text-sm leading-6 text-red-100/85">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-xl border border-red-400/30 bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-50 transition-colors hover:bg-red-500/30"
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