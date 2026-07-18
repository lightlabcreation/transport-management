import type { TrendPoint, ReportType } from '../reports.types';

interface ReportVisualTrendProps {
  trends: TrendPoint[];
  reportType: ReportType;
}

export function ReportVisualTrend({ trends, reportType }: ReportVisualTrendProps) {
  // Determine bar heights based on the active report selection
  const getBarValue = (point: TrendPoint) => {
    if (reportType === 'trips') return point.tripsCount;
    if (reportType === 'speed') return point.complianceRate;
    return point.alertsCount;
  };

  const getMaxValue = () => {
    if (reportType === 'trips') return 120;
    if (reportType === 'speed') return 100;
    return 40;
  };

  const getMetricLabel = () => {
    if (reportType === 'trips') return 'Trips';
    if (reportType === 'speed') return 'Compliance %';
    return 'Alerts';
  };

  const maxValue = getMaxValue();

  return (
    <section
      aria-labelledby="reports-trend-heading"
      className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          id="reports-trend-heading"
          className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground"
        >
          Trend Performance Chart ({getMetricLabel()})
        </h3>
        <span className="text-xs text-muted-foreground">Historical Scale</span>
      </div>

      {/* Accessible Text/Table Alternative for Screen Readers */}
      <div className="sr-only">
        <h4>Accessible Performance Data Table</h4>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr>
              <th>Period</th>
              <th>Trips Count</th>
              <th>Compliance Rate</th>
              <th>Alerts Count</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((point) => (
              <tr key={point.period}>
                <td>{point.period}</td>
                <td>{point.tripsCount}</td>
                <td>{point.complianceRate}%</td>
                <td>{point.alertsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graphical CSS Chart */}
      <div className="flex items-end justify-between h-36 pt-6 px-2 relative" aria-hidden="true">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-0 top-6 border-t border-border/40"></div>
        <div className="absolute inset-x-0 top-18 border-t border-border/40"></div>
        <div className="absolute inset-x-0 top-30 border-t border-border/40"></div>

        {trends.map((point, index) => {
          const val = getBarValue(point);
          const pct = Math.min((val / maxValue) * 100, 100);

          return (
            <div key={index} className="flex flex-col items-center group relative w-full">
              {/* Graphical Bar */}
              <div className="w-8 bg-slate-800 rounded-t-md h-28 flex flex-col justify-end overflow-hidden relative">
                <div
                  style={{ height: `${pct}%` }}
                  className={`w-full z-10 transition-all duration-500 ease-out ${
                    reportType === 'speed'
                      ? 'bg-success/80'
                      : reportType === 'alerts'
                        ? 'bg-danger/80'
                        : 'bg-primary/80'
                  }`}
                  title={`${getMetricLabel()}: ${val}`}
                ></div>
              </div>
              {/* Axis Label */}
              <span className="text-[10px] text-muted-foreground font-semibold mt-2">
                {point.period}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
