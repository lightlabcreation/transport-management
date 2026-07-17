import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ApplicationShell } from './ApplicationShell';
import type { NavigationItem, UserSummary } from './shell.types';

const mockNavigation: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard' },
  { id: 'groups', label: 'Groups', href: '/app/groups' },
  { id: 'speed', label: 'Speed limit', href: '/app/speed' },
  { id: 'sos', label: 'Emergency SOS', href: '/app/sos' },
];

const mockUser: UserSummary = {
  name: 'Kiyaan Sharma',
  mobile: '+919876543210',
  roleLabel: 'Group Owner',
};

function renderShell(
  currentPath: string,
  userSummary?: UserSummary,
  onLogout?: () => void,
  items: NavigationItem[] = mockNavigation,
) {
  const router = createMemoryRouter(
    [
      {
        path: currentPath,
        element: (
          <ApplicationShell
            navigationItems={items}
            currentPath={currentPath}
            userSummary={userSummary}
            onLogout={onLogout}
          >
            <div data-testid="child-content">Main Page Content</div>
          </ApplicationShell>
        ),
      },
      { path: '/app/dashboard', element: <h1>Dashboard Page</h1> },
      { path: '/app/groups', element: <h1>Groups Page</h1> },
    ],
    { initialEntries: [currentPath] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe('ApplicationShell Component', () => {
  it('renders children, header, sidebar, and mobile elements', () => {
    renderShell('/app/dashboard', mockUser, vi.fn());

    // Verify main page contents render correctly
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Main Page Content')).toBeInTheDocument();

    // Verify Header active page title derived from currentPath
    expect(screen.getAllByText('Dashboard')).toHaveLength(4); // Header, DesktopSidebar, Mobile BottomBar, Mobile Drawer

    // Verify User summary displays
    expect(screen.getAllByText('Kiyaan Sharma')).toHaveLength(3); // Header, Sidebar, and mobile drawer
    expect(screen.getAllByText('Group Owner')).toHaveLength(3);
  });

  it('marks active navigation item with aria-current="page"', () => {
    renderShell('/app/groups', mockUser, vi.fn());

    // Finding links pointing to groups
    const groupLinks = screen.getAllByRole('link', { name: /groups/i });
    expect(groupLinks.length).toBeGreaterThan(0);

    // Active item must have aria-current="page"
    const activeLink = groupLinks.find((link) => link.getAttribute('aria-current') === 'page');
    expect(activeLink).toBeDefined();
  });

  it('safely handles empty navigation elements', () => {
    renderShell('/app/dashboard', mockUser, vi.fn(), []);
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Transport Management')).toBeInTheDocument(); // Fallback page title
  });

  it('safely renders when user summary is missing', () => {
    renderShell('/app/dashboard', undefined, vi.fn());
    expect(screen.queryByText('Kiyaan Sharma')).not.toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('triggers logout callback when clicked', async () => {
    const handleLogout = vi.fn();
    renderShell('/app/dashboard', mockUser, handleLogout);

    const logoutButtons = screen.getAllByRole('button', { name: /log out/i });
    expect(logoutButtons.length).toBeGreaterThan(0);

    // Trigger logout on first available button (e.g. desktop sidebar logout button)
    const logoutBtn = logoutButtons[0];
    if (!logoutBtn) throw new Error('Logout button not found');
    await userEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('opens and closes mobile navigation drawer', async () => {
    renderShell('/app/dashboard', mockUser, vi.fn());

    const drawer = document.getElementById('mobile-navigation-drawer');
    if (!drawer) throw new Error('Drawer element not found');
    expect(drawer).toHaveAttribute('aria-hidden', 'true');

    // Get trigger button from mobile header
    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(toggleButton);

    // Now drawer is visible/expanded
    expect(drawer).toHaveAttribute('aria-hidden', 'false');

    // Close using drawer close button
    const closeButton = screen.getByRole('button', { name: /close menu drawer/i });
    await userEvent.click(closeButton);

    // Drawer is closed again
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('closes mobile drawer with Escape key', async () => {
    renderShell('/app/dashboard', mockUser, vi.fn());

    const drawer = document.getElementById('mobile-navigation-drawer');
    if (!drawer) throw new Error('Drawer element not found');
    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(toggleButton);

    expect(drawer).toHaveAttribute('aria-hidden', 'false');

    // Press Escape key on document (bubbles up)
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });
});
