import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoAccessProfiles } from '@/features/access-control';
import type { DemoAccessStore, PendingDemoAccessStore } from '@/features/access-control';

import {
  AuthServiceError,
  type AuthChallengeSource,
  type AuthService,
  type AuthServiceErrorCode,
} from './authService';
import type { SessionFactory } from './authSession';
import type { AuthSessionStore } from './authSessionStore';
import { AuthPageFrame } from './AuthPageFrame';

interface OtpVerificationPageProps {
  authService: AuthService;
  sessionFactory: SessionFactory;
  sessionStore: AuthSessionStore;
  accessStore?: DemoAccessStore;
  pendingDemoAccessStore?: PendingDemoAccessStore;
}

interface VerificationState {
  source: AuthChallengeSource;
  challengeId: string;
  maskedMobile: string;
  expiresAt: string;
}

const errorMessages: Record<AuthServiceErrorCode, string> = {
  duplicate_account: 'Something went wrong. Please try again.',
  validation: 'Something went wrong. Please try again.',
  invalid_otp: 'That verification code is incorrect. Try again.',
  expired_challenge: 'This verification code has expired. Request a new code.',
  rate_limited: 'Too many attempts. Please wait before trying again.',
  network: 'Unable to connect. Check your connection and try again.',
  unavailable: 'Verification is temporarily unavailable. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

function isVerificationState(value: unknown): value is VerificationState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<VerificationState>;
  return (
    (state.source === 'login' || state.source === 'registration') &&
    typeof state.challengeId === 'string' &&
    typeof state.maskedMobile === 'string' &&
    typeof state.expiresAt === 'string'
  );
}

export function OtpVerificationPage({
  authService,
  sessionFactory,
  sessionStore,
  accessStore,
  pendingDemoAccessStore,
}: OtpVerificationPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const codeRef = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const challenge = isVerificationState(location.state) ? location.state : undefined;
  const [code, setCode] = useState('');
  const [fieldError, setFieldError] = useState<string>();
  const [serviceError, setServiceError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceError) alertRef.current?.focus();
  }, [serviceError]);

  if (!challenge) return <Navigate to="/auth/login" replace />;
  const activeChallenge = challenge;
  const expiryLabel = new Date(activeChallenge.expiresAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!/^\d{6}$/.test(code)) {
      setFieldError('Enter the 6-digit verification code.');
      setServiceError(undefined);
      codeRef.current?.focus();
      return;
    }

    setFieldError(undefined);
    setServiceError(undefined);
    setIsSubmitting(true);

    try {
      await authService.verifyOtp({ challengeId: activeChallenge.challengeId, code });
      sessionStore.setSession(sessionFactory());

      let destination = '/auth/authenticated';
      if (accessStore && pendingDemoAccessStore) {
        const pendingProfileId = pendingDemoAccessStore.getProfileId();
        const pendingProfile = demoAccessProfiles.find(
          (profile) => profile.id === pendingProfileId,
        );

        if (pendingProfile) {
          accessStore.setProfile(pendingProfile);
          destination = '/auth/authenticated';
        } else {
          destination = '/app/access-preview';
        }

        pendingDemoAccessStore.clearProfile();
      }

      void navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? errorMessages[error.code] : errorMessages.unknown;
      setServiceError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageFrame
      compact
      eyebrow="Secure verification"
      title="Verify your mobile"
      description={`Enter the six-digit code sent to ${activeChallenge.maskedMobile}.`}
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-6 grid size-14 place-items-center rounded-full bg-primary/10 text-heading-md font-semibold text-primary"
      >
        ✓
      </div>
      <form className="space-y-5" noValidate onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification code</Label>
          <Input
            ref={codeRef}
            id="verification-code"
            name="verificationCode"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.currentTarget.value)}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? 'verification-code-error' : undefined}
            className="text-center text-heading-sm font-semibold tracking-[0.5em]"
          />
          {fieldError ? (
            <p id="verification-code-error" className="text-body-sm text-danger">
              {fieldError}
            </p>
          ) : null}
        </div>

        <p className="rounded-md bg-surface-muted px-3 py-2 text-center text-body-sm text-muted-foreground">
          Code expires at {expiryLabel}
        </p>

        {serviceError ? (
          <div
            ref={alertRef}
            role="alert"
            tabIndex={-1}
            className="rounded-md border border-danger p-3 text-body-sm text-danger"
          >
            {serviceError}
          </div>
        ) : null}

        {isSubmitting ? (
          <p role="status" className="text-body-sm text-muted-foreground">
            Verifying…
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Verify
        </Button>
      </form>

      <Link
        className="mt-6 block text-center text-body-sm font-medium text-primary underline-offset-4 hover:underline"
        to={activeChallenge.source === 'registration' ? '/auth/register' : '/auth/login'}
      >
        Change mobile number
      </Link>
    </AuthPageFrame>
  );
}
