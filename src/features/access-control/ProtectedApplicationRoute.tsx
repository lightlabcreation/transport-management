import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import type { AuthSessionStore } from '@/features/auth';

import type { DemoAccessStore } from './demo-access.types';

interface ProtectedApplicationRouteProps {
  sessionStore: AuthSessionStore;
  accessStore: DemoAccessStore;
  children: ReactNode;
}

export function ProtectedApplicationRoute({
  sessionStore,
  accessStore,
  children,
}: ProtectedApplicationRouteProps) {
  if (!sessionStore.getSession()) {
    accessStore.clearProfile();
    return <Navigate to="/auth/login" replace />;
  }

  if (!accessStore.getProfile()) return <Navigate to="/app/access-preview" replace />;

  return children;
}
