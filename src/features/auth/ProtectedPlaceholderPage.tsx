import { Navigate, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import type { AuthSessionStore } from './authSessionStore';
import { AuthPageFrame } from './AuthPageFrame';

interface ProtectedPlaceholderPageProps {
  sessionStore: AuthSessionStore;
}

export function ProtectedPlaceholderPage({ sessionStore }: ProtectedPlaceholderPageProps) {
  const navigate = useNavigate();
  const session = sessionStore.getSession();

  if (!session) return <Navigate to="/auth/login" replace />;

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  return (
    <AuthPageFrame
      compact
      eyebrow="Access confirmed"
      title="Authenticated"
      description="Your passwordless verification was successful."
    >
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-heading-lg font-semibold text-primary"
        >
          ✓
        </div>
        <h2 className="mt-5 text-heading-sm font-semibold">You’re securely signed in</h2>
        <p className="mt-2 text-body text-muted-foreground">
          Your product destination will appear here when the application workspace is ready.
        </p>
      </div>
      <Button className="mt-7" fullWidth variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </AuthPageFrame>
  );
}
