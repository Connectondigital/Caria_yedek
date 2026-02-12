/**
 * Properties API - Phase 1 (READ-ONLY)
 */

import httpClient from '../http';
import { propertyAdapter } from '../adapters/property.adapter';
import { Property, HorizonProperty, PropertyFilters } from '../domain/types/Property';
import { PaginatedResponse, PaginationParams } from '../domain/types/Common';

/**
 * Get all properties with client-side filtering and pagination
 */
export async function getProperties(
  filters?: PropertyFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Property>> {
  try {
    // Fetch all properties from backend
    const horizonProperties = await httpClient.get<HorizonProperty[]>('/api/listings');
    
    // Transform to UI models
    let properties = propertyAdapter.toUIList(horizonProperties);
    
    // Apply client-side filters
    if (filters) {
      properties = applyFilters(properties, filters);
    }
    
    // Apply client-side pagination
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 20;
    const total = properties.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = properties.slice(start, end);
    
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
    console.error('[Properties API] Failed to fetch properties:', error);
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
 * Get single property by slug
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const horizonProperty = await httpClient.get<HorizonProperty>(`/api/listings/${slug}`);
    return propertyAdapter.toUI(horizonProperty);
  } catch (error: any) {
    console.error('[Properties API] Failed to fetch property:', error);
    return null;
  }
}

/**
 * Get single property by ID (fetch all and find)
 */
export async function getPropertyById(id: number): Promise<Property | null> {
  try {
    const horizonProperties = await httpClient.get<HorizonProperty[]>('/api/listings');
    const property = horizonProperties.find(p => p.id === id);
    
    if (!property) {
      console.warn(`[Properties API] Property with ID ${id} not found`);
      return null;
    }
    
    return propertyAdapter.toUI(property);
  } catch (error: any) {
    console.error('[Properties API] Failed to fetch property by ID:', error);
    return null;
  }
}

/**
 * Apply client-side filters
 */
function applyFilters(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter(prop => {
    if (filters.status && prop.status !== filters.status) return false;
    if (filters.region && prop.region !== filters.region) return false;
    if (filters.propertyType && prop.propertyType !== filters.propertyType) return false;
    if (filters.minPrice && prop.price < filters.minPrice) return false;
    if (filters.maxPrice && prop.price > filters.maxPrice) return false;
    if (filters.beds && prop.bedsRoomCount !== filters.beds) return false;
    if (filters.isFeatured !== undefined && prop.isFeatured !== filters.isFeatured) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        prop.title.toLowerCase().includes(searchLower) ||
        prop.location.toLowerCase().includes(searchLower) ||
        prop.region.toLowerCase().includes(searchLower) ||
        prop.reference.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
}

// ============================================================
// PHASE 2+ STUBS (NOT IMPLEMENTED IN PHASE 1)
// ============================================================

/**
 * Create property - NOT IMPLEMENTED IN PHASE 1
 */
export async function createProperty(property: Partial<Property>): Promise<{ id: number } | null> {
  console.warn('[Properties API] createProperty() is not implemented in Phase 1');
  throw new Error('Property creation is not available in Phase 1');
}

/**
 * Update property - NOT IMPLEMENTED IN PHASE 1
 */
export async function updateProperty(id: number, property: Partial<Property>): Promise<boolean> {
  console.warn('[Properties API] updateProperty() is not implemented in Phase 1');
  throw new Error('Property update is not available in Phase 1');
}

/**
 * Delete property - NOT IMPLEMENTED IN PHASE 1
 */
export async function deleteProperty(id: number): Promise<boolean> {
  console.warn('[Properties API] deleteProperty() is not implemented in Phase 1');
  throw new Error('Property deletion is not available in Phase 1');
}

/**
 * Upload image - NOT IMPLEMENTED IN PHASE 1
 */
export async function uploadImage(file: File): Promise<string | null> {
  console.warn('[Properties API] uploadImage() is not implemented in Phase 1');
  throw new Error('Image upload is not available in Phase 1');
}

export const propertiesApi = {
  getProperties,
  getPropertyBySlug,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadImage,
};
