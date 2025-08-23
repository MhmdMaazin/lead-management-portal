## Lead Management Portal – Full Documentation

### Overview
The Lead Management Portal is a Next.js 14 application with a MongoDB-backed API for managing building project leads. It includes:
- A front‑of‑house leads explorer with filtering, favorites, and prospecting tools.
- An admin dashboard for CRUD management of leads.
- A single dynamic API route that implements multiple REST endpoints.

### Tech Stack
- Next.js 14 (App Router)
- React 18
- MongoDB (official Node driver)
- Tailwind CSS + tailwindcss-animate
- Radix UI primitives and custom UI components (shadcn-inspired)
- lucide-react icons

### Project Structure (key paths)
```
app/
  page.js                 # Frontend leads explorer
  layout.js               # App layout, imports globals.css
  admin/
    login/page.js         # Admin login
    page.js               # Admin dashboard (CRUD)
  api/[[...path]]/route.js# Dynamic API implementing all backend endpoints
components/ui/*           # Reusable UI components
lib/utils.js              # Shared utilities
tailwind.config.js        # Tailwind config
next.config.js            # Next config (CORS headers, standalone build)
backend_test.py           # Python test suite for API endpoints
```

### Environments and Configuration
Set the following environment variables (create a .env.local for local dev):
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=lead_management
```
Notes:
- On first API invocation, the backend seeds an admin user if none exists:
  - email: admin@gmail.com
  - password: 12345678 (stored as sha256 hash)
- Token implementation is a base64‑encoded JSON payload, expiring after 24h. It is unsigned and intended for development only.

### Installation
```bash
# Node 18+ recommended; Yarn classic is configured in package.json
yarn install

# Start dev server on http://localhost:3000
yarn dev

# Production build & start
yarn build
yarn start
```

### Running the App
- Frontend: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
  - Demo credentials: admin@gmail.com / 12345678
- Admin dashboard: http://localhost:3000/admin

### Data Model (recommended shape)
The API accepts schemaless JSON for leads, but the UI expects the following fields for full functionality:
```json
{
  "id": "uuid",                // created by backend
  "title": "string",
  "category": "environmental" | "uninhabitable",
  "phase": "string",
  "type": "string",
  "address": "string",
  "municipality": "string",
  "region": "string",
  "owner": "string",
  "email": "string",
  "phone": "string",
  "description": "string",
  "applicationDate": "YYYY-MM-DD",
  "publicationDate": "YYYY-MM-DD",
  "projectValue": "string",
  "status": "Pending" | "Under Review" | "In Progress" | "Approved",
  "architect": "string",
  "contractor": "string",
  "createdAt": "ISO date",     // created by backend
  "updatedAt": "ISO date"      // maintained by backend
}
```

### Persistence (MongoDB Collections)
- admin_users
- leads
- saved_leads
- prospection_leads
- contact_history
- emails
- postal_mail

### API Overview
All endpoints are implemented in `app/api/[[...path]]/route.js` and are accessible under `/api`.

Auth
- POST `/api/auth/login` → body { email, password } → returns { token, user }
- GET  `/api/auth/verify` → header Authorization: Bearer <token> → returns { user }

Health
- GET `/api/` → { message: "Lead Management Portal API" }

Leads
- GET    `/api/leads` → [Lead]
- POST   `/api/leads` → create Lead from body; backend adds id, createdAt, updatedAt
- GET    `/api/leads/{id}` → Lead
- PUT    `/api/leads/{id}` → update fields; updates updatedAt
- DELETE `/api/leads/{id}` → { message }

Saved Leads
- GET    `/api/saved-leads` → [SavedLead]
- POST   `/api/saved-leads` → body { leadId, userId? } → SavedLead
- DELETE `/api/saved-leads/{leadId}` → { message, deleted }

Prospection Leads
- GET    `/api/prospection-leads` → [ProspectionLead]
- POST   `/api/prospection-leads` → body { leadId, userId? } → ProspectionLead
- DELETE `/api/prospection-leads/{leadId}` → { message, deleted }

Contact History
- GET  `/api/contact-history` → latest 100 records, sorted desc by timestamp
- POST `/api/contact-history` → body { leadId, type, recipient, subject?, content, status?, userId? }

Email/Mail (placeholders)
- POST `/api/send-email` → body { to, subject, content } → stored in `emails`
- POST `/api/send-mail`  → body { to, content } → stored in `postal_mail`

### Authentication Notes
- Tokens are base64 JSON payloads with timestamp and 24h max age. They are not signed.
- The admin dashboard stores the token and user in localStorage and verifies via `/api/auth/verify`.
- Most data endpoints do not enforce authorization checks; harden before production.

### CORS and Headers
`next.config.js` sets permissive headers globally:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: *`
Dynamic route also sets CORS headers in responses.

### UI/Styling
- Tailwind CSS configured via `tailwind.config.js` with CSS variables in `app/globals.css`.
- UI components under `components/ui/*` wrap Radix primitives and Tailwind classes.

### Using the API (examples)
Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"12345678"}'
```

Create a lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "title":"New Construction Project",
    "category":"environmental",
    "phase":"Design",
    "type":"New Building",
    "address":"123 Oak Street",
    "municipality":"Vancouver",
    "region":"BC-West",
    "owner":"John Smith",
    "email":"john@example.com",
    "phone":"+1 555 123 4567",
    "description":"Eco-friendly residential complex",
    "applicationDate":"2024-06-15",
    "publicationDate":"2024-06-20",
    "projectValue":"$2.5M",
    "status":"Under Review",
    "architect":"Green Design Associates",
    "contractor":"BuildRight Construction"
  }'
```

Update a lead
```bash
curl -X PUT http://localhost:3000/api/leads/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"Approved"}'
```

Save/unsave a lead
```bash
curl -X POST http://localhost:3000/api/saved-leads \
  -H "Content-Type: application/json" \
  -d '{"leadId":"<id>","userId":"demo-user"}'

curl -X DELETE http://localhost:3000/api/saved-leads/<id>
```

Record contact
```bash
curl -X POST http://localhost:3000/api/contact-history \
  -H "Content-Type: application/json" \
  -d '{
    "leadId":"<id>",
    "type":"email",
    "recipient":"john@example.com",
    "subject":"Project Inquiry",
    "content":"Hello John...",
    "status":"sent"
  }'
```

### Admin Dashboard Usage
1. Navigate to `/admin/login` and sign in with the seeded credentials.
2. The dashboard (`/admin`) lets you:
   - Create leads (Add New Lead)
   - Edit leads (pencil icon)
   - Delete leads (trash icon)
   - View stats by category and status

### Testing the API (backend_test.py)
Prerequisites:
```bash
python -m pip install requests python-dotenv
```
Run tests (ensure `yarn dev` is running):
```bash
python backend_test.py
```
What it covers:
- Health check
- Leads CRUD
- Saved leads (save/remove)
- Prospection leads (add/remove)
- Contact history (create/list)
- Email and postal mail placeholders

### Deployment Notes
- `next.config.js` uses `output: 'standalone'` for easier containerization.
- Provide `MONGO_URL` and `DB_NAME` in the runtime environment.
- Start with `yarn start` after `yarn build` behind a process manager or container.
- The default global headers are permissive; review CORS and security for production.

### Security Considerations (before production)
- Replace the unsigned base64 token with a proper JWT (signed, exp/iat, audience).
- Enforce authorization on data endpoints (not just `/auth/verify`).
- Validate and sanitize request bodies (zod or similar) and restrict schemas.
- Configure restrictive CORS and security headers.
- Store secrets securely; avoid logging sensitive data.

### Troubleshooting
- Mongo connection errors: verify `MONGO_URL` and that MongoDB is reachable.
- Admin not created: ensure API route executed (hit any `/api/*` path) and DB write perms.
- 404 from API: check requests hit `/api/...` and that the app is running on port 3000.
- Token invalid: tokens expire after 24h; re‑login to refresh.
- Port 3000 in use: set `PORT=3001` (or free 3000) before `yarn dev`/`yarn start`.

### License
This project is provided as-is for demonstration and can be adapted as needed.


