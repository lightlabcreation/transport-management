import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import {
  getApplicationModeHome,
  getSafeApplicationReturnPath,
  isApplicationPathAllowed,
} from './application-mode-routing';
import type { ApplicationMode, ApplicationModeStore } from './application-mode.types';

interface ApplicationModeSelectionPageProps {
  modeStore: ApplicationModeStore;
  onLogout: () => void;
}

const modeOptions: ReadonlyArray<{
  value: ApplicationMode;
  title: string;
  description: string;
}> = [
  {
    value: 'tracking',
    title: 'Tracking and groups',
    description: 'Preview groups, member tracking, live map, speed, trips, and shared tools.',
  },
  {
    value: 'speed',
    title: 'Speed only',
    description: 'Preview private speed, navigation, trips, alerts, and shared account tools.',
  },
];

export function ApplicationModeSelectionPage({
  modeStore,
  onLogout,
}: ApplicationModeSelectionPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<ApplicationMode | null>(() =>
    modeStore.getMode(),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMode) return;

    modeStore.setMode(selectedMode);
    const requestedPath = getSafeApplicationReturnPath(location.state);
    const destination =
      requestedPath && isApplicationPathAllowed(selectedMode, requestedPath)
        ? requestedPath
        : getApplicationModeHome(selectedMode);

    void navigate(destination, { replace: true });
  }

  function handleLogout() {
    onLogout();
    void navigate('/auth/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-gutter py-section text-foreground sm:px-page lg:px-section">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-page shadow-sm sm:p-section">
        <header>
          <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
            Application experience
          </p>
          <h1 className="mt-3 text-heading-lg font-semibold tracking-tight">
            Choose an application mode
          </h1>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">
            Select the frontend experience you want to preview. You can revisit this choice later.
          </p>
        </header>

        <form className="mt-8" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="sr-only">Application mode</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {modeOptions.map((option) => {
                const isSelected = selectedMode === option.value;
                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border p-5 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="application-mode"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => setSelectedMode(option.value)}
                        className="mt-1 size-5 accent-primary"
                      />
                      <span>
                        <span className="block text-body-lg font-semibold">{option.title}</span>
                        <span className="mt-2 block text-body-sm text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleLogout}>
              Log out
            </Button>
            <Button type="submit" disabled={!selectedMode}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
