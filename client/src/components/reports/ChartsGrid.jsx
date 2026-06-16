import EmptyState from '../common/EmptyState.jsx';
import ChartPanel from './ChartPanel.jsx';

function ChartsGrid({ charts = [] }) {
  const visualCharts = charts.filter((chart) => chart.chartType !== 'table');

  if (!visualCharts.length) {
    return (
      <EmptyState
        title="No visual charts available"
        description="This report does not contain renderable chart data."
      />
    );
  }

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">Visual analysis</h2>
        <p className="mt-2 text-sm text-slate-400">
          Automatically generated charts based on detected numeric and
          categorical columns.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {visualCharts.map((chart) => (
          <ChartPanel key={chart.chartId || chart.title} chart={chart} />
        ))}
      </div>
    </section>
  );
}

export default ChartsGrid;