# Phases.md — Inovador Design Studio Build Plan

Solo-developer, client-funded build. Phases are sequenced so the client signs off on design before backend investment happens — avoids rebuilding data schemas after layout changes.

## Phase 0 — Setup & Content Collection (2-4 days, can overlap with Phase 1)
- Confirm domain, hosting accounts, repo setup
- Client provides: initial project photography, testimonial quotes, service descriptions, FAQ content, logo/brand assets, accent color preference (or agree to propose one)
- Lock the content model (PRD.md, Section 6) with the client — this is much cheaper to change now than after Strapi schema exists

**Blocker risk:** clients are frequently the bottleneck here (waiting on photography/copy). Start this phase immediately, in parallel with design work, not after.

## Phase 1 — Static MVP / Design Validation (~1-1.5 weeks)
- Build the Next.js frontend with all sections from Design.md
- Content hardcoded in a local JSON/config file (no backend yet)
- Full animation/motion pass (Framer Motion scroll-ins, hover reveals)
- Responsive pass: mobile, tablet, desktop
- **Deliverable:** a deployed preview link (Vercel) for client review and sign-off

**Why this phase exists:** this is the point where the client will want layout/copy/color changes. Making those changes against a JSON file takes minutes. Making them against a live database schema and admin UI takes much longer. Get sign-off here before Phase 2.

## Phase 2 — Backend & CMS (~1.5-2 weeks)
- Stand up Strapi + MySQL (locally, then staging)
- Build content types: Project, Testimonial, Service, FAQ, Inquiry
- Configure media library + Cloudinary/S3 provider
- Set public/admin permissions
- Migrate Phase 1's hardcoded content into Strapi as the first real entries
- Connect frontend to Strapi API, replacing the JSON file

## Phase 3 — Integration & Polish (~3-5 days)
- Wire up ISR + Strapi publish webhook (so new projects go live without a manual redeploy)
- Contact form → Strapi Inquiry endpoint → email notification via Resend/SendGrid
- Spam protection (honeypot/captcha) on the inquiry form
- Accessibility pass: keyboard nav on all carousels/accordion, contrast check, `prefers-reduced-motion` support
- Performance pass: image sizing/lazy-loading, Lighthouse/Core Web Vitals check

## Phase 4 — Client Training & Handover (~1-2 days)
- Walk the studio through the Strapi admin: adding a project, editing testimonials, updating FAQs
- Provide a short written guide (screenshots) for common tasks — reduces support requests later
- Confirm who owns hosting bills, domain renewal, and ongoing maintenance (this should already be settled contractually, but confirm technically too)
- Set up uptime monitoring and database backups before final handover

## Phase 5 — Launch & Post-Launch (ongoing)
- DNS cutover, SSL check, final smoke test on production
- Monitor for the first 1-2 weeks (form submissions arriving correctly, image loading, no console errors)
- Optional: agree on a support/retainer arrangement for future changes, since "just one more field" requests are near-certain

## Total Estimated Timeline
- **MVP (Phase 1 only, static):** ~1-1.5 weeks
- **Full version (Phases 0-4):** ~4.5-6.5 weeks solo, assuming client content (photos/copy) doesn't become a bottleneck
- Add buffer if client photography/copy isn't ready by end of Phase 0 — this is the most common real-world slippage point, not the code itself

## Sequencing Rule of Thumb
Don't start Phase 2 (backend) until Phase 1 (static design) has explicit client sign-off. This is the single biggest time-saver in the whole plan — schema and admin-panel rework after the fact is expensive; JSON-file rework is cheap.
