# Production Deployment & Hosting Guide — Inovador Design Studio

**Document**: Production Deployment Architecture & Manual Handover  
**Target Environment**: GitHub → Vercel (Frontend) & Managed Persistent Host (Strapi v5 + MySQL)  
**Security Standard**: AGENTS.md, Phase 4 Specification  
**Status**: READINESS ONLY (Manual Execution by Human Operator)

---

## 1. System Architecture

The Inovador Design Studio digital ecosystem separates static/ISR frontend rendering from persistent database & CMS operations:

```text
                     GitHub Repository
                            │
            ┌───────────────┴───────────────┐
            │ Git Push                      │ Git Push
            ▼                               ▼
     Vercel Platform              Managed Persistent Host
  (Root Directory: frontend)     (Railway / Render / VPS)
            │                               │
            ▼                               ▼
    Next.js 16 Frontend ───────────►   Strapi v5 CMS
  (ISR, Server API Routes)      (REST API with Token / CORS)
            │                               │
            ├──────────────┐                ├──────────────┐
            ▼              ▼                ▼              ▼
     Cloudflare Turnstile Resend       Managed MySQL   Cloudinary
     (Bot Protection)    (Email)     (Persistent DB)   (Media CDN)
```

### Critical Architectural Rules
1. **Never deploy MySQL or Strapi to Vercel Serverless Functions**: Strapi requires persistent Node.js runtime and WebSocket / file upload lifecycle.
2. **Never expose MySQL directly to the public internet or browser**: All frontend data fetching occurs via Next.js Server Components / API layer connecting to Strapi.
3. **Never prefix private server credentials with `NEXT_PUBLIC_`**: All API tokens, secrets, and database credentials remain strictly server-side.

---

## 2. GitHub Repository & Monorepo Setup

The single repository contains both `frontend/` and `backend/` directories.

### Branch Strategy
- `main`: Production-ready branch deployed to Vercel Production.
- `feature/*` / `fix/*`: Working branches triggering Vercel Preview Deployments upon Pull Request.
- **Merge Policy**: All PRs must pass TypeScript build check (`npx tsc --noEmit`) and linting before merging to `main`.

---

## 3. Vercel Frontend Deployment (Step-by-Step)

Follow these exact steps in the Vercel Dashboard:

### Step 1: Import Project
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select the **Inovador Design Studio** GitHub repository.

### Step 2: Configure Build & Root Directory
- **Project Name**: `inovador-design-studio`
- **Framework Preset**: `Next.js`
- **Root Directory**: Click *Edit* and select **`frontend`** *(CRITICAL: Do not leave as root)*.
- **Build Command**: `npm run build` *(Default)*
- **Output Directory**: `.next` *(Default)*
- **Install Command**: `npm install` *(Default)*
- **Node.js Version**: `20.x` or `22.x`

### Step 3: Configure Environment Variables

Add the following variables under **Project Settings $\rightarrow$ Environment Variables**:

| Variable Name | Environment | Description | Example Placeholder |
|---|---|---|---|
| `STRAPI_API_URL` | Production, Preview | Public HTTPS URL of persistent Strapi host | `https://cms.yourdomain.com` |
| `STRAPI_READ_TOKEN` | Production, Preview | Server-side Strapi Read API Token | `sec_read_9f83...` |
| `STRAPI_WRITE_TOKEN` | Production, Preview | Server-side Strapi Write API Token for inquiries | `sec_write_8fj2...` |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical public site URL | `https://www.yourdomain.com` |
| `USE_MOCK_DATA` | Production, Preview | Must be `false` in production | `false` |
| `REVALIDATE_SECRET` | Production, Preview | Shared secret for ISR webhook triggers | `long_random_secret_32_chars` |
| `RESEND_API_KEY` | Production, Preview | Resend API Key for client brief dispatch | `re_live_8392...` |
| `RESEND_FROM_EMAIL` | Production | Verified sender address in Resend | `Inovador Briefs <briefs@yourdomain.com>` |
| `STUDIO_NOTIFICATION_EMAIL` | Production | Studio destination inbox | `commissions@yourdomain.com` |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Production | Cloudflare Turnstile Public Site Key | `0x4AAAAAA...` |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Production | Cloudflare Turnstile Private Secret Key | `0x4AAAAAA...` |

### Step 4: Deploy & Verify Preview
1. Trigger deployment.
2. Verify that Vercel outputs `✓ Compiled successfully`.
3. Check preview URL to confirm assets, typography, and API connectivity.

---

## 4. Persistent Backend Hosting (Strapi v5 & MySQL)

Deploy the `backend/` directory to a persistent cloud provider (e.g., Railway, Render, or dedicated VPS).

### Database Configuration (Managed MySQL)
- **Engine**: MySQL 8.0+
- **Charset**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Connection**: Set `DATABASE_HOST`, `DATABASE_PORT=3306`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_SSL`.

### Strapi Environment Configuration
Configure the following in the hosting provider dashboard:
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
PUBLIC_URL=https://cms.yourdomain.com
FRONTEND_URL=https://www.yourdomain.com,https://yourdomain.com
DATABASE_CLIENT=mysql
DATABASE_HOST=mysql.internal.railway.app
DATABASE_PORT=3306
DATABASE_NAME=inovador_cms
DATABASE_USERNAME=db_user
DATABASE_PASSWORD=strong_db_password
DATABASE_SSL=false
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=salt1
ADMIN_JWT_SECRET=jwt_secret1
TRANSFER_TOKEN_SALT=salt2
JWT_SECRET=jwt_secret2
REVALIDATE_SECRET=long_random_secret_32_chars
```

### Strapi Build & Start Commands
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

---

## 5. Third-Party Production Integrations

### 1. Cloudinary (Media & CDN)
1. In Cloudinary Console, copy **Cloud Name**, **API Key**, and **API Secret**.
2. Configure them in Strapi environment variables.
3. In Strapi Admin $\rightarrow$ Media Library, verify that uploads automatically route to Cloudinary and return `https://res.cloudinary.com/...` URLs.

### 2. Resend (Transactional Email)
1. Go to [resend.com/domains](https://resend.com/domains).
2. Add your domain (`yourdomain.com`).
3. Add the DNS records (DKIM, SPF, MX) provided by Resend to your domain registrar.
4. Once verified, update `RESEND_FROM_EMAIL=Inovador Briefs <briefs@yourdomain.com>`.

### 3. Cloudflare Turnstile (Bot Protection)
1. In Cloudflare Dashboard $\rightarrow$ Turnstile, add a new widget.
2. Set Domain to `yourdomain.com` and `www.yourdomain.com`.
3. Copy **Site Key** (`NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`) and **Secret Key** (`CLOUDFLARE_TURNSTILE_SECRET_KEY`) to Vercel.

---

## 6. Strapi Webhook & On-Demand ISR Revalidation

To ensure frontend content updates automatically when an admin publishes changes in Strapi:

1. In Strapi Admin, navigate to **Settings $\rightarrow$ Webhooks**.
2. Click **Create new Webhook**:
   - **Name**: `Next.js ISR Revalidation`
   - **URL**: `https://www.yourdomain.com/api/revalidate`
   - **Headers**:
     - `x-revalidate-secret`: *(Your `REVALIDATE_SECRET` value)*
   - **Events**: Check `Entry`: `publish`, `unpublish`, `delete`.
3. Click **Save**.

---

## 7. Domain & DNS Configuration

When ready to point the live domain to the application:

| Record Type | Host / Name | Target / Value | Purpose |
|---|---|---|---|
| `CNAME` | `www` | `cname.vercel-dns.com` | Primary Frontend |
| `A` | `@` (Apex) | `76.76.21.21` | Apex redirect to `www` |
| `CNAME` | `cms` | `your-strapi-host.railway.app` | Strapi CMS & API |
| `TXT` / `CNAME` | `resend._domainkey` | *(Resend DKIM value)* | Email Authentication |

---

## 8. Database Backup Strategy

Before going live with production patron inquiries and content:
1. **Automated Daily Backups**: Enable managed daily automated backups on your MySQL provider (Railway / PlanetScale / AWS RDS) with **30-day retention**.
2. **Manual Snapshot Before Major Updates**: Take a database dump prior to content migrations:
   ```bash
   mysqldump -u <user> -p -h <host> inovador_cms > backup_pre_launch.sql
   ```
3. **Restore Verification**: Test restoring the dump to a staging/local database to verify table integrity.

---

## 9. Production Smoke Test Plan

After DNS propagation, execute the following manual smoke tests:

1. **Homepage (`/`)**: Verify video/image hero playback, typography, project cards, and animations.
2. **Projects Archive (`/projects`)**: Verify category and city filter pill interactions.
3. **Project Detail (`/projects/[slug]`)**: Verify high-resolution gallery images, built area specs, and back navigation.
4. **Services Page (`/services`)**: Verify 6 capability disciplines and 4-phase architectural process.
5. **Presence Directory (`/presence`)**: Verify all 5 studio ateliers (Mumbai, Goa, Bengaluru, New Delhi, Alibaug).
6. **Presence Detail (`/presence/mumbai`)**: Verify location narrative, atelier address, and derived local projects.
7. **Contact Page (`/contact`)**: Submit a test inquiry brief and confirm:
   - Form renders Turnstile widget.
   - Success state displays.
   - Record appears in Strapi Admin (`Inquiries`).
   - Email alert arrives in studio inbox.
8. **Editorial 404 (`/unknown-route`)**: Verify styled 404 page renders.
9. **Sitemap (`/sitemap.xml`)**: Verify XML output containing all canonical URLs.
10. **Robots (`/robots.txt`)**: Verify `Allow: /` and `Sitemap` link.

---

## 10. Rollback Procedure

If any critical issue arises during deployment:
1. **Frontend Rollback**:
   - In Vercel Dashboard $\rightarrow$ **Deployments**.
   - Locate the previous stable deployment.
   - Click the three dots $\rightarrow$ **Instant Rollback (Promote to Production)**.
   - Traffic routes to the previous build in $< 5$ seconds.
2. **Backend / CMS Rollback**:
   - In your host dashboard (Railway/Render), roll back to the previous deployment build commit.
3. **Database Rollback**:
   - Restore the pre-launch snapshot (`backup_pre_launch.sql`).
