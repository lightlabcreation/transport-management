import { useState } from 'react';
import type { EmergencyContact, SafetySettings } from './sos.types';
import { INITIAL_CONTACTS, DEFAULT_SAFETY_SETTINGS } from './sos.data';
import { SosTriggerCard } from './components/SosTriggerCard';
import { EmergencyContactsTable } from './components/EmergencyContactsTable';
import { SafetySettingsToggle } from './components/SafetySettingsToggle';
import { Badge } from '@/components/ui/badge';

export function SosPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [settings, setSettings] = useState<SafetySettings>(DEFAULT_SAFETY_SETTINGS);
  const [isSosBroadcasted, setIsSosBroadcasted] = useState(false);

  const handleTriggered = () => {
    setIsSosBroadcasted(true);
  };

  const handleCancelled = () => {
    setIsSosBroadcasted(false);
  };

  const handleAddContact = (newContact: Omit<EmergencyContact, 'id'>) => {
    const contact: EmergencyContact = {
      ...newContact,
      id: `contact-${Date.now()}`,
    };
    setContacts([...contacts, contact]);
  };

  const handleEditContact = (updatedContact: EmergencyContact) => {
    setContacts(contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c)));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSettingChange = (key: keyof SafetySettings, val: boolean) => {
    setSettings({
      ...settings,
      [key]: val,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-border/60 pb-6 flex flex-col gap-1">
        <h1 className="text-heading-lg font-bold text-foreground tracking-tight flex flex-wrap items-center gap-3">
          🚨 Safety & Emergency Center
          {isSosBroadcasted && (
            <Badge variant="danger" className="animate-pulse px-3 py-1 font-bold text-xs uppercase">
              Active SOS Broadcast
            </Badge>
          )}
        </h1>
        <p className="text-body-sm text-muted-foreground">
          Configure crash detection options, emergency triggers, and dispatcher notification lists.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* Left Side: Distress Trigger */}
        <div className="space-y-6">
          <SosTriggerCard onTriggered={handleTriggered} onCancelled={handleCancelled} />
          <SafetySettingsToggle settings={settings} onChange={handleSettingChange} />
        </div>

        {/* Right Side: Emergency Contacts list */}
        <div className="space-y-6">
          <EmergencyContactsTable
            contacts={contacts}
            onAddContact={handleAddContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
          />

          {/* Quick Informational Notice */}
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
            <h3 className="text-body-sm font-bold text-foreground flex items-center gap-2">
              <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Distress Mode Guide
            </h3>
            <p className="text-body-xs text-muted-foreground leading-relaxed">
              When SOS distress mode is activated, coordinates are simulated at regular 3-second intervals to verify active connection. In production, this would trigger instant Webhook updates to law enforcement.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
