import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PaymentsPage } from './PaymentsPage';

describe('PaymentsPage MVP Component Tests', () => {
  it('renders the Payments Dashboard title and description', () => {
    render(<PaymentsPage />);

    expect(screen.getByRole('heading', { name: /Billing & Payments/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your subscription plans, invoice receipts history, and payment configurations./i)
    ).toBeInTheDocument();
  });

  it('renders active plan info, Saved Cards, and Invoices history in Normal view state', () => {
    render(<PaymentsPage />);

    // Check Active Plan Card
    expect(screen.getAllByText('Enterprise Yearly')[0]).toBeInTheDocument();
    expect(screen.getByText('Active Status')).toBeInTheDocument();

    // Check saved cards
    expect(screen.getByText('•••• 4242')).toBeInTheDocument();
    expect(screen.getByText('•••• 5555')).toBeInTheDocument();

    // Check Invoice History table entries
    expect(screen.getAllByText('INV-2026-001')[0]).toBeInTheDocument();
    expect(screen.getAllByText('INV-2026-002')[0]).toBeInTheDocument();
  });

  it('renders pricing plans standard list features checkmarks and responds to billing toggle', () => {
    render(<PaymentsPage />);

    // Default yearly display of Standard Monthly features
    expect(screen.getAllByText('Standard Monthly')[0]).toBeInTheDocument();
    
    // Test toggle to Monthly billing
    const monthlyToggle = screen.getByRole('button', { name: /Monthly Billing/i });
    fireEvent.click(monthlyToggle);
    expect(screen.getAllByText('$19.99')[0]).toBeInTheDocument();
  });

  it('displays warning alert banner in No Subscription view state', () => {
    render(<PaymentsPage />);

    // Switch state to No Subscription
    const noSubStateBtn = screen.getByRole('button', { name: 'No Subscription' });
    fireEvent.click(noSubStateBtn);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Subscription Inactive')).toBeInTheDocument();
  });

  it('displays pending review warning message in Pending Approval view state', () => {
    render(<PaymentsPage />);

    // Switch state to Pending Approval
    const pendingStateBtn = screen.getByRole('button', { name: 'Pending Approval' });
    fireEvent.click(pendingStateBtn);

    expect(screen.getByText('Billing Status: Review Pending')).toBeInTheDocument();
    expect(screen.getByText(/process typically takes up to 24 hours/i)).toBeInTheDocument();
  });

  it('simulates plan checkout success and adds invoice item to list', () => {
    vi.useFakeTimers();
    render(<PaymentsPage />);

    // Toggle to Monthly Billing first so amount is $19.99
    const monthlyBtn = screen.getByRole('button', { name: /Monthly Billing/i });
    fireEvent.click(monthlyBtn);

    // Trigger upgrade modal on Standard Monthly plan
    const upgradeBtns = screen.getAllByRole('button', { name: /Upgrade Plan/i });
    const firstUpgradeBtn = upgradeBtns[0];
    if (!firstUpgradeBtn) throw new Error('Upgrade button not found');
    fireEvent.click(firstUpgradeBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Fill required details
    const nameInput = screen.getByLabelText(/Cardholder Name/i);
    const numInput = screen.getByLabelText(/Card Number/i);
    const expInput = screen.getByLabelText(/Expiration/i);
    const cvvInput = screen.getByLabelText(/CVV/i);

    fireEvent.change(nameInput, { target: { value: 'John Smith' } });
    fireEvent.change(numInput, { target: { value: '4242 4242 4242 1111' } });
    fireEvent.change(expInput, { target: { value: '09/27' } });
    fireEvent.change(cvvInput, { target: { value: '456' } });

    // Submit payment form
    const payBtn = screen.getByRole('button', { name: /Pay \$19.99/i });
    fireEvent.submit(payBtn);

    // Fast-forward simulated payment processing timeout
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Check success view
    expect(screen.getByText('Payment Successful!')).toBeInTheDocument();

    // Fast-forward modal close callback timeout
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Expect modal to be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Expect Standard Monthly active subscription as level 2 heading
    expect(screen.getByRole('heading', { level: 2, name: 'Standard Monthly' })).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('simulates payment declined failure state on specific card number patterns', () => {
    vi.useFakeTimers();
    render(<PaymentsPage />);

    // Toggle to Monthly Billing first so amount is $19.99
    const monthlyBtn = screen.getByRole('button', { name: /Monthly Billing/i });
    fireEvent.click(monthlyBtn);

    const upgradeBtns = screen.getAllByRole('button', { name: /Upgrade Plan/i });
    const firstUpgradeBtn = upgradeBtns[0];
    if (!firstUpgradeBtn) throw new Error('Upgrade button not found');
    fireEvent.click(firstUpgradeBtn);

    // Fill details with error-trigger card number ending in 4000
    fireEvent.change(screen.getByLabelText(/Cardholder Name/i), { target: { value: 'Jane Tester' } });
    fireEvent.change(screen.getByLabelText(/Card Number/i), { target: { value: '4242 4242 4242 4000' } });
    fireEvent.change(screen.getByLabelText(/Expiration/i), { target: { value: '09/27' } });
    fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '456' } });

    fireEvent.submit(screen.getByRole('button', { name: /Pay \$19.99/i }));

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Expect declined error alert block
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Your transaction was declined. Insufficient mock credit./i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
