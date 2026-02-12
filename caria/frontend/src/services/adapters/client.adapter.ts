/**
 * Client adapter - transforms Horizon API responses to EstatesOS domain models
 */

import { Client, HorizonInquiry } from '../domain/types/Client';
import { LeadStatus, LeadStage, LeadSource } from '../domain/types/Common';

/**
 * Map Horizon inquiry status to EstatesOS lead status
 */
function mapStatus(horizonStatus: string): LeadStatus {
  const statusMap: Record<string, LeadStatus> = {
    'new': 'new',
    'contacted': 'contacted',
    'qualified': 'qualified',
    'negotiating': 'negotiating',
    'won': 'won',
    'lost': 'lost',
  };
  return statusMap[horizonStatus?.toLowerCase()] || 'new';
}

/**
 * Map status to sales stage
 */
function statusToStage(status: LeadStatus): LeadStage {
  const stageMap: Record<LeadStatus, LeadStage> = {
    'new': 'Lead',
    'contacted': 'Qualified',
    'qualified': 'Meeting',
    'negotiating': 'Offer',
    'won': 'Closed',
    'lost': 'Lost',
  };
  return stageMap[status];
}

/**
 * Infer source from inquiry data (simple heuristic)
 */
function inferSource(inquiry: HorizonInquiry): LeadSource {
  // In Phase 1, all inquiries are from website
  // Later can be enhanced based on other fields
  return 'website';
}

/**
 * Transform Horizon inquiry to EstatesOS Client
 */
export function toUI(horizonInquiry: HorizonInquiry): Client {
  const status = mapStatus(horizonInquiry.status);
  
  return {
    id: horizonInquiry.id,
    name: horizonInquiry.name || 'Unknown',
    email: horizonInquiry.email || '',
    phone: horizonInquiry.phone || '',
    message: horizonInquiry.message || '',
    propertyId: horizonInquiry.property_id,
    status,
    stage: statusToStage(status),
    source: inferSource(horizonInquiry),
    createdAt: horizonInquiry.created_at || new Date().toISOString(),
  };
}

/**
 * Transform multiple inquiries
 */
export function toUIList(horizonInquiries: HorizonInquiry[]): Client[] {
  return horizonInquiries.map(toUI);
}

export const clientAdapter = {
  toUI,
  toUIList,
};
