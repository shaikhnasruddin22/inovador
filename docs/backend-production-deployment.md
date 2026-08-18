# Backend Production Hosting & Operations Guide (Strapi v5 + MySQL)

**Document**: Persistent CMS & Database Deployment Specification  
**Application**: Inovador Design Studio Backend (`backend/`)  
**Technology**: Strapi v5.5.0, Node.js 20/22 LTS, MySQL 8.0+, Cloudinary CDN  
**Status**: DEPLOYMENT SPECIFICATION (Ready for Manual Execution)

---

## 1. Hosting Architecture Overview

Strapi v5 is a stateful Node.js application requiring persistent server resources.

```text
       Internet Traffic
              │
              ▼
   Reverse Proxy / SSL (HTTPS)
              │
              ▼
   Strapi v5 Node.js Process (Port 1337)
        ├── REST API Controllers & Document Service
        ├── Admin Content Manager Panel (/admin)
        └── Webhook Dispatcher
              │
      ┌───────┴───────┐
      ▼               ▼
Managed MySQL    Cloudinary Media
  (Port 3306)     (HTTPS CDN)
```

**Recommended Managed Platforms**:
- **Railway.app** (Integrated Node.js + Managed MySQL)
- **Render.com** (Web Service + Managed PostgreSQL/MySQL)
- **DigitalOcean App Platform / Droplet with Docker**

---

## 2. Environment Variables Specification

Configure all variables in your persistent hosting platform:

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
PUBLIC_URL=https://cms.yourdomain.com
FRONTEND_URL=https://www.yourdomain.com,https://yourdomain.com

# Database (MySQL 8.0+)
DATABASE_CLIENT=mysql
DATABASE_HOST=mysql.your-cloud-host.com
DATABASE_PORT=3306
DATABASE_NAME=inovador_cms
DATABASE_USERNAME=inovador_admin
DATABASE_PASSWORD=your_super_secure_db_password
DATABASE_SSL=false

# Media & Storage (Cloudinary)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Security & Tokens
APP_KEYS=generate_random_key_1,generate_random_key_2,generate_random_key_3,generate_random_key_4
API_TOKEN_SALT=generate_random_salt_1
ADMIN_JWT_SECRET=generate_random_jwt_secret_1
TRANSFER_TOKEN_SALT=generate_random_salt_2
JWT_SECRET=generate_random_jwt_secret_2

# Revalidation Webhook Secret
REVALIDATE_SECRET=generate_long_random_revalidation_secret
```

---

## 3. Build & Startup Lifecycle

### Local / CI Build Command
```bash
npm install --include=dev
npm run build
```

### Production Runtime Command
```bash
npm run start
```
*(Defined in `backend/package.json` as `strapi start`)*

---

## 4. Database Schema Migration & Bootstrap Idempotency

When Strapi boots with `NODE_ENV=production`:
1. Strapi inspects MySQL tables against content schemas in `src/api/*/content-types/*`.
2. Missing tables, columns, and foreign keys are automatically synchronized without destructive drops.
3. The bootstrap script (`src/index.js`) executes, verifying public read permissions for all 17 content models.

### Seeding Production Data
To transfer initial content and schema structures from local development to production:
```bash
# Export local Strapi archive
npm run strapi export -- --no-encrypt --file inovador_cms_backup

# Transfer archive to production
npm run strapi import -- --file inovador_cms_backup.tar.gz
```

---

## 5. Security & Access Control

### Admin Panel Protection
- Production Admin must be accessed strictly over **HTTPS**.
- Create distinct administrator accounts for studio staff with strong passwords and 2FA enabled where supported.
- Never share the root database password with general editors.

### Public API Endpoint Permissions
The bootstrap routine automatically ensures that public role permissions are strictly scoped:
- **Public READ Access**: `projects`, `services`, `testimonials`, `faqs`, `hero-slides`, `process-steps`, `award-presses`, `navigation-items`, `presences`, `pages`, `site-setting`, `home-page`, `services-page`, `projects-page`, `contact-page`, `studio-about`.
- **Public WRITE Access**: Only `inquiries.create` is permitted. All other mutations (`update`, `delete`, `find` on inquiries) are strictly forbidden to public actors.

---

## 6. CORS Enforcement

Strapi's CORS configuration ([`config/middlewares.js`](file:///d:/Nasru/Projects/ids/backend/config/middlewares.js)) dynamically resolves `FRONTEND_URL`.
- In production, only the configured domain (`https://www.yourdomain.com`) is allowed to make cross-origin requests.
- Wildcards (`*`) are disabled in production.

---

## 7. Disaster Recovery & Backup Routine

1. **Daily MySQL Backups**: Configure automated snapshots with 30-day retention on your managed cloud database.
2. **Cloudinary Asset Protection**: Cloudinary preserves all original and transformed media assets in redundant cloud storage.
3. **Emergency Database Export**:
   ```bash
   mysqldump -h <host> -u <user> -p inovador_cms > inovador_cms_backup_$(date +%F).sql
   ```
