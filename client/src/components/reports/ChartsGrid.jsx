import EmptyState from '../common/EmptyState.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import ChartPanel from './ChartPanel.jsx';

function ChartsGrid({ charts = [] }) {
  const visualCharts = charts.filter(
    (chart) => chart && chart.chartType !== 'table'
  );

  if (!visualCharts.length) {
    return (
      <EmptyState
        title="No visual charts available"
        description="This report does not contain renderable chart data."
        icon="◌"
      />
    );
  }

  const [featuredChart, ...secondaryCharts] = visualCharts;

  return (
    <section className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge variant="info" showDot>
              Visual analysis
            </StatusBadge>

            <StatusBadge variant="neutral">
              {visualCharts.length} chart{visualCharts.length === 1 ? '' : 's'}
            </StatusBadge>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Explore the data visually
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Automatically generated charts highlight distributions, trends,
            category frequency, and numeric relationships detected in the dataset.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ChartPanel chart={featuredChart} featured />

        {secondaryCharts.length > 0 && (
          <div className="grid min-w-0 gap-6 xl:grid-cols-2">
            {secondaryCharts.map((chart) => (
              <ChartPanel
                key={chart.chartId || chart.title}
                chart={chart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ChartsGrid;