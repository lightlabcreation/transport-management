import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface SosTriggerCardProps {
  onTriggered: () => void;
  onCancelled: () => void;
}

export function SosTriggerCard({ onTriggered, onCancelled }: SosTriggerCardProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isBroadcastActive, setIsBroadcastActive] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number>(0);

  const HOLD_DURATION = 5000; // 5 seconds

  const startHold = () => {
    if (isBroadcastActive) return;
    setIsHolding(true);
    setProgress(0);
    startTimestampRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimestampRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION) {
        triggerSos();
      }
    }, 50);
  };

  const endHold = () => {
    if (isBroadcastActive) return;
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const triggerSos = () => {
    setIsHolding(false);
    setProgress(100);
    setIsBroadcastActive(true);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onTriggered();
  };

  const cancelSos = () => {
    setIsBroadcastActive(false);
    setIsHolding(false);
    setProgress(0);
    onCancelled();
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-heading-sm font-bold text-foreground">Emergency SOS Trigger</h2>
        <p className="text-body-sm text-muted-foreground max-w-sm">
          Press and hold the button for 5 seconds to broadcast a distress signal and send location alerts to emergency contacts.
        </p>
      </div>

      {/* Button & Progress HUD */}
      <div className="relative flex items-center justify-center size-64 select-none">
        
        {/* Progress SVG Border Ring */}
        <svg className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
          <circle
            cx="128"
            cy="128"
            r="110"
            className="stroke-muted fill-none"
            strokeWidth="8"
          />
          <circle
            cx="128"
            cy="128"
            r="110"
            className="stroke-danger fill-none transition-all duration-75"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
          />
        </svg>

        {/* SOS Pulse Circles when active */}
        {isBroadcastActive && (
          <>
            <span className="absolute inline-flex size-48 rounded-full bg-danger/20 animate-ping"></span>
            <span className="absolute inline-flex size-56 rounded-full bg-danger/10 animate-ping delay-300"></span>
          </>
        )}

        {/* Giant Trigger Button */}
        <button
          type="button"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isHolding) {
              e.preventDefault();
              startHold();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              endHold();
            }
          }}
          aria-label={isBroadcastActive ? "SOS Broadcast Active" : "Emergency SOS Trigger"}
          className={`z-10 flex flex-col items-center justify-center size-44 rounded-full border transition-all duration-normal outline-none focus-visible:ring-4 focus-visible:ring-danger/40 ${
            isBroadcastActive
              ? 'bg-danger border-danger text-danger-foreground shadow-lg shadow-danger/40'
              : isHolding
              ? 'bg-danger/90 border-danger text-danger-foreground scale-95'
              : 'bg-card border-danger/40 text-danger hover:bg-danger/5 shadow-md'
          }`}
        >
          {isBroadcastActive ? (
            <div className="space-y-1 animate-pulse">
              <span className="text-xl font-black uppercase tracking-wider block">ACTIVE</span>
              <span className="text-[10px] font-medium tracking-wide uppercase opacity-90 block">Distress Sent</span>
            </div>
          ) : isHolding ? (
            <div className="space-y-1">
              <span className="text-3xl font-extrabold block">
                {Math.ceil(5 - (progress / 100) * 5)}s
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-95">HOLD ON</span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-3xl font-black tracking-widest block">SOS</span>
              <span className="text-[9px] font-bold tracking-wide uppercase opacity-80 block">Press & Hold</span>
            </div>
          )}
        </button>
      </div>

      {/* Control Actions Panel */}
      <div className="w-full max-w-xs pt-2">
        {isBroadcastActive ? (
          <div className="space-y-4">
            <div role="alert" className="rounded-lg bg-danger/10 p-3 text-danger text-body-xs font-semibold leading-relaxed animate-pulse">
              🚨 MOCK SOS BROADCAST ACTIVE. Mock GPS telemetry and coordinates sent to emergency dispatcher contacts list.
            </div>
            <Button variant="danger" fullWidth onClick={cancelSos} className="font-bold text-xs uppercase tracking-wider">
              Cancel SOS Broadcast
            </Button>
          </div>
        ) : isHolding ? (
          <p className="text-body-xs text-muted-foreground font-semibold animate-pulse">
            Simulating system check... Release to cancel.
          </p>
        ) : (
          <p className="text-body-xs text-muted-foreground">
            Distress signal will trigger immediately after 5 seconds hold.
          </p>
        )}
      </div>
    </article>
  );
}
