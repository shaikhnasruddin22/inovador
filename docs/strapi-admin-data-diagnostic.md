# Phase 3.7 — Strapi Admin Data Diagnostic Report

**Project**: Inovador Design Studio  
**Date**: 2026-08-18  
**Diagnostic Objective**: Determine why content is returned by Strapi REST API and visible in MySQL but displayed as 0 records in Strapi v5 Admin Panel Content Manager.

---

## 1. Executive Diagnostic Summary

The investigation revealed the precise technical root cause for why the Strapi Admin Panel Content Manager shows 0 records while the frontend and MySQL database contain 6 projects, 6 services, 3 testimonials, 5 FAQs, 3 hero slides, 4 process steps, and 4 awards:

* **The Strapi v5 Document Service Architecture**: In Strapi v5, Content Manager list views (`GET /content-manager/collection-types/:uid`) query documents via the **Document Service API** (`strapi.documents`), which specifically requires a working **Draft version** of each document to display rows in the Admin table.
* **The Seeding Mechanism**: The bootstrap script in `backend/src/index.js` used low-level `strapi.db.query(uid).create({ data: { ..., publishedAt: new Date() } })`.
* **The Consequence**: `strapi.db.query` inserted raw published rows into MySQL. When queried via Public REST API (`/api/projects`), Strapi serves published records (6 records returned). However, when the Content Manager in the Admin Panel requests the collection list, it looks for the draft working document (`status=draft` / draft entity), finds 0 draft versions, and renders an empty list (**0 rows**).
* **Proof of Diagnosis**:
  * `GET /content-manager/collection-types/api::project.project` (Default Admin UI query) $\rightarrow$ **0 results**
  * `GET /content-manager/collection-types/api::project.project?status=published` $\rightarrow$ **6 results**
  * `GET /content-manager/collection-types/api::inquiry.inquiry` (Created via Strapi v5 Document Service / REST Controller) $\rightarrow$ **8 results (Visible in Admin!)**

---

## 2. Record Count Comparison Matrix

| Content Model UID | MySQL Table Name | MySQL Rows | Strapi REST API Rows | Strapi Admin Default View | Strapi Admin (`status=published`) | Admin Visible? |
|---|---|:---:|:---:|:---:|:---:|:---:|
| `api::project.project` | `projects` | **6** | **6** | **0** | **6** | **NO (Draft Missing)** |
| `api::service.service` | `services` | **6** | **6** | **0** | **6** | **NO (Draft Missing)** |
| `api::testimonial.testimonial` | `testimonials` | **3** | **3** | **0** | **3** | **NO (Draft Missing)** |
| `api::faq.faq` | `faqs` | **5** | **5** | **0** | **5** | **NO (Draft Missing)** |
| `api::hero-slide.hero-slide` | `hero_slides` | **3** | **3** | **0** | **3** | **NO (Draft Missing)** |
| `api::process-step.process-step` | `process_steps` | **4** | **4** | **0** | **4** | **NO (Draft Missing)** |
| `api::award-press.award-press` | `award_presses` | **4** | **4** | **0** | **4** | **NO (Draft Missing)** |
| `api::studio-about.studio-about` | `studio_abouts` | **1** | **1** | **0** | **1** | **NO (Draft Missing)** |
| `api::inquiry.inquiry` | `inquiries` | **8** | **8** | **8** | **8** | **YES (Fully Visible)** |

---

## 3. Specific Content Item Audit Across All 4 Layers

| Entity | Frontend Visible Value | Strapi REST API Value | MySQL Row Value | Strapi Admin Panel Default View |
|---|---|---|---|---|
| **1. First Project** | `"The Raw Stone Pavilion"` | `"The Raw Stone Pavilion"` (docId: `edklkys4ra6pp87cphknfl04`) | `"The Raw Stone Pavilion"` (id: `1`) | **0 rows displayed** (Draft missing) |
| **2. First Service** | `"Architectural Design"` | `"Architectural Design"` (docId: `d3s49581q4w3...`) | `"Architectural Design"` (id: `1`) | **0 rows displayed** (Draft missing) |
| **3. First Testimonial** | `"Inovador transformed our coastal property..."` | `"Inovador transformed our coastal property..."` | `"Inovador transformed our coastal property..."` | **0 rows displayed** (Draft missing) |
| **4. First FAQ** | `"What architectural and interior design typologies does Inovador undertake?"` | `"What architectural and interior design typologies does Inovador undertake?"` | `"What architectural and interior design typologies does Inovador undertake?"` | **0 rows displayed** (Draft missing) |
| **5. First Hero Slide** | `"Architecture in Dialogue with Landscape & Sea"` | `"Architecture in Dialogue with Landscape & Sea"` | `"Architecture in Dialogue with Landscape & Sea"` | **0 rows displayed** (Draft missing) |
| **6. First Process Step** | `"Discovery, Solar Analysis & Site Topology"` | `"Discovery, Solar Analysis & Site Topology"` | `"Discovery, Solar Analysis & Site Topology"` | **0 rows displayed** (Draft missing) |
| **7. First Award** | `"Residential Architecture of the Year 2024"` | `"Residential Architecture of the Year 2024"` | `"Residential Architecture of the Year 2024"` | **0 rows displayed** (Draft missing) |
| **8. Studio / About** | `"Inovador Design Studio"` | `"Inovador Design Studio"` | `"Inovador Design Studio"` (id: `1`) | **Empty Form / Draft Missing** |

---

## 4. Real Frontend Source & Execution Path

The running frontend in production mode (`USE_MOCK_DATA=false`) fetches live data through the following runtime trace:

```text
Homepage (frontend/src/app/page.tsx)
    ↓
Server Component Parallel Promise.all()
    ↓
frontend/src/lib/api/projects.ts -> getProjects()
frontend/src/lib/api/services.ts -> getServices()
frontend/src/lib/api/about.ts -> getStudioAbout()
frontend/src/lib/api/hero.ts -> getHeroSlides()
frontend/src/lib/api/process.ts -> getProcessSteps()
frontend/src/lib/api/reviews.ts -> getTestimonials()
frontend/src/lib/api/awards.ts -> getAwards()
frontend/src/lib/api/faq.ts -> getFAQs()
    ↓
fetchAPI() -> http://localhost:1337/api/... (Server-to-Server REST Request)
    ↓
Strapi REST Router & Controller
    ↓
Strapi Database Query Engine -> MySQL inovador_cms
    ↓
Returns published records to Next.js
    ↓
Normalizers (normalizers.ts) transform data
    ↓
Rendered into React components
```

---

## 5. Environment Variables Status

* `STRAPI_API_URL`: **PRESENT** (`http://localhost:1337`)
* `STRAPI_READ_TOKEN`: **MISSING** (Requests currently consume public permissions configured in Strapi)
* `STRAPI_WRITE_TOKEN`: **MISSING** (Inquiry creation endpoint currently consumes public write permission)
* `USE_MOCK_DATA`: **PRESENT** (`false`)

---

## 6. Root Cause Classification

### Primary Root Cause: **ROOT CAUSE B & D**
* **ROOT CAUSE B**: Strapi records exist in MySQL and are served through the public REST API, but are **not valid/visible Admin Content Manager records** because they lack the Strapi v5 Document Service draft/published paired state.
* **ROOT CAUSE D**: Draft/publish document-state mismatch in Strapi v5.
* **Explanation**: In Strapi v5, `strapi.db.query` creates raw SQL records that bypass the Strapi v5 Document Service. Content Manager in Strapi v5 requires documents to be created through `strapi.documents(uid).create({ data, status: 'published' })` so that the draft working copy and the published copy are properly indexed in the Document Service.

---

## 7. Recommended Fix (Awaiting Human Approval)

To make all records 100% visible and editable in the Strapi Admin Panel:
1. Update `backend/src/index.js` to seed records using the official Strapi v5 Document Service API:
   ```javascript
   await strapi.documents('api::project.project').create({
     data: itemData,
     status: 'published',
   });
   ```
2. Re-run Strapi bootstrap so Strapi v5 generates both draft and published document representations.
3. Verify that opening `http://localhost:1337/admin` displays all 6 Projects, 6 Services, 3 Testimonials, 5 FAQs, 3 Hero Slides, 4 Process Steps, 4 Awards, and 1 Studio/About single type in the Content Manager table view.
