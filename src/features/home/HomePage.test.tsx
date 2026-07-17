import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { HomePage } from './HomePage';

function renderHome() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HomePage /> },
      { path: '/onboarding/language', element: <h1>Onboarding boundary</h1> },
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/auth/register', element: <h1>Registration boundary</h1> },
      { path: '/legal/terms', element: <h1>Terms boundary</h1> },
    ],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('HomePage', () => {
  it('renders one public Home page with semantic landmarks and section navigation', () => {
    renderHome();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByText('Kiyaan Transport').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: /transport operations, coordinated with clarity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /everything your transport UI needs/i }),
    ).toHaveAttribute('id', 'features-heading');
    expect(
      screen.getByRole('heading', { name: /one product, two distinct experiences/i }),
    ).toHaveAttribute('id', 'solutions-heading');
    expect(
      screen.getByRole('heading', { name: /from first visit to operations overview/i }),
    ).toHaveAttribute('id', 'how-heading');
  });

  it('renders both product modes and the compact Dashboard preview', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: 'Tracking and Groups' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Speed Only' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /see operations without losing the big picture/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Active Trips')).toBeInTheDocument();
  });

  it.each([
    ['Get started', '/onboarding/language', 'Onboarding boundary'],
    ['Sign in', '/auth/login', 'Sign in boundary'],
    ['Create account', '/auth/register', 'Registration boundary'],
    ['Terms', '/legal/terms', 'Terms boundary'],
  ] as const)('connects %s to its existing product route', async (name, path, destination) => {
    const user = userEvent.setup();
    const router = renderHome();

    await user.click(screen.getAllByRole('link', { name })[0]!);

    await waitFor(() => expect(router.state.location.pathname).toBe(path));
    expect(screen.getByRole('heading', { name: destination })).toBeInTheDocument();
  });

  it('opens and closes the accessible mobile navigation', async () => {
    const user = userEvent.setup();
    renderHome();

    const openButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(openButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(openButton);

    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: 'Close navigation menu' });
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    await user.click(closeButton);
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('closes the mobile navigation with Escape', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('closes the mobile navigation after a section link is selected', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile navigation' });

    await user.click(within(mobileNavigation).getByRole('link', { name: 'Features' }));

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    expect(document.querySelector('#features')).toBeInTheDocument();
  });
});
