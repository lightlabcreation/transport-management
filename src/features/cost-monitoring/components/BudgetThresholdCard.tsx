import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BudgetConfig } from '../cost-monitoring.types';

interface BudgetThresholdCardProps {
  initialConfig: BudgetConfig;
}

export function BudgetThresholdCard({ initialConfig }: BudgetThresholdCardProps) {
  const [config, setConfig] = useState<BudgetConfig>(initialConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [capInput, setCapInput] = useState(initialConfig.monthlySpendCap.toString());
  const [saveMessage, setSaveMessage] = useState('');

  const spendPercent = Math.round((config.currentSpend / config.monthlySpendCap) * 100);

  const handleSave = () => {
    const newCap = parseFloat(capInput) || config.monthlySpendCap;
    setConfig((prev) => ({ ...prev, monthlySpendCap: newCap }));
    setIsEditing(false);
    setSaveMessage(`Monthly budget cap updated successfully to $${newCap.toFixed(2)}.`);
    setTimeout(() => setSaveMessage(''), 4000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={spendPercent > 80 ? 'warning' : 'success'}>
              {spendPercent}% of Budget Used
            </Badge>
            <span className="text-body-xs font-semibold text-muted-foreground">
              Billing Cycle Ends in 12 Days
            </span>
          </div>
          <h2 className="mt-1 text-heading-md font-semibold tracking-tight text-foreground">
            Monthly Spend Cap & Automated Safety Lockout
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Set hard financial thresholds across Google Maps, TomTom, and WhatsApp to prevent quota overflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Adjust Cap & Thresholds
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
                className="w-28 text-body-sm font-semibold"
                aria-label="Monthly spend cap"
              />
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Cap
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {saveMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-body-sm font-medium text-success"
        >
          {saveMessage}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-body-sm font-semibold">
          <span className="text-foreground">Current Combined Spend: ${config.currentSpend.toFixed(2)}</span>
          <span className="text-muted-foreground">Spend Cap: ${config.monthlySpendCap.toFixed(2)}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={`h-full transition-all duration-300 ${
              spendPercent > 90 ? 'bg-danger' : spendPercent > 75 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(spendPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-body-xs text-muted-foreground pt-1">
          <span>0% ($0.00)</span>
          <span>Warning Alert: {config.warningThresholdPercent}% (${(config.monthlySpendCap * (config.warningThresholdPercent / 100)).toFixed(2)})</span>
          <span>Lockout: {config.criticalThresholdPercent}% (${(config.monthlySpendCap * (config.criticalThresholdPercent / 100)).toFixed(2)})</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-body-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">Auto-Lockout Engine:</span>
          <Badge variant={config.autoLockoutEnabled ? 'danger' : 'neutral'}>
            {config.autoLockoutEnabled ? 'ENABLED (Stops non-critical API calls above 95%)' : 'DISABLED (Alert Only)'}
          </Badge>
        </div>
        <Button
          size="sm"
          variant={config.autoLockoutEnabled ? 'outline' : 'danger'}
          onClick={() =>
            setConfig((prev) => ({ ...prev, autoLockoutEnabled: !prev.autoLockoutEnabled }))
          }
        >
          {config.autoLockoutEnabled ? 'Disable Auto-Lockout' : 'Enable 95% Auto-Lockout'}
        </Button>
      </div>
    </div>
  );
}
