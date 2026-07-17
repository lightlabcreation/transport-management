import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

import { AuthServiceError, type AuthService, type AuthServiceErrorCode } from './authService';
import { AuthPageFrame } from './AuthPageFrame';
import { normalizePhoneNumber } from './phoneNumber';

const registrationSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d+$/),
  nationalNumber: z
    .string()
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .pipe(z.string().regex(/^\d+$/)),
  email: z
    .string()
    .trim()
    .transform((value) => (value === '' ? undefined : value))
    .pipe(z.email().optional()),
  language: z.literal('en'),
  acceptedTerms: z.literal(true),
});

type FieldName = keyof z.input<typeof registrationSchema>;
type FieldErrors = Partial<Record<FieldName, string>>;

interface RegistrationPageProps {
  authService: AuthService;
}

const serviceErrorMessages: Record<AuthServiceErrorCode, string> = {
  duplicate_account:
    'An account may already exist for this mobile number. Sign in or try another number.',
  validation: 'Some registration details could not be accepted. Review the form and try again.',
  invalid_otp: 'Something went wrong. Please try again.',
  expired_challenge: 'Something went wrong. Please try again.',
  rate_limited: 'Too many requests. Please wait before trying again.',
  network: 'Unable to connect. Check your connection and try again.',
  unavailable: 'Registration is temporarily unavailable. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

const fieldMessages: Record<FieldName, string> = {
  firstName: 'Enter your first name.',
  lastName: 'Enter your last name.',
  countryCode: 'Enter a country code beginning with + followed by digits.',
  nationalNumber: 'Enter a valid mobile number.',
  email: 'Enter a valid email address or leave this field empty.',
  language: 'Select a supported language.',
  acceptedTerms: 'Accept the Terms to create your account.',
};

export function RegistrationPage({ authService }: RegistrationPageProps) {
  const navigate = useNavigate();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const countryCodeRef = useRef<HTMLInputElement>(null);
  const nationalNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const serviceErrorRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<'en'>('en');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serviceError, setServiceError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceError) serviceErrorRef.current?.focus();
  }, [serviceError]);

  function focusField(field: FieldName) {
    const refs: Record<FieldName, React.RefObject<HTMLElement | null>> = {
      firstName: firstNameRef,
      lastName: lastNameRef,
      countryCode: countryCodeRef,
      nationalNumber: nationalNumberRef,
      email: emailRef,
      language: languageRef,
      acceptedTerms: termsRef,
    };
    refs[field].current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const result = registrationSchema.safeParse({
      firstName,
      lastName,
      countryCode,
      nationalNumber,
      email,
      language,
      acceptedTerms,
    });

    if (!result.success) {
      const invalidFields = new Set(result.error.issues.map((issue) => issue.path[0] as FieldName));
      const nextErrors: FieldErrors = {};
      for (const field of invalidFields) nextErrors[field] = fieldMessages[field];
      setFieldErrors(nextErrors);
      setServiceError(undefined);

      const firstInvalidField = Object.keys(fieldMessages).find((field) =>
        invalidFields.has(field as FieldName),
      ) as FieldName | undefined;
      if (firstInvalidField) focusField(firstInvalidField);
      return;
    }

    setFieldErrors({});
    setServiceError(undefined);
    setIsSubmitting(true);

    try {
      const response = await authService.register({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        mobileNumber: normalizePhoneNumber(result.data.countryCode, result.data.nationalNumber),
        ...(result.data.email ? { email: result.data.email } : {}),
        language: result.data.language,
        acceptedTerms: result.data.acceptedTerms,
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
      setServiceError(
        error instanceof AuthServiceError
          ? serviceErrorMessages[error.code]
          : serviceErrorMessages.unknown,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageFrame
      eyebrow="Get started"
      title="Create your account"
      description="Set up your passwordless account to access transport coordination and speed-assistance experiences."
      footer={
        <p className="text-muted-foreground">
          Already registered?{' '}
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            to="/auth/login"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" noValidate onSubmit={(event) => void handleSubmit(event)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" id="first-name" error={fieldErrors.firstName}>
            <Input
              ref={firstNameRef}
              id="first-name"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              aria-invalid={fieldErrors.firstName ? true : undefined}
              aria-describedby={fieldErrors.firstName ? 'first-name-error' : undefined}
            />
          </Field>
          <Field label="Last name" id="last-name" error={fieldErrors.lastName}>
            <Input
              ref={lastNameRef}
              id="last-name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              aria-invalid={fieldErrors.lastName ? true : undefined}
              aria-describedby={fieldErrors.lastName ? 'last-name-error' : undefined}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <Field
            label="Country code"
            id="registration-country-code"
            error={fieldErrors.countryCode}
          >
            <Input
              ref={countryCodeRef}
              id="registration-country-code"
              name="countryCode"
              type="tel"
              inputMode="tel"
              autoComplete="tel-country-code"
              placeholder="+"
              value={countryCode}
              onChange={(event) => setCountryCode(event.currentTarget.value)}
              aria-invalid={fieldErrors.countryCode ? true : undefined}
              aria-describedby={
                fieldErrors.countryCode ? 'registration-country-code-error' : undefined
              }
            />
          </Field>
          <Field
            label="Mobile number"
            id="registration-mobile-number"
            error={fieldErrors.nationalNumber}
          >
            <Input
              ref={nationalNumberRef}
              id="registration-mobile-number"
              name="mobileNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={nationalNumber}
              onChange={(event) => setNationalNumber(event.currentTarget.value)}
              aria-invalid={fieldErrors.nationalNumber ? true : undefined}
              aria-describedby={
                fieldErrors.nationalNumber ? 'registration-mobile-number-error' : undefined
              }
            />
          </Field>
        </div>

        <Field label="Email (optional)" id="registration-email" error={fieldErrors.email}>
          <Input
            ref={emailRef}
            id="registration-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'registration-email-error' : undefined}
          />
        </Field>

        <Field label="Language" id="registration-language" error={fieldErrors.language}>
          <select
            ref={languageRef}
            id="registration-language"
            name="language"
            value={language}
            onChange={(event) => setLanguage(event.currentTarget.value as 'en')}
            className={cn(
              'min-h-control w-full rounded-md border border-input bg-surface px-3 py-2 text-body text-foreground',
              'transition-colors duration-fast ease-standard',
            )}
          >
            <option value="en">English</option>
          </select>
        </Field>

        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <div className="flex min-h-control items-start gap-3">
            <input
              ref={termsRef}
              id="accepted-terms"
              name="acceptedTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.currentTarget.checked)}
              aria-invalid={fieldErrors.acceptedTerms ? true : undefined}
              aria-describedby={fieldErrors.acceptedTerms ? 'accepted-terms-error' : undefined}
              className="mt-1 size-5 accent-primary"
            />
            <Label htmlFor="accepted-terms" className="text-body">
              I accept the{' '}
              <Link className="text-primary underline-offset-4 hover:underline" to="/legal/terms">
                Terms
              </Link>
              .
            </Label>
          </div>
          {fieldErrors.acceptedTerms ? (
            <p id="accepted-terms-error" className="text-body-sm text-danger">
              {fieldErrors.acceptedTerms}
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
            Creating your account…
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthPageFrame>
  );
}

interface FieldProps {
  label: string;
  id: string;
  error?: string | undefined;
  children: React.ReactNode;
}

function Field({ label, id, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-body-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
