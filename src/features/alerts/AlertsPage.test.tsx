import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AlertsPage } from './AlertsPage';

describe('AlertsPage MVP Component Tests', () => {
  it('renders the alerts titles, metrics cards, and filters', () => {
    render(<AlertsPage initialViewState="normal" />);

    expect(
      screen.getByRole('heading', { name: /Compliance & Hazard Alerts/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Unread Alerts')).toBeInTheDocument();
    expect(screen.getByText('High Severity')).toBeInTheDocument();

    // Initial unread count is 3, queried inside its parent container
    expect(screen.getByText('Unread Alerts').closest('article')).toHaveTextContent('3');
  });

  it('filters alerts list by type selector buttons', () => {
    render(<AlertsPage initialViewState="normal" />);

    const hazardBtn = screen.getByRole('button', { name: 'Hazards' });
    fireEvent.click(hazardBtn);

    expect(screen.getAllByText('Flooding & Lane Obstruction').length).toBeGreaterThan(0);
    expect(screen.queryByText('High Speed Limit Violation')).not.toBeInTheDocument();
  });

  it('handles individual read state changes and updates metrics', () => {
    render(<AlertsPage initialViewState="normal" />);

    // Select first alert from the list row
    const alertRows = screen.getAllByText('High Speed Limit Violation');
    fireEvent.click(alertRows[0]!);

    const markReadBtn = screen.getByRole('button', { name: 'Mark as Read' });
    fireEvent.click(markReadBtn);

    // Metric unread count drops from 3 to 2, verified in unread alerts card
    expect(screen.getByText('Unread Alerts').closest('article')).toHaveTextContent('2');
  });

  it('handles mark all as read triggers', () => {
    render(<AlertsPage initialViewState="normal" />);

    const markAllBtn = screen.getByRole('button', { name: /Mark All as Read/i });
    fireEvent.click(markAllBtn);

    // Metric unread count is 0
    expect(screen.getByText('Unread Alerts').closest('article')).toHaveTextContent('0');
  });

  it('renders loading states correctly', () => {
    const { container } = render(<AlertsPage initialViewState="loading" />);

    expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByText('Unread Alerts')).not.toBeInTheDocument();
  });

  it('handles empty state display', () => {
    render(<AlertsPage initialViewState="empty" />);

    expect(screen.getByText(/No Alerts Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Everything is clear! No active notices/i)).toBeInTheDocument();
  });
});
