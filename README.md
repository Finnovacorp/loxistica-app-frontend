# Loxistica — React SPA (v2.1)

A mobile-responsive React single-page application for Loxistica field operations. Connects directly to the ERPNext backend via OAuth 2.0 and the v2.1 API endpoints. No backend server required — pure static React.

---

## Tech Stack

| Layer   | Technology                           |
| ------- | ------------------------------------ |
| UI      | React 19.2.8 + React Router 7        |
| Bundler | Vite 8                               |
| Auth    | OAuth 2.0 Authorization Code         |
| API     | Fetch API (direct to ERPNext)        |
| Styling | CSS custom properties (no framework) |
| Fonts   | IBM Plex Mono + IBM Plex Sans        |

---

## Project Structure

```
src/
├── main.jsx                    # Entry point, router, route guards
├── index.css                   # Global CSS variables (#005835 theme)
├── lib/
│   ├── config.js               # ERP base URL + all 7 endpoint URLs
│   ├── auth.js                 # OAuth helpers (redirect, exchange, refresh, revoke)
│   └── api.js                  # Fetch wrapper with auto token refresh + Frappe error parsing
├── hooks/
│   ├── useAuth.js              # Auth context: user, login, logout, isOpsManager
│   └── useApi.js               # Data-fetching hooks: useApi, useSubmit
├── components/
│   ├── AppLayout.jsx           # Nav bar + tab bar shell
│   └── UI.jsx                  # All shared components (StatusBadge, TaskCard, Modal, etc.)
└── pages/
    ├── auth/
    │   ├── Login.jsx           # Login page with ERP sign-in button
    │   └── Callback.jsx        # OAuth callback handler
    ├── tasks/
    │   ├── TaskList.jsx        # My Tasks with status filter pills
    │   └── TaskDetail.jsx      # Task detail + Start/Complete/Block/Unblock
    └── operations/
        ├── Dashboard.jsx       # Stats + blocked tasks list
        ├── OrderTasks.jsx      # Search tasks by order ID
        ├── GenerateTasks.jsx   # Generate tasks from template
        └── AssignTask.jsx      # Assign task to employee
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_ERP_BASE_URL=https://erp.loxng.com
VITE_OAUTH_CLIENT_ID=your_client_id_here
```

### 3. Register the OAuth callback URI in ERPNext

In ERPNext (as System Manager):

- **Setup → Integrations → OAuth Client → your app → Redirect URIs**
- Add: `http://localhost:3000/auth/callback`

For production, add your production domain instead.

### 4. Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

### 5. Build for production

```bash
npm run build
# Output in dist/
```

Deploy the `dist/` folder to any static host (Nginx, Vercel, Netlify, etc.).

---

## OAuth Flow

```
User clicks "Sign in with ERP"
  → window.location.href → ERPNext /authorize (full browser redirect, no CORS)
    → User logs in on ERPNext
      → ERPNext redirects to /auth/callback?code=...&state=...
        → React Callback.jsx: validates state, exchanges code for tokens (POST)
          → Fetches OpenID profile, checks roles
            → Stores tokens in sessionStorage
              → Navigates to /tasks or /operations/dashboard
```

Token refresh happens automatically inside `src/lib/api.js` on every 401 response.

---

## API Endpoints (v2.1)

| #   | Endpoint                   | Role        |
| --- | -------------------------- | ----------- |
| 4.1 | `get_my_tasks`             | Field Staff |
| 4.2 | `get_task_detail`          | Field Staff |
| 4.3 | `update_task_status`       | Field Staff |
| 4.4 | `get_order_tasks`          | Ops Manager |
| 4.5 | `generate_tasks`           | Ops Manager |
| 4.6 | `assign_task`              | Ops Manager |
| 4.7 | `get_operations_dashboard` | Ops Manager |

### Task lifecycle (v2.1)

```
Pending → In Progress → Completed  (terminal)
               ↕
            Blocked
```

---

## Route Guards

| Route                  | Guard                                            |
| ---------------------- | ------------------------------------------------ |
| `/`                    | Redirects authenticated users to their home view |
| `/auth/callback`       | Public — handles OAuth redirect                  |
| `/tasks`, `/tasks/:id` | `RequireAuth` — any logged-in user               |
| `/operations/*`        | `RequireOps` — Operations Manager role only      |

---

## Production Deployment

```bash
npm run build
```

**Nginx example** (SPA fallback required for React Router):

```nginx
server {
    root /var/www/loxistica/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Update `VITE_REDIRECT_URI` (or the ERPNext OAuth Client Redirect URIs) to match your production domain.
