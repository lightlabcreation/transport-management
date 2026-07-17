import { Button } from '@/components/ui/button';
import type { GroupRole, GroupCapability, GroupFormState } from '../groups.types';

// Types to communicate state to parent
interface StepProps {
  form: GroupFormState;
  onChange: <K extends keyof GroupFormState>(field: K, value: GroupFormState[K]) => void;
  errors?: Record<string, string>;
}

const APPROVED_CATEGORIES = [
  'Family',
  'Friends',
  'School',
  'Company',
  'Security',
  'Delivery',
] as const;

const ALL_CAPABILITIES: GroupCapability[] = [
  'edit_group',
  'invite_members',
  'remove_members',
  'block_members',
  'approve_join_requests',
  'reject_join_requests',
  'assign_roles',
  'edit_permissions',
  'view_live_map',
  'export_reports',
];

export function StepInfo({ form, onChange, errors = {} }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-body-md font-bold text-foreground">Group Information</h2>

      <div className="space-y-3">
        <div>
          <label htmlFor="group-name" className="block text-body-xs font-semibold text-foreground">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            id="group-name"
            type="text"
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g., Midnight Fleet Patrol"
          />
          {errors.name && <p className="mt-1 text-body-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="group-desc" className="block text-body-xs font-semibold text-foreground">
            Description / Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            id="group-desc"
            rows={3}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Provide a short description for members..."
          />
          {errors.description && (
            <p className="mt-1 text-body-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="group-cat" className="block text-body-xs font-semibold text-foreground">
            Category
          </label>
          <select
            id="group-cat"
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={form.category}
            onChange={(e) => onChange('category', e.target.value as GroupFormState['category'])}
          >
            {APPROVED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-body-xs font-semibold text-foreground">Group Logo</span>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted font-bold text-muted-foreground border border-dashed border-border text-body-lg">
              {form.name ? form.name.substring(0, 2).toUpperCase() : 'GP'}
            </div>
            <Button variant="outline" disabled aria-label="Upload logo placeholder">
              Upload Logo (Simulated)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepPrivacy({ form, onChange }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-body-md font-bold text-foreground">Privacy Setting</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            form.visibility === 'public'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border bg-card hover:bg-muted/10'
          }`}
          onClick={() => onChange('visibility', 'public')}
          aria-label="Public privacy option"
        >
          <span className="font-bold text-foreground text-body-sm">Public Group</span>
          <p className="mt-1.5 text-body-xs text-muted-foreground">
            Discoverable in directory. Users can search and request to join the group.
          </p>
        </button>

        <button
          type="button"
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            form.visibility === 'private'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border bg-card hover:bg-muted/10'
          }`}
          onClick={() => onChange('visibility', 'private')}
          aria-label="Private privacy option"
        >
          <span className="font-bold text-foreground text-body-sm">Private Group</span>
          <p className="mt-1.5 text-body-xs text-muted-foreground">
            Hidden from public directory. Joining is restricted strictly via invitation links or QR
            code.
          </p>
        </button>
      </div>
    </div>
  );
}

export function StepTracking({ form, onChange }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-body-md font-bold text-foreground">Tracking Settings</h2>

      <div className="rounded-lg bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 p-3 text-body-xs">
        ⚠️ <strong>Notice:</strong> Location updates are simulated locally. No real browser location
        permissions will be requested.
      </div>

      <div className="space-y-4">
        <div>
          <span className="block text-body-xs font-semibold text-foreground">Tracking Mode</span>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['continuous', 'optional', 'disabled'].map((mode) => (
              <label
                key={mode}
                className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer capitalize text-body-xs ${
                  form.trackingMode === mode
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <input
                  type="radio"
                  name="tracking-mode"
                  checked={form.trackingMode === mode}
                  onChange={() => onChange('trackingMode', mode as GroupFormState['trackingMode'])}
                  className="accent-primary"
                />
                {mode} Tracking
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
          <div>
            <span className="block text-body-xs font-semibold text-foreground">
              Background Tracking
            </span>
            <p className="text-[11px] text-muted-foreground">
              Keep tracking location when the application is minimized.
            </p>
          </div>
          <input
            type="checkbox"
            checked={form.backgroundTracking}
            onChange={(e) => onChange('backgroundTracking', e.target.checked)}
            className="size-5 accent-primary cursor-pointer"
            aria-label="Background tracking switch"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="gps-accuracy"
              className="block text-body-xs font-semibold text-foreground"
            >
              Location Accuracy
            </label>
            <select
              id="gps-accuracy"
              className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none"
              value={form.locationAccuracy}
              onChange={(e) =>
                onChange('locationAccuracy', e.target.value as GroupFormState['locationAccuracy'])
              }
            >
              <option value="high">High (GPS Telemetry)</option>
              <option value="medium">Medium (Wi-Fi & Cellular)</option>
              <option value="low">Low (Coarse Geofencing)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="refresh-time"
              className="block text-body-xs font-semibold text-foreground"
            >
              Refresh Interval
            </label>
            <select
              id="refresh-time"
              className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none"
              value={form.refreshInterval}
              onChange={(e) =>
                onChange('refreshInterval', e.target.value as GroupFormState['refreshInterval'])
              }
            >
              <option value="10s">10 Seconds</option>
              <option value="30s">30 Seconds</option>
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepVisibility({ form, onChange }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-body-md font-bold text-foreground">Visibility Policy</h2>

      <div>
        <label
          htmlFor="visibility-policy"
          className="block text-body-xs font-semibold text-foreground"
        >
          Who can view member positions?
        </label>
        <select
          id="visibility-policy"
          className="mt-1 w-full rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
          value={form.visibilityPolicy}
          onChange={(e) =>
            onChange('visibilityPolicy', e.target.value as GroupFormState['visibilityPolicy'])
          }
        >
          <option value="everyone">Everyone can see everyone</option>
          <option value="admins_only">Administrators only (Members hidden from each other)</option>
          <option value="nearby_only">Nearby members only (Subject to geographic proximity)</option>
          <option value="invisible">
            Invisible member mode (Location coordinates cached privately)
          </option>
          <option value="hidden_admin">
            Hidden administrator presentation (Admin pins hidden from members)
          </option>
        </select>
      </div>

      <div className="rounded-lg bg-muted/30 p-4 text-body-xs text-muted-foreground space-y-2">
        <p>
          <strong>Visibility Rules:</strong>
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Admins retain access to view all active pins under tracking policy bounds.</li>
          <li>Geofencing updates are computed on telemetry logs locally.</li>
        </ul>
      </div>
    </div>
  );
}

interface StepRolesProps extends StepProps {
  onToggleCapability: (role: GroupRole, cap: GroupCapability) => void;
}

export function StepRoles({ form, onToggleCapability }: StepRolesProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-body-md font-bold text-foreground">Roles & Permissions Configurator</h2>
      <p className="text-body-xs text-muted-foreground">
        Configure which capabilities are delegated to each role by default.
      </p>

      <div className="space-y-4 divide-y divide-border">
        {(['delegated_admin', 'admin', 'moderator', 'member', 'guest'] as GroupRole[]).map(
          (role) => (
            <div key={role} className="pt-4 first:pt-0">
              <span className="block text-body-xs font-semibold text-foreground capitalize">
                {role.replace('_', ' ')} Permissions
              </span>

              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_CAPABILITIES.map((cap) => {
                  const isChecked = form.roleCapabilities[role].includes(cap);
                  return (
                    <label
                      key={cap}
                      className={`flex items-center gap-2 p-2 border rounded-md text-[10px] cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-primary/5 border-primary/20 text-primary'
                          : 'bg-card border-border text-muted-foreground'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleCapability(role, cap)}
                        className="accent-primary"
                      />
                      {cap.replace('_', ' ')}
                    </label>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function StepReview({ form, onChange, errors = {} }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-body-md font-bold text-foreground">Review Group Details</h2>

      <div className="space-y-4 divide-y divide-border text-body-sm text-foreground">
        <div className="space-y-1.5">
          <h3 className="font-bold text-body-xs text-muted-foreground uppercase">
            1. General Information
          </h3>
          <p>
            <strong>Name:</strong> {form.name}
          </p>
          <p>
            <strong>Description:</strong> {form.description}
          </p>
          <p>
            <strong>Category:</strong> {form.category}
          </p>
        </div>

        <div className="pt-3 space-y-1.5">
          <h3 className="font-bold text-body-xs text-muted-foreground uppercase">
            2. Privacy Settings
          </h3>
          <p className="capitalize">
            <strong>Mode:</strong> {form.visibility}
          </p>
        </div>

        <div className="pt-3 space-y-1.5">
          <h3 className="font-bold text-body-xs text-muted-foreground uppercase">
            3. Tracking Policies
          </h3>
          <p className="capitalize">
            <strong>Mode:</strong> {form.trackingMode} tracking
          </p>
          <p>
            <strong>Background Updates:</strong> {form.backgroundTracking ? 'Enabled' : 'Disabled'}
          </p>
          <p className="capitalize">
            <strong>Accuracy:</strong> {form.locationAccuracy}
          </p>
          <p>
            <strong>Refresh Interval:</strong> {form.refreshInterval}
          </p>
        </div>

        <div className="pt-3 space-y-1.5">
          <h3 className="font-bold text-body-xs text-muted-foreground uppercase">
            4. Visibility Scope
          </h3>
          <p className="capitalize">
            <strong>Policy:</strong> {form.visibilityPolicy.replace('_', ' ')}
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => onChange('acceptTerms', e.target.checked)}
              className="mt-1 size-5 accent-primary shrink-0"
              aria-label="Accept terms checkbox"
            />
            <span className="text-body-xs text-muted-foreground leading-snug">
              I accept the{' '}
              <a
                href="/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Terms and Conditions
              </a>{' '}
              and consent to location sharing policies specified in the setup wizard.
            </span>
          </label>
          {errors.acceptTerms && <p className="text-body-xs text-red-500">{errors.acceptTerms}</p>}
        </div>
      </div>
    </div>
  );
}

interface StepSuccessProps {
  name: string;
  onReset: () => void;
  onBack: () => void;
}

export function StepSuccess({ name, onReset, onBack }: StepSuccessProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-heading-sm font-bold text-foreground">
          Group Registration Pending Approval
        </h2>
        <p className="mx-auto max-w-md text-body-sm text-muted-foreground">
          Your group registration request for <strong>{name}</strong> has been successfully
          submitted and is under platform review.
        </p>
      </div>

      <div className="rounded-lg bg-primary/5 text-primary border border-primary/10 p-4 mx-auto max-w-md text-body-xs text-left">
        📌 <strong>Simulation Check:</strong> This is a frontend simulation. Real-world payment
        gateways, server databases, and activation procedures will be connected in future
        integration phases.
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onReset} aria-label="Start over button">
          Start Over
        </Button>
        <Button onClick={onBack} aria-label="Return to groups directory list">
          Back to Directory
        </Button>
      </div>
    </div>
  );
}
