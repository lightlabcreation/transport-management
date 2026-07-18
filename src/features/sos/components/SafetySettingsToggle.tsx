import type { SafetySettings } from '../sos.types';

interface SafetySettingsToggleProps {
  settings: SafetySettings;
  onChange: (key: keyof SafetySettings, val: boolean) => void;
}

export function SafetySettingsToggle({ settings, onChange }: SafetySettingsToggleProps) {
  const toggleOptions: { key: keyof SafetySettings; label: string; desc: string }[] = [
    {
      key: 'crashDetection',
      label: 'Automatic Crash Detection',
      desc: 'Mock triggers distress broadcast if sudden deceleration telemetry is recorded.',
    },
    {
      key: 'speedAlerts',
      label: 'Overspeed Warnings',
      desc: 'Announces speed compliance limit exceedance alerts.',
    },
    {
      key: 'seatBeltAlarm',
      label: 'Seat-Belt Telemetry Alarms',
      desc: 'Triggers visual flash reminders if driver telemetry shows unbuckled belt.',
    },
    {
      key: 'schoolZoneNotify',
      label: 'School Zone Alerts',
      desc: 'Automatic speed limit drops warning alerts when entering school zone corridors.',
    },
  ];

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Safety Alert Settings
        </h2>
        <p className="text-body-xs text-muted-foreground">
          Configure visual warnings and simulated automation triggers.
        </p>
      </div>

      <div className="divide-y divide-border/60">
        {toggleOptions.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between py-4 first:pt-1 last:pb-1">
            <div className="space-y-0.5 pr-4">
              <label htmlFor={`toggle-${opt.key}`} className="text-body-sm font-bold text-foreground cursor-pointer">
                {opt.label}
              </label>
              <p className="text-body-xs text-muted-foreground">{opt.desc}</p>
            </div>

            {/* Toggle Switch */}
            <button
              id={`toggle-${opt.key}`}
              type="button"
              role="switch"
              aria-checked={settings[opt.key]}
              onClick={() => onChange(opt.key, !settings[opt.key])}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-fast ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                settings[opt.key] ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-surface shadow ring-0 transition duration-fast ease-in-out ${
                  settings[opt.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
