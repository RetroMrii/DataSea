const variants = {
  neutral: {
    border: 'border-slate-800/80',
    glow: 'bg-slate-500/10',
    accent: 'text-slate-300',
    bar: 'bg-slate-400',
  },
  info: {
    border: 'border-sky-400/20',
    glow: 'bg-sky-500/10',
    accent: 'text-sky-300',
    bar: 'bg-sky-400',
  },
  success: {
    border: 'border-emerald-400/20',
    glow: 'bg-emerald-500/10',
    accent: 'text-emerald-300',
    bar: 'bg-emerald-400',
  },
  warning: {
    border: 'border-amber-400/20',
    glow: 'bg-amber-500/10',
    accent: 'text-amber-300',
    bar: 'bg-amber-400',
  },
  danger: {
    border: 'border-red-400/20',
    glow: 'bg-red-500/10',
    accent: 'text-red-300',
    bar: 'bg-red-400',
  },
};

function SummaryCard({
  label,
  value,
  description,
  variant = 'neutral',
  progress,
  suffix,
}) {
  const style = variants[variant] || variants.neutral;
  const safeProgress = Number.isFinite(progress)
    ? Math.min(Math.max(progress, 0), 100)
    : null;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-slate-950/70 p-5 shadow-xl shadow-slate-950/20 backdrop-blur ${style.border}`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative">
        <p className="text-sm font-medium text-slate-400">{label}</p>

        <div className="mt-3 flex items-end gap-2">
          <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {value}
          </p>

          {suffix && (
            <span className={`pb-1 text-sm font-semibold ${style.accent}`}>
              {suffix}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-3 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}

        {safeProgress !== null && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Data quality</span>
              <span className={style.accent}>
                {safeProgress.toFixed(0)}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${style.bar}`}
                style={{ width: `${safeProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default SummaryCard;