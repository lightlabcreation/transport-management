import { useState } from 'react';
import type { Invoice } from '../payments.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PaymentHistoryTableProps {
  invoices: Invoice[];
}

export function PaymentHistoryTable({ invoices }: PaymentHistoryTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const handleDownload = (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    // Simulate invoice download processing latency
    setTimeout(() => {
      setDownloadingId(null);
      alert(`[SIMULATED DOWNLOAD] Invoice ${invoice.id} downloaded successfully. (Format: PDF)`);
    }, 1000);
  };

  return (
    <section aria-labelledby="history-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="history-heading" className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Billing & Invoices History
        </h2>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-body-sm text-muted-foreground">No invoices or transactions found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Invoice ID</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Billing Date</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Description</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Amount Paid</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 text-body-sm font-mono text-foreground font-semibold">{invoice.id}</td>
                    <td className="p-4 text-body-sm text-muted-foreground">{invoice.date}</td>
                    <td className="p-4 text-body-sm text-foreground">{invoice.planName}</td>
                    <td className="p-4 text-body-sm font-mono font-bold text-foreground">${invoice.amount.toFixed(2)}</td>
                    <td className="p-4 text-body-sm">
                      <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingId !== null}
                        onClick={() => handleDownload(invoice)}
                        className="text-xs min-h-8 font-bold"
                      >
                        {downloadingId === invoice.id ? 'Saving...' : 'Download'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile responsive card list view */}
          <div className="grid gap-3 md:hidden">
            {invoices.map((invoice) => (
              <article
                key={invoice.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm hover:border-muted transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-body-xs font-mono text-muted-foreground">{invoice.id}</span>
                    <h3 className="text-body font-bold text-foreground mt-0.5">{invoice.planName}</h3>
                  </div>
                  <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-body-sm py-1 border-y border-border/40">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Date</p>
                    <p className="font-semibold text-foreground">{invoice.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase text-right">Amount</p>
                    <p className="font-semibold text-foreground text-right font-mono">${invoice.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-muted-foreground italic">
                    via {invoice.billingMethod}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    disabled={downloadingId !== null}
                    onClick={() => handleDownload(invoice)}
                    className="text-xs min-h-8 font-bold"
                  >
                    {downloadingId === invoice.id ? 'Saving...' : 'Download Invoice'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
