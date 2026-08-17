# Inovador Design Studio — Strapi CMS Backend

This is the production-ready headless CMS and API backend for **Inovador Design Studio**, powered by **Strapi v5** and **MySQL**.

---

## 1. System Requirements & Technology Stack

* **Node.js**: `>= 18.0.0 <= 22.x.x` (Developed on Node `v20.20.2`)
* **npm**: `>= 10.0.0`
* **CMS Framework**: Strapi `v5.10.2` (Community Edition)
* **Database**: MySQL `8.0` / MariaDB `10.4+` (MySQL InnoDB utf8mb4)
* **Media Storage Provider**: `@strapi/provider-upload-cloudinary` (with local disk fallback for offline development)

---

## 2. MySQL Database Setup

1. Start your local or managed MySQL service:
   ```bash
   # If using XAMPP:
   C:\xampp\mysql\bin\mysqld.exe --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
   ```
2. Create the UTF-8 database for the studio CMS:
   ```sql
   CREATE DATABASE IF NOT EXISTS inovador_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

## 3. Environment Variables (`.env`)

Create `.env` in the `backend/` root from `.env.example`:

```env
# Strapi Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=exampleKey1,exampleKey2,exampleKey3,exampleKey4
API_TOKEN_SALT=exampleApiTokenSalt
ADMIN_JWT_SECRET=exampleAdminJwtSecret
TRANSFER_TOKEN_SALT=exampleTransferTokenSalt
JWT_SECRET=exampleJwtSecret

# Database Configuration (MySQL)
DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=inovador_cms
DATABASE_USERNAME=root
DATABASE_PASSWORD=
DATABASE_SSL=false

# Media Storage (Cloudinary - Production)
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

# Frontend Application URL for CORS
FRONTEND_URL=http://localhost:3000
```

> **Security Note**: Never commit `.env` files or production API keys to source control.

---

## 4. Starting the Server

### Development Mode (with hot-reload)
```bash
cd backend
npm run develop
```

### Production Build & Launch
```bash
cd backend
npm run build
npm run start
```
The Strapi REST API will listen at `http://localhost:1337` and the administration panel will be accessible at `http://localhost:1337/admin`.

---

## 5. Administration & User Roles

### Initial Administrator Setup
1. Open `http://localhost:1337/admin` in your browser.
2. Complete the initial Super Admin onboarding form (Name, Email, Strong Password).
3. The Super Admin retains complete control over schema definitions, API tokens, webhooks, and database settings.

### Creating the Studio Editor Role
Studio staff members who curate portfolio projects, testimonials, and process briefs should be assigned the **Editor** role:
1. Navigate to **Settings** $\rightarrow$ **Administration Panel** $\rightarrow$ **Users**.
2. Click **Invite new user**, enter the studio editor's email, and select the **Editor** role.
3. **Editor Permissions Scope**:
   * **Projects**: Full CRUD (Create, Read, Update, Delete) + Draft & Publish.
   * **Testimonials**: Full CRUD + Draft & Publish.
   * **Services**: Full CRUD + Draft & Publish.
   * **FAQs**: Full CRUD + Draft & Publish.
   * **Inquiries**: Read submissions & update inquiry status (`new` $\rightarrow$ `contacted` $\rightarrow$ `closed`).
   * **Media Library**: Upload and manage architectural photography and galleries.
   * **Prohibited**: Editors cannot modify schema models, delete databases, access developer tokens, or alter system configurations.

---

## 6. Content Types & Schemas

| Content Type | Kind | Draft & Publish | Key Fields | Description |
|---|---|---|---|---|
| **Project** (`api::project.project`) | Collection | **Yes** | `title`, `slug`, `city`, `category`, `year`, `shortDescription`, `description`, `coverImage`, `gallery`, `beforeImage`, `afterImage`, `featured`, `sortOrder`, `stats` | Architectural and interior portfolio commissions. Supports single cover, ordered multi-image gallery, before/after comparison pair, and typology tagging. |
| **Testimonial** (`api::testimonial.testimonial`) | Collection | **Yes** | `clientName`, `quote`, `roleOrLocation`, `projectReference` (Relation to `Project`), `photo`, `sortOrder` | Client perspectives and patron quotes. |
| **Service** (`api::service.service`) | Collection | **Yes** | `name`, `slug`, `iconName`, `shortDescription`, `deliverables`, `sortOrder` | Architectural practice disciplines and turnkey deliverables. |
| **FAQ** (`api::faq.faq`) | Collection | **Yes** | `question`, `answer`, `category`, `sortOrder` | Studio advisory and commission protocols. |
| **Inquiry** (`api::inquiry.inquiry`) | Collection | **No** (Direct) | `name`, `email`, `phone`, `projectType`, `timeline`, `message`, `status` | Client project briefs. **Strictly private** (403 Forbidden on public list/read). |

---

## 7. Media Management & Cloudinary CDN

* **Local Development**: Files uploaded via the Strapi Media Library are saved locally in `backend/public/uploads/`.
* **Production**: When `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` are provided in `.env`, Strapi automatically streams uploads to Cloudinary CDN via `@strapi/provider-upload-cloudinary`.
* **Ordering**: Multi-media fields (`gallery`) preserve image arrangement and caption metadata.

---

## 8. REST API Endpoints & Permissions

### Public Read-Only Endpoints (Published Content Only)
* `GET /api/projects` — Fetch published projects (Supports sorting `?sort=sortOrder:asc` and filtering `?filters[category][$eq]=Architecture`).
* `GET /api/projects?filters[slug][$eq]=<slug>` — Fetch single project by unique slug.
* `GET /api/testimonials?sort=sortOrder:asc` — Fetch published client testimonials.
* `GET /api/services?sort=sortOrder:asc` — Fetch studio practice disciplines.
* `GET /api/faqs?sort=sortOrder:asc` — Fetch published FAQs.

### Protected / Private Endpoints
* `GET /api/inquiries` $\rightarrow$ **403 Forbidden** (Inquiries cannot be listed or read by public users).
* `POST /api/inquiries` $\rightarrow$ Handled securely through server-to-server validation via Next.js `/api/inquiry` in Phase 3.

---

## 9. Database Backup & Disaster Recovery

### Local Database Export (mysqldump)
```bash
mysqldump -u root -p inovador_cms > inovador_cms_backup_$(date +%F).sql
```

### Local Database Restoration
```bash
mysql -u root -p inovador_cms < inovador_cms_backup.sql
```

### Production Backup Strategy
* **Daily Automated Snapshots**: Configure automated daily snapshots with a minimum 30-day retention window on managed MySQL (e.g. Railway, Render, PlanetScale, or AWS RDS).
* **Media Redundancy**: All media files reside in Cloudinary cloud storage, ensuring database backups contain only relational metadata and URLs.
