import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

import { AuthServiceError, type AuthService, type AuthServiceErrorCode } from './authService';
import { AuthPageFrame } from './AuthPageFrame';
import { normalizePhoneNumber } from './phoneNumber';

const registrationSchema = z.object({
  role: z.string().trim().min(1, 'Select a service category role to continue.'),
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
  language: z.string().trim().min(1),
  acceptedTerms: z.literal(true),
  carPlateNumber: z.string().trim().optional(),
  trackLocation: z.boolean().optional(),
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
  role: 'Select your Service Category role to continue.',
  firstName: 'Enter your first name.',
  lastName: 'Enter your last name.',
  countryCode: 'Enter a country code beginning with + followed by digits.',
  nationalNumber: 'Enter a valid mobile number.',
  email: 'Enter a valid email address or leave this field empty.',
  language: 'Select or enter a supported language.',
  acceptedTerms: 'Accept the Terms to create your account.',
  carPlateNumber: 'Enter a valid vehicle car plate number.',
  trackLocation: '',
};

export function RegistrationPage({ authService }: RegistrationPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleRef = useRef<HTMLSelectElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const countryCodeRef = useRef<HTMLInputElement>(null);
  const nationalNumberRef = useRef<HTMLInputElement>(null);
  const carPlateRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const trackLocationRef = useRef<HTMLInputElement>(null);
  const serviceErrorRef = useRef<HTMLDivElement>(null);

  const [role, setRole] = useState(
    searchParams.get('role') || (typeof window !== 'undefined' ? window.sessionStorage.getItem('transport-management.auth-role') : null) || '',
  );
  const isDriverRole = role === 'driver' || role.toLowerCase().includes('driver');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryPreset, setCountryPreset] = useState('+966');
  const [countryCode, setCountryCode] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
  const [carPlateNumber, setCarPlateNumber] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [customLanguage, setCustomLanguage] = useState('');
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([]);
  const [trackLocation, setTrackLocation] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serviceError, setServiceError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceError) serviceErrorRef.current?.focus();
  }, [serviceError]);

  function focusField(field: FieldName) {
    const refs: Record<FieldName, React.RefObject<HTMLElement | null>> = {
      role: roleRef,
      firstName: firstNameRef,
      lastName: lastNameRef,
      countryCode: countryCodeRef,
      nationalNumber: nationalNumberRef,
      carPlateNumber: carPlateRef,
      email: emailRef,
      language: languageRef,
      acceptedTerms: termsRef,
      trackLocation: trackLocationRef,
    };
    refs[field]?.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const finalLanguage =
      language === 'other' ? (customLanguage.trim() || 'Other') : language;
    const combinedLanguages =
      additionalLanguages.length > 0
        ? `${finalLanguage} (${additionalLanguages.join(', ')})`
        : finalLanguage;

    const result = registrationSchema.safeParse({
      role,
      firstName,
      lastName,
      countryCode,
      nationalNumber,
      email,
      language: combinedLanguages,
      acceptedTerms,
      carPlateNumber,
      trackLocation,
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

    if (isDriverRole && !carPlateNumber.trim()) {
      setFieldErrors((prev) => ({ ...prev, carPlateNumber: 'Car plate number is required for drivers.' }));
      carPlateRef.current?.focus();
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
        ...(role ? { role } : {}),
        ...(isDriverRole && carPlateNumber.trim() ? { carPlateNumber: carPlateNumber.trim() } : {}),
        ...(trackLocation !== undefined ? { trackLocation } : {}),
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
      description="Set up your account to access transport coordination and role-gated experiences."
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
        <Field label="Service Category (*Required)" id="registration-role" error={fieldErrors.role}>
          <div className="flex items-center gap-2">
            <select
              ref={roleRef}
              id="registration-role"
              name="role"
              value={role}
              onChange={(event) => {
                const val = event.currentTarget.value;
                setRole(val);
                if (val && typeof window !== 'undefined') {
                  try {
                    window.sessionStorage.setItem('transport-management.auth-role', val);
                  } catch {}
                }
              }}
              aria-invalid={fieldErrors.role ? true : undefined}
              aria-describedby={fieldErrors.role ? 'registration-role-error' : undefined}
              className={cn(
                'min-h-control w-full rounded-md border border-input bg-surface px-3 py-2 text-body font-semibold text-foreground',
                'transition-colors duration-fast ease-standard focus:border-primary focus:ring-2 focus:ring-primary/20',
              )}
            >
              <option value="">-- Select Service Category --</option>
              <option value="driver">Driver (Life Tracking) - $29/month</option>
              <option value="visitor">Visitor (Free Account)</option>
              <option value="workshop">Workshop - $79/month</option>
              <option value="oil_change">Oil Change Shop - $79/month</option>
              <option value="car_wash">Car Wash - $49/month</option>
              <option value="spare_parts">Spare Parts Store - $79/month</option>
            </select>
            <Link
              to="/auth/service-list"
              className="whitespace-nowrap rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-body-xs font-bold text-primary hover:bg-primary/10"
            >
              View Details
            </Link>
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" id="first-name" error={fieldErrors.firstName}>
            <Input
              ref={firstNameRef}
              id="first-name"
              name="firstName"
              autoComplete="given-name"
              placeholder="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              aria-invalid={fieldErrors.firstName ? true : undefined}
              aria-describedby={fieldErrors.firstName ? 'first-name-error' : undefined}
            />
          </Field>
          <Field label="Last Name" id="last-name" error={fieldErrors.lastName}>
            <Input
              ref={lastNameRef}
              id="last-name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              aria-invalid={fieldErrors.lastName ? true : undefined}
              aria-describedby={fieldErrors.lastName ? 'last-name-error' : undefined}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-[11.5rem_1fr]">
          <Field
            label="Country code"
            id="registration-country-code"
            error={fieldErrors.countryCode}
          >
            <div className="flex gap-1.5">
              <select
                aria-label="Country preset"
                value={countryPreset}
                onChange={(event) => {
                  const val = event.currentTarget.value;
                  setCountryPreset(val);
                  if (val !== 'other') {
                    setCountryCode(val);
                  } else {
                    setCountryCode('+');
                    countryCodeRef.current?.focus();
                  }
                }}
                className={cn(
                  'min-h-control w-28 shrink-0 rounded-md border border-input bg-surface px-2 py-2 text-body-xs font-semibold text-foreground focus:border-primary focus:ring-1 focus:ring-primary',
                )}
              >
                <option value="+966">🇸🇦 +966 (KSA)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
                <option value="+965">🇰🇼 +965 (KWT)</option>
                <option value="+974">🇶🇦 +974 (QAT)</option>
                <option value="+973">🇧🇭 +973 (BHR)</option>
                <option value="+968">🇴🇲 +968 (OMN)</option>
                <option value="+20">🇪🇬 +20 (EGY)</option>
                <option value="+91">🇮🇳 +91 (IND)</option>
                <option value="+1">🇺🇸 +1 (USA/CAN)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="other">🌐 Other (+)</option>
              </select>
              <Input
                ref={countryCodeRef}
                id="registration-country-code"
                name="countryCode"
                type="tel"
                inputMode="tel"
                autoComplete="tel-country-code"
                placeholder="+"
                value={countryCode}
                onChange={(event) => {
                  const val = event.currentTarget.value;
                  setCountryCode(val);
                  const presets = ['+966', '+971', '+965', '+974', '+973', '+968', '+20', '+91', '+1', '+44'];
                  if (presets.includes(val)) {
                    setCountryPreset(val);
                  } else {
                    setCountryPreset('other');
                  }
                }}
                aria-invalid={fieldErrors.countryCode ? true : undefined}
                aria-describedby={
                  fieldErrors.countryCode ? 'registration-country-code-error' : undefined
                }
                className="w-full font-mono font-bold"
              />
            </div>
          </Field>
          <Field
            label="Mobile NO"
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
              placeholder="Enter mobile number"
              value={nationalNumber}
              onChange={(event) => setNationalNumber(event.currentTarget.value)}
              aria-invalid={fieldErrors.nationalNumber ? true : undefined}
              aria-describedby={
                fieldErrors.nationalNumber ? 'registration-mobile-number-error' : undefined
              }
            />
          </Field>
        </div>

        {isDriverRole && (
          <div className="animate-fade-in">
            <Field label="Car plate number" id="registration-car-plate" error={fieldErrors.carPlateNumber}>
              <Input
                ref={carPlateRef}
                id="registration-car-plate"
                name="carPlateNumber"
                placeholder="e.g. ABC-1234"
                value={carPlateNumber}
                onChange={(event) => setCarPlateNumber(event.currentTarget.value)}
                aria-invalid={fieldErrors.carPlateNumber ? true : undefined}
                aria-describedby={fieldErrors.carPlateNumber ? 'registration-car-plate-error' : undefined}
              />
            </Field>
          </div>
        )}

        <Field label="Email (optional)" id="registration-email" error={fieldErrors.email}>
          <Input
            ref={emailRef}
            id="registration-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Optional email address"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'registration-email-error' : undefined}
          />
        </Field>

        <div className="rounded-lg border border-border bg-surface-muted/70 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <input
              ref={trackLocationRef}
              id="track-location"
              type="checkbox"
              checked={trackLocation}
              onChange={(event) => setTrackLocation(event.currentTarget.checked)}
              className="mt-0.5 size-4 accent-primary"
            />
            <Label htmlFor="track-location" className="text-body-sm font-semibold cursor-pointer">
              Track Location (Allow GPS telemetry & live coordinates)
            </Label>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-border/50">
            <input
              ref={termsRef}
              id="accepted-terms"
              name="acceptedTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.currentTarget.checked)}
              aria-invalid={fieldErrors.acceptedTerms ? true : undefined}
              aria-describedby={fieldErrors.acceptedTerms ? 'accepted-terms-error' : undefined}
              className="mt-0.5 size-4 accent-primary"
            />
            <Label htmlFor="accepted-terms" className="text-body-sm cursor-pointer">
              Accept Terms & Condition{' '}
              <Link className="text-primary underline-offset-4 hover:underline" to="/legal/terms">
                (Read Policy)
              </Link>
            </Label>
          </div>
          {fieldErrors.acceptedTerms ? (
            <p id="accepted-terms-error" className="text-body-xs text-danger font-medium">
              {fieldErrors.acceptedTerms}
            </p>
          ) : null}
        </div>

        <Field label="Language" id="registration-language" error={fieldErrors.language}>
          <div className="space-y-2.5">
            <select
              ref={languageRef}
              id="registration-language"
              name="language"
              value={language}
              onChange={(event) => setLanguage(event.currentTarget.value)}
              className={cn(
                'min-h-control w-full rounded-md border border-input bg-surface px-3 py-2 text-body text-foreground font-medium',
                'transition-colors duration-fast ease-standard focus:border-primary focus:ring-1 focus:ring-primary',
              )}
            >
              <option value="en">English (International)</option>
              <option value="ar">Arabic (العربية) — KSA / GCC</option>
              <option value="ur">Urdu (اردو) — Fleet & Drivers</option>
              <option value="hi">Hindi (हिन्दी) — India</option>
              <option value="ml">Malayalam (മലയാളം) — Kerala / GCC</option>
              <option value="tl">Tagalog (Filipino) — Philippines</option>
              <option value="fr">French (Français) — Europe / North Africa</option>
              <option value="es">Spanish (Español) — International</option>
              <option value="other">Other (Custom write-in...)</option>
            </select>

            {language === 'other' && (
              <Input
                placeholder="Type custom language (e.g. Turkish, Russian, Bengali...)"
                value={customLanguage}
                onChange={(event) => setCustomLanguage(event.currentTarget.value)}
                className="w-full animate-fade-in"
              />
            )}

            <div className="rounded-lg border border-border bg-surface-muted/40 p-3 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Additional Spoken Languages (Select Multiple / Optional)
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ar', name: 'Arabic (العربية)' },
                  { id: 'ur', name: 'Urdu (اردو)' },
                  { id: 'hi', name: 'Hindi (हिन्दी)' },
                  { id: 'ml', name: 'Malayalam (മലയാളം)' },
                  { id: 'en', name: 'English' },
                  { id: 'tl', name: 'Tagalog' },
                  { id: 'fr', name: 'French' },
                ].map((lang) => {
                  const isChecked = additionalLanguages.includes(lang.name);
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setAdditionalLanguages(additionalLanguages.filter((l) => l !== lang.name));
                        } else {
                          setAdditionalLanguages([...additionalLanguages, lang.name]);
                        }
                      }}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-body-xs font-semibold transition-all cursor-pointer',
                        isChecked
                          ? 'border-primary bg-primary text-primary-foreground shadow-2xs scale-105'
                          : 'border-border bg-surface text-foreground hover:bg-surface-muted',
                      )}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Field>

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
            Creating account & verifying details…
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Next
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
