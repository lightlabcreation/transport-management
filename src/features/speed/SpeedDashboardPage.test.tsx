import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpeedDashboardPage } from './SpeedDashboardPage';

describe('SpeedDashboardPage MVP Component Tests', () => {
  it('renders the Main Speed Dashboard title and informational banner', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    expect(
      screen.getByRole('heading', { name: /Speed Intelligence Dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/This is a frontend preview using mock data/i)).toBeInTheDocument();
  });

  it('renders current speed and configured speed limit', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    // Check current speed display
    expect(screen.getByText('72')).toBeInTheDocument();
    // Check configured speed limit display
    expect(screen.getByText('80')).toBeInTheDocument();
  });

  it('renders Safe state presentation when speed is below limit', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    expect(screen.getByText(/Speed Under Control/i)).toBeInTheDocument();
  });

  it('renders Over-limit presentation when speed exceeds limit', () => {
    render(<SpeedDashboardPage initialViewState="over-limit" />);

    expect(screen.getByText(/Speed Limit Exceeded/i)).toBeInTheDocument();
  });

  it('renders all summary metrics correctly', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    expect(screen.getByText('52.4')).toBeInTheDocument();
    expect(screen.getByText('84')).toBeInTheDocument();
    expect(screen.getByText('145.2')).toBeInTheDocument();
    expect(screen.getByText('2h 45m')).toBeInTheDocument();
  });

  it('renders recent activity driving sessions list', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    expect(screen.getByText('Express Highway Route')).toBeInTheDocument();
    expect(screen.getByText('Local Delivery Loop')).toBeInTheDocument();
    expect(screen.getByText('Morning Shift - Driver Route')).toBeInTheDocument();
  });

  it('renders speed violations with severity indicators', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    expect(screen.getByText('Highway Junction (Sec-62)')).toBeInTheDocument();
    expect(screen.getByText('low Risk')).toBeInTheDocument();

    expect(screen.getByText('School Zone Main Road')).toBeInTheDocument();
    expect(screen.getByText('medium Risk')).toBeInTheDocument();
  });

  it('handles empty activity state presentation', () => {
    render(<SpeedDashboardPage initialViewState="empty-activity" />);

    expect(
      screen.getByText(/No recent driving sessions recorded in the system/i),
    ).toBeInTheDocument();
  });

  it('handles empty violations state presentation', () => {
    render(<SpeedDashboardPage initialViewState="empty-violations" />);

    expect(screen.getByText(/No speed violations detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Keep up the safe driving practices/i)).toBeInTheDocument();
  });

  it('handles loading state layout', () => {
    const { container } = render(<SpeedDashboardPage initialViewState="loading" />);

    // Skeletons are rendered via animate-pulse class names
    const loadingElements = container.getElementsByClassName('animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);

    // Essential sections are hidden
    expect(screen.queryByText('Speed Intelligence Dashboard')).toBeInTheDocument(); // Title is still visible
    expect(screen.queryByText('Current Telemetry')).not.toBeInTheDocument();
  });

  it('handles data-unavailable error state', () => {
    render(<SpeedDashboardPage initialViewState="unavailable" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Data Stream Offline/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Unable to connect to the vehicle telemetry service/i),
    ).toBeInTheDocument();
  });

  it('includes accessible textual screen-reader summary for the CSS trend chart', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    expect(
      screen.getByRole('heading', { name: /Weekly Speed Data Summary/i, level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mon: Average speed 48 km\/h, Maximum speed 75 km\/h/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Thu: Average speed 60 km\/h, Maximum speed 95 km\/h/i),
    ).toBeInTheDocument();
  });

  it('allows state transitions via the interactive demo control buttons', () => {
    render(<SpeedDashboardPage initialViewState="normal" />);

    // Initial safe state
    expect(screen.getByText(/Speed Under Control/i)).toBeInTheDocument();

    // Switch to Over Limit
    const overLimitBtn = screen.getByRole('button', { name: /Over Limit State/i });
    fireEvent.click(overLimitBtn);
    expect(screen.getByText(/Speed Limit Exceeded/i)).toBeInTheDocument();

    // Switch to Loading
    const loadingBtn = screen.getByRole('button', { name: /Loading State/i });
    fireEvent.click(loadingBtn);
    expect(screen.queryByText('Current Telemetry')).not.toBeInTheDocument();
  });
});
