import type { ReactNode } from 'react';

import type { DemoAccessStore } from './demo-access.types';
import { AccessDeniedPage } from './AccessDeniedPage';
import { hasDemoCapability, type DemoCapability } from './demo-capabilities';

interface DemoCapabilityGateProps {
  accessStore: DemoAccessStore;
  capability: DemoCapability;
  children: ReactNode;
  message?: string | undefined;
  safeDestination?: string | undefined;
}

export function DemoCapabilityGate({
  accessStore,
  capability,
  children,
  message,
  safeDestination,
}: DemoCapabilityGateProps) {
  if (!hasDemoCapability(accessStore.getProfile(), capability)) {
    return (
      <AccessDeniedPage
        {...(message ? { message } : {})}
        {...(safeDestination ? { safeDestination } : {})}
      />
    );
  }

  return children;
}
