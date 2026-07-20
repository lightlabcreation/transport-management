/**
 * Shared in-memory browser store for newly created pending group approvals.
 * Bridges CreateGroupPage (groups feature) → PendingApprovalsQueue (owner dashboard).
 * Uses sessionStorage so data persists across navigations within the same tab.
 */

import type { PendingGroupApproval } from '@/features/roles/owner/owner.types';

const STORAGE_KEY = 'gts-pending-group-approvals';

function loadFromSession(): PendingGroupApproval[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingGroupApproval[];
  } catch {
    return [];
  }
}

function saveToSession(items: PendingGroupApproval[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // sessionStorage may be unavailable in some environments
  }
}

export const pendingGroupsStore = {
  getAll(): PendingGroupApproval[] {
    return loadFromSession();
  },

  add(approval: PendingGroupApproval): void {
    const current = loadFromSession();
    // Avoid duplicates by id
    if (!current.some((a) => a.id === approval.id)) {
      const updated = [approval, ...current];
      saveToSession(updated);
    }
  },

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
