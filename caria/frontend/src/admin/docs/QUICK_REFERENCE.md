# EstatesOS Service Layer - Quick Reference

## 📁 File Structure

```
frontend/src/admin/
├── domain/
│   └── types/
│       ├── Common.ts          # Shared types, pagination, errors
│       ├── Property.ts        # Property domain models
│       ├── Client.ts          # Client/Lead domain models
│       └── CMS.ts             # CMS domain models
├── services/
│   ├── http.ts                # HTTP client with auth & interceptors
│   ├── index.ts               # Unified exports
│   ├── adapters/
│   │   ├── property.adapter.ts   # Horizon → EstatesOS property
│   │   ├── client.adapter.ts     # Horizon → EstatesOS client
│   │   └── cms.adapter.ts        # Horizon → EstatesOS CMS
│   └── api/
│       ├── properties.api.ts  # Properties API (READ-ONLY)
│       ├── clients.api.ts     # Clients API (READ-ONLY)
│       ├── cms.api.ts         # CMS API (READ + AUTOSAVE)
│       └── auth.api.ts        # Authentication API
└── docs/
    ├── API_INVENTORY.md       # Complete API documentation
    ├── API_IMPLEMENTATION.md  # TypeScript types & adapters
    ├── API_SERVICES.md        # Service layer implementations
    └── PHASE_1_INTEGRATION.md # Integration checklist
```

---

## 🔌 Usage Examples

### Import Services

```typescript
import { propertiesApi, clientsApi, cmsApi, authApi } from '../services';
```

### Fetch Properties

```typescript
// Get all properties with filters and pagination
const response = await propertiesApi.getProperties(
  {
    region: 'Esentepe',
    minPrice: 100000,
    maxPrice: 500000,
    isFeatured: true,
    search: 'villa',
  },
  { page: 1, perPage: 20 }
);

console.log(response.data);        // Property[]
console.log(response.pagination);  // PaginationMeta
```

### Fetch Single Property

```typescript
// By slug
const property = await propertiesApi.getPropertyBySlug('luxury-villa-esentepe');

// By ID
const property = await propertiesApi.getPropertyById(16);
```

### Fetch Clients

```typescript
// Get all clients with filters
const response = await clientsApi.getClients(
  {
    status: 'new',
    dateFrom: '2026-01-01',
    search: 'john',
  },
  { page: 1, perPage: 20 }
);

console.log(response.data);        // Client[]
console.log(response.pagination);  // PaginationMeta
```

### Fetch Pipeline Data

```typescript
// Get clients grouped by stage
const pipeline = await clientsApi.getClientsByStage();

console.log(pipeline.Lead);       // Client[]
console.log(pipeline.Qualified);  // Client[]
console.log(pipeline.Meeting);    // Client[]
console.log(pipeline.Offer);      // Client[]
console.log(pipeline.Closed);     // Client[]
console.log(pipeline.Lost);       // Client[]
```

### Fetch CMS Data

```typescript
// Get homepage blocks
const blocks = await cmsApi.getHomepageBlocks();

// Get blocks grouped by type
const grouped = await cmsApi.getHomepageBlocksByType();
console.log(grouped.hero);         // CMSHomepageBlock[]
console.log(grouped.features);     // CMSHomepageBlock[]

// Get global strings
const strings = await cmsApi.getGlobalStrings();

// Get as key-value map
const map = await cmsApi.getGlobalStringsMap();
console.log(map['site_title']);    // { tr: '...', en: '...' }
```

### Save CMS Data (Autosave)

```typescript
// Save homepage block
const success = await cmsApi.saveHomepageBlock({
  id: 1,
  title: 'Updated Title',
  content: 'Updated content',
  active: true,
});

// Update global string
const success = await cmsApi.updateGlobalString(
  'site_title',
  'Başlık',
  'Title',
  'general'
);
```

### Update Lead Status (Phase 1.5)

```typescript
// Update lead status
try {
  await clientsApi.updateLeadStatus(1, 'qualified');
  console.log('Status updated');
} catch (error) {
  if (error.message.includes('not available yet')) {
    alert('⚠️ Backend endpoint not ready (Phase 1.5)');
  }
}
```

---

## 🛡️ Error Handling

All API calls return Promises that may reject with an `AppError`:

```typescript
interface AppError {
  message: string;      // Human-readable error message
  code?: string;        // Error code (e.g., 'NETWORK_ERROR')
  statusCode?: number;  // HTTP status code (e.g., 404, 500)
  details?: any;        // Additional error details
}
```

### Example Error Handling

```typescript
try {
  const properties = await propertiesApi.getProperties();
  setProperties(properties.data);
} catch (error) {
  console.error('Failed to load properties:', error);
  
  if (error.statusCode === 401) {
    // User not authenticated - already redirected to login
  } else if (error.code === 'NETWORK_ERROR') {
    setError('Network error - please check your connection');
  } else {
    setError(error.message || 'Failed to load properties');
  }
}
```

---

## 📊 Data Models

### Property

```typescript
interface Property {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  location: string;
  region: string;
  price: number;
  bedsRoomCount: number;
  bathsCount: number;
  area: number;
  plotArea: number;
  reference: string;
  image: string;
  gallery: PropertyImage[];
  propertyType: string;
  status: string;
  description: string;
  isFeatured: boolean;
  featuresInterior: string[];
  featuresExterior: string[];
  // ... 30+ more fields
}
```

### Client

```typescript
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: number | null;
  status: LeadStatus;      // 'new' | 'contacted' | 'qualified' | ...
  stage: LeadStage;        // 'Lead' | 'Qualified' | 'Meeting' | ...
  source: LeadSource;      // 'website' | 'referral' | ...
  createdAt: string;
}
```

### CMS Homepage Block

```typescript
interface CMSHomepageBlock {
  id: number;
  blockType: BlockType;    // 'hero' | 'feature' | 'testimonial' | 'cta'
  title: string;
  subtitle: string | null;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  displayOrder: number;
  active: boolean;
}
```

### CMS Global String

```typescript
interface CMSGlobalString {
  id: number;
  contentKey: string;
  valueTr: string;
  valueEn: string;
  section: string;
}
```

---

## 🔄 Adapter Pipeline

Data flows through adapters automatically:

```
Backend Response (Horizon format - snake_case, Turkish)
    ↓
HTTP Client (adds auth, handles errors)
    ↓
API Layer (propertiesApi, clientsApi, cmsApi)
    ↓
Adapter (propertyAdapter, clientAdapter, cmsAdapter)
    ↓
UI Component (clean, normalized, camelCase, English)
```

**You never need to call adapters directly** - they're used internally by API services.

---

## 🔑 Authentication

### Login

```typescript
const response = await authApi.login('admin@example.com', 'password');
console.log(response.token);  // JWT token (stored in localStorage)
```

### Logout

```typescript
authApi.logout();  // Clears token and redirects to login
```

### Check Auth Status

```typescript
if (authApi.isAuthenticated()) {
  // User is logged in
}
```

### Get Token

```typescript
const token = authApi.getToken();
```

**Note:** Token is automatically added to all API requests via HTTP interceptor.

---

## 🚫 Phase 1 Limitations

### NOT IMPLEMENTED (will throw errors):

**Properties:**
- `createProperty()` - throws error
- `updateProperty()` - throws error
- `deleteProperty()` - throws error
- `uploadImage()` - throws error

**Clients:**
- `createClient()` - throws error
- `deleteClient()` - throws error
- `updateLeadStatus()` - throws error if backend endpoint missing

**CMS:**
- `deleteHomepageBlock()` - throws error

### Phase 1.5 (Partial):
- `updateLeadStatus()` - works if backend endpoint exists

### Phase 2+ (Future):
- Full CRUD for all entities
- Image upload
- Bulk operations
- Advanced filtering

---

## 🧪 Testing in Browser Console

Open browser console and test services:

```javascript
// Import services (if using ES modules)
import { propertiesApi, clientsApi, cmsApi } from './services';

// Fetch properties
propertiesApi.getProperties().then(console.log);

// Fetch clients
clientsApi.getClients().then(console.log);

// Fetch CMS data
cmsApi.getHomepageBlocks().then(console.log);
cmsApi.getGlobalStrings().then(console.log);
```

---

## 🐛 Debugging

### Enable Debug Logs

Debug logs are automatically enabled in development mode:

```
[HTTP] GET /api/properties
[HTTP] Response from /api/properties [...]
```

### Check Network Tab

All API calls use base URL: `http://localhost:5001/api`

### Common Issues

**401 Unauthorized:**
- Token expired or invalid
- User not logged in
- Auto-redirects to login

**404 Not Found:**
- API endpoint doesn't exist
- Check backend is running on port 5001

**Network Error:**
- Backend not running
- CORS issues
- Firewall blocking request

**Empty Data:**
- Database is empty
- Check backend logs
- Verify backend returns data

---

## 📝 TypeScript IntelliSense

All services are fully typed. Your IDE will provide:

- ✅ Auto-completion for all API methods
- ✅ Type checking for parameters
- ✅ IntelliSense for response shapes
- ✅ Error detection at compile time

Example:

```typescript
const response = await propertiesApi.getProperties(
  {
    region: 'Esentepe',     // ✅ Valid
    minPrice: 100000,        // ✅ Valid
    invalidField: 'test',    // ❌ TypeScript error
  }
);

response.data[0].title;      // ✅ string
response.data[0].price;      // ✅ number
response.data[0].invalid;    // ❌ TypeScript error
```

---

**END OF QUICK REFERENCE**
