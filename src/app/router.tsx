import { createBrowserRouter } from 'react-router';

import {
  browserAuthSessionStore,
  createMockAuthSession,
  LoginPage,
  mockAuthService,
  OtpVerificationPage,
  ProtectedPlaceholderPage,
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <main className="min-h-screen bg-background p-page text-foreground">
        <h1 className="text-heading-lg font-semibold">Transport Management</h1>
        <p className="text-body text-muted-foreground">Frontend foundation</p>
      </main>
    ),
  },
  {
    path: '/auth/login',
    element: <LoginPage authService={mockAuthService} />,
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
      />
    ),
  },
  {
    path: '/auth/authenticated',
    element: <ProtectedPlaceholderPage sessionStore={browserAuthSessionStore} />,
  },
  {
    path: '/legal/terms',
    element: <TermsPlaceholderPage />,
  },
  // [DEV PREVIEW] GRP-001 — Groups Directory MVP
  // Temporary route for developer review. Permanent shell integration is D1's responsibility.
  {
    path: '/app/groups',
    element: <GroupsPage />,
  },
]);

