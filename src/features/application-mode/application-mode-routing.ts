import type { ApplicationMode } from './application-mode.types';

const TRACKING_ONLY_PATH_PREFIXES = [
  '/app/dashboard',
  '/app/live-map',
  '/app/groups',
  '/app/tracking',
] as const;

export function getApplicationModeHome(mode: ApplicationMode) {
  return mode === 'tracking' ? '/app/dashboard' : '/app/speed';
}

export function isApplicationPathAllowed(mode: ApplicationMode, path: string) {
  if (mode === 'tracking') return true;

  const pathname = path.split(/[?#]/, 1)[0] ?? path;
  return !TRACKING_ONLY_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getSafeApplicationReturnPath(state: unknown) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return null;

  const returnTo = (state as { returnTo?: unknown }).returnTo;
  if (
    typeof returnTo !== 'string' ||
    !returnTo.startsWith('/app/') ||
    returnTo.startsWith('/app/select-mode')
  ) {
    return null;
  }

  return returnTo;
}
