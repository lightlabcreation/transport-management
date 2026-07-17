import { createBrowserRouter, Navigate } from 'react-router';

import {
  browserDemoAccessStore,
  browserPendingDemoAccessStore,
  DemoAccessPage,
  DemoAccessReset,
  ProtectedApplicationRoute,
} from '@/features/access-control';

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth/login',
    element: (
      <DemoAccessReset
        accessStore={browserDemoAccessStore}
        pendingDemoAccessStore={browserPendingDemoAccessStore}
      >
        <LoginPage
          authService={mockAuthService}
          pendingDemoAccessStore={browserPendingDemoAccessStore}
        />
      </DemoAccessReset>
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
    element: <ModeSelectionPage />,
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
    element: (
      <ProtectedApplicationRoute
        sessionStore={browserAuthSessionStore}
        accessStore={browserDemoAccessStore}
      >
        <DashboardRoute
          sessionStore={browserAuthSessionStore}
          accessStore={browserDemoAccessStore}
        />
      </ProtectedApplicationRoute>
    ),
  },
  {
    path: '/app/live-map',
    element: (
      <ProtectedApplicationRoute
        sessionStore={browserAuthSessionStore}
        accessStore={browserDemoAccessStore}
      >
        <LiveMapPage sessionStore={browserAuthSessionStore} />
      </ProtectedApplicationRoute>
    ),
  },
  {
    path: '/app/access-preview',
    element: (
      <DemoAccessPage sessionStore={browserAuthSessionStore} accessStore={browserDemoAccessStore} />
    ),
  },
  {
    path: '/legal/terms',
    element: <TermsPlaceholderPage />,
  },
  // [DEV PREVIEW] GRP-001 — Groups Directory MVP
  // Temporary route for developer review. Permanent shell integration is D1's responsibility.
  {
    path: '/app/groups',
    element: (
      <ProtectedApplicationRoute
        sessionStore={browserAuthSessionStore}
        accessStore={browserDemoAccessStore}
      >
        <GroupsPage />
      </ProtectedApplicationRoute>
    ),
  },
]);
