import { useState } from 'react';
import type { ExpirationOption } from '../whatsapp-invites.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InviteQrCodeCardProps {
  initialLink: string;
}

export function InviteQrCodeCard({ initialLink }: InviteQrCodeCardProps) {
  const [expiresIn, setExpiresIn] = useState<ExpirationOption>('7-days');
  const [copied, setCopied] = useState(false);
  
  // Calculate dynamic mock link based on expiry setting
  const getDynamicLink = () => {
    return `${initialLink}?expires=${expiresIn}&token=token_${expiresIn.substring(0, 3)}_${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const dynamicLink = getDynamicLink();

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center space-y-6">
      <div className="space-y-1">
        <h2 className="text-body font-bold text-foreground">Fast Dispatch Invitation Link</h2>
        <p className="text-body-xs text-muted-foreground">
          Drivers can scan the QR code to instantly enroll into tracking corridors.
        </p>
      </div>

      {/* Mock Responsive QR Code Box (CSS + Vector squares) */}
      <div className="p-4 bg-white rounded-xl border border-border flex items-center justify-center size-48 shadow-inner" aria-label="Mock QR Code scan code">
        <div className="size-full bg-slate-900 p-2 flex flex-wrap justify-between content-between gap-1 relative overflow-hidden rounded">
          {/* Top-Left Finder pattern */}
          <div className="size-12 border-4 border-white bg-slate-900 flex items-center justify-center absolute top-2 left-2 rounded">
            <div className="size-5 bg-white rounded-sm"></div>
          </div>
          {/* Top-Right Finder pattern */}
          <div className="size-12 border-4 border-white bg-slate-900 flex items-center justify-center absolute top-2 right-2 rounded">
            <div className="size-5 bg-white rounded-sm"></div>
          </div>
          {/* Bottom-Left Finder pattern */}
          <div className="size-12 border-4 border-white bg-slate-900 flex items-center justify-center absolute bottom-2 left-2 rounded">
            <div className="size-5 bg-white rounded-sm"></div>
          </div>
          {/* QR code dots and noises mockup */}
          <div className="absolute inset-0 flex flex-wrap gap-2 p-16 opacity-75">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-sm ${i % 3 === 0 ? 'size-2 bg-white' : i % 5 === 0 ? 'size-1.5 bg-slate-500' : 'size-1 bg-transparent'}`}
              />
            ))}
          </div>
          <Badge variant="success" className="absolute bottom-2 right-2 text-[8px] px-1 py-0 border-none font-bold font-mono">
            SCAN LIVE
          </Badge>
        </div>
      </div>

      {/* Controls: Expiration & Link Copy */}
      <div className="w-full space-y-4">
        {/* Expiration Settings selector */}
        <div className="flex items-center justify-between gap-4 text-left">
          <label htmlFor="expiry-select" className="text-body-xs font-semibold text-muted-foreground uppercase">
            Link Expiration Settings:
          </label>
          <select
            id="expiry-select"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value as ExpirationOption)}
            className="text-body-sm font-semibold rounded-md border border-input bg-surface p-1.5 focus:border-primary outline-none"
          >
            <option value="24-hours">24 Hours</option>
            <option value="7-days">7 Days</option>
            <option value="never">Never Expire</option>
          </select>
        </div>

        {/* Link input with copy button */}
        <div className="space-y-1">
          <label htmlFor="invite-link-display" className="sr-only">Invitation Link Url</label>
          <div className="flex gap-2">
            <input
              id="invite-link-display"
              type="text"
              readOnly
              value={dynamicLink}
              className="min-h-control flex-1 rounded-md border border-input bg-surface-muted px-3 py-1.5 text-body-xs font-mono text-muted-foreground outline-none cursor-not-allowed select-all"
            />
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleCopy}
              className="text-xs min-h-control font-bold px-4 tracking-wider uppercase shrink-0"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
