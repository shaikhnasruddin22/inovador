# Architecture.md — Inovador Design Studio

## 1. High-Level Stack
- **Frontend:** Next.js (React), Framer Motion (animation), Swiper (carousels/sliders)
- **CMS/API:** Strapi (self-hosted, Node.js) instead of hand-rolled Express — same ecosystem, gives content types, admin UI, and auth for free
- **Database:** MySQL (Strapi's datastore)
- **Media storage:** Cloudinary or S3 + CloudFront (not local disk or DB blobs)
- **Email:** Resend or SendGrid, for inquiry notifications
- **Hosting:** Vercel (frontend) + a small VPS or managed Node host (Railway/Render) for Strapi + MySQL

## 2. System Diagram (described)

```
[Visitor Browser]
      |
      v
[Next.js Frontend — Vercel]
   - SSG for static pages (About, Process, Services)
   - ISR for Projects (revalidate on a timer or via webhook)
   - Client-side fetch for filter interactions (city/category)
   - Optimized image delivery via next/image
      |
      +-----------------------------+
      |                             |
      | REST/Data calls             | Media assets from CDN
      v                             v
[Strapi API Engine]        [Cloudinary CDN]
   ├── MySQL Datastore           ^
   │   (Content models)          |
   └── Cloudinary Plugin --------+ (Media uploads & transforms)

[Inquiry Pipeline]:
[Visitor] -> [Next.js /api/inquiry] -> [Zod + Turnstile + Honeypot]
                   ├──> [Strapi API] -> [MySQL Database] (Status: "new")
                   └──> [Resend API] -> [Studio Notification Inbox]
```

## 3. Component Breakdown

### Frontend (Next.js)
- `/` — homepage, composed of all sections in Design.md
- `/projects/[slug]` — individual project detail page (SSG + ISR, so new projects appear without full redeploy)
- `/about` — full About page (linked from homepage teaser)
- API calls centralized in a small data-fetching layer (e.g., `lib/api.ts`) so Strapi's API shape is isolated from components — if the backend ever changes, only this layer needs updating

### Backend (Strapi)
- Content types map directly to the Content Model in PRD.md (Project, Testimonial, Service, FAQ, Inquiry)
- Public API permissions: read-only on Project/Testimonial/Service/FAQ; write-only (create) on Inquiry
- Admin permissions: full CRUD on all content types, restricted to studio staff accounts
- Media library handles image upload, resizing presets, and pushes to Cloudinary/S3 via a Strapi provider plugin

### Integration Points (the tricky bits)
1. **Image pipeline** — Strapi's media library + Cloudinary provider plugin handles this, but responsive image sizes need to be configured explicitly (thumbnail/medium/large breakpoints) or the frontend will be shipping oversized images.
2. **ISR revalidation** — when the studio publishes a new project in Strapi, the frontend needs to know to regenerate that page. Use a Strapi webhook on publish → hits a Next.js revalidation API route.
3. **Contact form → email** — form submits to Strapi's Inquiry endpoint (stores in DB) and a Strapi lifecycle hook (`afterCreate`) triggers the email send via Resend/SendGrid. Keeps this logic server-side, not duplicated in the frontend.
4. **Filtering (city/category)** — for v1 scale (a design studio's portfolio, likely <200 projects), client-side filtering of a pre-fetched project list is simpler and faster than server-side filtered API calls. Revisit only if the project count grows large.

## 4. Environments
- **Local dev:** Next.js dev server + local Strapi instance + local MySQL (or Docker Compose for all three)
- **Staging:** mirrors production, used for client review before go-live
- **Production:** Vercel (frontend) + Strapi/MySQL host, with automated backups on the database

## 5. Security Notes
- Strapi admin panel must be behind strong auth (not default credentials) — this is the client's CMS login, treat it like any admin system.
- Rate-limit and honeypot/captcha the public Inquiry endpoint to prevent spam.
- CORS on Strapi locked to the known frontend domain(s), not wide open.
- Environment secrets (DB credentials, email API keys, Cloudinary keys) never committed to the repo — use environment variables per environment.

## 6. Performance Considerations
- Next.js `next/image` for all imagery, with proper `sizes` attributes for the hero and grid.
- SSG/ISR over full client-side rendering — this is the main lever for both SEO and perceived load speed on an image-heavy site.
- Lazy-load below-the-fold carousels (testimonials, before/after) rather than initializing Swiper instances the visitor hasn't scrolled to yet.

## 7. Maintenance/Ownership Post-Launch
- Someone needs to own: MySQL backups, Strapi/Node version upgrades, and hosting bills — this should be an explicit line item in the client contract, not assumed.
- Recommend a simple uptime monitor (e.g., a free tier of UptimeRobot) on both the frontend and the Strapi API so issues surface before the client notices.
