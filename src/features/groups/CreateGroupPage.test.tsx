import { render, screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CreateGroupPage } from './CreateGroupPage';

describe('CreateGroupPage Wizard Flow', () => {
  it('renders Step 1 (Group Information) initially with fields and category dropdown', () => {
    render(<CreateGroupPage onBack={vi.fn()} />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Create New Group/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Group Information/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description \/ Purpose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  it('validates required fields on Step 1 and blocks forward navigation', async () => {
    const user = userEvent.setup();
    render(<CreateGroupPage onBack={vi.fn()} />);

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    // Errors displayed, and step remains 1
    expect(screen.getByText(/Group Name is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required./i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Group Information/i }),
    ).toBeInTheDocument();
  });

  it('allows filling Step 1 and navigating to Step 2 (Privacy), then back', async () => {
    const user = userEvent.setup();
    render(<CreateGroupPage onBack={vi.fn()} />);

    // Fill Step 1
    const nameInput = screen.getByLabelText(/Group Name/i);
    const descInput = screen.getByLabelText(/Description \/ Purpose/i);

    await user.type(nameInput, 'Custom Logistics Squad');
    await user.type(descInput, 'A custom test logistics group purpose details.');

    // Go Next
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Verify Step 2 renders
    expect(screen.getByRole('heading', { level: 2, name: /Privacy Setting/i })).toBeInTheDocument();
    expect(screen.getByText(/Public Group/i)).toBeInTheDocument();
    expect(screen.getByText(/Private Group/i)).toBeInTheDocument();

    // Go Back
    await user.click(screen.getByRole('button', { name: 'Previous wizard step' }));

    // Verify back to Step 1
    expect(
      screen.getByRole('heading', { level: 2, name: /Group Information/i }),
    ).toBeInTheDocument();
  });

  it('runs through the entire wizard flow, configures settings, requires terms, and completes submission', async () => {
    const user = userEvent.setup();
    render(<CreateGroupPage onBack={vi.fn()} />);

    // Step 1: Info
    await user.type(screen.getByLabelText(/Group Name/i), 'Velo Fleet');
    await user.type(
      screen.getByLabelText(/Description \/ Purpose/i),
      'Velo transportation details.',
    );
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Privacy (Select Private)
    expect(screen.getByRole('heading', { level: 2, name: /Privacy Setting/i })).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Private privacy option/i));
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: Tracking
    expect(
      screen.getByRole('heading', { level: 2, name: /Tracking Settings/i }),
    ).toBeInTheDocument();
    const bgTrackingSwitch = screen.getByLabelText(/Background tracking switch/i);
    expect(bgTrackingSwitch).toBeChecked();
    await user.click(bgTrackingSwitch); // Toggle off background tracking
    expect(bgTrackingSwitch).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 4: Visibility
    expect(
      screen.getByRole('heading', { level: 2, name: /Visibility Policy/i }),
    ).toBeInTheDocument();
    const visibilityPolicySelect = screen.getByLabelText(/Who can view member positions?/i);
    await user.selectOptions(visibilityPolicySelect, 'admins_only');
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 5: Roles & Permissions Configurator
    expect(
      screen.getByRole('heading', { level: 2, name: /Roles & Permissions Configurator/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Next/i }));

    // Step 6: Review & Terms
    expect(
      screen.getByRole('heading', { level: 2, name: /Review Group Details/i }),
    ).toBeInTheDocument();

    // Verify summaries
    expect(screen.getByText(/Velo Fleet/i)).toBeInTheDocument();
    expect(screen.getByText(/Velo transportation details./i)).toBeInTheDocument();
    expect(screen.getByText(/private/i)).toBeInTheDocument();
    expect(screen.getByText(/Background Updates:/i).parentElement?.textContent).toContain(
      'Background Updates: Disabled',
    );

    // Verify Terms Link is present
    const termsLink = screen.getByRole('link', { name: /Terms and Conditions/i });
    expect(termsLink).toHaveAttribute('href', '/legal/terms');

    // Attempt submitting without accepting terms
    const submitBtn = screen.getByRole('button', { name: 'Submit group creation request' });

    await user.click(submitBtn);

    // Terms validation error displayed
    expect(
      screen.getByText(/You must accept the Terms and Conditions to proceed./i),
    ).toBeInTheDocument();

    // Accept terms
    const acceptCheckbox = screen.getByLabelText(/Accept terms checkbox/i);
    await user.click(acceptCheckbox);
    expect(acceptCheckbox).toBeChecked();

    // Submit form
    await user.click(submitBtn);

    // Wait for simulated submission transition to success screen (Step 7)
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { level: 2, name: /Group Registration Pending Approval/i }),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Verification of pending simulated statement
    expect(
      screen.getByText(/This is a frontend simulation. Real-world payment gateways/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/group is active/i)).not.toBeInTheDocument();

    // Start Over reset action
    const startOverBtn = screen.getByRole('button', { name: /Start Over/i });
    await user.click(startOverBtn);

    // Verifies form is fully reset to Step 1
    expect(
      screen.getByRole('heading', { level: 2, name: /Group Information/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Group Name/i)).toHaveValue('');
  });
});
