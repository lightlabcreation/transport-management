import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        mobileNumber: normalizePhoneNumber(result.data.countryCode, result.data.nationalNumber),
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
      description="Enter your mobile number and we’ll send a one-time verification code. No password to remember."
      footer={
        <nav aria-label="Authentication links" className="flex justify-center gap-5">
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            to="/auth/register"
          >
            Create an account
          </Link>
          <Link
            className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            to="/legal/terms"
          >
            Terms
          </Link>
        </nav>
      }
    >
      <form className="space-y-5" noValidate onSubmit={(event) => void handleSubmit(event)}>
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

        <Button className="mt-2" type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Continue
        </Button>
      </form>
    </AuthPageFrame>
  );
}
