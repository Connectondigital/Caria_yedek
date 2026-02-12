# EstatesOS API Implementation Guide

## PART 6: FILE STRUCTURE

```
frontend/src/admin/
├── services/
│   ├── api/
│   │   ├── client.ts              # Axios instance + interceptors
│   │   ├── endpoints.ts           # URL constants
│   │   └── errorHandler.ts        # Centralized error handling
│   ├── adapters/
│   │   ├── propertyAdapter.ts     # Property: Horizon → EstatesOS
│   │   ├── clientAdapter.ts       # Client/Lead: Horizon → EstatesOS
│   │   ├── cmsAdapter.ts          # CMS: Horizon → EstatesOS
│   │   └── index.ts               # Barrel export
│   ├── propertyService.ts         # Property business logic
│   ├── clientService.ts           # Client/Lead business logic
│   ├── cmsService.ts              # CMS business logic
│   └── authService.ts             # Authentication
├── domain/
│   └── types/
│       ├── property.ts            # Property interfaces
│       ├── client.ts              # Client/Lead interfaces
│       ├── cms.ts                 # CMS interfaces
│       └── common.ts              # Shared types (Pagination, etc.)
└── state/
    └── adminStore.ts              # Global state (already exists)
```

---

## PART 7: TYPE DEFINITIONS

### domain/types/common.ts
```typescript
export interface PaginationParams {
  page: number;
  perPage: number;
  total: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export type Currency = 'GBP' | 'USD' | 'EUR' | 'TRY';
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'draft';
export type PropertyType = 'Villa' | 'Apartment' | 'Land' | 'Commercial';
export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'White Goods';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'scheduled' | 'negotiating' | 'closed' | 'lost';
export type LeadStage = 'Lead' | 'Qualified' | 'Meeting' | 'Offer' | 'Closed' | 'Lost';
export type LeadSource = 'Website' | 'Referral' | 'Direct' | 'Campaign' | 'Unknown';
```

### domain/types/property.ts
```typescript
import { Currency, PropertyStatus, PropertyType, FurnishingStatus } from './common';

export interface GalleryImage {
  id: string;
  url: string;
  category: string;
}

export interface Property {
  // Core identifiers
  id: number;
  slug: string;
  reference: string;
  
  // Basic info
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  location: string;
  region: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  
  // Pricing
  price: number;
  currency: Currency;
  
  // Measurements
  bedsRoomCount: string;
  bathsCount: number;
  plotArea: number | null;
  closedArea: number | null;
  balconyCount: number | null;
  
  // Features
  featuresInterior: string[];
  featuresExterior: string[];
  featuresLocation: string[];
  isFurnished: FurnishingStatus;
  floorLevel: string;
  buildingAge: number;
  siteWithin: boolean;
  
  // Media
  coverImage: string;
  featuredImage: string;
  gallery: GalleryImage[];
  pdfBrochure: string | null;
  
  // Location details
  fullAddress: string | null;
  neighborhood: string | null;
  city: string | null;
  countryName: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceSea: string | null;
  distanceCenter: string | null;
  distanceAirport: string | null;
  distanceHospital: string | null;
  distanceSchool: string | null;
  
  // Agent
  advisorId: number | null;
  advisorName: string;
  advisorSlug: string | null;
  advisorPortrait: string | null;
  
  // Meta
  isFeatured: boolean;
  isFeaturedSlider: boolean;
  tag: string | null;
  
  // EstatesOS-specific (computed)
  roiPct: number;
  rentYield: number;
  viewCount: number;
  inquiryCount: number;
}

export interface PropertyFilters {
  status?: PropertyStatus;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  beds?: string;
  isFeatured?: boolean;
  search?: string;
}

// Raw Horizon API shape (for adapter input)
export interface HorizonProperty {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  plotSize: string;
  reference: string;
  image: string;
  tag: string;
  region: string;
  kocan_tipi: string;
  ozellikler_ic: string;
  ozellikler_dis: string;
  ozellikler_konum: string;
  pdf_brosur: string;
  advisor_id: number | null;
  advisor_name?: string;
  advisor_slug?: string;
  advisor_portrait?: string;
  status: string;
  description: string;
  description_en: string;
  beds_room_count: string;
  baths_count: number;
  plot_area: string;
  closed_area: string;
  is_featured: number;
  is_featured_slider: number;
  balcony: string;
  distance_sea: string;
  distance_center: string;
  distance_airport: string;
  distance_hospital: string | null;
  distance_school: string | null;
  gallery: string;
  property_type: string;
  is_furnished: string;
  floor_level: string;
  site_within: string;
  title_en: string;
  building_age: string;
  featured_image: string;
  full_address: string | null;
  neighborhood: string | null;
  city: string | null;
  country_name: string | null;
  latitude: number | null;
  longitude: number | null;
}
```

### domain/types/client.ts
```typescript
import { LeadStatus, LeadStage, LeadSource } from './common';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // EstatesOS aliases
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  
  // Status pipeline
  status: LeadStatus;
  stage: LeadStage;
  
  // Linked property
  linkedPropertyId: number | null;
  linkedPropertyTitle: string | null;
  
  // Dates
  createdAt: string;
  lastContactedAt: string | null;
  closedAt: string | null;
  
  // EstatesOS-specific
  dealValue: number | null;
  source: LeadSource;
  tags: string[];
  assignedTo: string | null;
}

export interface ClientFilters {
  status?: LeadStatus;
  stage?: LeadStage;
  source?: LeadSource;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Raw Horizon API shape
export interface HorizonInquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: number | null;
  status: string;
  created_at: string;
}
```

### domain/types/cms.ts
```typescript
export interface CMSHomepageBlock {
  id: number;
  blockType: 'hero' | 'feature' | 'testimonial' | 'cta';
  title: string;
  subtitle: string | null;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  displayOrder: number;
  active: boolean;
}

export interface CMSGlobalString {
  id: number;
  contentKey: string;
  valueTr: string;
  valueEn: string;
  section: string;
}

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  contentHtml: string;
  bannerTitle: string | null;
  bannerUrl: string | null;
  galleryJson: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Raw Horizon API shapes
export interface HorizonHomepageBlock {
  id: number;
  block_type: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  display_order: number;
  active: number;
  created_at?: string;
  updated_at?: string;
}

export interface HorizonGlobalString {
  id: number;
  content_key: string;
  value_tr: string;
  value_en: string;
  section: string;
  updated_at?: string;
}
```

---

## PART 8: API CLIENT IMPLEMENTATION

### services/api/client.ts
```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Handle 401 Unauthorized (redirect to login)
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/connect-admin#login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### services/api/endpoints.ts
```typescript
export const ENDPOINTS = {
  // Properties
  PROPERTIES_LIST: '/properties',
  PROPERTIES_DETAIL: (slug: string) => `/properties/${slug}`,
  PROPERTIES_CREATE: '/properties',
  PROPERTIES_UPDATE: '/properties',
  PROPERTIES_DELETE: (id: number) => `/properties/${id}`,
  PROPERTIES_UPLOAD: '/upload',

  // Clients/Leads (Inquiries)
  INQUIRIES_LIST: '/inquiries',
  INQUIRIES_CREATE: '/inquiries',
  INQUIRIES_DELETE: (id: number) => `/inquiries/${id}`,
  INQUIRIES_UPDATE_STATUS: (id: number) => `/inquiries/${id}`, // Phase 1.5

  // CMS
  CMS_HOMEPAGE_LIST: '/cms/homepage',
  CMS_HOMEPAGE_SAVE: '/cms/homepage',
  CMS_HOMEPAGE_DELETE: (id: number) => `/cms/homepage/${id}`,
  CMS_CONTENT_LIST: '/cms/content',
  CMS_CONTENT_UPDATE: '/cms/update',
  CMS_PAGES_LIST: '/cms/pages',
  CMS_SLIDERS_LIST: '/cms/sliders',
  CMS_FEATURES_LIST: '/cms/features',

  // Advisors
  ADVISORS_LIST: '/advisors',
  ADVISORS_DETAIL: (slug: string) => `/advisors/${slug}`,

  // Auth
  AUTH_SIGNIN: '/auth/signin',
};
```

### services/api/errorHandler.ts
```typescript
import { AxiosError } from 'axios';
import { ApiError } from '../../domain/types/common';

export function handleApiError(error: any): ApiError {
  if (error.response) {
    // Backend returned an error response
    const data = error.response.data;
    return {
      message: data?.detail || data?.message || 'An error occurred',
      status: error.response.status,
      code: data?.code,
      details: data,
    };
  } else if (error.request) {
    // Network error (no response received)
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else went wrong
    return {
      message: error.message || 'Unknown error occurred',
      status: -1,
    };
  }
}

export function isApiError(error: any): error is ApiError {
  return error && typeof error.message === 'string' && typeof error.status === 'number';
}
```

---

## PART 9: ADAPTER IMPLEMENTATIONS

### services/adapters/propertyAdapter.ts
```typescript
import { Property, HorizonProperty, GalleryImage } from '../../domain/types/property';
import { PropertyStatus, PropertyType, FurnishingStatus } from '../../domain/types/common';

/**
 * Parse JSON string safely
 */
function parseJSON<T = any>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

/**
 * Convert image path to full URL
 */
function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '/assets/images/placeholder-teal.png';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/static/') || url.startsWith('/assets/')) return url;
  return `/static/uploads/${url}`;
}

/**
 * Map Horizon status to EstatesOS status
 */
function mapStatus(horizonStatus: string): PropertyStatus {
  const statusMap: Record<string, PropertyStatus> = {
    'Satılık Emlak': 'available',
    'Satılık': 'available',
    'Rezerve': 'reserved',
    'Satıldı': 'sold',
    'Taslak': 'draft',
  };
  return statusMap[horizonStatus] || 'available';
}

/**
 * Map Horizon property type to EstatesOS type
 */
function mapPropertyType(horizonType: string): PropertyType {
  const typeMap: Record<string, PropertyType> = {
    'Villa': 'Villa',
    'Daire': 'Apartment',
    'Apartment': 'Apartment',
    'Arsa': 'Land',
    'Land': 'Land',
    'Ticari': 'Commercial',
    'Commercial': 'Commercial',
  };
  return typeMap[horizonType] || 'Apartment';
}

/**
 * Map furnishing status
 */
function mapFurnishing(horizonFurnishing: string): FurnishingStatus {
  const furnishingMap: Record<string, FurnishingStatus> = {
    'Eşyalı': 'Furnished',
    'Furnished': 'Furnished',
    'Yarı Eşyalı': 'Semi-Furnished',
    'Semi-Furnished': 'Semi-Furnished',
    'Eşyasız': 'Unfurnished',
    'Unfurnished': 'Unfurnished',
    'Beyaz Eşyalı': 'White Goods',
    'White Goods': 'White Goods',
  };
  return furnishingMap[horizonFurnishing] || 'Unfurnished';
}

/**
 * Convert Horizon Property to EstatesOS Property
 */
export function toUI(horizonProperty: HorizonProperty): Property {
  return {
    // Core identifiers
    id: horizonProperty.id,
    slug: horizonProperty.slug || '',
    reference: horizonProperty.reference || '',

    // Basic info
    title: horizonProperty.title || 'Untitled Property',
    titleEn: horizonProperty.title_en || undefined,
    description: horizonProperty.description || '',
    descriptionEn: horizonProperty.description_en || undefined,
    location: horizonProperty.location || 'N/A',
    region: horizonProperty.region || 'N/A',
    propertyType: mapPropertyType(horizonProperty.property_type),
    status: mapStatus(horizonProperty.status),

    // Pricing
    price: parseFloat(horizonProperty.price) || 0,
    currency: 'GBP', // Default

    // Measurements
    bedsRoomCount: horizonProperty.beds_room_count || '0+0',
    bathsCount: horizonProperty.baths_count || 0,
    plotArea: horizonProperty.plot_area ? parseFloat(horizonProperty.plot_area) : null,
    closedArea: horizonProperty.closed_area ? parseFloat(horizonProperty.closed_area) : null,
    balconyCount: horizonProperty.balcony ? parseInt(horizonProperty.balcony) : null,

    // Features
    featuresInterior: parseJSON<string[]>(horizonProperty.ozellikler_ic, []),
    featuresExterior: parseJSON<string[]>(horizonProperty.ozellikler_dis, []),
    featuresLocation: parseJSON<string[]>(horizonProperty.ozellikler_konum, []),
    isFurnished: mapFurnishing(horizonProperty.is_furnished),
    floorLevel: horizonProperty.floor_level || '0',
    buildingAge: parseInt(horizonProperty.building_age) || 0,
    siteWithin: horizonProperty.site_within === 'Evet',

    // Media
    coverImage: normalizeImageUrl(horizonProperty.image),
    featuredImage: normalizeImageUrl(horizonProperty.featured_image || horizonProperty.image),
    gallery: parseJSON<GalleryImage[]>(horizonProperty.gallery, []).map(img => ({
      ...img,
      url: normalizeImageUrl(img.url),
    })),
    pdfBrochure: horizonProperty.pdf_brosur || null,

    // Location details
    fullAddress: horizonProperty.full_address || null,
    neighborhood: horizonProperty.neighborhood || null,
    city: horizonProperty.city || null,
    countryName: horizonProperty.country_name || null,
    latitude: horizonProperty.latitude || null,
    longitude: horizonProperty.longitude || null,
    distanceSea: horizonProperty.distance_sea || null,
    distanceCenter: horizonProperty.distance_center || null,
    distanceAirport: horizonProperty.distance_airport || null,
    distanceHospital: horizonProperty.distance_hospital || null,
    distanceSchool: horizonProperty.distance_school || null,

    // Agent
    advisorId: horizonProperty.advisor_id || null,
    advisorName: horizonProperty.advisor_name || 'Unassigned',
    advisorSlug: horizonProperty.advisor_slug || null,
    advisorPortrait: horizonProperty.advisor_portrait 
      ? normalizeImageUrl(horizonProperty.advisor_portrait) 
      : null,

    // Meta
    isFeatured: Boolean(horizonProperty.is_featured),
    isFeaturedSlider: Boolean(horizonProperty.is_featured_slider),
    tag: horizonProperty.tag || null,

    // EstatesOS-specific (computed/placeholder)
    roiPct: 0, // TODO: Compute based on price/rent
    rentYield: 0, // TODO: Compute
    viewCount: 0, // Phase 2
    inquiryCount: 0, // Phase 2
  };
}

/**
 * Convert EstatesOS Property to Horizon API format (for POST/PUT)
 */
export function toAPI(estatosProperty: Partial<Property>): Partial<HorizonProperty> {
  return {
    id: estatosProperty.id,
    title: estatosProperty.title,
    title_en: estatosProperty.titleEn,
    description: estatosProperty.description,
    description_en: estatosProperty.descriptionEn,
    location: estatosProperty.location,
    region: estatosProperty.region,
    property_type: estatosProperty.propertyType,
    status: estatosProperty.status, // TODO: Reverse map if needed
    price: estatosProperty.price?.toString(),
    beds_room_count: estatosProperty.bedsRoomCount,
    baths_count: estatosProperty.bathsCount,
    plot_area: estatosProperty.plotArea?.toString(),
    closed_area: estatosProperty.closedArea?.toString(),
    is_featured: estatosProperty.isFeatured ? 1 : 0,
    is_featured_slider: estatosProperty.isFeaturedSlider ? 1 : 0,
    advisor_id: estatosProperty.advisorId,
    // ... add more fields as needed
  };
}

export const propertyAdapter = {
  toUI,
  toAPI,
};
```

### services/adapters/clientAdapter.ts
```typescript
import { Client, HorizonInquiry } from '../../domain/types/client';
import { LeadStatus, LeadStage, LeadSource } from '../../domain/types/common';

/**
 * Map status to stage
 */
function mapStatusToStage(status: string): LeadStage {
  const stageMap: Record<string, LeadStage> = {
    'new': 'Lead',
    'contacted': 'Qualified',
    'qualified': 'Qualified',
    'scheduled': 'Meeting',
    'negotiating': 'Offer',
    'closed': 'Closed',
    'lost': 'Lost',
  };
  return stageMap[status.toLowerCase()] || 'Lead';
}

/**
 * Convert Horizon Inquiry to EstatesOS Client
 */
export function toUI(horizonInquiry: HorizonInquiry): Client {
  return {
    id: horizonInquiry.id,
    name: horizonInquiry.name || 'Unknown',
    email: horizonInquiry.email || '',
    phone: horizonInquiry.phone || '',
    message: horizonInquiry.message || '',

    // Aliases
    clientName: horizonInquiry.name || 'Unknown',
    contactEmail: horizonInquiry.email || '',
    contactPhone: horizonInquiry.phone || '',
    notes: horizonInquiry.message || '',

    // Status
    status: (horizonInquiry.status?.toLowerCase() as LeadStatus) || 'new',
    stage: mapStatusToStage(horizonInquiry.status),

    // Linked property
    linkedPropertyId: horizonInquiry.property_id || null,
    linkedPropertyTitle: null, // TODO: Resolve from properties

    // Dates
    createdAt: horizonInquiry.created_at,
    lastContactedAt: null, // Phase 1.5
    closedAt: null, // Phase 1.5

    // EstatesOS-specific
    dealValue: null, // Phase 2
    source: 'Website', // Default assumption
    tags: [], // Phase 2
    assignedTo: null, // Phase 2
  };
}

/**
 * Convert EstatesOS Client to Horizon API format
 */
export function toAPI(estatosClient: Partial<Client>): Partial<HorizonInquiry> {
  return {
    id: estatosClient.id,
    name: estatosClient.name,
    email: estatosClient.email,
    phone: estatosClient.phone,
    message: estatosClient.message || estatosClient.notes,
    status: estatosClient.status,
    property_id: estatosClient.linkedPropertyId,
  };
}

export const clientAdapter = {
  toUI,
  toAPI,
};
```

### services/adapters/cmsAdapter.ts
```typescript
import { 
  CMSHomepageBlock, 
  CMSGlobalString, 
  HorizonHomepageBlock, 
  HorizonGlobalString 
} from '../../domain/types/cms';

/**
 * Convert Horizon Homepage Block to EstatesOS format
 */
export function homepageBlockToUI(horizonBlock: HorizonHomepageBlock): CMSHomepageBlock {
  return {
    id: horizonBlock.id,
    blockType: horizonBlock.block_type as any || 'feature',
    title: horizonBlock.title || '',
    subtitle: horizonBlock.subtitle || null,
    content: horizonBlock.content || null,
    imageUrl: horizonBlock.image_url || null,
    videoUrl: horizonBlock.video_url || null,
    displayOrder: horizonBlock.display_order || 0,
    active: Boolean(horizonBlock.active),
  };
}

/**
 * Convert EstatesOS Homepage Block to Horizon format
 */
export function homepageBlockToAPI(estatosBlock: Partial<CMSHomepageBlock>): Partial<HorizonHomepageBlock> {
  return {
    id: estatosBlock.id,
    block_type: estatosBlock.blockType,
    title: estatosBlock.title,
    subtitle: estatosBlock.subtitle,
    content: estatosBlock.content,
    image_url: estatosBlock.imageUrl,
    video_url: estatosBlock.videoUrl,
    display_order: estatosBlock.displayOrder,
    active: estatosBlock.active ? 1 : 0,
  };
}

/**
 * Convert Horizon Global String to EstatesOS format
 */
export function globalStringToUI(horizonString: HorizonGlobalString): CMSGlobalString {
  return {
    id: horizonString.id,
    contentKey: horizonString.content_key,
    valueTr: horizonString.value_tr || '',
    valueEn: horizonString.value_en || '',
    section: horizonString.section || 'general',
  };
}

/**
 * Convert EstatesOS Global String to Horizon format
 */
export function globalStringToAPI(estatosString: Partial<CMSGlobalString>): Partial<HorizonGlobalString> {
  return {
    id: estatosString.id,
    content_key: estatosString.contentKey,
    value_tr: estatosString.valueTr,
    value_en: estatosString.valueEn,
    section: estatosString.section,
  };
}

export const cmsAdapter = {
  homepageBlockToUI,
  homepageBlockToAPI,
  globalStringToUI,
  globalStringToAPI,
};
```

### services/adapters/index.ts
```typescript
export { propertyAdapter } from './propertyAdapter';
export { clientAdapter } from './clientAdapter';
export { cmsAdapter } from './cmsAdapter';
```

---

## NEXT SECTION: Continue to API_SERVICES.md for service layer implementations
