import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">
        The page you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300"
      >
        Back home
      </Link>
    </div>
  );
}

export default NotFound;