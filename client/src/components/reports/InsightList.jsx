import EmptyState from '../common/EmptyState.jsx';
import StatusBadge from '../common/StatusBadge.jsx';

function getInsightVariant(insight) {
  const text = String(insight || '').toLowerCase();

  if (
    text.includes('missing') ||
    text.includes('duplicate') ||
    text.includes('outlier') ||
    text.includes('warning') ||
    text.includes('issue')
  ) {
    return {
      border: 'border-amber-400/20',
      background: 'bg-amber-500/10',
      iconBackground: 'bg-amber-500/15',
      iconBorder: 'border-amber-400/30',
      iconText: 'text-amber-200',
      badge: 'warning',
      label: 'Review',
      icon: '!',
    };
  }

  if (
    text.includes('complete') ||
    text.includes('clean') ||
    text.includes('no missing') ||
    text.includes('no duplicate') ||
    text.includes('consistent')
  ) {
    return {
      border: 'border-emerald-400/20',
      background: 'bg-emerald-500/10',
      iconBackground: 'bg-emerald-500/15',
      iconBorder: 'border-emerald-400/30',
      iconText: 'text-emerald-200',
      badge: 'success',
      label: 'Positive',
      icon: '✓',
    };
  }

  return {
    border: 'border-sky-400/20',
    background: 'bg-sky-500/10',
    iconBackground: 'bg-sky-500/15',
    iconBorder: 'border-sky-400/30',
    iconText: 'text-sky-200',
    badge: 'info',
    label: 'Insight',
    icon: 'i',
  };
}

function InsightList({ insights = [] }) {
  if (!insights.length) {
    return (
      <EmptyState
        title="No insights generated"
        description="The analysis did not return textual insights for this file."
        icon="i"
      />
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_24rem)]" />

      <div className="relative">
        <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <StatusBadge variant="info" showDot>
              Automated findings
            </StatusBadge>

            <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
              Generated insights
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Key observations derived from data quality, distributions, and statistical analysis.
            </p>
          </div>

          <StatusBadge variant="neutral">
            {insights.length} insight{insights.length === 1 ? '' : 's'}
          </StatusBadge>
        </div>

        <ul className="mt-5 space-y-4">
          {insights.map((insight, index) => {
            const style = getInsightVariant(insight);

            return (
              <li
                key={`${index}-${insight}`}
                className={`rounded-2xl border p-4 sm:p-5 ${style.border} ${style.background}`}
              >
                <div className="flex gap-4">
                  <div
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold ${style.iconBorder} ${style.iconBackground} ${style.iconText}`}
                  >
                    {style.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <StatusBadge variant={style.badge}>
                      {style.label}
                    </StatusBadge>

                    <p className="mt-3 break-words text-sm leading-6 text-slate-200">
                      {insight}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default InsightList;