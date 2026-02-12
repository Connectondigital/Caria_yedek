# Backend Contract Pack (Admin System)

This document outlines the suggested data structure and API contracts required to connect the high-fidelity admin frontend to a live backend.

## Core Entities

### 1. Lead (Sales CRM)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `name` | String | Lead full name |
| `budget` | Decimal | Total budget amount |
| `currency` | Enum | TL, GBP, EUR |
| `location` | String | Target area (e.g., Bodrum) |
| `intent` | Enum | VIP, SICAK, GECİKMİŞ, SOĞUK |
| `status` | Enum | new, interested, first_contact, negotiation, closed, lost |
| `consultant` | String | Assigned advisor name |
| `lastActivity` | Timestamp | Date of last interaction |

### 2. Client (Customer Management)
*Follows Lead structure +*
| Field | Type | Description |
| :--- | :--- | :--- |
| `tag` | Enum | VIP, SICAK, GECİKMİŞ |
| `notes` | Array[Note] | Related customer notes |
| `offers` | Array[Offer] | Property offers sent |

### 3. Property (Portfolio)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `title` | String | Listing name |
| `region` | String | Searchable region |
| `price` | Decimal | Sales price |
| `featured` | Boolean | Whether it appears on the showcase |

## Suggested API Endpoints

### Leads / CRM
- `GET /api/leads` - List all leads with filtering.
- `PATCH /api/leads/:id/status` - Move lead between pipeline stages.
- `POST /api/leads/:id/notes` - Add a log/note to a lead.

### Global Store (Activities & Notifications)
- `GET /api/activities` - Fetch global timeline.
- `POST /api/activities` - Create a log entry (System/User triggered).
- `GET /api/notifications` - Fetch unread alerts for current user.
- `PATCH /api/notifications/read-all` - Mark notifications as read.

## Response Examples (JSON)

### Activity Item
```json
{
  "id": 12345,
  "type": "lead",
  "title": "Lead Aşaması Değişti",
  "description": "Ahmet Yılmaz 'Pazarlık' aşamasına taşındı.",
  "time": "2026-01-26T21:00:00Z",
  "entity": "Sales CRM"
}
```
