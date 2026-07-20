import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Group, GroupRole, GroupCapability, GroupFormState } from './groups.types';
import {
  StepInfo,
  StepPrivacy,
  StepTracking,
  StepVisibility,
  StepRoles,
  StepReview,
  StepSuccess,
} from './components/CreateGroupSteps';

interface CreateGroupPageProps {
  onBack: () => void;
  onGroupCreated?: (group: Group) => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

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

const DEFAULT_ROLE_CAPABILITIES: Record<GroupRole, GroupCapability[]> = {
  owner: ALL_CAPABILITIES,
  delegated_admin: [
    'invite_members',
    'approve_join_requests',
    'reject_join_requests',
    'view_live_map',
  ],
  admin: [
    'invite_members',
    'remove_members',
    'approve_join_requests',
    'reject_join_requests',
    'view_live_map',
  ],
  moderator: ['invite_members', 'approve_join_requests', 'reject_join_requests'],
  member: ['view_live_map'],
  guest: [],
};

const INITIAL_FORM_STATE: GroupFormState = {
  name: '',
  description: '',
  category: 'Family',
  visibility: 'public',
  trackingMode: 'continuous',
  backgroundTracking: true,
  locationAccuracy: 'high',
  refreshInterval: '30s',
  visibilityPolicy: 'everyone',
  roleCapabilities: { ...DEFAULT_ROLE_CAPABILITIES },
  acceptTerms: false,
};

export function CreateGroupPage({ onBack, onGroupCreated }: CreateGroupPageProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<GroupFormState>({ ...INITIAL_FORM_STATE });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange<K extends keyof GroupFormState>(field: K, value: GroupFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  }

  function handleCapabilityToggle(role: GroupRole, cap: GroupCapability) {
    if (role === 'owner') return;

    setForm((prev) => {
      const current = prev.roleCapabilities[role];
      const updated = current.includes(cap) ? current.filter((c) => c !== cap) : [...current, cap];
      return {
        ...prev,
        roleCapabilities: {
          ...prev.roleCapabilities,
          [role]: updated,
        },
      };
    });
  }

  function validateStep(): boolean {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!form.name.trim()) {
        errors.name = 'Group Name is required.';
      }
      if (!form.description.trim()) {
        errors.description = 'Description is required.';
      }
    } else if (step === 6) {
      if (!form.acceptTerms) {
        errors.acceptTerms = 'You must accept the Terms and Conditions to proceed.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function nextStep() {
    if (validateStep()) {
      setStep((prev) => (prev + 1) as WizardStep);
    }
  }

  function prevStep() {
    setStep((prev) => (prev - 1) as WizardStep);
  }

  function handleSubmit() {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      // Build the new Group object from wizard form data
      const nameWords = form.name.trim().split(/\s+/);
      const initials =
        nameWords.length >= 2
          ? `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase()
          : form.name.slice(0, 2).toUpperCase();

      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        visibility: form.visibility,
        status: 'pending',
        memberCount: 1,
        lastUpdated: new Date().toISOString(),
        initials,
        category: form.category,
        trackingPolicy: form.trackingMode,
        visibilityPolicy: form.visibilityPolicy,
        members: [],
        joinRequests: [],
      };

      // Notify parent to add to live list
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }

      setStep(7);
    }, 1200);
  }

  function handleReset() {
    setForm({ ...INITIAL_FORM_STATE });
    setStep(1);
    setValidationErrors({});
  }

  return (
    <div
      className="mx-auto max-w-[var(--container-content)] p-4 space-y-6"
      aria-label="Create group form workspace"
    >
      {step < 7 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-md font-bold text-foreground">Create New Group</h1>
              <p className="text-body-xs text-muted-foreground">
                Setup group details and location tracking preferences.
              </p>
            </div>
            <span className="text-body-sm font-semibold text-primary">Step {step} of 6</span>
          </div>

          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-fast"
              style={{ width: `${(step / 6) * 100}%` }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={6}
              aria-label="Progress bar"
            />
          </div>
        </div>
      )}

      {/* Render Steps */}
      {step === 1 && (
        <StepInfo form={form} onChange={handleInputChange} errors={validationErrors} />
      )}
      {step === 2 && (
        <StepPrivacy form={form} onChange={handleInputChange} errors={validationErrors} />
      )}
      {step === 3 && (
        <StepTracking form={form} onChange={handleInputChange} errors={validationErrors} />
      )}
      {step === 4 && (
        <StepVisibility form={form} onChange={handleInputChange} errors={validationErrors} />
      )}
      {step === 5 && (
        <StepRoles
          form={form}
          onChange={handleInputChange}
          errors={validationErrors}
          onToggleCapability={handleCapabilityToggle}
        />
      )}
      {step === 6 && (
        <StepReview form={form} onChange={handleInputChange} errors={validationErrors} />
      )}
      {step === 7 && <StepSuccess name={form.name} onReset={handleReset} onBack={onBack} />}

      {step < 7 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            disabled={step === 1 || isSubmitting}
            onClick={prevStep}
            aria-label="Previous wizard step"
          >
            Back
          </Button>

          {step < 6 ? (
            <Button onClick={nextStep} aria-label="Next wizard step">
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
              aria-label="Submit group creation request"
            >
              {isSubmitting ? 'Submitting...' : 'Register Group'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
