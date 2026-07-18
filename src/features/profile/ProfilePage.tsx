import { useState, type FormEvent, type ReactNode } from 'react';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .transform((value) => (value === '' ? undefined : value))
    .pipe(z.email().optional()),
  language: z.literal('en'),
});

export type ProfileViewState = 'ready' | 'loading' | 'error';

interface ProfilePageProps {
  initialViewState?: ProfileViewState;
}

export function ProfilePage({ initialViewState = 'ready' }: ProfilePageProps) {
  const [firstName, setFirstName] = useState('Demo');
  const [lastName, setLastName] = useState('Operator');
  const [email, setEmail] = useState('demo@example.com');
  const [language, setLanguage] = useState<'en'>('en');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  if (initialViewState === 'loading') {
    return (
      <div role="status" className="space-y-4" aria-label="Loading profile">
        <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-surface-muted" />
      </div>
    );
  }

  if (initialViewState === 'error') {
    return (
      <section role="alert" className="rounded-xl border border-danger/40 bg-danger/5 p-page">
        <h2 className="text-heading-sm font-semibold">Profile unavailable</h2>
        <p className="mt-2 text-body text-muted-foreground">
          The frontend profile preview could not be loaded. Try again later.
        </p>
      </section>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = profileSchema.safeParse({ firstName, lastName, email, language });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        nextErrors[field] =
          field === 'email' ? 'Enter a valid email address or leave it empty.' : 'Required field.';
      }
      setErrors(nextErrors);
      setStatus('Review the highlighted profile fields.');
      return;
    }

    setErrors({});
    setStatus('Profile changes saved in this frontend preview.');
  }

  return (
    <div className="space-y-section">
      <header>
        <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
          Personal details
        </p>
        <h2 className="mt-2 text-heading-lg font-semibold">Profile</h2>
        <p className="mt-2 max-w-2xl text-body text-muted-foreground">
          Review frontend-only account details. No personal information is persisted by this page.
        </p>
      </header>

      <div className="grid gap-section xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-xl border border-border bg-surface p-page shadow-sm">
          <div className="grid size-20 place-items-center rounded-full bg-primary text-heading-md font-semibold text-primary-foreground">
            DO
          </div>
          <h3 className="mt-5 text-heading-sm font-semibold">Demo Operator</h3>
          <p className="mt-1 text-body-sm text-muted-foreground">Frontend preview account</p>
          <dl className="mt-6 space-y-3 text-body-sm">
            <div>
              <dt className="text-muted-foreground">Mobile status</dt>
              <dd className="mt-1 font-medium">Verified mock number</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Account storage</dt>
              <dd className="mt-1 font-medium">Not persisted</dd>
            </div>
          </dl>
        </aside>

        <form
          className="rounded-xl border border-border bg-surface p-page shadow-sm sm:p-section"
          noValidate
          onSubmit={handleSubmit}
        >
          <h3 className="text-heading-sm font-semibold">Profile information</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <ProfileField label="First name" id="profile-first-name" error={errors.firstName}>
              <Input
                id="profile-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.currentTarget.value)}
                aria-invalid={errors.firstName ? true : undefined}
              />
            </ProfileField>
            <ProfileField label="Last name" id="profile-last-name" error={errors.lastName}>
              <Input
                id="profile-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.currentTarget.value)}
                aria-invalid={errors.lastName ? true : undefined}
              />
            </ProfileField>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ProfileField label="Verified mobile" id="profile-mobile">
              <Input id="profile-mobile" value="+•• ••••••3210" readOnly />
            </ProfileField>
            <ProfileField label="Email (optional)" id="profile-email" error={errors.email}>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                aria-invalid={errors.email ? true : undefined}
              />
            </ProfileField>
          </div>

          <div className="mt-5 max-w-md space-y-2">
            <Label htmlFor="profile-language">Language</Label>
            <select
              id="profile-language"
              value={language}
              onChange={(event) => setLanguage(event.currentTarget.value as 'en')}
              className="min-h-control w-full rounded-md border border-input bg-surface px-3 py-2"
            >
              <option value="en">English</option>
            </select>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit">Save profile</Button>
            <p role="status" aria-live="polite" className="text-body-sm text-primary">
              {status}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}
