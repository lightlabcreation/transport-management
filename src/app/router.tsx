import { createBrowserRouter } from 'react-router';

import {
  browserAuthSessionStore,
  createMockAuthSession,
  LoginPage,
  mockAuthService,
  OtpVerificationPage,
  ProtectedPlaceholderPage,
} from '@/features/auth';

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
]);
