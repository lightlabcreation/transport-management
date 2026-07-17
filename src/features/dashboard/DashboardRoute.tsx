import type { DemoAccessStore } from '@/features/access-control';
import type { AuthSessionStore } from '@/features/auth';

import { DashboardPage } from './DashboardPage';

interface DashboardRouteProps {
  sessionStore: AuthSessionStore;
  accessStore: DemoAccessStore;
}

export function DashboardRoute({ sessionStore, accessStore }: DashboardRouteProps) {
  return <DashboardPage sessionStore={sessionStore} accessProfile={accessStore.getProfile()} />;
}
