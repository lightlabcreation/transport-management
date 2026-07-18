import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import type { ApplicationMode } from '@/features/application-mode';

interface SettingsPageProps {
  mode: ApplicationMode;
  onLogout: () => void;
}

export function SettingsPage({ mode, onLogout }: SettingsPageProps) {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [status, setStatus] = useState('');

  function savePreferences() {
    setStatus('Settings saved for this frontend preview.');
  }

  return (
    <div className="space-y-section">
      <header>
        <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
          Application preferences
        </p>
        <h2 className="mt-2 text-heading-lg font-semibold">Settings</h2>
        <p className="mt-2 max-w-2xl text-body text-muted-foreground">
          Configure local preview preferences. Production settings will require account services.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsCard title="Language" description="Choose an approved interface language.">
          <label className="block space-y-2" htmlFor="settings-language">
            <span className="text-body-sm font-medium">Interface language</span>
            <select
              id="settings-language"
              className="min-h-control w-full rounded-md border border-input bg-surface px-3 py-2"
              defaultValue="en"
            >
              <option value="en">English</option>
            </select>
          </label>
        </SettingsCard>

        <SettingsCard title="Theme" description="Preview the preferred interface appearance.">
          <fieldset>
            <legend className="sr-only">Theme preference</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['system', 'light', 'dark'] as const).map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-md border p-3 text-center text-body-sm font-medium capitalize ${theme === option ? 'border-primary bg-primary/5 text-primary' : 'border-border'}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option}
                    checked={theme === option}
                    onChange={() => setTheme(option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        </SettingsCard>

        <SettingsCard
          title="Privacy"
          description="Review how mock location and activity information is represented."
        >
          <p className="rounded-lg bg-surface-muted p-4 text-body-sm text-muted-foreground">
            This frontend does not collect real GPS coordinates. Visibility and consent policies
            will require backend and device enforcement.
          </p>
        </SettingsCard>

        <SettingsCard
          title="Notifications"
          description="Control frontend notification presentation."
        >
          <label className="flex min-h-control items-center justify-between gap-4 rounded-lg border border-border p-4">
            <span>
              <span className="block font-medium">Show notification previews</span>
              <span className="block text-body-sm text-muted-foreground">
                This does not request browser notification permission.
              </span>
            </span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(event) => setNotificationsEnabled(event.currentTarget.checked)}
              className="size-5 accent-primary"
            />
          </label>
        </SettingsCard>

        {mode === 'tracking' ? (
          <SettingsCard
            title="Tracking settings"
            description="Review the current frontend tracking-mode context."
          >
            <p className="text-body-sm text-muted-foreground">
              Tracking, visibility, background location, and group policy controls will be added in
              a dedicated feature batch.
            </p>
          </SettingsCard>
        ) : null}

        <SettingsCard title="Account" description="Manage the current frontend demo session.">
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
            <p className="font-medium">End demo session</p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Logging out clears the mock session, demo profile, pending profile, and application
              mode.
            </p>
            <Button className="mt-4" variant="danger" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </SettingsCard>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={savePreferences}>Save settings</Button>
        <p role="status" aria-live="polite" className="text-body-sm text-primary">
          {status}
        </p>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-page shadow-sm">
      <h3 className="text-heading-sm font-semibold">{title}</h3>
      <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
