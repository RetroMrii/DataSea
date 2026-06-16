import EmptyState from '../common/EmptyState.jsx';

function TablePreview({ tablePreview }) {
  const columns = tablePreview?.columns || [];
  const rows = tablePreview?.rows || [];

  if (!columns.length || !rows.length) {
    return (
      <EmptyState
        title="No table preview"
        description="The backend did not return preview rows for this file."
      />
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Table preview</h2>
          <p className="mt-1 text-sm text-slate-400">
            Showing up to {tablePreview.maxRowsShown || rows.length} rows.
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-4 py-3 font-semibold text-slate-200"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join('-')}`} className="bg-slate-950">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="whitespace-nowrap px-4 py-3 text-slate-300"
                  >
                    {cell === '' || cell === null || cell === undefined
                      ? '—'
                      : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablePreview;