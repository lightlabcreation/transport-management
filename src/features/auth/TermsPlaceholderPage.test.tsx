import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { TermsPlaceholderPage } from './TermsPlaceholderPage';

function renderTermsPage() {
  const router = createMemoryRouter(
    [
      { path: '/legal/terms', element: <TermsPlaceholderPage /> },
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
    ],
    { initialEntries: ['/legal/terms'] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe('TermsPlaceholderPage', () => {
  it('clearly identifies unavailable Terms content without inventing legal copy', () => {
    renderTermsPage();

    expect(screen.getByRole('heading', { name: 'Terms' })).toBeInTheDocument();
    expect(screen.getByText(/terms content will be provided later/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
  });

  it('navigates back to the authentication flow', async () => {
    const user = userEvent.setup();
    const router = renderTermsPage();

    await user.click(screen.getByRole('link', { name: 'Back to sign in' }));

    expect(router.state.location.pathname).toBe('/auth/login');
    expect(screen.getByRole('heading', { name: 'Sign in boundary' })).toBeInTheDocument();
  });
});
