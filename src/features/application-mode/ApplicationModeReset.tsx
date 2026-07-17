import { useEffect, type ReactNode } from 'react';

import type { ApplicationModeStore } from './application-mode.types';

interface ApplicationModeResetProps {
  modeStore: ApplicationModeStore;
  shouldReset: () => boolean;
  children: ReactNode;
}

export function ApplicationModeReset({
  modeStore,
  shouldReset,
  children,
}: ApplicationModeResetProps) {
  const resetMode = shouldReset();

  useEffect(() => {
    if (resetMode) modeStore.clearMode();
  }, [modeStore, resetMode]);

  return children;
}
