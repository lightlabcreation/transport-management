import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import {
  browserDemoAccessStore,
  browserPendingDemoAccessStore,
  DemoCapabilityGate,
  DemoAccessPage,
  DemoAccessReset,
  ProtectedApplicationRoute,
} from '@/features/access-control';
import { AlertsPage } from '@/features/alerts';
import { NavigationPage } from '@/features/navigation';
import { ReportsPage } from '@/features/reports';
import { TripsPage } from '@/features/trips';
import {
  ApplicationModeGate,
  ApplicationModeReset,
  ApplicationModeSelectionPage,
  browserApplicationModeStore,
} from '@/features/application-mode';

import {
  browserAuthSessionStore,
  createMockAuthSession,
  LoginPage,
  mockAuthService,
  OtpVerificationPage,
  RegistrationPage,
  TermsPlaceholderPage,
} from '@/features/auth';
import { GroupsPage } from '@/features/groups';
import {
  LanguageSelectionPage,
  ModeSelectionPage,
  PermissionIntroductionPage,
  WelcomePage,
} from '@/features/onboarding';
import { DashboardRoute } from '@/features/dashboard';
import { HomePage } from '@/features/home';
import { LiveMapPage } from '@/features/live-map';
import { NotificationsPage } from '@/features/notifications';
import { ProfilePage } from '@/features/profile';
import { SpeedDashboardPage } from '@/features/speed';

import { createApplicationSessionStore } from './application-session-store';
import { ApplicationPageFrame } from './ApplicationPageFrame';
import { SettingsRoute } from './SettingsRoute';

const browserApplicationSessionStore = createApplicationSessionStore({
  authSessionStore: browserAuthSessionStore,
  accessStore: browserDemoAccessStore,
  pendingAccessStore: browserPendingDemoAccessStore,
  modeStore: browserApplicationModeStore,
});

function protectApplicationPage(children: ReactNode, requireMode = true) {
  return (
    <ProtectedApplicationRoute
      sessionStore={browserApplicationSessionStore}
      accessStore={browserDemoAccessStore}
    >
      {requireMode ? (
        <ApplicationModeGate modeStore={browserApplicationModeStore}>
          {children}
        </ApplicationModeGate>
      ) : (
        children
      )}
    </ProtectedApplicationRoute>
  );
}

function renderFramedApplicationPage(
  capability: Parameters<typeof DemoCapabilityGate>[0]['capability'],
  children: ReactNode,
) {
  return protectApplicationPage(
    <ApplicationPageFrame
      sessionStore={browserApplicationSessionStore}
      accessStore={browserDemoAccessStore}
      modeStore={browserApplicationModeStore}
    >
      <DemoCapabilityGate accessStore={browserDemoAccessStore} capability={capability}>
        {children}
      </DemoCapabilityGate>
    </ApplicationPageFrame>,
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth/login',
    element: (
      <ApplicationModeReset
        modeStore={browserApplicationModeStore}
        shouldReset={() => browserDemoAccessStore.getProfile() !== null}
      >
        <DemoAccessReset
          accessStore={browserDemoAccessStore}
          pendingDemoAccessStore={browserPendingDemoAccessStore}
        >
          <LoginPage
            authService={mockAuthService}
            pendingDemoAccessStore={browserPendingDemoAccessStore}
          />
        </DemoAccessReset>
      </ApplicationModeReset>
    ),
  },
  {
    path: '/onboarding/language',
    element: <LanguageSelectionPage />,
  },
  {
    path: '/onboarding/welcome',
    element: <WelcomePage />,
  },
  {
    path: '/onboarding/mode',
    element: <ModeSelectionPage modeStore={browserApplicationModeStore} />,
  },
  {
    path: '/onboarding/permissions',
    element: <PermissionIntroductionPage />,
  },
  {
    path: '/auth/register',
    element: <RegistrationPage authService={mockAuthService} />,
  },
  {
    path: '/auth/verify',
    element: (
      <OtpVerificationPage
        authService={mockAuthService}
        sessionFactory={createMockAuthSession}
        sessionStore={browserAuthSessionStore}
        accessStore={browserDemoAccessStore}
        pendingDemoAccessStore={browserPendingDemoAccessStore}
      />
    ),
  },
  {
    path: '/auth/authenticated',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/app/dashboard',
    element: protectApplicationPage(
      <DashboardRoute
        sessionStore={browserApplicationSessionStore}
        accessStore={browserDemoAccessStore}
      />,
    ),
  },
  {
    path: '/app/live-map',
    element: protectApplicationPage(
      <DemoCapabilityGate accessStore={browserDemoAccessStore} capability="view-live-map">
        <LiveMapPage
          sessionStore={browserApplicationSessionStore}
          accessStore={browserDemoAccessStore}
        />
      </DemoCapabilityGate>,
    ),
  },
  {
    path: '/app/access-preview',
    element: (
      <DemoAccessPage
        sessionStore={browserApplicationSessionStore}
        accessStore={browserDemoAccessStore}
      />
    ),
  },
  {
    path: '/legal/terms',
    element: <TermsPlaceholderPage />,
  },
  {
    path: '/app/select-mode',
    element: protectApplicationPage(
      <ApplicationModeSelectionPage
        modeStore={browserApplicationModeStore}
        onLogout={() => browserApplicationSessionStore.clearSession()}
      />,
      false,
    ),
  },
  // [DEV PREVIEW] GRP-001 — Groups Directory MVP
  // Temporary route for developer review. Permanent shell integration is D1's responsibility.
  {
    path: '/app/groups',
    element: protectApplicationPage(
      <DemoCapabilityGate accessStore={browserDemoAccessStore} capability="view-groups">
        <GroupsPage sessionStore={browserApplicationSessionStore} />
      </DemoCapabilityGate>,
    ),
  },
  {
    path: '/app/speed',
    element: renderFramedApplicationPage('view-speed', <SpeedDashboardPage />),
  },
  {
    path: '/app/notifications',
    element: renderFramedApplicationPage('view-notifications', <NotificationsPage />),
  },
  {
    path: '/app/profile',
    element: renderFramedApplicationPage('view-profile', <ProfilePage />),
  },
  {
    path: '/app/settings',
    element: renderFramedApplicationPage(
      'view-settings',
      <SettingsRoute
        sessionStore={browserApplicationSessionStore}
        modeStore={browserApplicationModeStore}
      />,
    ),
  },
  {
    path: '/app/navigation',
    element: renderFramedApplicationPage('view-navigation', <NavigationPage />),
  },
  {
    path: '/app/trips',
    element: renderFramedApplicationPage('view-trips', <TripsPage />),
  },
  {
    path: '/app/alerts',
    element: renderFramedApplicationPage('view-alerts', <AlertsPage />),
  },
  {
    path: '/app/reports',
    element: renderFramedApplicationPage('view-reports', <ReportsPage />),
  },
]);
