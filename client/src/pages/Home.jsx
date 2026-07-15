import { Link } from 'react-router-dom';

const featureCards = [
  {
    label: 'Upload',
    title: 'Structured file support',
    description:
      'Analyze CSV, JSON, and XLSX datasets through one consistent workflow.',
    icon: '01',
  },
  {
    label: 'Analyze',
    title: 'Automatic insights',
    description:
      'Generate summary statistics, data-quality indicators, charts, and concise observations.',
    icon: '02',
  },
  {
    label: 'Save',
    title: 'Private report history',
    description:
      'Keep generated reports associated with your account and reopen them whenever needed.',
    icon: '03',
  },
];

const reportMetrics = [
  {
    label: 'Rows',
    value: '11,248',
    change: 'Parsed',
  },
  {
    label: 'Columns',
    value: '18',
    change: 'Detected',
  },
  {
    label: 'Completeness',
    value: '98.4%',
    change: 'Healthy',
  },
];

const categoryBars = [
  {
    label: 'Electronics',
    value: '54%',
    width: '54%',
  },
  {
    label: 'Office',
    value: '27%',
    width: '27%',
  },
  {
    label: 'Furniture',
    value: '19%',
    width: '19%',
  },
];

function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              Private data analysis
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn raw datasets into clear, usable reports.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            DataSea analyzes structured files and produces summary statistics,
            quality indicators, charts, table previews, and concise insights
            without requiring manual spreadsheet review.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300"
            >
              Create free account
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-600 hover:bg-slate-900"
            >
              Log in
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ['Supported formats', 'CSV · JSON · XLSX'],
              ['Report access', 'Private by account'],
              ['Workflow', 'Upload · Review · Save'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/45 px-4 py-3 backdrop-blur"
              >
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  {label}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_24rem)]" />

            <div className="relative">
              <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Sample report
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Sales performance analysis
                  </h2>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Analysis ready
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {reportMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {metric.label}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-white">
                      {metric.value}
                    </p>

                    <p className="mt-1 text-xs text-sky-300">
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      Category distribution
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Auto-generated frequency chart
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Bar chart
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {categoryBars.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300">
                          {item.label}
                        </span>

                        <span className="text-slate-500">
                          {item.value}
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300"
                          style={{ width: item.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-sky-400/15 bg-sky-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
                  Generated insight
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Electronics accounts for more than half of categorized sales,
                  making it the dominant segment in this dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800/80 bg-slate-950/35">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
              From file upload to saved report
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
              The application keeps analysis focused: upload structured data,
              inspect the generated result, then save only the reports you want
              to retain.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.label}
                className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sm font-bold text-sky-300">
                  {feature.icon}
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {feature.label}
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;