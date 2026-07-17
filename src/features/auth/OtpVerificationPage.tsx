import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AuthServiceError, type AuthService, type AuthServiceErrorCode } from './authService';
import type { SessionFactory } from './authSession';
import type { AuthSessionStore } from './authSessionStore';

interface OtpVerificationPageProps {
  authService: AuthService;
  sessionFactory: SessionFactory;
  sessionStore: AuthSessionStore;
}

interface VerificationState {
  challengeId: string;
  maskedMobile: string;
  expiresAt: string;
}

const errorMessages: Record<AuthServiceErrorCode, string> = {
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
    typeof state.challengeId === 'string' &&
    typeof state.maskedMobile === 'string' &&
    typeof state.expiresAt === 'string'
  );
}

export function OtpVerificationPage({
  authService,
  sessionFactory,
  sessionStore,
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
      void navigate('/auth/authenticated', { replace: true });
    } catch (error) {
      const message =
        error instanceof AuthServiceError ? errorMessages[error.code] : errorMessages.unknown;
      setServiceError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-gutter py-section text-foreground">
      <section className="w-full max-w-form rounded-lg border border-border bg-surface p-page shadow-sm">
        <p className="text-body-sm font-semibold text-primary">Transport Management</p>
        <h1 className="mt-2 text-heading-md font-semibold">Verify your mobile</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Enter the verification code sent to {activeChallenge.maskedMobile}.
        </p>

        <form
          className="mt-section space-y-4"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
        >
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
              value={code}
              onChange={(event) => setCode(event.currentTarget.value)}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={fieldError ? 'verification-code-error' : undefined}
            />
            {fieldError ? (
              <p id="verification-code-error" className="text-body-sm text-danger">
                {fieldError}
              </p>
            ) : null}
          </div>

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

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Verify
          </Button>
        </form>

        <Link
          className="mt-6 inline-block text-body-sm text-primary underline-offset-4 hover:underline"
          to="/auth/login"
        >
          Change mobile number
        </Link>
      </section>
    </main>
  );
}
