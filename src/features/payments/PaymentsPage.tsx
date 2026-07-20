import { useState } from 'react';
import type { PaymentsViewState, SubscriptionPlan, Invoice, PaymentCard, PlanTier } from './payments.types';
import { MOCK_INVOICES, MOCK_CARDS } from './payments.data';
import { SubscriptionPlansCard } from './components/SubscriptionPlansCard';
import { CheckoutFormModal } from './components/CheckoutFormModal';
import { PaymentHistoryTable } from './components/PaymentHistoryTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function PaymentsPage() {
  const [viewState, setViewState] = useState<PaymentsViewState>('Normal');
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>({
    id: 'yearly',
    name: 'Enterprise Yearly',
    price: 179.99,
    interval: 'yr',
    features: [],
    isPopular: true,
  });
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [cards] = useState<PaymentCard[]>(MOCK_CARDS);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<PlanTier>('yearly');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan, billingCycle: PlanTier) => {
    setSelectedPlan(plan);
    setSelectedCycle(billingCycle);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (plan: SubscriptionPlan) => {
    setIsCheckoutOpen(false);
    setActivePlan(plan);
    setViewState('Normal');

    // Add new mock invoice
    const newInvoice: Invoice = {
      id: `INV-2026-00${invoices.length + 1}`,
      date: new Date().toISOString().split('T')[0] || '',
      amount: plan.price,
      status: 'Paid',
      planName: plan.name,
      billingMethod: 'Visa ending in 4242',
    };
    setInvoices([newInvoice, ...invoices]);
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your current subscription? This will lock tracking actions.')) {
      setActivePlan(null);
      setViewState('No Subscription');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-heading-lg font-bold text-foreground tracking-tight">Billing & Payments</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            Manage your subscription plans, invoice receipts history, and payment configurations.
          </p>
        </div>

        {/* View State Switcher (Demo HUD) */}
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm max-w-fit">
          <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">Demo State:</span>
          {(['Normal', 'No Subscription', 'Pending Approval'] as PaymentsViewState[]).map((state) => (
            <Button
              key={state}
              variant={viewState === state ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewState(state)}
              className="text-xs min-h-8 rounded-lg font-medium px-2.5"
            >
              {state}
            </Button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      {viewState === 'No Subscription' && (
        <div className="space-y-6 animate-fade-in">
          <div role="alert" className="rounded-2xl border border-warning/40 bg-warning/5 p-6 space-y-3">
            <div className="flex items-center gap-3 text-warning">
              <svg className="size-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-body font-bold">Subscription Inactive</h2>
            </div>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Your vehicle tracking and reports dashboard features are currently locked. Please select a subscription plan below to unlock full standard operations control.
            </p>
          </div>
          <SubscriptionPlansCard currentPlanId={undefined} onSelectPlan={handleSelectPlan} />
        </div>
      )}

      {viewState === 'Pending Approval' && (
        <div className="rounded-2xl border border-info/40 bg-info/5 p-8 text-center max-w-xl mx-auto space-y-4 animate-fade-in">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-info/10 text-info">
            <svg className="size-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-heading-sm font-bold text-foreground">Billing Status: Review Pending</h2>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Your billing upgrade request is currently being reviewed by the platform administrator. This approval process typically takes up to 24 hours. You will receive an in-app notification once active.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setViewState('Normal')} className="font-bold text-xs">
              Go Back to Dashboard Preview
            </Button>
          </div>
        </div>
      )}

      {viewState === 'Normal' && (
        <div className="space-y-8 animate-fade-in">
          {/* Active plan summary and Payment Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Active Plan Card */}
            <article className="md:col-span-2 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Plan</span>
                  <Badge variant="success">Active Status</Badge>
                </div>
                {activePlan ? (
                  <>
                    <h2 className="text-heading-sm font-bold text-foreground">{activePlan.name}</h2>
                    <p className="text-body-sm text-muted-foreground leading-relaxed">
                      Your subscription is active. Your next billing date is scheduled for <strong className="text-foreground">August 15, 2027</strong>.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-heading-sm font-bold text-foreground">No Plan Active</h2>
                    <p className="text-body-sm text-muted-foreground leading-relaxed">
                      Upgrade to unlock all standard tracking metrics and voice warnings templates.
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border/40 mt-4">
                <Button variant="outline" size="sm" onClick={() => setViewState('No Subscription')} className="text-xs font-bold">
                  Change Plan Tiers
                </Button>
                {activePlan && (
                  <Button variant="ghost" size="sm" onClick={handleCancelSubscription} className="text-xs text-danger hover:text-danger/90 font-semibold">
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </article>

            {/* Payment Cards list */}
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Saved Cards
                </h3>
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-surface-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="rounded border border-border bg-card px-2 py-1 text-[10px] font-bold uppercase font-mono text-foreground">
                          {card.brand}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-foreground">•••• {card.last4}</p>
                          <p className="text-[10px] text-muted-foreground">Expires {card.expDate}</p>
                        </div>
                      </div>
                      {card.isDefault && (
                        <Badge variant="outline" className="text-[9px] font-bold">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => alert('[SIMULATED ACTION] New credit card form modal coming soon.')}
                className="mt-6 text-xs font-bold"
              >
                Add New Card
              </Button>
            </article>
          </div>

          {/* Pricing Selector (Always visible so they can upgrade from Dashboard) */}
          <SubscriptionPlansCard currentPlanId={activePlan?.id} onSelectPlan={handleSelectPlan} />

          {/* Invoices List */}
          <PaymentHistoryTable invoices={invoices} />
        </div>
      )}

      {/* Checkout Modal Form */}
      {selectedPlan && (
        <CheckoutFormModal
          plan={selectedPlan}
          billingCycle={selectedCycle}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
