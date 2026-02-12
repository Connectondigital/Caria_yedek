# EstatesOS Phase 1 Integration Checklist

## ✅ COMPLETED: Service Layer Implementation

### Created Files:
- ✅ `domain/types/Common.ts` - Shared types, pagination, errors
- ✅ `domain/types/Property.ts` - Property domain models
- ✅ `domain/types/Client.ts` - Client/Lead domain models
- ✅ `domain/types/CMS.ts` - CMS domain models
- ✅ `services/http.ts` - HTTP client with auth & interceptors
- ✅ `services/adapters/property.adapter.ts` - Property normalization
- ✅ `services/adapters/client.adapter.ts` - Client normalization
- ✅ `services/adapters/cms.adapter.ts` - CMS normalization
- ✅ `services/api/properties.api.ts` - Properties API (READ-ONLY)
- ✅ `services/api/clients.api.ts` - Clients API (READ-ONLY)
- ✅ `services/api/cms.api.ts` - CMS API (READ + AUTOSAVE)
- ✅ `services/api/auth.api.ts` - Authentication API
- ✅ `services/index.ts` - Unified exports

---

## 📋 NEXT: UI Integration Tasks

### PHASE 1.1: CMS OS Integration (Week 1)

#### File: `src/admin/pages/CmsPage.js`

**Current State:** Using mock data  
**Target State:** Use real API with autosave

**Changes Required:**

```jsx
// ADD IMPORTS AT TOP
import { cmsApi } from '../services';
import { useState, useEffect } from 'react';

// REPLACE MOCK DATA WITH:
const [homepageBlocks, setHomepageBlocks] = useState([]);
const [globalStrings, setGlobalStrings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchCmsData() {
    try {
      setLoading(true);
      const [blocks, strings] = await Promise.all([
        cmsApi.getHomepageBlocks(),
        cmsApi.getGlobalStrings(),
      ]);
      setHomepageBlocks(blocks);
      setGlobalStrings(strings);
    } catch (err) {
      setError('Failed to load CMS data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchCmsData();
}, []);

// AUTOSAVE HANDLER
const handleBlockUpdate = async (block) => {
  try {
    const success = await cmsApi.saveHomepageBlock(block);
    if (success) {
      // Show success toast
      console.log('Block saved successfully');
    }
  } catch (err) {
    // Show error toast
    console.error('Failed to save block:', err);
  }
};

const handleStringUpdate = async (contentKey, valueTr, valueEn) => {
  try {
    const success = await cmsApi.updateGlobalString(contentKey, valueTr, valueEn);
    if (success) {
      // Show success toast
      console.log('String saved successfully');
    }
  } catch (err) {
    // Show error toast
    console.error('Failed to save string:', err);
  }
};
```

**UI States to Add:**
- ✅ Loading spinner while fetching
- ✅ Error banner if fetch fails
- ✅ Empty state if no blocks/strings
- ✅ Success toast on autosave
- ✅ Error toast on autosave failure

---

### PHASE 1.2: Property OS Integration (Week 2)

#### File: `src/admin/pages/PropertyPage.js`

**Current State:** Using mock data  
**Target State:** Use real API with filters & pagination

**Changes Required:**

```jsx
// ADD IMPORTS AT TOP
import { propertiesApi } from '../services';
import { useState, useEffect } from 'react';

// REPLACE MOCK DATA WITH:
const [properties, setProperties] = useState([]);
const [pagination, setPagination] = useState({
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
});
const [filters, setFilters] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedProperty, setSelectedProperty] = useState(null);

useEffect(() => {
  async function fetchProperties() {
    try {
      setLoading(true);
      const response = await propertiesApi.getProperties(filters, {
        page: pagination.page,
        perPage: pagination.perPage,
      });
      setProperties(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchProperties();
}, [filters, pagination.page]);

// FILTER HANDLERS
const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
};

// PAGINATION HANDLERS
const handlePageChange = (newPage) => {
  setPagination(prev => ({ ...prev, page: newPage }));
};

// PROPERTY DETAIL DRAWER
const handlePropertyClick = async (propertyId) => {
  try {
    const property = await propertiesApi.getPropertyById(propertyId);
    setSelectedProperty(property);
  } catch (err) {
    console.error('Failed to load property details:', err);
  }
};
```

**UI States to Add:**
- ✅ Loading spinner while fetching
- ✅ Error banner if fetch fails
- ✅ Empty state if no properties
- ✅ Skeleton loaders for property cards
- ✅ Property detail drawer/modal

**Filter UI Components:**
- Search input (title, location, reference)
- Region dropdown
- Property type dropdown
- Price range slider
- Beds dropdown
- Featured toggle

**Pagination UI:**
- Page numbers
- Previous/Next buttons
- Items per page selector
- Total count display

---

### PHASE 1.3: Client OS Integration (Week 2)

#### File: `src/admin/pages/ClientPage.js`

**Current State:** Using mock data  
**Target State:** Use real API with filters & pagination

**Changes Required:**

```jsx
// ADD IMPORTS AT TOP
import { clientsApi } from '../services';
import { useState, useEffect } from 'react';

// REPLACE MOCK DATA WITH:
const [clients, setClients] = useState([]);
const [pagination, setPagination] = useState({
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
});
const [filters, setFilters] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedClient, setSelectedClient] = useState(null);

useEffect(() => {
  async function fetchClients() {
    try {
      setLoading(true);
      const response = await clientsApi.getClients(filters, {
        page: pagination.page,
        perPage: pagination.perPage,
      });
      setClients(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchClients();
}, [filters, pagination.page]);

// CLIENT DETAIL DRAWER
const handleClientClick = async (clientId) => {
  try {
    const client = await clientsApi.getClientById(clientId);
    setSelectedClient(client);
  } catch (err) {
    console.error('Failed to load client details:', err);
  }
};
```

**UI States to Add:**
- ✅ Loading spinner while fetching
- ✅ Error banner if fetch fails
- ✅ Empty state if no clients
- ✅ Client detail drawer/modal

**Filter UI Components:**
- Search input (name, email, phone, message)
- Status dropdown
- Stage dropdown
- Source dropdown
- Date range picker (from/to)

---

### PHASE 1.4: Sales OS Integration (Week 3)

#### File: `src/admin/pages/SalesPage.js`

**Current State:** Using mock data  
**Target State:** Use real API with pipeline view

**Changes Required:**

```jsx
// ADD IMPORTS AT TOP
import { clientsApi } from '../services';
import { useState, useEffect } from 'react';

// REPLACE MOCK DATA WITH:
const [pipelineData, setPipelineData] = useState({
  Lead: [],
  Qualified: [],
  Meeting: [],
  Offer: [],
  Closed: [],
  Lost: [],
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchPipeline() {
    try {
      setLoading(true);
      const data = await clientsApi.getClientsByStage();
      setPipelineData(data);
    } catch (err) {
      setError('Failed to load pipeline');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchPipeline();
}, []);

// LEAD STATUS UPDATE (Phase 1.5 - may not work yet)
const handleStatusUpdate = async (leadId, newStatus) => {
  try {
    await clientsApi.updateLeadStatus(leadId, newStatus);
    // Refresh pipeline
    fetchPipeline();
    // Show success toast
  } catch (err) {
    if (err.message.includes('not available yet')) {
      // Show warning: Backend endpoint not ready
      alert('⚠️ Lead status update requires backend implementation (Phase 1.5)');
    } else {
      console.error('Failed to update lead status:', err);
    }
  }
};
```

**UI States to Add:**
- ✅ Loading spinner while fetching
- ✅ Error banner if fetch fails
- ✅ Empty state for each pipeline stage
- ✅ Drag-and-drop UI (visual only for now)
- ✅ Phase 1.5 warning modal/toast

---

## 🔧 PHASE 1.5: Backend Enhancement

### Required Backend Changes:

#### File: `backend/server.py`

**Add New Endpoint:**

```python
@api_router.patch("/inquiries/{id}")
async def update_inquiry_status(
    id: int,
    status: str,
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Update inquiry status for Sales OS pipeline
    Phase 1.5 enhancement
    """
    cursor = db.cursor()
    cursor.execute(
        "UPDATE inquiries SET status = ? WHERE id = ?",
        (status, id)
    )
    db.commit()
    return {"status": "success", "id": id}
```

**Test Status Update:**
```bash
curl -X PATCH http://localhost:5001/api/inquiries/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "qualified"}'
```

---

## 🧪 TESTING CHECKLIST

### Unit Tests (Optional for Phase 1):
- [ ] Adapter transformations (Horizon → EstatesOS)
- [ ] Filter functions
- [ ] Pagination helpers

### Integration Tests:
- [ ] Backend server running on port 5001
- [ ] Frontend running on port 3000/3001
- [ ] Auth token flow works
- [ ] CMS data loads correctly
- [ ] Properties load with filters
- [ ] Clients load with filters
- [ ] Pipeline view displays correctly

### Manual Testing:
- [ ] Open EstatesOS at `/connect-admin`
- [ ] Navigate to CMS OS → verify homepage blocks display
- [ ] Edit global string → verify autosave works
- [ ] Navigate to Property OS → verify property list displays
- [ ] Apply filters → verify filtering works
- [ ] Change page → verify pagination works
- [ ] Click property → verify detail drawer opens
- [ ] Navigate to Client OS → verify client list displays
- [ ] Apply filters → verify filtering works
- [ ] Navigate to Sales OS → verify pipeline displays
- [ ] Try status update → verify Phase 1.5 warning shows
- [ ] Open Horizon Admin → verify still works (no breaking changes)

### Error Testing:
- [ ] Stop backend → verify error banners show
- [ ] Invalid token → verify redirect to login
- [ ] Network timeout → verify error handling
- [ ] Empty data → verify empty states display

---

## 📊 SUCCESS CRITERIA

### Phase 1 Complete When:
1. ✅ CMS OS displays real homepage blocks from `/api/cms/homepage`
2. ✅ CMS OS displays real global strings from `/api/cms/content`
3. ✅ CMS OS autosave works for homepage blocks
4. ✅ CMS OS autosave works for global strings
5. ✅ Property OS displays real properties from `/api/properties`
6. ✅ Property OS filters work (client-side)
7. ✅ Property OS pagination works (client-side)
8. ✅ Property OS detail drawer shows full property data
9. ✅ Client OS displays real inquiries from `/api/inquiries`
10. ✅ Client OS filters work (client-side)
11. ✅ Sales OS displays pipeline with real data
12. ✅ All loading states work correctly
13. ✅ All error states work correctly
14. ✅ All empty states work correctly
15. ✅ Horizon Admin still works (no breaking changes)

### Phase 1.5 Complete When:
16. ✅ Backend endpoint `PATCH /api/inquiries/:id` implemented
17. ✅ Lead status updates work from Sales OS
18. ✅ Pipeline view reflects status changes immediately

---

## 🚀 DEPLOYMENT NOTES

### Environment Variables:
Create `.env` in `frontend/` directory:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

For production:
```env
REACT_APP_API_URL=https://your-domain.com/api
```

### Build for Production:
```bash
cd frontend
npm run build
```

The build will include all TypeScript compiled to JavaScript.

### TypeScript Compilation:
If TypeScript is not configured yet, add to `package.json`:
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0"
  }
}
```

Then install:
```bash
cd frontend
npm install
```

---

## 📝 NOTES

### Phase 1 Limitations:
- No property creation/update/delete
- No client creation/delete
- No image uploads
- No full CRUD operations
- Status update requires Phase 1.5

### Data Flow:
```
Backend (Horizon Format)
    ↓
HTTP Client (auth, errors)
    ↓
API Layer (fetch data)
    ↓
Adapters (normalize to EstatesOS)
    ↓
UI Components (consume normalized data)
```

### Adapter Benefits:
- Backend never changes
- UI gets clean, predictable data
- Easy to add new fields later
- Easy to migrate to new backend in future

### Coexistence Strategy:
- Both Horizon and EstatesOS use same backend
- Both use same auth token
- Both can run simultaneously
- Zero backend breaking changes
- Gradual feature migration

---

**END OF PHASE 1 INTEGRATION CHECKLIST**
