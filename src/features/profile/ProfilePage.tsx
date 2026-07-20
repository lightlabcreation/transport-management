import { useState, type FormEvent, type ReactNode } from 'react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .transform((value) => (value === '' ? undefined : value))
    .pipe(z.email().optional()),
  language: z.string(),
});

export type ProfileViewState = 'ready' | 'loading' | 'error';

interface ProfilePageProps {
  initialViewState?: ProfileViewState;
}

export function ProfilePage({ initialViewState = 'ready' }: ProfilePageProps) {
  const [firstName, setFirstName] = useState('Demo');
  const [lastName, setLastName] = useState('Operator');
  const [email, setEmail] = useState('demo@example.com');
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState<'identity' | 'telemetry' | 'security'>('identity');
  
  // Interactive Telemetry Settings
  const [gpsBroadcast, setGpsBroadcast] = useState(true);
  const [highPrecisionPing, setHighPrecisionPing] = useState(false);
  const [sosAutoNotify, setSosAutoNotify] = useState(true);
  const [badgeDownloaded, setBadgeDownloaded] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  if (initialViewState === 'loading') {
    return (
      <div role="status" className="space-y-4" aria-label="Loading profile">
        <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-2xl bg-surface-muted" />
          <div className="h-96 animate-pulse rounded-2xl bg-surface-muted lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (initialViewState === 'error') {
    return (
      <section role="alert" className="rounded-2xl border border-danger/40 bg-danger/5 p-8 shadow-sm">
        <div className="flex items-center gap-3 text-danger">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-heading-sm font-semibold">Profile unavailable</h2>
        </div>
        <p className="mt-2 text-body text-muted-foreground">
          The frontend profile preview could not be loaded. Try again later.
        </p>
      </section>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = profileSchema.safeParse({ firstName, lastName, email, language });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        nextErrors[field] =
          field === 'email' ? 'Enter a valid email address or leave it empty.' : 'Required field.';
      }
      setErrors(nextErrors);
      setStatus('Review the highlighted profile fields.');
      return;
    }

    setErrors({});
    setStatus('Profile changes saved in this frontend preview.');
  }

  function handleDownloadBadge() {
    setBadgeDownloaded(true);
    setTimeout(() => setBadgeDownloaded(false), 3500);
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface via-surface to-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-body-xs font-bold uppercase tracking-wider text-primary">
              Personal details
            </span>
            <Badge variant="success">Level 4 Clearance</Badge>
            <Badge variant="info">Verified Identity</Badge>
          </div>
          <h2 className="mt-2 text-heading-lg font-bold tracking-tight text-foreground">Profile</h2>
          <p className="mt-1 max-w-2xl text-body text-muted-foreground">
            Review frontend-only account details. No personal information is persisted by this page.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant={badgeDownloaded ? 'primary' : 'outline'}
            size="sm"
            onClick={handleDownloadBadge}
          >
            {badgeDownloaded ? '✔️ License Card Downloaded' : '🪪 Export Operator License Card'}
          </Button>
        </div>
      </header>

      {/* Main Grid: Left ID Card & Right Tabbed Workspace */}
      <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        {/* Left Aside: Official Holographic Operator ID License */}
        <aside className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-md transition-all hover:shadow-lg">
          {/* License Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-primary text-body-xs font-bold text-primary-foreground">
                🚚
              </span>
              <span className="text-body-xs font-extrabold uppercase tracking-widest text-foreground">
                GTS OPERATOR LIC
              </span>
            </div>
            <span className="font-mono text-body-xs font-semibold text-muted-foreground">
              #GTS-8849-DO
            </span>
          </div>

          {/* Avatar & Glowing Online Status */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="relative">
              <div className="grid size-24 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-heading-lg font-extrabold text-primary-foreground shadow-lg ring-4 ring-primary/20">
                DO
              </div>
              <span
                className="absolute -bottom-1 -right-1 size-6 rounded-full border-2 border-surface bg-success"
                title="Active GPS Broadcast"
              />
            </div>
            <h3 className="mt-4 text-heading-sm font-bold text-foreground">
              {firstName} {lastName}
            </h3>
            <p className="text-body-sm font-medium text-primary">Demo Operator</p>
            <p className="text-body-xs text-muted-foreground">Frontend preview account</p>
          </div>

          {/* Operator Metrics Pills */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-muted p-3 text-center">
            <div className="border-r border-border/60">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Safety Rating
              </span>
              <span className="text-body font-extrabold text-success">4.98 ⭐</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Trips
              </span>
              <span className="text-body font-extrabold text-foreground">1,420 km</span>
            </div>
          </div>

          {/* Verification Specifications List */}
          <dl className="space-y-3 border-t border-border pt-4 text-body-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Mobile status</dt>
              <dd className="font-semibold text-foreground">Verified mock number</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Account storage</dt>
              <dd className="font-semibold text-foreground">Not persisted</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Assigned Cluster</dt>
              <dd className="font-semibold text-primary">Express North Fleet</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Speed Protocol</dt>
              <dd className="font-semibold text-foreground">High Precision HUD</dd>
            </div>
          </dl>

          {/* Simulated QR Verification Footer */}
          <div className="rounded-xl border border-dashed border-border bg-card p-3 text-center space-y-1">
            <div className="mx-auto flex size-16 items-center justify-center rounded bg-foreground text-background font-mono text-[9px] font-bold leading-tight p-1 tracking-tighter">
              [GTS-AUTH-QR-OK]
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground">
              Scan to verify operator credentials (`M11`)
            </p>
          </div>
        </aside>

        {/* Right Panel: Interactive Form Workspace */}
        <div className="space-y-6">
          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
            <Button
              size="sm"
              variant={activeSection === 'identity' ? 'primary' : 'ghost'}
              onClick={() => setActiveSection('identity')}
            >
              👤 Profile identification
            </Button>
            <Button
              size="sm"
              variant={activeSection === 'telemetry' ? 'primary' : 'ghost'}
              onClick={() => setActiveSection('telemetry')}
            >
              📡 Telemetry &amp; Privacy
            </Button>
            <Button
              size="sm"
              variant={activeSection === 'security' ? 'primary' : 'ghost'}
              onClick={() => setActiveSection('security')}
            >
              🔒 Security &amp; Credentials
            </Button>
          </div>

          {activeSection === 'identity' && (
            <form
              className="rounded-2xl border border-border bg-surface p-6 shadow-md transition-all space-y-6"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="border-b border-border pb-4">
                <h3 className="text-heading-sm font-bold text-foreground">Profile information</h3>
                <p className="text-body-sm text-muted-foreground">
                  Update your public display name, verified mobile contact, and language preference.
                </p>
              </div>

              {/* Status Alert if triggered */}
              {status && (
                <div
                  role="status"
                  className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-body-sm font-semibold text-primary flex items-center justify-between"
                >
                  <span>{status}</span>
                  <Badge variant="primary">Synced</Badge>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <ProfileField label="First name" id="profile-first-name" error={errors.firstName}>
                  <Input
                    id="profile-first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.currentTarget.value)}
                    aria-invalid={errors.firstName ? true : undefined}
                    placeholder="Enter first name"
                  />
                </ProfileField>
                <ProfileField label="Last name" id="profile-last-name" error={errors.lastName}>
                  <Input
                    id="profile-last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.currentTarget.value)}
                    aria-invalid={errors.lastName ? true : undefined}
                    placeholder="Enter last name"
                  />
                </ProfileField>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <ProfileField label="Verified mobile" id="profile-mobile">
                  <Input id="profile-mobile" value="+•• ••••••3210" readOnly className="bg-surface-muted font-mono" />
                </ProfileField>
                <ProfileField label="Email (optional)" id="profile-email" error={errors.email}>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    aria-invalid={errors.email ? true : undefined}
                    placeholder="operator@transport.com"
                  />
                </ProfileField>
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="profile-language">Language</Label>
                <select
                  id="profile-language"
                  value={language}
                  onChange={(event) => setLanguage(event.currentTarget.value)}
                  className="w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-body-sm text-foreground focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 transition-colors"
                >
                  <option value="en">English (United States)</option>
                  <option value="hi">Hindi (हिन्दी) — India</option>
                  <option value="es">Spanish (Español) — International</option>
                  <option value="fr">French (Français) — European</option>
                  <option value="ar">Arabic (العربية) — Middle East</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFirstName('Demo');
                    setLastName('Operator');
                    setEmail('demo@example.com');
                    setErrors({});
                    setStatus('Profile fields reset to default preview values.');
                  }}
                >
                  Reset changes
                </Button>
                <Button type="submit">Save profile</Button>
              </div>
            </form>
          )}

          {activeSection === 'telemetry' && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-md space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-heading-sm font-bold text-foreground">Telemetry &amp; Privacy Protocols</h3>
                <p className="text-body-sm text-muted-foreground">
                  Control how your vehicle speed and GPS coordinates are broadcasted to your tracking cluster.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-card">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-body-sm text-foreground">Live GPS Coordinate Broadcast</h4>
                    <p className="text-body-xs text-muted-foreground">
                      Continuously transmit real-time latitude/longitude to Express Logistics North Fleet.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={gpsBroadcast ? 'primary' : 'outline'}
                    onClick={() => setGpsBroadcast(!gpsBroadcast)}
                  >
                    {gpsBroadcast ? '📡 ACTIVE BROADCAST' : '⏸️ PAUSED'}
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-card">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-body-sm text-foreground">High Precision Telemetry Ping (1s interval)</h4>
                    <p className="text-body-xs text-muted-foreground">
                      Increases GPS sampling rate for supercar/EV cockpit speedometer precision. May increase battery usage.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={highPrecisionPing ? 'primary' : 'outline'}
                    onClick={() => setHighPrecisionPing(!highPrecisionPing)}
                  >
                    {highPrecisionPing ? '⚡ ENABLED (1 sec)' : '⚙️ STANDARD (5 sec)'}
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-card">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-body-sm text-foreground">Automatic Emergency SOS Trigger</h4>
                    <p className="text-body-xs text-muted-foreground">
                      Automatically alert cluster owner and emergency contacts if sudden G-force impact or deceleration is detected.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={sosAutoNotify ? 'danger' : 'outline'}
                    onClick={() => setSosAutoNotify(!sosAutoNotify)}
                  >
                    {sosAutoNotify ? '🚨 AUTO-SOS ARMED' : '🔕 DISABLED'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-md space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-heading-sm font-bold text-foreground">Security &amp; Active Sessions</h3>
                <p className="text-body-sm text-muted-foreground">
                  Review your authentication method, session duration, and cluster access permissions (`M11`).
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4 bg-card space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Authentication Method</span>
                  <p className="text-body-sm font-bold text-foreground">Passwordless Mobile OTP</p>
                  <p className="text-body-xs text-success font-medium">✔️ Verified via SMS Gateway</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Session Expiry</span>
                  <p className="text-body-sm font-bold text-foreground">24 Hours Remaining</p>
                  <p className="text-body-xs text-muted-foreground">Auto-refresh enabled on active navigation</p>
                </div>
              </div>

              <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-body-sm text-foreground">Sign Out of All Cluster Devices</h4>
                  <p className="text-body-xs text-muted-foreground">
                    Immediately revoke active preview tokens on mobile devices and desktop HUD sessions.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert('All remote cluster sessions terminated safely.')}
                >
                  🔒 Revoke Sessions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProfileFieldProps {
  label: string;
  id: string;
  error?: string | undefined;
  children: ReactNode;
}

function ProfileField({ label, id, error, children }: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-body-xs font-semibold text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
