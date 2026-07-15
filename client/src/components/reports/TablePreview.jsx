import EmptyState from '../common/EmptyState.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { usePreferences } from '../../context/PreferencesContext.jsx';

function isMissingValue(value) {
  return value === '' || value === null || value === undefined;
}

function TablePreview({ tablePreview }) {
  const { preferences } = usePreferences();

  const columns = tablePreview?.columns || [];
  const rows = tablePreview?.rows || [];

  const cellSpacing =
    preferences.tableDensity === 'compact'
      ? 'px-3 py-2'
      : 'px-4 py-3';

  if (!columns.length || !rows.length) {
    return (
      <EmptyState
        title="No table preview"
        description="The backend did not return preview rows for this file."
        icon="▦"
      />
    );
  }

  const visibleRowCount =
    tablePreview.maxRowsShown || rows.length;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.07),transparent_24rem)]" />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <StatusBadge variant="neutral" showDot>
              Data preview
            </StatusBadge>

            <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
              Table preview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Showing up to {visibleRowCount} preview rows from the uploaded
              dataset.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="info">
              {columns.length} column{columns.length === 1 ? '' : 's'}
            </StatusBadge>

            <StatusBadge variant="neutral">
              {rows.length} row{rows.length === 1 ? '' : 's'}
            </StatusBadge>

            <StatusBadge variant="neutral">
              {preferences.tableDensity === 'compact'
                ? 'Compact'
                : 'Comfortable'}
            </StatusBadge>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                <th
                  className={`sticky left-0 z-20 whitespace-nowrap border-b border-r border-slate-800 bg-slate-900 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 ${cellSpacing}`}
                >
                  #
                </th>

                {columns.map((column) => (
                  <th
                    key={column}
                    className={`whitespace-nowrap border-b border-slate-800 bg-slate-900 font-semibold text-slate-200 ${cellSpacing}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="max-w-56 truncate">
                        {column}
                      </span>

                      <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        field
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={`${rowIndex}-${row.join('-')}`}
                  className="group transition-colors hover:bg-slate-900/70"
                >
                  <td
                    className={`sticky left-0 z-10 whitespace-nowrap border-b border-r border-slate-800 bg-slate-950 text-xs font-semibold text-slate-500 group-hover:bg-slate-900 ${cellSpacing}`}
                  >
                    {rowIndex + 1}
                  </td>

                  {row.map((cell, cellIndex) => {
                    const missing = isMissingValue(cell);

                    return (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className={`max-w-80 whitespace-nowrap border-b border-slate-800 text-slate-300 ${cellSpacing}`}
                        title={
                          missing
                            ? 'Missing value'
                            : String(cell)
                        }
                      >
                        {missing ? (
                          <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-300">
                            Missing
                          </span>
                        ) : (
                          <span className="block max-w-72 truncate">
                            {String(cell)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Scroll horizontally to inspect wide datasets. This preview does not
          modify the saved report.
        </p>
      </div>
    </section>
  );
}

export default TablePreview;