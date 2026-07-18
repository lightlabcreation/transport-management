import { useState } from 'react';
import type { BroadcastScenario } from './whatsapp-invites.types';
import { MOCK_BROADCAST_SCENARIOS, MOCK_ANALYTICS } from './whatsapp-invites.data';
import { InviteQrCodeCard } from './components/InviteQrCodeCard';
import { WhatsAppBroadcastModal } from './components/WhatsAppBroadcastModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function WhatsAppCenterPage() {
  const scenarios = MOCK_BROADCAST_SCENARIOS;
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [selectedScenario, setSelectedScenario] = useState<BroadcastScenario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBroadcast = (scenario: BroadcastScenario) => {
    setSelectedScenario(scenario);
    setIsModalOpen(true);
  };

  const handleBroadcastSent = (_scenario: BroadcastScenario) => {
    // Increment stats count on successful broadcast trigger
    setAnalytics((prev) => ({
      ...prev,
      totalInvitesSent: prev.totalInvitesSent + 1,
    }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-border/60 pb-6 flex flex-col gap-1">
        <h1 className="text-heading-lg font-bold text-foreground tracking-tight flex items-center gap-3">
          💬 WhatsApp Dispatch & Invite Center
        </h1>
        <p className="text-body-sm text-muted-foreground">
          Generate dispatcher QR invitations, link expiration limits, and compile message broadcasts.
        </p>
      </div>

      {/* Analytics Dashboard Grid */}
      <section aria-labelledby="analytics-heading" className="grid gap-4 grid-cols-3">
        <h2 id="analytics-heading" className="sr-only">Invite Analytics Stats</h2>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Broadcasts</p>
          <p className="mt-1.5 text-heading-md font-bold text-foreground font-mono">{analytics.totalInvitesSent}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Links</p>
          <p className="mt-1.5 text-heading-md font-bold text-foreground font-mono">{analytics.activeLinksCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">QR Scans (Mock)</p>
          <p className="mt-1.5 text-heading-md font-bold text-foreground font-mono">{analytics.qrScansCount}</p>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Side: QR Code Generator Card */}
        <div className="md:col-span-1">
          <InviteQrCodeCard initialLink="https://transport-management.example.com/join" />
        </div>

        {/* Right Side: Broadcast Template list */}
        <section aria-labelledby="scenarios-heading" className="md:col-span-2 space-y-4">
          <h2 id="scenarios-heading" className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
            WhatsApp Broadcast Scenarios
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {scenarios.map((scenario) => {
              const isSos = scenario.id === 'sos';
              return (
                <article
                  key={scenario.id}
                  className={`rounded-2xl border bg-card p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between ${
                    isSos ? 'border-danger/35 hover:border-danger/60' : 'border-border hover:border-muted'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body-sm font-bold text-foreground">{scenario.title}</h3>
                      {isSos && <Badge variant="danger">High Priority</Badge>}
                    </div>
                    <p className="text-body-xs text-muted-foreground leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2">
                    <Button
                      variant={isSos ? 'danger' : 'outline'}
                      size="sm"
                      fullWidth
                      onClick={() => handleOpenBroadcast(scenario)}
                      className="text-xs font-bold uppercase tracking-wider"
                    >
                      Compile Link
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Broadcast compiler modal overlay */}
      {selectedScenario && (
        <WhatsAppBroadcastModal
          scenario={selectedScenario}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBroadcastSent={handleBroadcastSent}
        />
      )}
    </div>
  );
}
