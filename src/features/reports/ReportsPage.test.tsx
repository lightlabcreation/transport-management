import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReportsPage } from './ReportsPage';

describe('ReportsPage MVP Component Tests', () => {
  it('renders the reports title and visual chart axis labels', () => {
    render(<ReportsPage initialViewState="normal" />);

    expect(
      screen.getByRole('heading', { name: /Operations Performance Audits/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Report \(CSV\)/i })).toBeInTheDocument();

    // Check metric cards rendering
    expect(screen.getByText('Completed Trips')).toBeInTheDocument();
  });

  it('toggles filters for period selection and report types updates metrics', () => {
    render(<ReportsPage initialViewState="normal" />);

    // Change to Speed compliance metrics
    const speedTypeBtn = screen.getByRole('button', { name: 'Speed' });
    fireEvent.click(speedTypeBtn);

    expect(screen.getByText('Compliance Score')).toBeInTheDocument();
    expect(screen.getByText('96.2%')).toBeInTheDocument(); // Weekly speed compliance is 96.2%

    // Change period to Daily
    const dailyPeriodBtn = screen.getByRole('button', { name: 'Daily' });
    fireEvent.click(dailyPeriodBtn);

    expect(screen.getByText('98.5%')).toBeInTheDocument(); // Daily speed compliance score is 98.5%
  });

  it('renders accessible tabular data screen-reader alternatives of chart trends', () => {
    render(<ReportsPage initialViewState="normal" />);

    // Alt text headers must exist
    expect(
      screen.getByRole('heading', { name: /Accessible Performance Data Table/i, level: 4 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Trips Count' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Compliance Rate' })).toBeInTheDocument();
  });

  it('displays simulated toast notification triggers upon clicking export action', () => {
    render(<ReportsPage initialViewState="normal" />);

    const exportBtn = screen.getByRole('button', { name: /Export Report \(CSV\)/i });
    fireEvent.click(exportBtn);

    expect(
      screen.getByText(/Simulated export triggered. Your weekly trips report is ready/i),
    ).toBeInTheDocument();
  });

  it('handles loading state skeletons', () => {
    const { container } = render(<ReportsPage initialViewState="loading" />);

    expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByText('Completed Trips')).not.toBeInTheDocument();
  });

  it('handles empty state illustration layouts', () => {
    render(<ReportsPage initialViewState="empty" />);

    expect(screen.getByText(/No Report Data/i)).toBeInTheDocument();
    expect(screen.getByText(/No visual trend or statistics records match/i)).toBeInTheDocument();
  });
});
