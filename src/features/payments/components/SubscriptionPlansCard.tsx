import { useState } from 'react';
import { MOCK_PLANS } from '../payments.data';
import type { SubscriptionPlan, PlanTier } from '../payments.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SubscriptionPlansCardProps {
  currentPlanId?: PlanTier | undefined;
  onSelectPlan: (plan: SubscriptionPlan, billingCycle: PlanTier) => void;
}

export function SubscriptionPlansCard({ currentPlanId, onSelectPlan }: SubscriptionPlansCardProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<'Stripe' | 'Razorpay' | 'Apple Pay' | 'Google Pay' | 'Credit Card'>('Stripe');

  const getPriceDisplay = (plan: SubscriptionPlan) => {
    if (plan.id === 'lifetime' || billingCycle === 'lifetime') {
      return { price: plan.price * 2.5, text: 'one-time lifetime' };
    }
    if (billingCycle === 'yearly') {
      const yearlyPrice = plan.id === 'monthly' ? 14.99 * 12 : plan.price;
      return { price: Number((yearlyPrice / 12).toFixed(2)), text: 'mo, billed annually' };
    }
    return { price: plan.id === 'yearly' ? 19.99 : plan.price, text: 'mo' };
  };

  const gateways = [
    { name: 'Stripe', icon: '💳', badge: 'Popular' },
    { name: 'Razorpay', icon: '⚡', badge: 'Instant' },
    { name: 'Apple Pay', icon: '🍎', badge: 'Fast' },
    { name: 'Google Pay', icon: '🔍', badge: '1-Tap' },
    { name: 'Credit Card', icon: '🔒', badge: 'Secure' },
  ] as const;

  return (
    <section aria-labelledby="pricing-heading" className="space-y-6">
      {/* Billing cycle & Auto-Renewal controls */}
      {/* Billing cycle & Auto-Renewal controls */}
      <div className="flex flex-col items-center justify-center gap-4 bg-surface-muted/50 p-4 rounded-2xl border border-border/60">
        <h2 id="pricing-heading" className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Subscription Duration & Auto-Renewal Options
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Duration tabs */}
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
            <Button
              variant={billingCycle === 'monthly' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
              className="rounded-full text-xs min-h-8 px-3.5 font-semibold"
            >
              Monthly Billing
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('yearly')}
              className="rounded-full text-xs min-h-8 px-3.5 font-semibold"
            >
              Yearly Billing (Save 25%)
            </Button>
            <Button
              variant={billingCycle === 'lifetime' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('lifetime')}
              className="rounded-full text-xs min-h-8 px-3.5 font-semibold"
            >
              Lifetime Billing
            </Button>
          </div>

          {/* Auto-Renewal toggle switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card shadow-sm">
            <span className="text-xs font-semibold text-foreground">Auto-Renewal:</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoRenewal}
              onClick={() => setAutoRenewal(!autoRenewal)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoRenewal ? 'bg-success' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoRenewal ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-[10px] font-bold ${autoRenewal ? 'text-success' : 'text-muted-foreground'}`}>
              {autoRenewal ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        </div>

        {/* Payment Gateway selector badges */}
        <div className="space-y-2 text-center pt-2 border-t border-border/40 w-full max-w-2xl">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Select Preferred Payment Gateway (PDF Section 8 Compliant):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {gateways.map((gw) => (
              <button
                key={gw.name}
                type="button"
                onClick={() => setSelectedGateway(gw.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  selectedGateway === gw.name
                    ? 'border-primary bg-primary/10 text-primary shadow-sm scale-105 ring-1 ring-primary/30'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{gw.icon}</span>
                <span>{gw.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/60 font-mono">{gw.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PLANS.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
          const { price, text } = getPriceDisplay(plan);

          return (
            <article
              key={plan.id}
              className={`relative rounded-2xl border bg-card p-6 flex flex-col justify-between transition-all duration-normal shadow-sm hover:shadow-md ${
                plan.isPopular ? 'border-primary shadow-md scale-102 ring-1 ring-primary/20' : 'border-border'
              }`}
            >
              {plan.isPopular && (
                <Badge variant="primary" className="absolute -top-3 right-6 px-3 py-1 font-bold text-[10px] tracking-wide uppercase">
                  Most Popular
                </Badge>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-heading-sm font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-extrabold text-foreground tracking-tight">
                    ${price}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/{text}</span>
                  </p>
                </div>

                <div className="border-t border-border/60 my-4"></div>

                {/* Features checkmark list */}
                <ul className="space-y-3" role="list">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-sm text-muted-foreground">
                      <svg
                        className="h-5 w-5 text-success shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => onSelectPlan(plan, billingCycle)}
                  disabled={isCurrent}
                  className="font-bold text-xs tracking-wider uppercase"
                >
                  {isCurrent ? 'Current Plan Active' : plan.id === 'lifetime' ? 'Get Lifetime Access' : 'Upgrade Plan'}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
