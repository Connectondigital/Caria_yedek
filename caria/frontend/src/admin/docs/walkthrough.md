# Admin Global Features Walkthrough

I have implemented the core global management features for the Caria Admin panel. This update introduces global search, a centralized notification system, and a comprehensive activity timeline.

## Feature Overview

### 1. Admin Top Bar & Global Search
- **Always Visible**: The top bar is now present across all admin routes.
- **Predictive Search**: Start typing anywhere in the search bar to find Customers, Leads, or Properties.
- **Instant Jump**: Clicking a search result will navigate you to the correct page and automatically open the entry's detail drawer or preview.

### 2. User & Role System (v1.2)
- **Unified Login**: A premium login page at `/login` supports mock user selection and role-based redirection.
- **Role Hierarchy**: 
  - **Admin**: Full access to all systems, including user management.
  - **Manager**: Access to all systems, but can only view users (cannot add/edit/deactivate).
  - **Advisor**: Access to a dedicated Advisor Panel with filtered personal leads/clients.
- **Google Integration (Simulation)**: Users can "link" their Google accounts in the User Drawer or Advisor settings to simulate OAuth flow.

### 3. Advisor Hub
- **Focused View**: Advisors see a simplified dashboard with only their own data.
- **Personal Pipeline**: A dedicated Kanban board for the signed-in advisor's leads.
- **Personal Clients**: A focused list of clients assigned to the advisor.

### 4. Notification Center & Activity Center
- **Bell Icon**: Shows an unread count badge.
- **Logged Events**: Everything from lead dragging to Google linking is logged globally and in real-time.

## Testing Instructions

### Auth & Role Gating
1. Visit `http://localhost:3000/login`.
2. Select **Baran Gökmen (ADMIN)** -> Sign In.
3. Observe access to **Kullanıcılar** in the sidebar.
4. Logout (Top Right) -> Select **Ece Temel (MANAGER)**.
5. Visit **Kullanıcılar** -> Buttons should be disabled with a tooltip/info text.
6. Logout -> Select **Buse Aydın (ADVISOR)**.
7. **Expected**: Redirect to `/advisor#pipeline`. Sidebar is smaller and focused only on Pipeline and Clients.

### Google Link Simulation
1. Login as Admin.
2. Go to **Kullanıcılar** (Users).
3. Click "Edit" on any user.
4. Click the **Google Bağla** (Link) button.
5. **Expected**: Icon turns green/active. Check **Aktivite Merkezi** to see the "Google Bağlantısı" event logged.

### Advisor Pipeline
1. Login as an Advisor (e.g., Buse).
2. Drag a lead card to another column.
3. Observe the change and the activity log entry generated for your specific action.
