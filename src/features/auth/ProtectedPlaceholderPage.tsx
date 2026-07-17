import { Navigate, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import type { AuthSessionStore } from './authSessionStore';

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
    <main className="flex min-h-screen items-center justify-center bg-background p-page text-foreground">
      <section className="w-full max-w-form rounded-lg border border-border bg-surface p-page shadow-sm">
        <h1 className="text-heading-md font-semibold">Authenticated</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Your identity has been verified. The post-authentication destination will be added in a
          later slice.
        </p>
        <Button className="mt-6" variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </section>
    </main>
  );
}
