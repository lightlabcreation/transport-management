import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavigationPage } from './NavigationPage';

describe('NavigationPage MVP Component Tests', () => {
  it('renders the navigation titles and mock disclaimer warning banner', () => {
    render(<NavigationPage initialViewState="normal" />);

    expect(
      screen.getByRole('heading', { name: /Operations & Navigation Guidance/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Simulated Navigation Portal/i)).toBeInTheDocument();
  });

  it('renders inputs and supports changing origin and destination', () => {
    render(<NavigationPage initialViewState="normal" />);

    const originInput = screen.getByLabelText(/Origin/i);
    const destInput = screen.getByLabelText(/Destination/i);

    expect(originInput).toHaveValue('School Depot Yard');
    expect(destInput).toHaveValue('St. Mary School Ground, Sector 12');

    fireEvent.change(originInput, { target: { value: 'Central Terminal' } });
    fireEvent.change(destInput, { target: { value: 'Sector 62 Library' } });

    expect(originInput).toHaveValue('Central Terminal');
    expect(destInput).toHaveValue('Sector 62 Library');
  });

  it('allows choosing a route option and updates display metrics', () => {
    render(<NavigationPage initialViewState="normal" />);

    // Choose route 2
    const routeButton = screen.getByRole('button', { name: /Sector 62 Main Road Bypass/i });
    fireEvent.click(routeButton);

    expect(screen.getByText('12 km')).toBeInTheDocument();
    expect(screen.getByText('28 mins')).toBeInTheDocument();
    expect(screen.getByText(/MODERATE TRAFFIC/i)).toBeInTheDocument();
    expect(screen.getByText(/Minor water logging near subway/i)).toBeInTheDocument();
  });

  it('supports Start Navigation action and renders guidelines alerts', () => {
    render(<NavigationPage initialViewState="normal" />);

    const startBtn = screen.getByRole('button', { name: /Start Simulated Guidance/i });
    fireEvent.click(startBtn);

    expect(screen.getByText(/Simulated GPS active. Route guidance started/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel Guidance/i })).toBeInTheDocument();
  });

  it('renders loading view skeletons when viewState is loading', () => {
    const { container } = render(<NavigationPage initialViewState="loading" />);

    expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByText('Trip Planner')).not.toBeInTheDocument();
  });

  it('renders route-unavailable failure warnings', () => {
    render(<NavigationPage initialViewState="unavailable" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Navigation Provider Offline/i)).toBeInTheDocument();
  });

  it('supports no-route configuration placeholder and resets', () => {
    render(<NavigationPage initialViewState="no-route" />);

    expect(screen.getByText(/No Route Configured/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Find Route Alternatives/i })).toBeDisabled();

    const originField = screen.getByLabelText(/Origin Point/i);
    const destField = screen.getByLabelText(/Destination Point/i);

    fireEvent.change(originField, { target: { value: 'Terminal A' } });
    fireEvent.change(destField, { target: { value: 'Terminal B' } });

    const findBtn = screen.getByRole('button', { name: /Find Route Alternatives/i });
    expect(findBtn).not.toBeDisabled();
    fireEvent.click(findBtn);

    expect(screen.getAllByText('Expressway Route (Fastest)').length).toBeGreaterThan(0);
  });
});
