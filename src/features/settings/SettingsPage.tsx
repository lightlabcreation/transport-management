import { useState, useEffect, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ApplicationMode } from '@/features/application-mode';

interface SettingsPageProps {
  mode: ApplicationMode;
  onLogout: () => void;
}

export function SettingsPage({ mode, onLogout }: SettingsPageProps) {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kiyaan-theme') as 'system' | 'light' | 'dark';
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'system';
  });

  const [language, setLanguage] = useState('en-US');
  const [fallbackLanguage, setFallbackLanguage] = useState('ar-AE');
  const [timeZone, setTimeZone] = useState('Asia/Dubai');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [speedUnit, setSpeedUnit] = useState('kmh');
  const [mapEngine, setMapEngine] = useState('osm');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState('horn');
  const [autoLockTimer, setAutoLockTimer] = useState('30m');
  const [status, setStatus] = useState('');

  // Apply real theme change immediately when theme state changes
  function applyThemeChange(selectedTheme: 'system' | 'light' | 'dark') {
    setTheme(selectedTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kiyaan-theme', selectedTheme);
      if (selectedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (selectedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        // System preference
        const isSystemDark =
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isSystemDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    }
  }

  function savePreferences() {
    applyThemeChange(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kiyaan-language', language);
      localStorage.setItem('kiyaan-speed-unit', speedUnit);
      localStorage.setItem('kiyaan-map-engine', mapEngine);
    }
    setStatus('Settings saved for this frontend preview.');
  }

  return (
    <div className="space-y-6 pb-16">
      <header className="rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-primary">
                Application preferences
              </span>
              <Badge variant="success">Real-time synced</Badge>
            </div>
            <h2 className="mt-2 text-heading-xl font-bold tracking-tight text-foreground">Settings</h2>
            <p className="mt-1 max-w-3xl text-body text-muted-foreground">
              Configure local preview preferences, worldwide language display, theme modes, live map units, and account sessions. Production settings will require account services.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button onClick={savePreferences} className="font-semibold shadow-sm" aria-label="Quick save preferences">
              <span aria-hidden="true">💾 </span>Quick save
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Worldwide Language & Regional Localization */}
        <SettingsCard
          title="Language"
          description="Choose an approved interface language and fallback options for global operations."
        >
          <div className="space-y-4">
            <label className="block space-y-1.5" htmlFor="settings-language">
              <span className="text-body-sm font-semibold text-foreground">Primary Interface language</span>
              <select
                id="settings-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="min-h-control w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-body-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en-US">🇺🇸 English (United States)</option>
                <option value="en-GB">🇬🇧 English (United Kingdom)</option>
                <option value="ar-AE">🇦🇪 العربية (Arabic - UAE/Gulf)</option>
                <option value="hi-IN">🇮🇳 हिंदी (Hindi - India)</option>
                <option value="ur-PK">🇵🇰 اردو (Urdu - Pakistan)</option>
                <option value="fr-FR">🇫🇷 Français (French - France/Africa)</option>
                <option value="es-ES">🇪🇸 Español (Spanish - Global)</option>
                <option value="de-DE">🇩🇪 Deutsch (German - Central Europe)</option>
                <option value="ru-RU">🇷🇺 Русский (Russian - CIS)</option>
                <option value="zh-CN">🇨🇳 中文 (Mandarin Chinese)</option>
                <option value="ja-JP">🇯🇵 日本語 (Japanese)</option>
                <option value="tr-TR">🇹🇷 Türkçe (Turkish)</option>
                <option value="pt-BR">🇵🇹 Português (Portuguese - Brazil/Europe)</option>
              </select>
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-body-xs font-semibold text-muted-foreground">Fallback / Secondary Language</span>
                <select
                  value={fallbackLanguage}
                  onChange={(e) => setFallbackLanguage(e.target.value)}
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-body-sm font-medium text-foreground focus:outline-none"
                >
                  <option value="ar-AE">🇦🇪 العربية (Arabic)</option>
                  <option value="en-US">🇺🇸 English</option>
                  <option value="hi-IN">🇮🇳 हिंदी (Hindi)</option>
                  <option value="ur-PK">🇵🇰 اردو (Urdu)</option>
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-body-xs font-semibold text-muted-foreground">Date & Calendar Format</span>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-body-sm font-medium text-foreground focus:outline-none"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK / UAE / India)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (United States)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 Standard)</option>
                </select>
              </label>
            </div>
          </div>
        </SettingsCard>

        {/* Theme Appearance Mode */}
        <SettingsCard
          title="Theme"
          description="Preview the preferred interface appearance across the entire dashboard and modals."
        >
          <fieldset>
            <legend className="sr-only">Theme preference</legend>
            <div className="grid grid-cols-3 gap-3">
              {(['system', 'light', 'dark'] as const).map((option) => (
                <label
                  key={option}
                  onClick={() => applyThemeChange(option)}
                  className={`flex flex-col items-center justify-center cursor-pointer rounded-xl border p-4 text-center transition-all duration-fast ${
                    theme === option
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs scale-[1.02]'
                      : 'border-border bg-surface hover:bg-surface-muted text-muted-foreground font-medium'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option}
                    checked={theme === option}
                    onChange={() => applyThemeChange(option)}
                    className="sr-only"
                  />
                  <span aria-hidden="true" className="text-2xl mb-1">
                    {option === 'light' ? '☀️' : option === 'dark' ? '🌙' : '💻'}
                  </span>
                  <span className="capitalize text-body-sm">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="mt-3.5 text-body-xs text-muted-foreground">
            💡 Selecting <strong>Dark</strong> or <strong>Light</strong> instantly shifts the UI color palette without reloading the browser.
          </p>
        </SettingsCard>

        {/* Personal & Regional Settings */}
        <SettingsCard
          title="Personal & Regional Controls"
          description="Set your primary operational timezone, speed units, and audio alerts."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-body-sm font-semibold text-foreground">Operational Time Zone</span>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-body-sm font-medium text-foreground focus:outline-none"
              >
                <option value="Asia/Dubai">(UTC+04:00) Gulf Standard Time - Dubai / Abu Dhabi</option>
                <option value="Asia/Kolkata">(UTC+05:30) India Standard Time - New Delhi / Mumbai</option>
                <option value="Asia/Karachi">(UTC+05:00) Pakistan Standard Time - Karachi / Islamabad</option>
                <option value="Asia/Riyadh">(UTC+03:00) Arabia Standard Time - Riyadh</option>
                <option value="Europe/London">(UTC+00:00) Greenwich Mean Time - London</option>
                <option value="America/New_York">(UTC-05:00) Eastern Time - New York</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-body-sm font-semibold text-foreground">Speed & Telemetry Unit</span>
              <select
                value={speedUnit}
                onChange={(e) => setSpeedUnit(e.target.value)}
                className="w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-body-sm font-medium text-foreground focus:outline-none"
              >
                <option value="kmh">Kilometers per hour (km/h)</option>
                <option value="mph">Miles per hour (mph)</option>
                <option value="knots">Nautical Knots (Maritime / Fleet)</option>
              </select>
            </label>

            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-body-sm font-semibold text-foreground">Speed Violation Audio Alert</span>
              <select
                value={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.value)}
                className="w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-body-sm font-medium text-foreground focus:outline-none"
              >
                <option value="horn">🚨 Loud Siren & Horn (Immediate warning on overspeed)</option>
                <option value="beep">🔔 Gentle Beep (Driver friendly chime)</option>
                <option value="mute">🔕 Silent / Visual Flash Only</option>
              </select>
            </label>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard
          title="Notifications"
          description="Control frontend notification presentation across desktop and mobile devices."
        >
          <div className="space-y-3">
            <label className="flex min-h-control items-center justify-between gap-4 rounded-xl border border-border bg-surface-muted/30 p-4 transition-colors hover:bg-surface-muted/50">
              <span>
                <span className="block font-semibold text-foreground">Show notification previews</span>
                <span className="block text-body-xs text-muted-foreground">
                  Display high-priority speed violation banners without requesting browser OS permission.
                </span>
              </span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(event) => setNotificationsEnabled(event.currentTarget.checked)}
                className="size-5 rounded accent-primary cursor-pointer"
              />
            </label>
          </div>
        </SettingsCard>

        {/* Privacy & Mock Location Policy */}
        <SettingsCard
          title="Privacy"
          description="Review how mock location, live GPS coordinates, and activity information are represented."
        >
          <div className="space-y-3">
            <p className="rounded-xl border border-border bg-surface-muted/40 p-4 text-body-sm text-muted-foreground">
              🛡️ This frontend does not collect real GPS coordinates without explicit driver device consent. Visibility and consent policies are enforced at the hardware telemetry layer.
            </p>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-body-sm">
              <span className="font-medium text-foreground">Session Auto-Lock Security Timer</span>
              <select
                value={autoLockTimer}
                onChange={(e) => setAutoLockTimer(e.target.value)}
                className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="15m">Lock after 15 mins inactive</option>
                <option value="30m">Lock after 30 mins inactive</option>
                <option value="1h">Lock after 1 hour</option>
                <option value="never">Never lock during active trip</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        {/* Tracking settings (Only displayed when mode === 'tracking') */}
        {mode === 'tracking' ? (
          <SettingsCard
            title="Tracking settings"
            description="Review the current frontend tracking-mode context and map rendering preferences."
          >
            <div className="space-y-3">
              <label className="block space-y-1.5">
                <span className="text-body-sm font-semibold text-foreground">Default Map Rendering Engine</span>
                <select
                  value={mapEngine}
                  onChange={(e) => setMapEngine(e.target.value)}
                  className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-body-sm font-medium text-foreground focus:outline-none"
                >
                  <option value="osm">OpenStreetMap Vector HD (Fast & Low Data)</option>
                  <option value="google">Google Maps Satellite & Street Hybrid</option>
                  <option value="tomtom">TomTom Traffic & Speed Limit Layers</option>
                </select>
              </label>
              <p className="text-body-xs text-muted-foreground">
                Tracking, visibility, background location, and group policy controls operate continuously in tracking mode.
              </p>
            </div>
          </SettingsCard>
        ) : null}

        {/* Account & Session Controls */}
        <SettingsCard title="Account" description="Manage the current frontend demo session and active credentials.">
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-5">
            <p className="text-body font-bold text-danger">End demo session</p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Logging out clears the mock session, demo profile, pending profile, and active application
              mode from local storage.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="danger" onClick={onLogout} className="font-semibold shadow-xs">
                Log out
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <Button onClick={savePreferences} size="lg" className="font-semibold px-6">
          Save settings
        </Button>
        <p role="status" aria-live="polite" className="text-body-sm font-semibold text-primary">
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
    <section className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-xs transition-shadow hover:shadow-sm">
      <div>
        <h3 className="text-heading-sm font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
