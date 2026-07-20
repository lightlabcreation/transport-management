import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { AuthPageFrame } from './AuthPageFrame';

export interface ServiceRoleOption {
  id: 'driver' | 'workshop' | 'oil_change' | 'spare_parts' | 'visitor';
  title: string;
  badge: string;
  description: string;
  isLifeTracking?: boolean;
}

export const SERVICE_ROLE_OPTIONS: ServiceRoleOption[] = [
  {
    id: 'driver',
    title: 'Driver (Life Tracking)',
    badge: 'Live GPS',
    description: 'Real-time GPS telemetry and continuous location tracking on trips. Requires car plate registration.',
    isLifeTracking: true,
  },
  {
    id: 'workshop',
    title: 'Workshop (Location only)',
    badge: 'Location Pin',
    description: 'Auto repair and maintenance shop pinned on the live map for drivers and visitors.',
  },
  {
    id: 'oil_change',
    title: 'Oil change (Location only)',
    badge: 'Location Pin',
    description: 'Oil change specialty service center visible to all public map visitors.',
  },
  {
    id: 'spare_parts',
    title: 'Spare parts & Services (Location only)',
    badge: 'Location Pin',
    description: 'Auto parts and general service location pinned on the map.',
  },
  {
    id: 'visitor',
    title: 'Visitor',
    badge: 'Self Visible',
    description: '(It is up to Admin to be required or no) Standard visitor profile visible to yourself only.',
  },
];

export function ServiceListPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<ServiceRoleOption['id']>('driver');

  function handleProceed() {
    const roleObj = SERVICE_ROLE_OPTIONS.find((opt) => opt.id === selectedRole);
    if (roleObj) {
      try {
        window.sessionStorage.setItem('transport-management.auth-role', roleObj.id);
        window.sessionStorage.setItem('transport-management.auth-role-title', roleObj.title);
      } catch {
        // Storage might fail if private browsing or quota exceeded
      }
    }
    void navigate(`/auth/register?role=${selectedRole}`);
  }

  return (
    <AuthPageFrame
      eyebrow="Service Registration"
      title="Select Service Category"
      description="Choose your account role or service type from the list below to proceed with your registration."
    >
      <div className="space-y-4">
        <div
          role="radiogroup"
          aria-label="Service Roles"
          className="grid gap-3 max-h-[340px] overflow-y-auto pr-1"
        >
          {SERVICE_ROLE_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedRole(option.id)}
                className={cn(
                  'w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-fast',
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                    : 'border-border bg-surface hover:bg-surface-muted/60 hover:border-border/80',
                )}
              >
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-background">
                  {isSelected && <div className="size-2.5 rounded-full bg-primary" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-body font-bold text-foreground leading-snug">
                      {option.title}
                    </span>
                    <span
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono',
                        option.isLifeTracking
                          ? 'bg-success/15 text-success border border-success/30'
                          : 'bg-muted text-muted-foreground border border-border',
                      )}
                    >
                      {option.badge}
                    </span>
                  </div>
                  <p className="text-body-xs text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <Button type="button" size="lg" fullWidth onClick={handleProceed}>
            Proceed to Registration
          </Button>
        </div>
      </div>
    </AuthPageFrame>
  );
}
