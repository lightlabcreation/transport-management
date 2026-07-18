import { useState } from 'react';
import type { EmergencyContact } from '../sos.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmergencyContactsTableProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onEditContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
}

export function EmergencyContactsTable({
  contacts,
  onAddContact,
  onEditContact,
  onDeleteContact,
}: EmergencyContactsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState(1);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setRelationship('');
    setPhone('');
    setPriority(contacts.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setRelationship(contact.relationship);
    setPhone(contact.phone);
    setPriority(contact.priority);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relationship || !phone) return;

    if (editingContact) {
      onEditContact({
        id: editingContact.id,
        name,
        relationship,
        phone,
        priority: Number(priority),
      });
    } else {
      onAddContact({
        name,
        relationship,
        phone,
        priority: Number(priority),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <section aria-labelledby="contacts-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="contacts-heading" className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Distress Emergency Contacts
        </h2>
        <Button variant="outline" size="sm" onClick={openAddModal} className="text-xs font-bold">
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-body-sm text-muted-foreground">No emergency contacts set up yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table view */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Priority</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Relationship</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase">Phone Number</th>
                  <th className="p-4 text-body-xs font-semibold text-muted-foreground uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[...contacts].sort((a, b) => a.priority - b.priority).map((contact) => (
                  <tr key={contact.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 text-body-sm font-semibold font-mono text-primary">#{contact.priority}</td>
                    <td className="p-4 text-body-sm font-bold text-foreground">{contact.name}</td>
                    <td className="p-4 text-body-sm text-muted-foreground">{contact.relationship}</td>
                    <td className="p-4 text-body-sm font-mono text-foreground">{contact.phone}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(contact)}
                        className="text-xs min-h-8 px-2.5 font-semibold text-primary"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteContact(contact.id)}
                        className="text-xs min-h-8 px-2.5 font-semibold text-danger hover:text-danger/90"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile responsive cards list view */}
          <div className="grid gap-3 md:hidden">
            {[...contacts].sort((a, b) => a.priority - b.priority).map((contact) => (
              <article
                key={contact.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm hover:border-muted transition-colors animate-fade-in"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Priority #{contact.priority}
                    </span>
                    <h3 className="text-body font-bold text-foreground">{contact.name}</h3>
                  </div>
                  <span className="text-body-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {contact.relationship}
                  </span>
                </div>

                <div className="flex justify-between items-center text-body-sm py-1 border-t border-border/40">
                  <span className="font-mono text-muted-foreground">{contact.phone}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(contact)}
                      className="text-[10px] min-h-7 px-3 font-semibold"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteContact(contact.id)}
                      className="text-[10px] min-h-7 px-3 font-semibold text-danger hover:text-danger/95"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Contact Modal Overlay */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-overlay backdrop-blur-sm transition-opacity"
        >
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-scale-up space-y-4">
            <h3 id="contact-modal-title" className="text-body font-bold text-foreground">
              {editingContact ? 'Edit Contact Info' : 'Add Emergency Contact'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="contact-name">Full Name</Label>
                <Input
                  id="contact-name"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-rel">Relationship</Label>
                <Input
                  id="contact-rel"
                  required
                  placeholder="e.g. Spouse, Brother, Partner"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  required
                  placeholder="e.g. +1 (555) 901-2384"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contact-priority">Priority Index</Label>
                <Input
                  id="contact-priority"
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-2 pt-3">
                <Button variant="outline" fullWidth onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
