import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
          Analytics dashboard
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Understand your data without reading every row.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          DataSea turns CSV, JSON, and XLSX files into private visual reports,
          summary statistics, automatic charts, and concise insights.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300"
          >
            Create account
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-sky-950/20">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Sample report</p>
            <h2 className="text-xl font-semibold text-white">Sales analysis</h2>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Private
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Rows', '11'],
            ['Columns', '5'],
            ['Outliers', '3'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-slate-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Category frequency</p>
            <p className="text-xs text-slate-500">auto chart</p>
          </div>
          <div className="space-y-3">
            {[
              ['Electronics', '54%'],
              ['Office', '27%'],
              ['Furniture', '18%'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs text-slate-400">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-sky-400"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;