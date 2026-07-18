import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { AlertsViewState, AlertRecord } from './alerts.types';
import { MOCK_ALERTS } from './alerts.data';
import { AlertSummaryMetrics } from './components/AlertSummaryMetrics';
import { AlertDetailCard } from './components/AlertDetailCard';
import { AlertsListItems } from './components/AlertsListItems';

// Helper function outside the component to avoid cyclomatic complexity bloat
function isAlertMatching(
  alert: AlertRecord,
  severity: string,
  type: string,
  read: 'all' | 'unread' | 'read',
): boolean {
  if (severity !== 'all' && alert.severity !== severity) return false;
  if (type !== 'all' && alert.type !== type) return false;
  if (read === 'unread' && alert.isRead) return false;
  if (read === 'read' && !alert.isRead) return false;
  return true;
}

// Subcomponent 1: Demo State Switcher
interface SwitcherProps {
  viewState: AlertsViewState;
  setViewState: (val: AlertsViewState) => void;
  setSelectedAlertId: (val: string) => void;
  onReset: () => void;
}

function DemoStateSwitcher({
  viewState,
  setViewState,
  setSelectedAlertId,
  onReset,
}: SwitcherProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Demo State Switcher (Testing Controls)
        </h2>
        <span className="text-[11px] text-muted-foreground">
          Switch states below to verify alerts requirements.
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={viewState === 'normal' ? 'primary' : 'outline'}
          onClick={() => {
            setViewState('normal');
            setSelectedAlertId('alert-1');
          }}
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
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs h-8 ml-auto border-dashed"
        >
          Reset Read Flags
        </Button>
      </div>
    </div>
  );
}

// Subcomponent 2: Filters Bar
interface FiltersBarProps {
  selectedType: string;
  setSelectedType: (val: string) => void;
  readFilter: 'all' | 'unread' | 'read';
  setReadFilter: (val: 'all' | 'unread' | 'read') => void;
  selectedSeverity: string;
  setSelectedSeverity: (val: string) => void;
}

function AlertFiltersBar({
  selectedType,
  setSelectedType,
  readFilter,
  setReadFilter,
  selectedSeverity,
  setSelectedSeverity,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
            className="h-8 text-xs"
          >
            All Types
          </Button>
          <Button
            variant={selectedType === 'speed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('speed')}
            className="h-8 text-xs"
          >
            Speed
          </Button>
          <Button
            variant={selectedType === 'hazard' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('hazard')}
            className="h-8 text-xs"
          >
            Hazards
          </Button>
          <Button
            variant={selectedType === 'safety' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('safety')}
            className="h-8 text-xs"
          >
            Safety
          </Button>
        </div>

        {/* Read Filter */}
        <div className="flex gap-2">
          <Button
            variant={readFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setReadFilter('all')}
            className="h-8 text-xs"
          >
            All Status
          </Button>
          <Button
            variant={readFilter === 'unread' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setReadFilter('unread')}
            className="h-8 text-xs"
          >
            Unread
          </Button>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
        <span className="text-xs text-muted-foreground self-center mr-2">Severity:</span>
        <Button
          variant={selectedSeverity === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedSeverity('all')}
          className="h-7 text-[11px]"
        >
          All Severity
        </Button>
        <Button
          variant={selectedSeverity === 'high' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedSeverity('high')}
          className="h-7 text-[11px]"
        >
          High
        </Button>
        <Button
          variant={selectedSeverity === 'medium' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedSeverity('medium')}
          className="h-7 text-[11px]"
        >
          Medium
        </Button>
        <Button
          variant={selectedSeverity === 'low' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSelectedSeverity('low')}
          className="h-7 text-[11px]"
        >
          Low
        </Button>
      </div>
    </div>
  );
}

interface AlertsPageProps {
  initialViewState?: AlertsViewState;
}

export function AlertsPage({ initialViewState = 'normal' }: AlertsPageProps) {
  const [viewState, setViewState] = useState<AlertsViewState>(initialViewState);
  const [alerts, setAlerts] = useState<AlertRecord[]>(MOCK_ALERTS);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alert-1');
  const [announcement, setAnnouncement] = useState('');

  // Handle read toggles
  const handleMarkRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      setAnnouncement(`Alert "${alert.title}" marked as read.`);
    }
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    setAnnouncement('All alerts marked as read.');
  };

  const handleResetAlerts = () => {
    setAlerts(MOCK_ALERTS);
    setSelectedAlertId('alert-1');
    setAnnouncement('Alerts list reset to initial mock data.');
  };

  // Switch viewState mock lists
  const activeAlerts = viewState === 'empty' ? [] : alerts;

  // Filter logic using helper
  const filteredAlerts = activeAlerts.filter((alert) =>
    isAlertMatching(alert, selectedSeverity, selectedType, readFilter),
  );

  const selectedAlert = filteredAlerts.find((a) => a.id === selectedAlertId) || filteredAlerts[0];

  return (
    <div className="space-y-section max-w-7xl mx-auto p-4 md:p-6 pb-24">
      {/* Hidden screen-reader announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Demo ViewState Switcher */}
      <DemoStateSwitcher
        viewState={viewState}
        setViewState={setViewState}
        setSelectedAlertId={setSelectedAlertId}
        onReset={handleResetAlerts}
      />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-lg font-bold tracking-tight text-foreground">
            Compliance & Hazard Alerts
          </h1>
          <p className="text-body text-muted-foreground">
            Receive and review safety violations, panic warnings, road delays, and operator invites.
          </p>
        </div>
        {viewState === 'normal' && filteredAlerts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="self-start sm:self-center"
          >
            Mark All as Read
          </Button>
        )}
      </header>

      {/* Summary Stats */}
      {viewState !== 'loading' && <AlertSummaryMetrics alerts={activeAlerts} />}

      {/* Loading Skeletons */}
      {viewState === 'loading' && (
        <div className="grid gap-6 md:grid-cols-3 animate-pulse">
          <div className="md:col-span-2 space-y-4">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded-xl"></div>
            <div className="h-20 bg-muted rounded-xl"></div>
            <div className="h-20 bg-muted rounded-xl"></div>
          </div>
          <div className="md:col-span-1">
            <div className="h-[360px] bg-muted rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Data Panel */}
      {viewState !== 'loading' && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main List Column */}
          <div className="md:col-span-2 space-y-4">
            <AlertFiltersBar
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              readFilter={readFilter}
              setReadFilter={setReadFilter}
              selectedSeverity={selectedSeverity}
              setSelectedSeverity={setSelectedSeverity}
            />

            {/* List Items */}
            <AlertsListItems
              alerts={filteredAlerts}
              selectedAlertId={selectedAlert?.id || ''}
              onSelectAlert={(id) => setSelectedAlertId(id)}
            />
          </div>

          {/* Details Sidebar overlay */}
          <div className="md:col-span-1">
            {selectedAlert ? (
              <AlertDetailCard
                alert={selectedAlert}
                onMarkRead={handleMarkRead}
                onClose={() => setSelectedAlertId('')}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground text-xs min-h-[160px] flex items-center justify-center">
                Select an alert from the board to display detailed logs and mark actions here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
