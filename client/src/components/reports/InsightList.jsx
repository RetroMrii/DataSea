import EmptyState from '../common/EmptyState.jsx';

function InsightList({ insights = [] }) {
  if (!insights.length) {
    return (
      <EmptyState
        title="No insights generated"
        description="The analysis did not return textual insights for this file."
      />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
      <h2 className="text-xl font-semibold text-white">Generated insights</h2>

      <ul className="mt-5 space-y-3">
        {insights.map((insight) => (
          <li
            key={insight}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
          >
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsightList;