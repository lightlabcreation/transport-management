import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TripsPage } from './TripsPage';

describe('TripsPage MVP Component Tests', () => {
  it('renders the trips page heading and summary statistics cards', () => {
    render(<TripsPage initialViewState="normal" />);

    expect(screen.getByRole('heading', { name: /Trips Log Directory/i })).toBeInTheDocument();
    expect(screen.getByText('Total Trips')).toBeInTheDocument();
    expect(screen.getByText('Active Routes')).toBeInTheDocument();

    // Check metric counters (sum of distances: 14.5 + 28.0 + 8.2 + 14.5 + 11.2 = 76.4 km)
    expect(screen.getByText('76.4')).toBeInTheDocument();
  });

  it('filters trips list based on user search keywords', () => {
    render(<TripsPage initialViewState="normal" />);

    const searchField = screen.getByPlaceholderText(/Search route, driver, bus.../i);

    // Search by driver
    fireEvent.change(searchField, { target: { value: 'Amit Kumar' } });
    expect(screen.getAllByText('Central Terminal to Outer Bypass Express').length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText('High School Pick-up Loop B')).not.toBeInTheDocument();

    // Search by vehicle
    fireEvent.change(searchField, { target: { value: 'V-5541' } });
    expect(screen.getAllByText('High School Pick-up Loop B').length).toBeGreaterThan(0);
    expect(screen.queryByText('Central Terminal to Outer Bypass Express')).not.toBeInTheDocument();
  });

  it('filters trips list based on status filters buttons', () => {
    render(<TripsPage initialViewState="normal" />);

    // Switch to active
    const activeBtn = screen.getByRole('button', { name: 'Active' });
    fireEvent.click(activeBtn);

    expect(screen.getAllByText('High School Pick-up Loop B').length).toBeGreaterThan(0);
    expect(screen.queryByText('Sector 12 School Route to Depot 3')).not.toBeInTheDocument();
  });

  it('updates selected details panel when a list item is selected', () => {
    render(<TripsPage initialViewState="normal" />);

    // Select trip-2 in lists
    const tripRows = screen.getAllByText('Central Terminal to Outer Bypass Express');
    // First is mobile card, second is desktop table row. Click either.
    fireEvent.click(tripRows[0]!);

    // Telemetry details displayed inside Detail card
    expect(screen.getByRole('heading', { name: /Trip Log Details/i })).toBeInTheDocument();
    expect(screen.getByText('👤 Amit Kumar')).toBeInTheDocument();
    expect(screen.getByText('🚌 Bus UP-16-T-8854')).toBeInTheDocument();
    expect(screen.getByText('58 km/h')).toBeInTheDocument();
    expect(screen.getByText('84 km/h')).toBeInTheDocument();
  });

  it('renders loading states correctly', () => {
    const { container } = render(<TripsPage initialViewState="loading" />);

    expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByText('Total Trips')).not.toBeInTheDocument();
  });

  it('renders empty layout when trips list is empty', () => {
    render(<TripsPage initialViewState="empty" />);

    expect(screen.getByText(/No Trips Found/i)).toBeInTheDocument();
    expect(screen.getByText(/No records match your query or filters/i)).toBeInTheDocument();
  });
});
