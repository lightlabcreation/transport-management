import { useState, useEffect } from 'react';
import type { SubscriptionPlan, PlanTier } from '../payments.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CheckoutFormModalProps {
  plan: SubscriptionPlan;
  billingCycle: PlanTier;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: SubscriptionPlan) => void;
}

type PaymentMethod = 'stripe' | 'razorpay' | 'pay';

export function CheckoutFormModal({ plan, billingCycle, isOpen, onClose, onSuccess }: CheckoutFormModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('stripe');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculatedPrice = plan.id === 'lifetime'
    ? plan.price
    : billingCycle === 'yearly'
    ? Number(((plan.id === 'monthly' ? 14.99 * 12 : plan.price) / 12).toFixed(2))
    : plan.id === 'yearly' ? 19.99 : plan.price;

  const totalAmount = plan.id === 'lifetime' ? plan.price : billingCycle === 'yearly' ? calculatedPrice * 12 : calculatedPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Simulate network latency
    setTimeout(() => {
      // Simulate failure behavior on card ending with '4000'
      if (method === 'stripe' && cardNumber.endsWith('4000')) {
        setStatus('error');
        setErrorMessage('Your transaction was declined. Insufficient mock credit. Try any other numbers.');
      } else if (method === 'razorpay' && !upiId.includes('@')) {
        setStatus('error');
        setErrorMessage('Invalid UPI address. Please include @bank (e.g. user@okhdfc).');
      } else {
        setStatus('success');
        setTimeout(() => {
          onSuccess(plan);
        }, 1200);
      }
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-overlay backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg animate-scale-up space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 id="checkout-title" className="text-heading-sm font-bold text-foreground">
            Complete Checkout
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close checkout modal"
            className="rounded-full"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Success View */}
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
              <svg className="size-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-heading-sm font-bold text-foreground">Payment Successful!</h3>
            <p className="text-body-sm text-muted-foreground">
              Thank you for upgrading! Your subscription to <strong className="text-foreground">{plan.name}</strong> is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Purchase Summary */}
            <div className="rounded-xl bg-surface-muted p-4 border border-border/40">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-body font-bold text-foreground">{plan.name}</p>
                  <p className="text-body-xs text-muted-foreground capitalize">
                    {billingCycle} billing cycle
                  </p>
                </div>
                <Badge variant="primary" className="font-mono text-body-sm px-3.5 py-1">
                  ${totalAmount.toFixed(2)}
                </Badge>
              </div>
            </div>

            {/* Simulated payment options selectors */}
            <div className="space-y-2">
              <Label>Select Payment Gateway (Simulated)</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setMethod('stripe'); setStatus('idle'); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    method === 'stripe' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground'
                  }`}
                >
                  <span className="text-body-xs font-bold uppercase tracking-wide">Credit Card</span>
                  <span className="text-[9px] mt-1 text-muted-foreground">Stripe Mock</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('razorpay'); setStatus('idle'); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    method === 'razorpay' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground'
                  }`}
                >
                  <span className="text-body-xs font-bold uppercase tracking-wide">UPI / Net</span>
                  <span className="text-[9px] mt-1 text-muted-foreground">Razorpay Mock</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('pay'); setStatus('idle'); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    method === 'pay' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-transparent text-muted-foreground'
                  }`}
                >
                  <span className="text-body-xs font-bold uppercase tracking-wide">Wallet</span>
                  <span className="text-[9px] mt-1 text-muted-foreground">Apple / Google</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-danger/10 p-3 text-danger text-body-sm">
                <svg className="size-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inputs based on Gateway */}
            {method === 'stripe' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    required
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    required
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Tip: End with <code className="font-bold text-foreground">4000</code> to trigger simulated declined error state.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="card-expiry">Expiration</Label>
                    <Input
                      id="card-expiry"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'razorpay' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="upi-id">UPI Address</Label>
                  <Input
                    id="upi-id"
                    required
                    placeholder="username@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must include `@` symbol to validate successfully.
                  </p>
                </div>
              </div>
            )}

            {method === 'pay' && (
              <div className="py-4 text-center border border-dashed border-border rounded-lg bg-surface-muted space-y-2">
                <p className="text-body-sm text-muted-foreground">
                  Simulating direct express wallet checkout.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-sm bg-foreground text-background px-3 py-1 rounded"> Pay</span>
                  <span className="font-bold text-sm border border-border px-3 py-1 rounded bg-card">G Pay</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" fullWidth onClick={onClose} disabled={status === 'loading'}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth isLoading={status === 'loading'}>
                {status === 'loading' ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
