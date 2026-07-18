import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoAccessProfiles, findDemoAccessProfile } from '@/features/access-control';
import type {
  DemoAccessProfileId,
  PendingDemoAccessStore,
  DemoAccessStore,
} from '@/features/access-control';

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
  accessStore?: DemoAccessStore;
}

interface FieldErrors {
  countryCode?: string;
  nationalNumber?: string;
  password?: string;
}

const serviceErrorMessages: Record<AuthServiceErrorCode, string> = {
  duplicate_account: 'Something went wrong. Please try again.',
  validation: 'Please check your input details and try again.',
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

const demoCredentials: Record<DemoAccessProfileId, { mobile: string; password: string }> = {
  'group-owner': { mobile: '9876543210', password: 'demo@owner' },
  'delegated-group-administrator': { mobile: '9876543211', password: 'demo@delegated' },
  'group-admin': { mobile: '9876543212', password: 'demo@admin' },
  moderator: { mobile: '9876543213', password: 'demo@moderator' },
  member: { mobile: '9876543214', password: 'demo@member' },
  'group-guest': { mobile: '9876543215', password: 'demo@guest' },
};

export function LoginPage({ authService, pendingDemoAccessStore, accessStore }: LoginPageProps) {
  const navigate = useNavigate();
  const countryCodeRef = useRef<HTMLSelectElement>(null);
  const nationalNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const serviceErrorRef = useRef<HTMLDivElement>(null);
  const [countryCode, setCountryCode] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<DemoAccessProfileId | ''>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serviceError, setServiceError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAction, setActiveAction] = useState<'otp' | 'login' | null>(null);

  useEffect(() => {
    if (serviceError) {
      serviceErrorRef.current?.focus();
    }
  }, [serviceError]);

  function handleSelectProfile(profileId: DemoAccessProfileId) {
    setSelectedProfileId(profileId);
    const creds = demoCredentials[profileId];
    if (creds) {
      setCountryCode('+91');
      setNationalNumber(creds.mobile);
      setPassword(creds.password);
      setFieldErrors({});
      setServiceError(undefined);
    }
  }

  async function handleActionSubmit(action: 'otp' | 'login') {
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

    if (action === 'login' && (!password || password.trim().length === 0)) {
      setFieldErrors({ password: 'Please enter your password to log in directly, or click Send OTP.' });
      setServiceError(undefined);
      passwordRef.current?.focus();
      return;
    }

    setFieldErrors({});
    setServiceError(undefined);
    setIsSubmitting(true);
    setActiveAction(action);

    if (selectedProfileId) {
      pendingDemoAccessStore?.setProfileId(selectedProfileId);
    } else {
      pendingDemoAccessStore?.clearProfile();
    }

    try {
      const normalizedMobile = normalizePhoneNumber(result.data.countryCode, result.data.nationalNumber);

      if (action === 'otp') {
        const response = await authService.requestOtp({
          mobileNumber: normalizedMobile,
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
      } else {
        if (authService.loginWithPassword) {
          await authService.loginWithPassword({
            mobileNumber: normalizedMobile,
            password,
          });
        } else {
          await authService.verifyOtp({
            challengeId: 'direct-login',
            code: '123456',
          });
        }

        const profileId = selectedProfileId || pendingDemoAccessStore?.getProfileId();
        const profileToSet = profileId ? findDemoAccessProfile(profileId) : null;

        if (profileToSet && accessStore) {
          accessStore.setProfile(profileToSet);
          pendingDemoAccessStore?.clearProfile();
          void navigate('/auth/authenticated', { replace: true });
        } else {
          pendingDemoAccessStore?.clearProfile();
          void navigate('/app/access-preview', { replace: true });
        }
      }
    } catch (error) {
      pendingDemoAccessStore?.clearProfile();
      const message =
        error instanceof AuthServiceError
          ? serviceErrorMessages[error.code]
          : serviceErrorMessages.unknown;
      setServiceError(message);
    } finally {
      setIsSubmitting(false);
      setActiveAction(null);
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
      <form
        className="space-y-4"
        noValidate
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          void handleActionSubmit('login');
        }}
      >
        <fieldset className="space-y-2.5 rounded-lg border border-border/80 bg-surface/40 p-3">
          <legend className="text-body-sm font-bold text-foreground px-1">
            Choose demo role <span className="font-normal text-muted-foreground">(optional)</span>
          </legend>
          <p className="text-body-xs font-medium text-muted-foreground px-1 leading-snug">
            This role selector is for frontend demo access preview only. Production roles will be managed by backend authorization.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 pt-0.5" role="radiogroup" aria-label="Demo roles">
            {demoAccessProfiles.map((profile) => {
              const isSelected = selectedProfileId === profile.id;
              const info = shortProfileInfo[profile.id];
              return (
                <label
                  key={profile.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-primary ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-2xs font-bold'
                      : 'border-border bg-card hover:border-primary/40 font-medium'
                  }`}
                >
                  <input
                    type="radio"
                    name="demoProfile"
                    value={profile.id}
                    checked={isSelected}
                    onChange={() => handleSelectProfile(profile.id)}
                    className="size-4 accent-primary shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-body-sm font-bold text-foreground leading-snug">
                      {info.icon} {profile.name}
                    </span>
                    <span className="block text-body-xs text-muted-foreground font-medium leading-tight">
                      {info.shortDesc}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="mobile-number" className="text-body-sm font-bold">
            Mobile number
          </Label>
          <div className="grid gap-2 sm:grid-cols-[minmax(8.5rem,0.38fr)_minmax(0,1fr)]">
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
              className="h-10 w-full rounded-md border border-input bg-surface px-3 py-1.5 text-body-sm font-semibold text-foreground transition-colors duration-fast ease-standard focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-muted aria-invalid:border-danger"
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
              className="h-10 text-body-sm font-semibold tracking-wide"
            />
          </div>
          {fieldErrors.countryCode ? (
            <p id="country-code-error" className="text-body-xs font-semibold text-danger">
              {fieldErrors.countryCode}
            </p>
          ) : null}
          {fieldErrors.nationalNumber ? (
            <p id="mobile-number-error" className="text-body-xs font-semibold text-danger">
              {fieldErrors.nationalNumber}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5 pt-0.5">
          <Label htmlFor="password" className="text-body-sm font-bold">
            Password <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            ref={passwordRef}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            placeholder="Enter password to login directly (optional)"
            className="h-10 text-body-sm font-semibold"
          />
          {fieldErrors.password ? (
            <p id="password-error" role="alert" className="text-body-xs font-semibold text-danger">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {serviceError ? (
          <div
            ref={serviceErrorRef}
            role="alert"
            tabIndex={-1}
            className="rounded-md border border-danger p-2.5 text-body-xs font-semibold text-danger"
          >
            {serviceError}
          </div>
        ) : null}

        {isSubmitting ? (
          <p role="status" className="text-body-xs font-medium text-muted-foreground">
            {activeAction === 'otp' ? 'Sending verification code...' : 'Logging in to dashboard...'}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="h-10 text-body-sm font-bold"
            fullWidth
            isLoading={isSubmitting && activeAction === 'otp'}
            onClick={() => void handleActionSubmit('otp')}
          >
            Send OTP
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="h-10 text-body-sm font-bold"
            fullWidth
            isLoading={isSubmitting && activeAction === 'login'}
            onClick={() => void handleActionSubmit('login')}
          >
            Login
          </Button>
        </div>
      </form>
    </AuthPageFrame>
  );
}
