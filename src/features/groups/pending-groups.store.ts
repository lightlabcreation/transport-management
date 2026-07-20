/**
 * Shared LocalStorage browser store for newly created groups and pending approvals.
 * Persists data across browser reloads / page refreshes.
 */

import type { Group, GroupStatus } from './groups.types';
import type { PendingGroupApproval, GroupApprovalStatus } from '@/features/roles/owner/owner.types';

const PENDING_STORAGE_KEY = 'gts-pending-group-approvals';
const CREATED_GROUPS_KEY = 'gts-created-groups';

/* ── PENDING APPROVALS STORE ───────────────────────────────── */

function loadPendingFromLocal(): PendingGroupApproval[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingGroupApproval[];
  } catch {
    return [];
  }
}

function savePendingToLocal(items: PendingGroupApproval[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // LocalStorage fallback
  }
}

export const pendingGroupsStore = {
  getAll(): PendingGroupApproval[] {
    return loadPendingFromLocal();
  },

  add(approval: PendingGroupApproval): void {
    const current = loadPendingFromLocal();
    if (!current.some((a) => a.id === approval.id)) {
      const updated = [approval, ...current];
      savePendingToLocal(updated);
    }
  },

  updateStatus(approvalId: string, status: GroupApprovalStatus, notes?: string): void {
    const current = loadPendingFromLocal();
    const updated = current.map((a) => {
      if (a.id === approvalId) {
        return {
          ...a,
          status,
          notes: notes ? `${a.notes || ''} [Admin Note: ${notes}]` : a.notes,
        };
      }
      return a;
    });
    savePendingToLocal(updated);
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PENDING_STORAGE_KEY);
    }
  },
};

/* ── CREATED GROUPS LOCAL STORAGE ───────────────────────────── */

function loadCreatedGroupsFromLocal(): Group[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(CREATED_GROUPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Group[];
  } catch {
    return [];
  }
}

function saveCreatedGroupsToLocal(items: Group[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CREATED_GROUPS_KEY, JSON.stringify(items));
    }
  } catch {
    // LocalStorage fallback
  }
}

export const createdGroupsStore = {
  getAll(): Group[] {
    return loadCreatedGroupsFromLocal();
  },

  add(group: Group): void {
    const current = loadCreatedGroupsFromLocal();
    if (!current.some((g) => g.id === group.id)) {
      const updated = [group, ...current];
      saveCreatedGroupsToLocal(updated);
    }
  },

  updateStatus(groupId: string, status: GroupStatus): void {
    const current = loadCreatedGroupsFromLocal();
    const updated = current.map((g) => (g.id === groupId ? { ...g, status } : g));
    saveCreatedGroupsToLocal(updated);
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CREATED_GROUPS_KEY);
    }
  },
};
