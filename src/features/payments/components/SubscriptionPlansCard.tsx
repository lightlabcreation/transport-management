import { useState } from 'react';
import { MOCK_PLANS } from '../payments.data';
import type { SubscriptionPlan, PlanTier } from '../payments.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SubscriptionPlansCardProps {
  currentPlanId?: PlanTier | undefined;
  onSelectPlan: (plan: SubscriptionPlan, billingCycle: 'monthly' | 'yearly') => void;
}

export function SubscriptionPlansCard({ currentPlanId, onSelectPlan }: SubscriptionPlansCardProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const getPriceDisplay = (plan: SubscriptionPlan) => {
    if (plan.id === 'lifetime') {
      return { price: plan.price, text: 'one-time' };
    }
    if (billingCycle === 'yearly') {
      // 25% discount logic or standard
      const yearlyPrice = plan.id === 'monthly' ? 14.99 * 12 : plan.price;
      return { price: Number((yearlyPrice / 12).toFixed(2)), text: 'mo, billed annually' };
    }
    return { price: plan.id === 'yearly' ? 19.99 : plan.price, text: 'mo' };
  };

  return (
    <section aria-labelledby="pricing-heading" className="space-y-6">
      {/* Billing cycle toggle */}
      <div className="flex flex-col items-center justify-center gap-3">
        <h2 id="pricing-heading" className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Subscription Tiers
        </h2>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <Button
            variant={billingCycle === 'monthly' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('monthly')}
            className="rounded-full text-xs min-h-8 px-4 font-semibold"
          >
            Monthly Billing
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('yearly')}
            className="rounded-full text-xs min-h-8 px-4 font-semibold"
          >
            Yearly Billing (Save 25%)
          </Button>
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
