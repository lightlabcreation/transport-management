import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoAccessProfiles } from '@/features/access-control';
import type { DemoAccessProfileId, PendingDemoAccessStore } from '@/features/access-control';

import { AuthServiceError, type AuthService, type AuthServiceErrorCode } from './authService';
import { AuthPageFrame } from './AuthPageFrame';
import { normalizePhoneNumber } from './phoneNumber';

const mobileSchema = z.object({
  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d+$/),
  nationalNumber: z
    .string()
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .pipe(z.string().regex(/^\d+$/)),
});

interface LoginPageProps {
  authService: AuthService;
  pendingDemoAccessStore?: PendingDemoAccessStore;
}

interface FieldErrors {
  countryCode?: string;
  nationalNumber?: string;
}

const serviceErrorMessages: Record<AuthServiceErrorCode, string> = {
  duplicate_account: 'Something went wrong. Please try again.',
  validation: 'Something went wrong. Please try again.',
  invalid_otp: 'Something went wrong. Please try again.',
  expired_challenge: 'Something went wrong. Please try again.',
  rate_limited: 'Too many requests. Please wait before trying again.',
  network: 'Unable to connect. Check your connection and try again.',
  unavailable: 'Sign in is temporarily unavailable. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

const countryOptions = [
  { value: '+91', label: 'India (+91)' },
  { value: '+1', label: 'United States (+1)' },
  { value: '+44', label: 'United Kingdom (+44)' },
  { value: '+971', label: 'United Arab Emirates (+971)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+65', label: 'Singapore (+65)' },
] as const;

const shortProfileInfo: Record<DemoAccessProfileId, { icon: string; shortDesc: string }> = {
  'group-owner': { icon: '👑', shortDesc: 'Master control over platform & groups' },
  'delegated-group-administrator': { icon: '🔑', shortDesc: 'Assisted administration & permissions' },
  'group-admin': { icon: '🛡️', shortDesc: 'Manage cluster ops & safety policies' },
  moderator: { icon: '👨‍💼', shortDesc: 'Monitor speed violations & road safety' },
  member: { icon: '👥', shortDesc: 'Live GPS tracking & SOS emergency controls' },
  'group-guest': { icon: '👁️', shortDesc: 'View-only map preview (no GPS sharing)' },
};

export function LoginPage({ authService, pendingDemoAccessStore }: LoginPageProps) {
  const navigate = useNavigate();
  const countryCodeRef = useRef<HTMLSelectElement>(null);
  const nationalNumberRef = useRef<HTMLInputElement>(null);
  const serviceErrorRef = useRef<HTMLDivElement>(null);
  const [countryCode, setCountryCode] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<DemoAccessProfileId | ''>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serviceError, setServiceError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceError) {
      serviceErrorRef.current?.focus();
    }
  }, [serviceError]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const result = mobileSchema.safeParse({ countryCode, nationalNumber });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      const invalidFields = new Set(result.error.issues.map((issue) => issue.path[0]));

      if (invalidFields.has('countryCode')) {
        nextErrors.countryCode = 'Select a country code beginning with + followed by digits.';
      }

      if (invalidFields.has('nationalNumber')) {
        nextErrors.nationalNumber = 'Enter a valid mobile number.';
      }

      setFieldErrors(nextErrors);
      setServiceError(undefined);

      if (nextErrors.countryCode) {
        countryCodeRef.current?.focus();
      } else {
        nationalNumberRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});
    setServiceError(undefined);
    setIsSubmitting(true);

    if (selectedProfileId) {
      pendingDemoAccessStore?.setProfileId(selectedProfileId);
    } else {
      pendingDemoAccessStore?.clearProfile();
    }

    try {
      const response = await authService.requestOtp({
        mobileNumber: normalizePhoneNumber(result.data.countryCode, result.data.nationalNumber),
        password: password ? password : undefined,
      });

      void navigate('/auth/verify', {
        state: {
          source: response.source,
          challengeId: response.challengeId,
          maskedMobile: response.maskedMobile,
          expiresAt: response.expiresAt,
        },
      });
    } catch (error) {
      pendingDemoAccessStore?.clearProfile();
      const message =
        error instanceof AuthServiceError
          ? serviceErrorMessages[error.code]
          : serviceErrorMessages.unknown;
      setServiceError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageFrame
      compact
      eyebrow="Passwordless access"
      title="Welcome back"
      description="Choose an optional demo role, then enter your mobile number to generate a one-time verification code."
      footer={
        <nav aria-label="Authentication links" className="flex justify-center gap-4">
          <Link
            className="font-semibold text-primary underline-offset-4 hover:underline"
            to="/auth/register"
          >
            Create an account
          </Link>
          <span className="text-border">•</span>
          <Link
            className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            to="/legal/terms"
          >
            Terms
          </Link>
        </nav>
      }
    >
      <form className="space-y-3.5" noValidate onSubmit={(event) => void handleSubmit(event)}>
        <fieldset className="space-y-2 rounded-lg border border-border/80 bg-surface/40 p-2.5">
          <legend className="text-body-xs font-semibold text-foreground px-1">
            Choose demo role <span className="font-normal text-muted-foreground">(optional)</span>
          </legend>
          <p className="text-[10px] text-muted-foreground px-1 leading-tight">
            This role selector is for frontend demo access preview only. Production roles will be managed by backend authorization.
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2" role="radiogroup" aria-label="Demo roles">
            {demoAccessProfiles.map((profile) => {
              const isSelected = selectedProfileId === profile.id;
              const info = shortProfileInfo[profile.id];
              return (
                <label
                  key={profile.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-primary ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-2xs font-semibold'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="demoProfile"
                    value={profile.id}
                    checked={isSelected}
                    onChange={() => setSelectedProfileId(profile.id)}
                    className="size-3.5 accent-primary shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold text-foreground leading-snug">
                      {info.icon} {profile.name}
                    </span>
                    <span className="block text-[10px] text-muted-foreground leading-tight">
                      {info.shortDesc}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="mobile-number" className="text-body-xs font-semibold">Mobile number</Label>
          <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.38fr)_minmax(0,1fr)]">
            <select
              ref={countryCodeRef}
              id="country-code"
              name="countryCode"
              autoComplete="tel-country-code"
              value={countryCode}
              onChange={(event) => setCountryCode(event.currentTarget.value)}
              aria-label="Country code"
              aria-invalid={fieldErrors.countryCode ? true : undefined}
              aria-describedby={fieldErrors.countryCode ? 'country-code-error' : undefined}
              className="h-9 w-full rounded-md border border-input bg-surface px-2.5 py-1 text-body-xs font-medium text-foreground transition-colors duration-fast ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-muted aria-invalid:border-danger"
            >
              <option value="">Code</option>
              {countryOptions.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            <Input
              ref={nationalNumberRef}
              id="mobile-number"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel-national"
              value={nationalNumber}
              onChange={(event) => setNationalNumber(event.currentTarget.value.replace(/\D/g, ''))}
              aria-invalid={fieldErrors.nationalNumber ? true : undefined}
              aria-describedby={fieldErrors.nationalNumber ? 'mobile-number-error' : undefined}
              placeholder="9876543210 (Digits only)"
              className="h-9 text-body-xs font-medium"
            />
          </div>
          {fieldErrors.countryCode ? (
            <p id="country-code-error" className="text-[11px] text-danger font-medium">
              {fieldErrors.countryCode}
            </p>
          ) : null}
          {fieldErrors.nationalNumber ? (
            <p id="mobile-number-error" className="text-[11px] text-danger font-medium">
              {fieldErrors.nationalNumber}
            </p>
          ) : null}
        </div>

        <div className="space-y-1 pt-0.5">
          <Label htmlFor="password" className="text-body-xs font-semibold">
            Password <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            placeholder="Enter password if already set (optional)"
            className="h-9 text-body-xs font-medium"
          />
        </div>

        {serviceError ? (
          <div
            ref={serviceErrorRef}
            role="alert"
            tabIndex={-1}
            className="rounded-md border border-danger p-2 text-[11px] font-semibold text-danger"
          >
            {serviceError}
          </div>
        ) : null}

        {isSubmitting ? (
          <p role="status" className="text-[11px] text-muted-foreground">
            Generating verification code...
          </p>
        ) : null}

        <Button className="mt-1" type="submit" size="md" fullWidth isLoading={isSubmitting}>
          Generate OTP
        </Button>
      </form>
    </AuthPageFrame>
  );
}
