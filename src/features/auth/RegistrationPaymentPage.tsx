import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { AuthPageFrame } from './AuthPageFrame';

export function RegistrationPaymentPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'wallet'>('card');

  const roleParam = typeof window !== 'undefined' ? window.sessionStorage.getItem('transport-management.auth-role') || 'driver' : 'driver';
  const roleTitle = typeof window !== 'undefined' ? window.sessionStorage.getItem('transport-management.auth-role-title') || 'Driver (Life Tracking)' : 'Driver (Life Tracking)';

  let price = '$29.00 / month';
  if (roleParam === 'workshop' || roleParam === 'oil_change' || roleParam === 'spare_parts') {
    price = '$79.00 / month';
  } else if (roleParam === 'visitor') {
    price = '$0.00 (Free Account)';
  }

  function handlePaymentSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        window.sessionStorage.setItem('transport-management.payment-status', 'paid');
      } catch {
        // Ignore storage errors
      }
      void navigate('/auth/approval-status', { replace: true });
    }, 800);
  }

  return (
    <AuthPageFrame
      eyebrow="Step 2 of 3 • Payment Gateway"
      title="Complete Activation"
      description="Select your preferred billing method to activate telemetry and map visibility services."
    >
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        {/* Order Summary */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-body-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Service Subscription</span>
            <span className="text-primary font-mono">Tier: {roleParam.toUpperCase()}</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <h3 className="text-body font-bold text-foreground">{roleTitle}</h3>
            <span className="text-heading-sm font-extrabold text-foreground">{price}</span>
          </div>
          <p className="text-body-xs text-muted-foreground">
            Includes full role-gated workspace access and automated map synchronization.
          </p>
        </div>

        {/* Payment Method Tabs */}
        <div className="space-y-3">
          <label className="text-body-xs font-bold uppercase tracking-wider text-muted-foreground">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3.5 rounded-xl border text-left font-bold text-body-sm transition-colors ${
                selectedMethod === 'card'
                  ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted'
              }`}
            >
              💳 Credit / Debit Card
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('wallet')}
              className={`p-3.5 rounded-xl border text-left font-bold text-body-sm transition-colors ${
                selectedMethod === 'wallet'
                  ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted'
              }`}
            >
              🌐 Digital Wallet / Apple Pay
            </button>
          </div>
        </div>

        {/* Simulated Card Inputs */}
        {selectedMethod === 'card' && (
          <div className="space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4">
            <div className="space-y-1.5">
              <label htmlFor="card-num" className="text-body-xs font-bold text-foreground">
                Card Number
              </label>
              <input
                id="card-num"
                type="text"
                placeholder="4532 •••• •••• 8890"
                defaultValue="4532 8819 2301 8890"
                className="w-full rounded-md border border-input bg-surface px-3 py-2 text-body font-mono text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="exp-date" className="text-body-xs font-bold text-foreground">
                  Expiry Date
                </label>
                <input
                  id="exp-date"
                  type="text"
                  placeholder="MM/YY"
                  defaultValue="08/29"
                  className="w-full rounded-md border border-input bg-surface px-3 py-2 text-body font-mono text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="cvc" className="text-body-xs font-bold text-foreground">
                  CVC / Security Code
                </label>
                <input
                  id="cvc"
                  type="password"
                  placeholder="•••"
                  defaultValue="342"
                  className="w-full rounded-md border border-input bg-surface px-3 py-2 text-body font-mono text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-6 text-center text-body-sm text-foreground font-semibold">
            Clicking &quot;Pay & Submit&quot; will prompt Apple Pay or Google Wallet on supported devices.
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" size="lg" fullWidth isLoading={isProcessing}>
            Pay & Submit for Approval
          </Button>
        </div>
      </form>
    </AuthPageFrame>
  );
}
