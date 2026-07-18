import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ReportsViewState, ReportPeriod, ReportType } from './reports.types';
import { MOCK_METRICS, MOCK_TRENDS } from './reports.data';
import { ReportSummaryCards } from './components/ReportSummaryCards';
import { ReportVisualTrend } from './components/ReportVisualTrend';

interface ReportsPageProps {
  initialViewState?: ReportsViewState;
}

export function ReportsPage({ initialViewState = 'normal' }: ReportsPageProps) {
  const [viewState, setViewState] = useState<ReportsViewState>(initialViewState);
  const [period, setPeriod] = useState<ReportPeriod>('weekly');
  const [reportType, setReportType] = useState<ReportType>('trips');
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = () => {
    setExportMessage(
      `Simulated export triggered. Your ${period} ${reportType} report is ready in downloads (simulated CSV preview).`,
    );
    // Clear message after a short delay for accessible announcement reset
    setTimeout(() => {
      setExportMessage('');
    }, 6000);
  };

  // Determine active metrics and trends based on period and type
  const activeMetrics = viewState === 'empty' ? [] : MOCK_METRICS[period][reportType];
  const activeTrends = viewState === 'empty' ? [] : MOCK_TRENDS[period];

  return (
    <div className="space-y-section max-w-7xl mx-auto p-4 md:p-6 pb-24">
      {/* Demo ViewState Switcher - Hidden in production, great for verification and testing */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Demo State Switcher (Testing Controls)
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Switch states below to verify reports requirements.
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewState === 'normal' ? 'primary' : 'outline'}
            onClick={() => setViewState('normal')}
            size="sm"
            className="text-xs h-8"
          >
            Normal Data
          </Button>
          <Button
            variant={viewState === 'empty' ? 'primary' : 'outline'}
            onClick={() => setViewState('empty')}
            size="sm"
            className="text-xs h-8"
          >
            Empty State
          </Button>
          <Button
            variant={viewState === 'loading' ? 'primary' : 'outline'}
            onClick={() => setViewState('loading')}
            size="sm"
            className="text-xs h-8"
          >
            Loading State
          </Button>
        </div>
      </div>

      {/* Title Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-lg font-bold tracking-tight text-foreground">
            Operations Performance Audits
          </h1>
          <p className="text-body text-muted-foreground">
            Compile fleet diagnostics, trip records, driver speeds, and compliance alerts log.
          </p>
        </div>
        {viewState === 'normal' && (
          <Button variant="primary" onClick={handleExport} className="self-start sm:self-center">
            Export Report (CSV)
          </Button>
        )}
      </header>

      {/* Controls: Type and Period selection */}
      {viewState !== 'loading' && (
        <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
          {/* Period Selector */}
          <div className="flex gap-2">
            <Button
              variant={period === 'daily' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod('daily')}
              className="h-8 text-xs"
            >
              Daily
            </Button>
            <Button
              variant={period === 'weekly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod('weekly')}
              className="h-8 text-xs"
            >
              Weekly
            </Button>
            <Button
              variant={period === 'monthly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod('monthly')}
              className="h-8 text-xs"
            >
              Monthly
            </Button>
          </div>

          {/* Type Selector */}
          <div className="flex gap-2">
            <Button
              variant={reportType === 'trips' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReportType('trips')}
              className="h-8 text-xs"
            >
              Trips
            </Button>
            <Button
              variant={reportType === 'speed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReportType('speed')}
              className="h-8 text-xs"
            >
              Speed
            </Button>
            <Button
              variant={reportType === 'alerts' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReportType('alerts')}
              className="h-8 text-xs"
            >
              Alerts
            </Button>
          </div>
        </div>
      )}

      {/* Accessible announcement on export click */}
      {exportMessage && (
        <div
          className="rounded-lg border border-success/30 bg-success/10 p-4 text-body-sm text-success flex items-start gap-3 shadow-xs animate-fade-in"
          role="status"
        >
          <svg
            className="h-5 w-5 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-semibold">{exportMessage}</p>
        </div>
      )}

      {/* Skeletons Loading state */}
      {viewState === 'loading' && (
        <div className="space-y-6 animate-pulse">
          <div className="h-12 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="h-[240px] bg-muted rounded-xl"></div>
        </div>
      )}

      {/* Report Cards Grid */}
      {viewState !== 'loading' && <ReportSummaryCards metrics={activeMetrics} />}

      {/* Visual Chart Trend & Accessible Alternative */}
      {viewState !== 'loading' && (
        <>
          {activeTrends.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[260px] space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-body font-bold text-foreground">No Report Data</h2>
              <p className="text-body-sm text-muted-foreground">
                No visual trend or statistics records match the selected parameters.
              </p>
            </div>
          ) : (
            <ReportVisualTrend trends={activeTrends} reportType={reportType} />
          )}
        </>
      )}
    </div>
  );
}
