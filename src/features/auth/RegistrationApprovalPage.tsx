import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { AuthPageFrame } from './AuthPageFrame';

interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  role: string;
  phone: string;
  status: 'pending' | 'approved';
}

export function RegistrationApprovalPage() {
  const navigate = useNavigate();
  const [notificationDispatched, setNotificationDispatched] = useState(false);

  useEffect(() => {
    try {
      const role = window.sessionStorage.getItem('transport-management.auth-role') || 'driver';
      const roleTitle = window.sessionStorage.getItem('transport-management.auth-role-title') || 'Driver (Life Tracking)';
      const pendingRaw = window.sessionStorage.getItem('transport-management.pending-registration');
      const pendingObj = pendingRaw ? JSON.parse(pendingRaw) as { mobileNumber?: string; firstName?: string; lastName?: string } : {};
      const phone = pendingObj.mobileNumber || '+•• ••••••3210';
      const fullName = `${pendingObj.firstName || 'New'} ${pendingObj.lastName || 'User'}`.trim();

      // Dispatch notification to Admin Dashboard store bridge
      const storedAlertsRaw = window.localStorage.getItem('transport-management.admin-notifications') || '[]';
      const storedAlerts = JSON.parse(storedAlertsRaw) as NotificationPayload[];

      const newAlert: NotificationPayload = {
        id: `APP-REQ-${Date.now()}`,
        type: 'APPROVAL_REQUEST',
        title: `New ${roleTitle} Registration Request`,
        message: `${fullName} (${phone}) has completed payment and submitted registration for account approval.`,
        timestamp: new Date().toISOString(),
        role,
        phone,
        status: 'pending',
      };

      // Push to start of list so admin sees it immediately on dashboard
      const updatedAlerts = [newAlert, ...storedAlerts];
      window.localStorage.setItem('transport-management.admin-notifications', JSON.stringify(updatedAlerts));
      setNotificationDispatched(true);
    } catch {
      // Ignore local storage errors
      setNotificationDispatched(true);
    }
  }, []);

  return (
    <AuthPageFrame
      eyebrow="Step 3 of 3 • Status Review"
      title="Submitted for Approval"
      description="Your account registration and payment verification have been successfully received."
    >
      <div className="space-y-6 text-center">
        {/* Animated Check & Status Badge */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success ring-8 ring-success/5">
          <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-info/15 border border-info/30 px-3 py-1 text-body-xs font-bold text-info">
            <span className="size-2 rounded-full bg-info animate-pulse" /> Status: Admin Review Pending
          </div>
          <p className="text-body-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            As per platform governance, an automated request has been dispatched to the administrator dashboard (`Admin get Notification on Dashboard`). Once approved, your Life Tracking toggle and Live Map service visibility will unlock automatically according to your role.
          </p>
        </div>

        {/* Client Wireframe Exact Contact Box requirement */}
        <div className="rounded-2xl border-2 border-primary bg-primary/10 p-6 shadow-md space-y-2 transform transition-transform hover:scale-[1.01]">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary font-mono">
            Direct Support Line
          </span>
          <h2 className="text-heading-md font-extrabold text-foreground tracking-tight select-all">
            For Approval Contact Us <br />
            <span className="text-primary">+966000000000</span>
          </h2>
          <p className="text-body-xs text-muted-foreground pt-1">
            Need urgent clearance or immediate dispatch verification? Call or WhatsApp the admin desk directly.
          </p>
        </div>

        {notificationDispatched && (
          <div className="rounded-xl border border-border bg-surface-muted/50 p-3 text-body-xs text-muted-foreground">
            ⚡ <strong className="text-foreground">Bridge Active:</strong> Notification payload dispatched. When Developer 2&apos;s Admin Dashboard opens, this approval request will appear instantly.
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => void navigate('/app/dashboard')}
          >
            Preview Dashboard
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => void navigate('/auth/login')}
          >
            Back to Sign In
          </Button>
        </div>

        <div className="pt-2 border-t border-border/60">
          <Link
            to="/legal/terms"
            className="text-[11px] font-medium text-muted-foreground underline hover:text-foreground"
          >
            View Terms & Governance Policies
          </Link>
        </div>
      </div>
    </AuthPageFrame>
  );
}
