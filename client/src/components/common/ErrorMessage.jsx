function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
      <p className="text-sm">{message}</p>

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
  );
}

export default ErrorMessage;