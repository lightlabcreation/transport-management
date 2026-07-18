import { useState, useEffect } from 'react';
import type { BroadcastScenario } from '../whatsapp-invites.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WhatsAppBroadcastModalProps {
  scenario: BroadcastScenario | null;
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSent?: (scenario: BroadcastScenario) => void;
}

export function WhatsAppBroadcastModal({
  scenario,
  isOpen,
  onClose,
  onBroadcastSent,
}: WhatsAppBroadcastModalProps) {
  const [messageText, setMessageText] = useState('');

  // Update template message when scenario changes
  useEffect(() => {
    if (scenario) {
      setMessageText(scenario.templateMessage);
    }
  }, [scenario]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !scenario) return null;

  const handleLaunchWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const encoded = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/?text=${encoded}`;
    
    // Open target link on a new tab
    window.open(waUrl, '_blank');

    if (onBroadcastSent) {
      onBroadcastSent(scenario);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="broadcast-modal-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-overlay backdrop-blur-sm transition-opacity"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg animate-scale-up space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 id="broadcast-modal-title" className="text-heading-sm font-bold text-foreground">
            WhatsApp Dispatch Broadcast
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close broadcast modal"
            className="rounded-full"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleLaunchWhatsApp} className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-body-sm font-bold text-foreground">{scenario.title}</h3>
            <p className="text-body-xs text-muted-foreground">{scenario.description}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="broadcast-textarea">Compile Broadcast Message</Label>
            <Textarea
              id="broadcast-textarea"
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter message to broadcast..."
              className="font-mono text-body-sm min-h-32"
            />
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Uses standard whatsapp external share protocol.</span>
              <span>{messageText.length} characters</span>
            </div>
          </div>

          {/* Quick Disclaimer Alert */}
          <div className="rounded-lg bg-info/10 p-3 text-info text-body-xs leading-relaxed">
            📢 **External Link Notice**: This action compiles a secure `https://wa.me/` hyperlink and redirects you to WhatsApp Web/App interface in a new browser tab.
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth className="gap-2">
              <svg className="size-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.022-.08-.103-.13-.18-.13h-.114a1.86 1.86 0 0 0-1.378.583l-.603.626c-.347.362-1.07.181-1.637-.367-.57-.55-.776-1.258-.428-1.62l.53-.551a1.88 1.88 0 0 0 .548-1.344v-.115c0-.077-.047-.156-.123-.178l-2.236-.665a.19.19 0 0 0-.22.078l-.83 1.139c-.584.802-.373 2.067.47 2.91.84.843 2.1.1 2.902.47l1.147-.831a.19.19 0 0 0 .077-.22l-.666-2.232z" />
                <path fillRule="evenodd" d="M12.004 22c5.523 0 10-4.477 10-10S17.527 2 12.004 2 2.004 6.477 2.004 12c0 2.213.72 4.26 1.94 5.922L2 22l4.22-.924A9.95 9.95 0 0 0 12.004 22zM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" clipRule="evenodd" />
              </svg>
              Open WhatsApp Share
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
