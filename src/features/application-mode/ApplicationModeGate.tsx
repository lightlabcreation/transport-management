import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { getApplicationModeHome, isApplicationPathAllowed } from './application-mode-routing';
import type { ApplicationModeStore } from './application-mode.types';

interface ApplicationModeGateProps {
  modeStore: ApplicationModeStore;
  children: ReactNode;
}

export function ApplicationModeGate({ modeStore, children }: ApplicationModeGateProps) {
  const location = useLocation();
  const mode = modeStore.getMode();

  if (!mode) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/app/select-mode" replace state={{ returnTo }} />;
  }

  if (!isApplicationPathAllowed(mode, location.pathname)) {
    return <Navigate to={getApplicationModeHome(mode)} replace />;
  }

  return children;
}
