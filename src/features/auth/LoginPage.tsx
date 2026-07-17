import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AuthServiceError, type AuthService, type AuthServiceErrorCode } from './authService';

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
}

interface FieldErrors {
  countryCode?: string;
  nationalNumber?: string;
}

const serviceErrorMessages: Record<AuthServiceErrorCode, string> = {
  invalid_otp: 'Something went wrong. Please try again.',
  expired_challenge: 'Something went wrong. Please try again.',
  rate_limited: 'Too many requests. Please wait before trying again.',
  network: 'Unable to connect. Check your connection and try again.',
  unavailable: 'Sign in is temporarily unavailable. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

export function LoginPage({ authService }: LoginPageProps) {
  const navigate = useNavigate();
  const countryCodeRef = useRef<HTMLInputElement>(null);
  const nationalNumberRef = useRef<HTMLInputElement>(null);
  const serviceErrorRef = useRef<HTMLDivElement>(null);
  const [countryCode, setCountryCode] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
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
        nextErrors.countryCode = 'Enter a country code beginning with + followed by digits.';
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

    try {
      const response = await authService.requestOtp({
        mobileNumber: `${result.data.countryCode}${result.data.nationalNumber}`,
      });

      void navigate('/auth/verify', {
        state: {
          challengeId: response.challengeId,
          maskedMobile: response.maskedMobile,
          expiresAt: response.expiresAt,
        },
      });
    } catch (error) {
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
    <main className="flex min-h-screen items-center justify-center bg-background px-gutter py-section text-foreground">
      <section className="w-full max-w-form rounded-lg border border-border bg-surface p-page shadow-sm">
        <p className="text-body-sm font-semibold text-primary">Transport Management</p>
        <h1 className="mt-2 text-heading-md font-semibold">Sign in</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Enter your mobile number to continue securely without a password.
        </p>

        <form
          className="mt-section space-y-4"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="space-y-2">
            <Label htmlFor="country-code">Country code</Label>
            <Input
              ref={countryCodeRef}
              id="country-code"
              name="countryCode"
              type="tel"
              inputMode="tel"
              autoComplete="tel-country-code"
              value={countryCode}
              onChange={(event) => setCountryCode(event.currentTarget.value)}
              aria-invalid={fieldErrors.countryCode ? true : undefined}
              aria-describedby={fieldErrors.countryCode ? 'country-code-error' : undefined}
              placeholder="+"
            />
            {fieldErrors.countryCode ? (
              <p id="country-code-error" className="text-body-sm text-danger">
                {fieldErrors.countryCode}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-number">Mobile number</Label>
            <Input
              ref={nationalNumberRef}
              id="mobile-number"
              name="mobileNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={nationalNumber}
              onChange={(event) => setNationalNumber(event.currentTarget.value)}
              aria-invalid={fieldErrors.nationalNumber ? true : undefined}
              aria-describedby={fieldErrors.nationalNumber ? 'mobile-number-error' : undefined}
            />
            {fieldErrors.nationalNumber ? (
              <p id="mobile-number-error" className="text-body-sm text-danger">
                {fieldErrors.nationalNumber}
              </p>
            ) : null}
          </div>

          {serviceError ? (
            <div
              ref={serviceErrorRef}
              role="alert"
              tabIndex={-1}
              className="rounded-md border border-danger p-3 text-body-sm text-danger"
            >
              {serviceError}
            </div>
          ) : null}

          {isSubmitting ? (
            <p role="status" className="text-body-sm text-muted-foreground">
              Requesting verification…
            </p>
          ) : null}

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Continue
          </Button>
        </form>

        <nav aria-label="Authentication links" className="mt-6 flex flex-wrap gap-4 text-body-sm">
          <Link className="text-primary underline-offset-4 hover:underline" to="/auth/register">
            Register
          </Link>
          <Link className="text-primary underline-offset-4 hover:underline" to="/legal/terms">
            Terms
          </Link>
        </nav>
      </section>
    </main>
  );
}
