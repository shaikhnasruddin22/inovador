# PRD — Inovador Design Studio Website

## 1. Overview
A public-facing marketing website for Inovador Design Studio (architecture / interior / branding / landscape studio). Editorial visual style, self-service content management for the client (no code changes needed to update portfolio, testimonials, services, or FAQs).

## 2. Goals
- Give the studio a premium, portfolio-first web presence that reflects their design quality.
- Let visitors browse work by city/category and get a feel for the studio's process.
- Convert visitors into inquiries via a simple, low-friction contact form.
- Let the studio's team update projects, testimonials, services, and FAQs themselves, without touching code.
- Rank in search for the studio's name, location, and service categories.

## 3. Non-Goals (v1)
- No client portal / login area for project tracking.
- No e-commerce or payments.
- No multi-language support (unless client requests — flag as v2).
- No blog/news section unless explicitly requested (flag as v2).

## 4. Target Users
- **Prospective clients** (homeowners, businesses) researching design studios — primary audience, browsing on mobile and desktop.
- **Press / partners** — looking for credibility signals (awards, past work).
- **Studio staff / admin** — non-technical, needs to update content regularly (new projects, testimonials).

## 5. Core Features (v1 scope)

| Feature | Description | Priority |
|---|---|---|
| Hero slider | Full-bleed rotating imagery + one-line brand statement | Must |
| Featured Projects grid | Filterable by city + category, hover reveals | Must |
| Project detail view | Individual project page/modal with gallery | Must |
| About teaser | Short blurb + link to full About page | Must |
| Our Process | 4-step numbered section with scroll-in animation | Must |
| Services grid | Icon-based, 4-6 service categories | Must |
| Before/After slider | Interactive comparison widget | Should |
| Testimonials carousel | Serif-styled, client quotes | Must |
| Press/Awards strip | Logo strip, conditional on client having press | Could |
| FAQ accordion | Common client questions | Must |
| Contact/inquiry form | Name, email, project type, message → stored + emailed | Must |
| CMS admin | Studio can edit all dynamic content without a developer | Must |

## 6. Content Model (drives the CMS/API schema)
- **Project**: title, city, category, cover image, gallery images, short description, year, before/after image pair (optional)
- **Testimonial**: client name, quote, project reference (optional), photo (optional)
- **Service**: name, icon, short description
- **FAQ**: question, answer
- **Inquiry**: name, email, phone (optional), project type, message, submitted date, status (new/contacted/closed)

## 7. Success Metrics
- Inquiry form submissions per month (primary conversion metric)
- Page load performance: Core Web Vitals passing (LCP < 2.5s especially, given image-heavy design)
- Studio successfully self-publishes at least one new project without developer help within first month post-launch
- Organic search visibility for studio name + "[service] + [city]" queries

## 8. Constraints
- Solo developer, client-funded build.
- Studio needs to self-manage content post-launch — CMS usability matters as much as frontend polish.
- Image-heavy site — performance budget must be respected from day one, not bolted on later.

## 9. Open Questions (resolve with client before/during build)
- Does the studio want video in the hero, now or later?
- How many initial projects/testimonials will be provided for launch content?
- Do they need multi-language support?
- Who owns hosting/domain after handover, and who's responsible for ongoing maintenance?
- Is there a brand style guide (fonts, exact palette) or is that being defined during this build?

## 10. Out of Scope Risks
- Scope creep on the admin panel ("just one more field") — see Phases.md for how this is contained.
- Client providing low-resolution or inconsistent project photography — flag early, this affects the "editorial" feel more than any code decision.
