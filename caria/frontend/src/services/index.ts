/**
 * EstatesOS Services - Unified export
 */

// API Services
export { propertiesApi } from './api/properties.api';
export { clientsApi } from './api/clients.api';
export { cmsApi } from './api/cms.api';
export { authApi } from './api/auth.api';

// HTTP Client
export { default as httpClient } from './http';

// Adapters
export { propertyAdapter } from './adapters/property.adapter';
export { clientAdapter } from './adapters/client.adapter';
export { cmsAdapter } from './adapters/cms.adapter';

// Types (re-export for convenience)
export type { Property, PropertyFilters } from '../admin/domain/types/Property';
export type { Client, ClientFilters } from '../admin/domain/types/Client';
export type { CMSHomepageBlock, CMSGlobalString } from '../admin/domain/types/CMS';
export type { PaginatedResponse, PaginationParams, AppError } from '../admin/domain/types/Common';
