# EstatesOS API Inventory & Adapter Architecture

## PART 1: HORIZON API INVENTORY

### Backend Base Configuration
- **Base URL:** `/api`
- **Auth:** Bearer token (stored in `localStorage`)
- **DB:** SQLite (`caria.db`)
- **Backend:** FastAPI (Python)

---

### 1. PROPERTIES API

#### 1.1 List Properties
- **Name:** `properties.list`
- **Method:** `GET`
- **Path:** `/api/properties`
- **Query Params:** None (returns all)
- **Response Shape:**
```json
[
  {
    "id": 16,
    "slug": "luxury-villa-esentepe",
    "title": "Luxury new project...",
    "location": "Esentepe",
    "price": "397950",
    "beds": 0,
    "baths": 0,
    "area": "",
    "plotSize": "",
    "reference": "",
    "image": "/static/uploads/...",
    "tag": "",
    "region": "Kyrenia",
    "kocan_tipi": "Eşdeğer",
    "ozellikler_ic": "[\"Balkon\",\"Parke\"]",
    "ozellikler_dis": "[\"Bahçe\",\"Çift Cam\"]",
    "ozellikler_konum": "[\"Deniz Manzarası\"]",
    "pdf_brosur": "",
    "advisor_id": 2,
    "advisor_name": "Hakan Okur",
    "advisor_portrait": "hakan-okur.png",
    "advisor_slug": "hakan-okur",
    "advisor": {...},
    "status": "Satılık Emlak",
    "description": "...",
    "description_en": "...",
    "beds_room_count": "3+1",
    "baths_count": 2,
    "plot_area": "356",
    "closed_area": "102",
    "is_featured": 1,
    "is_featured_slider": 0,
    "balcony": "1",
    "distance_sea": "",
    "distance_center": "",
    "distance_airport": "",
    "distance_hospital": null,
    "distance_school": null,
    "gallery": "[{\"url\":\"...\",\"category\":\"Genel\",\"id\":\"...\"}]",
    "property_type": "Villa",
    "is_furnished": "Beyaz Eşyalı",
    "floor_level": "1",
    "site_within": "Hayır",
    "title_en": "...",
    "building_age": "0",
    "featured_image": "/static/uploads/...",
    "full_address": null,
    "neighborhood": null,
    "city": null,
    "country_name": null,
    "latitude": null,
    "longitude": null
  }
]
```
- **Used By:** Horizon Admin (Properties table), EstatesOS (Property OS)
- **Pagination:** None (client-side)
- **Filters:** None (client-side)

#### 1.2 Get Property by Slug
- **Name:** `properties.detail`
- **Method:** `GET`
- **Path:** `/api/properties/{slug}`
- **Response:** Single property object (same shape as list item)
- **Used By:** Horizon (Property edit form), EstatesOS (Property detail drawer)

#### 1.3 Create/Update Property
- **Name:** `properties.save`
- **Method:** `POST`
- **Path:** `/api/properties`
- **Body:** Property object (with or without `id`)
- **Response:** `{"status": "success", "id": 123}`
- **Used By:** Horizon (Property form)

#### 1.4 Delete Property
- **Name:** `properties.delete`
- **Method:** `DELETE`
- **Path:** `/api/properties/{id}`
- **Response:** `{"status": "success"}`
- **Used By:** Horizon (Property table actions)

#### 1.5 Upload Image
- **Name:** `properties.uploadImage`
- **Method:** `POST`
- **Path:** `/api/upload`
- **Body:** `FormData` with `file`
- **Response:** `{"url": "/static/uploads/..."}`
- **Used By:** Horizon (Property form image upload)

---

### 2. INQUIRIES (CLIENTS/LEADS) API

#### 2.1 List Inquiries
- **Name:** `inquiries.list`
- **Method:** `GET`
- **Path:** `/api/inquiries`
- **Query Params:** None
- **Response Shape:**
```json
[
  {
    "id": 1,
    "name": "Final Test Agent",
    "email": "test@agent.com",
    "phone": "999999",
    "message": "Integration is successful!",
    "property_id": null,
    "status": "new",
    "created_at": "2026-01-14 19:59:52"
  }
]
```
- **Used By:** Horizon (Inquiries table), EstatesOS (Client OS + Sales OS)
- **Status Values:** `new`, `contacted`, `qualified`, `scheduled`, `closed`

#### 2.2 Create Inquiry
- **Name:** `inquiries.create`
- **Method:** `POST`
- **Path:** `/api/inquiries`
- **Body:** `{name, email, phone, message, property_id?}`
- **Response:** `{"status": "success"}`
- **Used By:** Public website contact forms

#### 2.3 Delete Inquiry
- **Name:** `inquiries.delete`
- **Method:** `DELETE`
- **Path:** `/api/inquiries/{id}`
- **Response:** `{"status": "success"}`
- **Used By:** Horizon (Inquiries table)

#### 2.4 Update Inquiry Status ⚠️ MISSING (Phase 1.5)
- **Name:** `inquiries.updateStatus`
- **Method:** `PATCH`
- **Path:** `/api/inquiries/{id}`
- **Body:** `{status: "contacted"}`
- **Response:** `{"status": "success"}`
- **Used By:** EstatesOS (Sales OS pipeline)
- **⚠️ Status:** NOT IMPLEMENTED YET

---

### 3. CMS API

#### 3.1 Get Homepage Blocks
- **Name:** `cms.homepage.list`
- **Method:** `GET`
- **Path:** `/api/cms/homepage` or `/api/homepage/blocks`
- **Response Shape:**
```json
[
  {
    "id": 1,
    "block_type": "hero",
    "title": "Welcome to Caria Estates",
    "subtitle": "Luxury Real Estate",
    "content": "...",
    "image_url": "/static/uploads/...",
    "video_url": null,
    "display_order": 1,
    "active": 1,
    "created_at": "...",
    "updated_at": "..."
  }
]
```
- **Used By:** Horizon (Blocks manager), EstatesOS (CMS OS)
- **Block Types:** `hero`, `feature`, `testimonial`, `cta`

#### 3.2 Save Homepage Block
- **Name:** `cms.homepage.save`
- **Method:** `POST`
- **Path:** `/api/cms/homepage`
- **Body:** Block object (with or without `id`)
- **Response:** `{"status": "success", "id": 123}`

#### 3.3 Delete Homepage Block
- **Name:** `cms.homepage.delete`
- **Method:** `DELETE`
- **Path:** `/api/cms/homepage/{id}`
- **Response:** `{"status": "success"}`

#### 3.4 Get Global Strings
- **Name:** `cms.content.list`
- **Method:** `GET`
- **Path:** `/api/cms/content`
- **Response Shape:**
```json
[
  {
    "id": 1,
    "content_key": "site_title",
    "value_tr": "Caria Estates",
    "value_en": "Caria Estates",
    "section": "header",
    "updated_at": "..."
  }
]
```
- **Used By:** Horizon (Content manager), EstatesOS (CMS OS Global Strings)

#### 3.5 Update Global Strings
- **Name:** `cms.content.update`
- **Method:** `POST`
- **Path:** `/api/cms/update`
- **Body:** Array of content objects
- **Response:** `{"status": "success"}`

#### 3.6 Get Sliders
- **Name:** `cms.sliders.list`
- **Method:** `GET`
- **Path:** `/api/cms/sliders`
- **Response:** Array of slider objects

#### 3.7 Get Pages
- **Name:** `cms.pages.list`
- **Method:** `GET`
- **Path:** `/api/cms/pages`
- **Response:** Array of page objects

#### 3.8 Get Features
- **Name:** `cms.features.list`
- **Method:** `GET`
- **Path:** `/api/cms/features`
- **Response:** Array of feature objects

---

### 4. ADVISORS API

#### 4.1 List Advisors
- **Name:** `advisors.list`
- **Method:** `GET`
- **Path:** `/api/advisors`
- **Response:** Static array (Phase 1) or DB-backed (Phase 2)
- **Used By:** Horizon (Advisors selector), EstatesOS (Agent assignment)

#### 4.2 Get Advisor by Slug
- **Name:** `advisors.detail`
- **Method:** `GET`
- **Path:** `/api/advisors/{slug}`
- **Response:** Advisor object with listings array

---

## PART 2: ESTATESOS DOMAIN MODELS

### 2.1 Property Model
```typescript
interface Property {
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
  propertyType: 'Villa' | 'Apartment' | 'Land' | 'Commercial';
  status: 'available' | 'reserved' | 'sold' | 'draft';
  
  // Pricing
  price: number;
  currency: 'GBP' | 'USD' | 'EUR' | 'TRY';
  
  // Measurements
  bedsRoomCount: string; // e.g. "3+1"
  bathsCount: number;
  plotArea: number | null;
  closedArea: number | null;
  balconyCount: number | null;
  
  // Features
  featuresInterior: string[]; // Parsed from JSON
  featuresExterior: string[]; // Parsed from JSON
  featuresLocation: string[]; // Parsed from JSON
  isFurnished: 'Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'White Goods';
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

interface GalleryImage {
  id: string;
  url: string;
  category: string;
}
```

### 2.2 Client/Lead Model
```typescript
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // EstatesOS mapping
  clientName: string; // = name
  contactEmail: string; // = email
  contactPhone: string; // = phone
  notes: string; // = message
  
  // Status pipeline
  status: 'new' | 'contacted' | 'qualified' | 'scheduled' | 'negotiating' | 'closed' | 'lost';
  
  // Linked property
  linkedPropertyId: number | null;
  linkedPropertyTitle: string | null;
  
  // Dates
  createdAt: string;
  lastContactedAt: string | null;
  closedAt: string | null;
  
  // EstatesOS-specific
  stage: 'Lead' | 'Qualified' | 'Meeting' | 'Offer' | 'Closed' | 'Lost';
  dealValue: number | null;
  source: 'Website' | 'Referral' | 'Direct' | 'Campaign' | 'Unknown';
  tags: string[];
  assignedTo: string | null;
}
```

### 2.3 CMS Models
```typescript
interface CMSHomepageBlock {
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

interface CMSGlobalString {
  id: number;
  contentKey: string;
  valueTr: string;
  valueEn: string;
  section: string;
}

interface CMSPage {
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
```

---

## PART 3: ADAPTER MAPPING TABLES

### 3.1 Property Adapter Mapping

| Horizon Field | EstatesOS Field | Transform | Default | Notes |
|---------------|-----------------|-----------|---------|-------|
| `id` | `id` | direct | - | Primary key |
| `slug` | `slug` | direct | - | URL-safe identifier |
| `reference` | `reference` | direct | `""` | Property reference number |
| `title` | `title` | direct | `"Untitled Property"` | Main title |
| `title_en` | `titleEn` | direct | `null` | English title |
| `description` | `description` | direct | `""` | Turkish description |
| `description_en` | `descriptionEn` | direct | `null` | English description |
| `location` | `location` | direct | `"N/A"` | City/town |
| `region` | `region` | direct | `"N/A"` | Region name |
| `property_type` | `propertyType` | direct | `"Apartment"` | Type enum |
| `status` | `status` | map | `"available"` | `"Satılık Emlak"` → `"available"` |
| `price` | `price` | parseFloat | `0` | Numeric price |
| - | `currency` | static | `"GBP"` | Always GBP for now |
| `beds_room_count` | `bedsRoomCount` | direct | `"0+0"` | e.g. "3+1" |
| `baths_count` | `bathsCount` | parseInt | `0` | Number of bathrooms |
| `plot_area` | `plotArea` | parseFloat | `null` | Plot size in m² |
| `closed_area` | `closedArea` | parseFloat | `null` | Closed area in m² |
| `balcony` | `balconyCount` | parseInt | `0` | Number of balconies |
| `ozellikler_ic` | `featuresInterior` | JSON.parse | `[]` | Interior features array |
| `ozellikler_dis` | `featuresExterior` | JSON.parse | `[]` | Exterior features array |
| `ozellikler_konum` | `featuresLocation` | JSON.parse | `[]` | Location features array |
| `is_furnished` | `isFurnished` | direct | `"Unfurnished"` | Furnishing status |
| `floor_level` | `floorLevel` | direct | `"0"` | Floor number |
| `building_age` | `buildingAge` | parseInt | `0` | Age in years |
| `site_within` | `siteWithin` | boolean | `false` | `"Evet"` → `true` |
| `image` | `coverImage` | imageUrl | `"/placeholder.png"` | Main thumbnail |
| `featured_image` | `featuredImage` | imageUrl | `coverImage` | Featured display |
| `gallery` | `gallery` | JSON.parse + map | `[]` | Array of gallery objects |
| `pdf_brosur` | `pdfBrochure` | direct | `null` | PDF URL |
| `full_address` | `fullAddress` | direct | `null` | Full address |
| `neighborhood` | `neighborhood` | direct | `null` | Neighborhood |
| `city` | `city` | direct | `null` | City |
| `country_name` | `countryName` | direct | `null` | Country |
| `latitude` | `latitude` | parseFloat | `null` | GPS lat |
| `longitude` | `longitude` | parseFloat | `null` | GPS lng |
| `distance_sea` | `distanceSea` | direct | `null` | Distance to sea |
| `distance_center` | `distanceCenter` | direct | `null` | Distance to center |
| `distance_airport` | `distanceAirport` | direct | `null` | Distance to airport |
| `distance_hospital` | `distanceHospital` | direct | `null` | Distance to hospital |
| `distance_school` | `distanceSchool` | direct | `null` | Distance to school |
| `advisor_id` | `advisorId` | direct | `null` | Agent ID |
| `advisor_name` | `advisorName` | direct | `"Unassigned"` | Agent name |
| `advisor_slug` | `advisorSlug` | direct | `null` | Agent slug |
| `advisor_portrait` | `advisorPortrait` | imageUrl | `null` | Agent image |
| `is_featured` | `isFeatured` | boolean | `false` | `1` → `true` |
| `is_featured_slider` | `isFeaturedSlider` | boolean | `false` | `1` → `true` |
| `tag` | `tag` | direct | `null` | Property tag |
| - | `roiPct` | compute | `0` | Computed ROI |
| - | `rentYield` | compute | `0` | Computed yield |
| - | `viewCount` | static | `0` | Phase 2 |
| - | `inquiryCount` | static | `0` | Phase 2 |

### 3.2 Client/Lead Adapter Mapping

| Horizon Field | EstatesOS Field | Transform | Default | Notes |
|---------------|-----------------|-----------|---------|-------|
| `id` | `id` | direct | - | Primary key |
| `name` | `name` | direct | `"Unknown"` | Full name |
| `name` | `clientName` | direct | `"Unknown"` | Alias for UI |
| `email` | `email` | direct | `""` | Email address |
| `email` | `contactEmail` | direct | `""` | Alias for UI |
| `phone` | `phone` | direct | `""` | Phone number |
| `phone` | `contactPhone` | direct | `""` | Alias for UI |
| `message` | `message` | direct | `""` | Original message |
| `message` | `notes` | direct | `""` | Alias for notes |
| `status` | `status` | direct | `"new"` | Pipeline status |
| `status` | `stage` | map | `"Lead"` | UI-friendly stage |
| `property_id` | `linkedPropertyId` | direct | `null` | Linked property |
| - | `linkedPropertyTitle` | lookup | `null` | Resolve from property |
| `created_at` | `createdAt` | datetime | - | ISO format |
| - | `lastContactedAt` | static | `null` | Phase 1.5 |
| - | `closedAt` | static | `null` | Phase 1.5 |
| - | `dealValue` | static | `null` | Phase 2 |
| - | `source` | infer | `"Website"` | Default to website |
| - | `tags` | static | `[]` | Phase 2 |
| - | `assignedTo` | static | `null` | Phase 2 |

**Status → Stage Mapping:**
```typescript
const statusToStage = {
  'new': 'Lead',
  'contacted': 'Qualified',
  'qualified': 'Qualified',
  'scheduled': 'Meeting',
  'negotiating': 'Offer',
  'closed': 'Closed',
  'lost': 'Lost'
};
```

### 3.3 CMS Homepage Block Adapter Mapping

| Horizon Field | EstatesOS Field | Transform | Default |
|---------------|-----------------|-----------|---------|
| `id` | `id` | direct | - |
| `block_type` | `blockType` | direct | `"feature"` |
| `title` | `title` | direct | `""` |
| `subtitle` | `subtitle` | direct | `null` |
| `content` | `content` | direct | `null` |
| `image_url` | `imageUrl` | imageUrl | `null` |
| `video_url` | `videoUrl` | direct | `null` |
| `display_order` | `displayOrder` | parseInt | `0` |
| `active` | `active` | boolean | `true` |

### 3.4 CMS Global String Adapter Mapping

| Horizon Field | EstatesOS Field | Transform | Default |
|---------------|-----------------|-----------|---------|
| `id` | `id` | direct | - |
| `content_key` | `contentKey` | direct | - |
| `value_tr` | `valueTr` | direct | `""` |
| `value_en` | `valueEn` | direct | `""` |
| `section` | `section` | direct | `"general"` |

---

## PART 4: ERROR & EMPTY STATES

### 4.1 Error Handling Strategy
```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Centralized error handler
function handleApiError(error: any): ApiError {
  if (error.response) {
    // Backend returned error
    return {
      message: error.response.data?.detail || error.response.data?.message || 'An error occurred',
      status: error.response.status,
      code: error.response.data?.code,
      details: error.response.data
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Unknown error
    return {
      message: error.message || 'Unknown error occurred',
      status: -1
    };
  }
}
```

### 4.2 Empty State Patterns
```typescript
// Properties empty
{
  isEmpty: properties.length === 0,
  message: "No properties found",
  action: "Add your first property",
  icon: "BuildingIcon"
}

// Clients empty
{
  isEmpty: clients.length === 0,
  message: "No inquiries yet",
  action: "Waiting for leads",
  icon: "UsersIcon"
}

// CMS empty
{
  isEmpty: blocks.length === 0,
  message: "No homepage blocks configured",
  action: "Add your first block",
  icon: "LayoutIcon"
}
```

### 4.3 Loading States
```typescript
interface LoadingState {
  isLoading: boolean;
  progress?: number; // 0-100
  message?: string;
}

// Example usage
const [propertyState, setPropertyState] = useState<LoadingState>({
  isLoading: true,
  message: "Loading properties..."
});
```

---

## PART 5: PAGINATION & FILTERING

### 5.1 Client-Side Pagination (Phase 1)
Since backend doesn't support pagination, implement client-side:

```typescript
interface PaginationParams {
  page: number;
  perPage: number;
  total: number;
}

function paginateClientSide<T>(
  data: T[],
  page: number,
  perPage: number
): { data: T[]; pagination: PaginationParams } {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: data.slice(start, end),
    pagination: {
      page,
      perPage,
      total: data.length
    }
  };
}
```

### 5.2 Client-Side Filtering (Phase 1)
```typescript
interface PropertyFilters {
  status?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  beds?: string;
  isFeatured?: boolean;
  search?: string;
}

function filterProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
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
        prop.region.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
}
```

### 5.3 Server-Side Pagination (Phase 1.5+)
Backend enhancement proposal:
```python
@api_router.get("/properties")
async def get_properties(
    page: int = 1,
    per_page: int = 20,
    status: str = None,
    region: str = None,
    min_price: float = None,
    max_price: float = None,
    is_featured: bool = None,
    search: str = None,
    db: sqlite3.Connection = Depends(get_db)
):
    # Build query with filters
    # Return paginated response
    pass
```

---

## NEXT SECTION: Continue to API_IMPLEMENTATION.md for file structure and code
