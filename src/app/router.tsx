import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import {
  browserDemoAccessStore,
  browserPendingDemoAccessStore,
  DemoAccessPage,
  DemoAccessReset,
  ProtectedApplicationRoute,
} from '@/features/access-control';
import { AppPagePlaceholder, appPageDefinitions } from '@/features/app-pages';
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

import { createApplicationSessionStore } from './application-session-store';

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
    element: protectApplicationPage(<LiveMapPage sessionStore={browserApplicationSessionStore} />),
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
    element: protectApplicationPage(<GroupsPage />),
  },
  ...appPageDefinitions.map(({ path, title }) => ({
    path,
    element: protectApplicationPage(
      <AppPagePlaceholder
        title={title}
        sessionStore={browserApplicationSessionStore}
        accessStore={browserDemoAccessStore}
        modeStore={browserApplicationModeStore}
      />,
    ),
  })),
]);
