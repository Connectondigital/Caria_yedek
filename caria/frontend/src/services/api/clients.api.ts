/**
 * Clients API - Phase 1 (READ-ONLY + Phase 1.5 status update stub)
 */

import httpClient from '../http';
import { clientAdapter } from '../adapters/client.adapter';
import { Client, HorizonInquiry, ClientFilters } from '../domain/types/Client';
import { PaginatedResponse, PaginationParams, LeadStatus } from '../domain/types/Common';

/**
 * Get all clients with client-side filtering and pagination
 */
export async function getClients(
  filters?: ClientFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Client>> {
  try {
    // Fetch all inquiries from backend
    const horizonInquiries = await httpClient.get<HorizonInquiry[]>('/api/inquiries');
    
    // Transform to UI models
    let clients = clientAdapter.toUIList(horizonInquiries);
    
    // Apply client-side filters
    if (filters) {
      clients = applyFilters(clients, filters);
    }
    
    // Apply client-side pagination
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 20;
    const total = clients.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = clients.slice(start, end);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  } catch (error: any) {
    console.error('[Clients API] Failed to fetch clients:', error);
    // Return empty result on error
    return {
      data: [],
      pagination: {
        page: pagination?.page || 1,
        perPage: pagination?.perPage || 20,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

/**
 * Get single client by ID
 */
export async function getClientById(id: number): Promise<Client | null> {
  try {
    const horizonInquiries = await httpClient.get<HorizonInquiry[]>('/api/inquiries');
    const inquiry = horizonInquiries.find(i => i.id === id);
    
    if (!inquiry) {
      console.warn(`[Clients API] Client with ID ${id} not found`);
      return null;
    }
    
    return clientAdapter.toUI(inquiry);
  } catch (error: any) {
    console.error('[Clients API] Failed to fetch client by ID:', error);
    return null;
  }
}

/**
 * Get clients grouped by stage (for Sales OS pipeline)
 */
export async function getClientsByStage(): Promise<Record<string, Client[]>> {
  try {
    const horizonInquiries = await httpClient.get<HorizonInquiry[]>('/api/inquiries');
    const clients = clientAdapter.toUIList(horizonInquiries);
    
    // Group by stage
    const grouped: Record<string, Client[]> = {
      Lead: [],
      Qualified: [],
      Meeting: [],
      Offer: [],
      Closed: [],
      Lost: [],
    };
    
    clients.forEach(client => {
      grouped[client.stage].push(client);
    });
    
    return grouped;
  } catch (error: any) {
    console.error('[Clients API] Failed to fetch clients by stage:', error);
    // Return empty groups on error
    return {
      Lead: [],
      Qualified: [],
      Meeting: [],
      Offer: [],
      Closed: [],
      Lost: [],
    };
  }
}

/**
 * Apply client-side filters
 */
function applyFilters(clients: Client[], filters: ClientFilters): Client[] {
  return clients.filter(client => {
    if (filters.status && client.status !== filters.status) return false;
    if (filters.stage && client.stage !== filters.stage) return false;
    if (filters.source && client.source !== filters.source) return false;
    
    if (filters.dateFrom) {
      const clientDate = new Date(client.createdAt);
      const filterDate = new Date(filters.dateFrom);
      if (clientDate < filterDate) return false;
    }
    
    if (filters.dateTo) {
      const clientDate = new Date(client.createdAt);
      const filterDate = new Date(filters.dateTo);
      if (clientDate > filterDate) return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(filters.search) ||
        client.message.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
}

// ============================================================
// PHASE 1.5 STUB (Status Update)
// ============================================================

/**
 * Update lead status - PHASE 1.5 STUB
 * This requires backend endpoint: PATCH /api/inquiries/:id
 */
export async function updateLeadStatus(id: number, status: LeadStatus): Promise<boolean> {
  try {
    // Attempt to call backend endpoint
    await httpClient.patch(`/api/inquiries/${id}`, { status });
    return true;
  } catch (error: any) {
    // If endpoint doesn't exist (404), provide helpful message
    if (error.statusCode === 404) {
      console.warn('[Clients API] Status update endpoint not implemented yet (Phase 1.5)');
      throw new Error(
        'Lead status update not available yet. Backend endpoint PATCH /api/inquiries/:id needs to be implemented (Phase 1.5)'
      );
    }
    
    console.error('[Clients API] Failed to update lead status:', error);
    throw error;
  }
}

// ============================================================
// PHASE 2+ STUBS (NOT IMPLEMENTED IN PHASE 1)
// ============================================================

/**
 * Create client/inquiry - NOT IMPLEMENTED IN PHASE 1
 */
export async function createClient(client: Partial<Client>): Promise<{ id: number } | null> {
  console.warn('[Clients API] createClient() is not implemented in Phase 1');
  throw new Error('Client creation is not available in Phase 1 (admin side)');
}

/**
 * Delete client - NOT IMPLEMENTED IN PHASE 1
 */
export async function deleteClient(id: number): Promise<boolean> {
  console.warn('[Clients API] deleteClient() is not implemented in Phase 1');
  throw new Error('Client deletion is not available in Phase 1');
}

export const clientsApi = {
  getClients,
  getClientById,
  getClientsByStage,
  updateLeadStatus,
  createClient,
  deleteClient,
};
