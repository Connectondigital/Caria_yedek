# EstatesOS Service Layer Implementation

## PART 10: SERVICE IMPLEMENTATIONS

### services/propertyService.ts
```typescript
import apiClient from './api/client';
import { ENDPOINTS } from './api/endpoints';
import { handleApiError } from './api/errorHandler';
import { propertyAdapter } from './adapters';
import { Property, PropertyFilters, HorizonProperty } from '../domain/types/property';
import { PaginatedResponse, PaginationParams } from '../domain/types/common';

/**
 * Get all properties with optional filtering and pagination
 */
export async function getProperties(
  filters?: PropertyFilters,
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedResponse<Property>> {
  try {
    const response = await apiClient.get<HorizonProperty[]>(ENDPOINTS.PROPERTIES_LIST);
    let properties = response.data.map(propertyAdapter.toUI);

    // Apply client-side filters
    if (filters) {
      properties = filterProperties(properties, filters);
    }

    // Apply client-side pagination
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
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get single property by slug
 */
export async function getPropertyBySlug(slug: string): Promise<Property> {
  try {
    const response = await apiClient.get<HorizonProperty>(
      ENDPOINTS.PROPERTIES_DETAIL(slug)
    );
    return propertyAdapter.toUI(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get single property by ID (resolve slug first)
 */
export async function getPropertyById(id: number): Promise<Property> {
  try {
    // First get all properties to find the slug
    const response = await apiClient.get<HorizonProperty[]>(ENDPOINTS.PROPERTIES_LIST);
    const property = response.data.find(p => p.id === id);
    
    if (!property) {
      throw new Error('Property not found');
    }

    return propertyAdapter.toUI(property);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create new property
 */
export async function createProperty(property: Partial<Property>): Promise<{ id: number }> {
  try {
    const apiData = propertyAdapter.toAPI(property);
    const response = await apiClient.post(ENDPOINTS.PROPERTIES_CREATE, apiData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update existing property
 */
export async function updateProperty(
  id: number,
  property: Partial<Property>
): Promise<{ status: string }> {
  try {
    const apiData = propertyAdapter.toAPI({ ...property, id });
    const response = await apiClient.post(ENDPOINTS.PROPERTIES_UPDATE, apiData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete property
 */
export async function deleteProperty(id: number): Promise<{ status: string }> {
  try {
    const response = await apiClient.delete(ENDPOINTS.PROPERTIES_DELETE(id));
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Toggle featured status
 */
export async function toggleFeatured(
  id: number,
  isFeatured: boolean
): Promise<{ status: string }> {
  try {
    const response = await apiClient.post(ENDPOINTS.PROPERTIES_UPDATE, {
      id,
      is_featured: isFeatured ? 1 : 0,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Upload property image
 */
export async function uploadPropertyImage(file: File): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(ENDPOINTS.PROPERTIES_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Client-side filtering helper
 */
function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter(prop => {
    if (filters.status && prop.status !== filters.status) return false;
    if (filters.region && prop.region !== filters.region) return false;
    if (filters.minPrice && prop.price < filters.minPrice) return false;
    if (filters.maxPrice && prop.price > filters.maxPrice) return false;
    if (filters.propertyType && prop.propertyType !== filters.propertyType) return false;
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

export const propertyService = {
  getProperties,
  getPropertyBySlug,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFeatured,
  uploadPropertyImage,
};
```

### services/clientService.ts
```typescript
import apiClient from './api/client';
import { ENDPOINTS } from './api/endpoints';
import { handleApiError } from './api/errorHandler';
import { clientAdapter } from './adapters';
import { Client, ClientFilters, HorizonInquiry } from '../domain/types/client';
import { PaginatedResponse } from '../domain/types/common';
import { LeadStatus } from '../domain/types/common';

/**
 * Get all clients/leads with optional filtering and pagination
 */
export async function getClients(
  filters?: ClientFilters,
  page: number = 1,
  perPage: number = 20
): Promise<PaginatedResponse<Client>> {
  try {
    const response = await apiClient.get<HorizonInquiry[]>(ENDPOINTS.INQUIRIES_LIST);
    let clients = response.data.map(clientAdapter.toUI);

    // Apply client-side filters
    if (filters) {
      clients = filterClients(clients, filters);
    }

    // Apply client-side pagination
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
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get single client by ID
 */
export async function getClientById(id: number): Promise<Client> {
  try {
    const response = await apiClient.get<HorizonInquiry[]>(ENDPOINTS.INQUIRIES_LIST);
    const inquiry = response.data.find(i => i.id === id);
    
    if (!inquiry) {
      throw new Error('Client not found');
    }

    return clientAdapter.toUI(inquiry);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create new inquiry (usually from public website)
 */
export async function createInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: number;
}): Promise<{ status: string }> {
  try {
    const response = await apiClient.post(ENDPOINTS.INQUIRIES_CREATE, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update lead status (Phase 1.5 - requires backend endpoint)
 */
export async function updateLeadStatus(
  id: number,
  status: LeadStatus
): Promise<{ status: string }> {
  try {
    const response = await apiClient.patch(ENDPOINTS.INQUIRIES_UPDATE_STATUS(id), {
      status,
    });
    return response.data;
  } catch (error) {
    // If endpoint doesn't exist yet, provide helpful error
    if (error.response?.status === 404) {
      throw new Error(
        'Lead status update not available yet. Please implement PATCH /api/inquiries/:id in backend (Phase 1.5)'
      );
    }
    throw handleApiError(error);
  }
}

/**
 * Delete inquiry
 */
export async function deleteClient(id: number): Promise<{ status: string }> {
  try {
    const response = await apiClient.delete(ENDPOINTS.INQUIRIES_DELETE(id));
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get clients by status for pipeline view
 */
export async function getClientsByStage(): Promise<Record<string, Client[]>> {
  try {
    const response = await apiClient.get<HorizonInquiry[]>(ENDPOINTS.INQUIRIES_LIST);
    const clients = response.data.map(clientAdapter.toUI);

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
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Client-side filtering helper
 */
function filterClients(clients: Client[], filters: ClientFilters): Client[] {
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

export const clientService = {
  getClients,
  getClientById,
  createInquiry,
  updateLeadStatus,
  deleteClient,
  getClientsByStage,
};
```

### services/cmsService.ts
```typescript
import apiClient from './api/client';
import { ENDPOINTS } from './api/endpoints';
import { handleApiError } from './api/errorHandler';
import { cmsAdapter } from './adapters';
import {
  CMSHomepageBlock,
  CMSGlobalString,
  HorizonHomepageBlock,
  HorizonGlobalString,
} from '../domain/types/cms';

/**
 * Get all homepage blocks
 */
export async function getHomepageBlocks(): Promise<CMSHomepageBlock[]> {
  try {
    const response = await apiClient.get<HorizonHomepageBlock[]>(
      ENDPOINTS.CMS_HOMEPAGE_LIST
    );
    return response.data.map(cmsAdapter.homepageBlockToUI);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get homepage blocks grouped by type
 */
export async function getHomepageBlocksByType(): Promise<{
  hero: CMSHomepageBlock[];
  features: CMSHomepageBlock[];
  testimonials: CMSHomepageBlock[];
  cta: CMSHomepageBlock[];
}> {
  try {
    const blocks = await getHomepageBlocks();
    return {
      hero: blocks.filter(b => b.blockType === 'hero'),
      features: blocks.filter(b => b.blockType === 'feature'),
      testimonials: blocks.filter(b => b.blockType === 'testimonial'),
      cta: blocks.filter(b => b.blockType === 'cta'),
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Save homepage block (create or update)
 */
export async function saveHomepageBlock(
  block: Partial<CMSHomepageBlock>
): Promise<{ status: string; id: number }> {
  try {
    const apiData = cmsAdapter.homepageBlockToAPI(block);
    const response = await apiClient.post(ENDPOINTS.CMS_HOMEPAGE_SAVE, apiData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete homepage block
 */
export async function deleteHomepageBlock(id: number): Promise<{ status: string }> {
  try {
    const response = await apiClient.delete(ENDPOINTS.CMS_HOMEPAGE_DELETE(id));
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get all global strings
 */
export async function getGlobalStrings(): Promise<CMSGlobalString[]> {
  try {
    const response = await apiClient.get<HorizonGlobalString[]>(
      ENDPOINTS.CMS_CONTENT_LIST
    );
    return response.data.map(cmsAdapter.globalStringToUI);
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get global strings as key-value map
 */
export async function getGlobalStringsMap(): Promise<Record<string, { tr: string; en: string }>> {
  try {
    const strings = await getGlobalStrings();
    const map: Record<string, { tr: string; en: string }> = {};
    
    strings.forEach(str => {
      map[str.contentKey] = {
        tr: str.valueTr,
        en: str.valueEn,
      };
    });
    
    return map;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update global strings (batch update)
 */
export async function updateGlobalStrings(
  strings: Partial<CMSGlobalString>[]
): Promise<{ status: string }> {
  try {
    const apiData = strings.map(cmsAdapter.globalStringToAPI);
    const response = await apiClient.post(ENDPOINTS.CMS_CONTENT_UPDATE, apiData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update single global string
 */
export async function updateGlobalString(
  contentKey: string,
  valueTr: string,
  valueEn: string,
  section: string = 'general'
): Promise<{ status: string }> {
  try {
    const apiData = cmsAdapter.globalStringToAPI({
      contentKey,
      valueTr,
      valueEn,
      section,
    });
    const response = await apiClient.post(ENDPOINTS.CMS_CONTENT_UPDATE, [apiData]);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export const cmsService = {
  getHomepageBlocks,
  getHomepageBlocksByType,
  saveHomepageBlock,
  deleteHomepageBlock,
  getGlobalStrings,
  getGlobalStringsMap,
  updateGlobalStrings,
  updateGlobalString,
};
```

### services/authService.ts
```typescript
import apiClient from './api/client';
import { ENDPOINTS } from './api/endpoints';
import { handleApiError } from './api/errorHandler';

interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
  };
}

/**
 * Sign in with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH_SIGNIN, {
      email,
      password,
    });

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Sign out (clear token)
 */
export function logout(): void {
  localStorage.removeItem('admin_token');
  window.location.href = '/connect-admin#login';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('admin_token'));
}

/**
 * Get current auth token
 */
export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

export const authService = {
  login,
  logout,
  isAuthenticated,
  getToken,
};
```

---

## PART 11: PHASE 1 BINDING PLAN

### Phase 1.1: CMS Integration (Week 1)

**Goal:** Connect CMS OS to real backend

#### Task 1.1.1: Homepage Blocks
```typescript
// pages/CmsPage.js
import { cmsService } from '../services/cmsService';

const CmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlocks() {
      try {
        setLoading(true);
        const data = await cmsService.getHomepageBlocks();
        setBlocks(data);
      } catch (error) {
        console.error('Failed to load homepage blocks:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlocks();
  }, []);

  // ... rest of component
};
```

#### Task 1.1.2: Global Strings
```typescript
// pages/CmsPage.js - Global Strings Tab
const [globalStrings, setGlobalStrings] = useState([]);

useEffect(() => {
  async function fetchStrings() {
    try {
      const data = await cmsService.getGlobalStrings();
      setGlobalStrings(data);
    } catch (error) {
      console.error('Failed to load global strings:', error);
    }
  }
  fetchStrings();
}, []);

// Auto-save on edit
const handleStringUpdate = async (contentKey, valueTr, valueEn) => {
  try {
    await cmsService.updateGlobalString(contentKey, valueTr, valueEn);
    // Show success toast
  } catch (error) {
    // Show error toast
  }
};
```

---

### Phase 1.2: Property OS Integration (Week 2)

**Goal:** Connect Property OS to real backend (read-only + featured toggle)

#### Task 1.2.1: Property List
```typescript
// pages/PropertyPage.js
import { propertyService } from '../services/propertyService';

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const response = await propertyService.getProperties(
          filters,
          pagination.page,
          pagination.perPage
        );
        setProperties(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [filters, pagination.page, pagination.perPage]);

  // Toggle featured
  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await propertyService.toggleFeatured(id, !currentStatus);
      // Refresh list
      fetchProperties();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  // ... rest of component
};
```

#### Task 1.2.2: Property Detail Drawer
```typescript
// components/PropertyDrawer.js
const PropertyDrawer = ({ propertyId, onClose }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(propertyId);
        setProperty(data);
      } catch (error) {
        console.error('Failed to load property:', error);
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) fetchProperty();
  }, [propertyId]);

  // ... rest of component
};
```

---

### Phase 1.3: Client OS Integration (Week 2)

**Goal:** Connect Client OS to real backend (read-only)

#### Task 1.3.1: Client List
```typescript
// pages/ClientPage.js
import { clientService } from '../services/clientService';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const response = await clientService.getClients(
          filters,
          pagination.page,
          pagination.perPage
        );
        setClients(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Failed to load clients:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [filters, pagination.page, pagination.perPage]);

  // ... rest of component
};
```

---

### Phase 1.4: Sales OS Integration (Week 3)

**Goal:** Connect Sales OS to real backend (pipeline view + status update)

#### Task 1.4.1: Pipeline View
```typescript
// pages/SalesPage.js
import { clientService } from '../services/clientService';

const SalesPage = () => {
  const [pipelineData, setPipelineData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPipeline() {
      try {
        setLoading(true);
        const data = await clientService.getClientsByStage();
        setPipelineData(data);
      } catch (error) {
        console.error('Failed to load pipeline:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPipeline();
  }, []);

  // ... rest of component
};
```

#### Task 1.4.2: Update Lead Status (Phase 1.5)
```typescript
// components/LeadCard.js
const handleStatusChange = async (leadId, newStatus) => {
  try {
    await clientService.updateLeadStatus(leadId, newStatus);
    // Refresh pipeline
    fetchPipeline();
    // Show success toast
  } catch (error) {
    if (error.message.includes('not available yet')) {
      alert('⚠️ Lead status update requires backend implementation (Phase 1.5)');
    } else {
      console.error('Failed to update lead status:', error);
    }
  }
};
```

---

## PART 12: NEXT ACTIONS CHECKLIST

### ✅ Phase 1.1: CMS Integration (Week 1)
- [ ] Create TypeScript type files in `domain/types/`
- [ ] Implement API client (`services/api/client.ts`)
- [ ] Implement endpoints constants (`services/api/endpoints.ts`)
- [ ] Implement error handler (`services/api/errorHandler.ts`)
- [ ] Implement CMS adapter (`services/adapters/cmsAdapter.ts`)
- [ ] Implement CMS service (`services/cmsService.ts`)
- [ ] Update CmsPage.js to use real API
- [ ] Test homepage blocks GET
- [ ] Test global strings GET
- [ ] Test global strings UPDATE (autosave)
- [ ] Verify Horizon Admin still works

### ✅ Phase 1.2: Property OS Integration (Week 2)
- [ ] Implement property adapter (`services/adapters/propertyAdapter.ts`)
- [ ] Implement property service (`services/propertyService.ts`)
- [ ] Update PropertyPage.js to use real API
- [ ] Implement property list with filters
- [ ] Implement property detail drawer
- [ ] Test featured toggle
- [ ] Test image upload (if needed)
- [ ] Verify Horizon Admin still works

### ✅ Phase 1.3: Client OS Integration (Week 2)
- [ ] Implement client adapter (`services/adapters/clientAdapter.ts`)
- [ ] Implement client service (`services/clientService.ts`)
- [ ] Update ClientPage.js to use real API
- [ ] Implement client list with filters
- [ ] Implement client detail drawer
- [ ] Test pagination
- [ ] Verify Horizon Admin still works

### ✅ Phase 1.4: Sales OS Integration (Week 3)
- [ ] Update SalesPage.js to use real API
- [ ] Implement pipeline view with stages
- [ ] Implement lead card drag-and-drop (UI only for now)
- [ ] Add lead status update UI (with Phase 1.5 warning)
- [ ] Test pipeline data loading
- [ ] Verify Horizon Admin still works

### ⚠️ Phase 1.5: Backend Enhancements (Week 3-4)
- [ ] Add PATCH /api/inquiries/:id endpoint to backend
- [ ] Add status column to inquiries table (if missing)
- [ ] Test status update from EstatesOS
- [ ] Enable lead status updates in Sales OS
- [ ] Verify backward compatibility with Horizon

### 📊 Testing & Validation
- [ ] Run all EstatesOS pages in parallel with Horizon
- [ ] Verify no data corruption
- [ ] Test auth flow (same token works for both)
- [ ] Test error states (network errors, 404s, 500s)
- [ ] Test empty states (no properties, no clients)
- [ ] Load test with 1000+ properties
- [ ] Mobile responsiveness check

### 📚 Documentation
- [ ] Document API endpoints for team
- [ ] Create adapter mapping reference
- [ ] Write migration guide for other developers
- [ ] Document known limitations
- [ ] Create troubleshooting guide

---

## PART 13: SUCCESS CRITERIA

### Phase 1 Complete When:
1. ✅ CMS OS displays real homepage blocks
2. ✅ CMS OS displays and updates global strings (autosave works)
3. ✅ Property OS displays real properties from backend
4. ✅ Property OS featured toggle works
5. ✅ Client OS displays real inquiries
6. ✅ Sales OS displays pipeline view with real data
7. ✅ All features work alongside Horizon without conflicts
8. ✅ No backend breaking changes introduced
9. ✅ Error handling works correctly
10. ✅ Loading states work correctly

### Phase 1.5 Complete When:
11. ✅ Lead status can be updated from Sales OS
12. ✅ Status updates persist in database
13. ✅ Pipeline view reflects status changes immediately
14. ✅ Horizon Admin unaffected by new status field

---

**END OF API IMPLEMENTATION GUIDE**
