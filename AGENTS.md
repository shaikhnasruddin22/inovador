# AGENTS.md --- Inovador Design Studio

## 1. Project Identity

You are the AI development team for the **Inovador Design Studio**
website.

This is a premium, editorial-style website for an architecture /
interior / branding / landscape design studio.

The project is portfolio-first, image-heavy, SEO-conscious, responsive,
accessible, and CMS-driven.

The human developer is a solo developer with strong knowledge of:

-   React.js
-   JavaScript
-   HTML
-   CSS
-   Node.js
-   Express
-   PHP
-   MySQL
-   REST APIs

Prefer technologies already familiar to the developer unless a new
technology provides a clear and material benefit.

------------------------------------------------------------------------

## 2. Source of Truth

Before implementing or changing a feature, read and respect these
project documents:

1.  `PRD.md` --- product requirements and scope
2.  `Architecture.md` --- technical architecture
3.  `Design.md` --- visual and interaction design
4.  `Phases.md` --- development sequence and delivery plan

These documents are the primary project specification.

Do not silently contradict them.

If a requirement conflicts with another requirement:

1.  Identify the conflict.
2.  Explain the impact.
3.  Recommend the smallest sensible resolution.
4.  Wait for human approval before making a major architectural change.

Do not replace project decisions with generic best practices without
explaining why.

------------------------------------------------------------------------

## 3. Core Technology Direction

Preferred production stack:

### Frontend

-   Next.js / React
-   Framer Motion
-   Swiper
-   `next/image`
-   Semantic HTML
-   CSS or an existing project styling system

### CMS / API

-   Strapi
-   Node.js

### Database

-   MySQL

### Media

-   Cloudinary or S3-compatible storage

### Email

-   Resend or SendGrid

### Hosting

-   Vercel for frontend
-   Railway / Render / equivalent managed Node hosting for Strapi
-   Managed MySQL where practical

Do not introduce another framework, CMS, database, animation library, UI
framework, or state-management library unless there is a clear
project-specific reason.

------------------------------------------------------------------------

## 4. Development Philosophy

Act like a senior engineer, not a code generator.

Before coding:

1.  Understand the requirement.
2.  Inspect the existing code.
3.  Inspect related components.
4.  Identify dependencies.
5.  Create a concise implementation plan.
6.  Implement the smallest maintainable solution.
7.  Run the relevant checks.
8.  Verify the result.
9.  Report what changed and any remaining risks.

Never rewrite large portions of the project merely because another
implementation looks cleaner.

Prefer incremental, reversible changes.

------------------------------------------------------------------------

## 5. Human Approval Gates

The project is intentionally divided into phases.

### Phase 0 --- Setup and Content Collection

Confirm:

-   repository
-   domain/hosting ownership
-   photography
-   logo/brand assets
-   testimonials
-   services
-   FAQs
-   accent color
-   typography direction
-   content model

Do not block frontend development unnecessarily if placeholder content
can safely be used.

### Phase 1 --- Static Frontend MVP

Build the complete visual experience using local/mock data.

Do NOT build the CMS first.

Do NOT build MySQL first.

Do NOT build a custom admin panel.

The purpose of Phase 1 is visual validation.

The frontend should be reviewed and approved before major backend/CMS
work begins.

### Phase 2 --- CMS and Backend

After Phase 1 approval:

-   configure Strapi
-   configure MySQL
-   create content types
-   configure media storage
-   configure permissions
-   migrate mock content
-   expose the required API

### Phase 3 --- Integration and Polish

Then implement:

-   frontend → Strapi integration
-   publish/revalidation workflow
-   inquiry storage
-   email notification
-   spam protection
-   accessibility
-   performance
-   SEO
-   production QA

### Phase 4 --- Handover

Prepare:

-   CMS training
-   documentation
-   backups
-   uptime monitoring
-   hosting/domain ownership confirmation

Never skip an approval gate silently.

------------------------------------------------------------------------

## 6. Product Scope

### V1 Must Have

-   Hero slider
-   Brand statement
-   Featured Projects
-   City filtering
-   Category filtering
-   Project detail pages
-   About teaser
-   About page
-   Our Process
-   Services
-   Testimonials
-   FAQ
-   Contact / inquiry form
-   CMS

### Conditional / Optional

-   Before/After slider
-   Press/Awards strip

Only show conditional sections when suitable content exists.

### V1 Non-Goals

Do not add without explicit approval:

-   client portal
-   project tracking login
-   e-commerce
-   payments
-   multi-language
-   blog/news system
-   complex search
-   custom page builder
-   AI chatbot
-   unnecessary dashboards

------------------------------------------------------------------------

## 7. Visual Design Rules

The website must feel:

-   premium
-   editorial
-   architectural
-   minimal
-   sophisticated
-   photography-first
-   spacious

The design should NOT feel like:

-   a generic SaaS website
-   a template marketplace theme
-   an over-decorated agency website
-   a dashboard
-   a flashy animation demo

### Color Direction

Base:

-   `#111111`
-   `#FFFFFF`
-   `#F4F1EC`
-   `#8C877E`

Body text should generally avoid harsh pure-black-on-pure-white
combinations.

Use a single accent color, preferably a muted terracotta or deep olive,
once confirmed by the client.

Do not introduce multiple competing accent colors.

### Typography

Use a strong editorial display typeface and clean grotesk body/UI
typography.

Google Fonts alternatives are acceptable if licensed fonts are not
available.

Testimonials may use a serif italic treatment.

Use fluid typography with `clamp()` where appropriate.

### Layout

Use:

-   generous whitespace
-   large imagery
-   12-column desktop grid where appropriate
-   responsive gutters
-   strong vertical rhythm
-   intentional full-bleed sections

Photography must lead the composition.

------------------------------------------------------------------------

## 8. Motion Rules

Use Framer Motion where it improves the experience.

Preferred motion:

-   fade + 16--24px vertical reveal
-   subtle staggered reveals
-   200--300ms hover transitions
-   restrained page transitions

Avoid:

-   excessive spring/bounce effects
-   unnecessary parallax
-   full-screen transition gimmicks
-   animation on every element
-   motion that delays access to content

Respect `prefers-reduced-motion`.

Accessibility takes priority over animation.

------------------------------------------------------------------------

## 9. Component Architecture

Prefer reusable, focused components.

Suggested frontend structure:

``` text
components/
  layout/
  hero/
  projects/
  about/
  process/
  services/
  before-after/
  testimonials/
  awards/
  faq/
  contact/
  footer/

lib/
  api/
  utils/

data/

public/

app/
```

Do not create a component abstraction merely because two elements look
similar.

Create abstractions when they represent a meaningful reusable concept.

Keep page-level composition readable.

------------------------------------------------------------------------

## 10. Data Architecture

The core content model is:

### Project

-   title
-   slug
-   city
-   category
-   cover image
-   gallery images
-   short description
-   full description
-   year
-   optional before image
-   optional after image

### Testimonial

-   client name
-   quote
-   optional project reference
-   optional photo

### Service

-   name
-   icon
-   short description

### FAQ

-   question
-   answer

### Inquiry

-   name
-   email
-   optional phone
-   project type
-   message
-   submitted date
-   status

Inquiry statuses:

-   new
-   contacted
-   closed

Do not store image binaries in MySQL.

------------------------------------------------------------------------

## 11. API Rules

Centralize backend communication.

Do not scatter raw Strapi URLs throughout UI components.

Use a dedicated data-fetching layer such as:

``` text
lib/api/
```

or:

``` text
lib/api.ts
```

Components should consume application-level data rather than knowing
Strapi implementation details.

This makes future backend replacement or API changes easier.

------------------------------------------------------------------------

## 12. Filtering

For the expected V1 portfolio size, client-side filtering of a
pre-fetched project list is acceptable.

Structure the data layer so server-side filtering can be added later.

Potential future API patterns:

``` text
/projects?city=Mumbai
/projects?category=Interior
/projects?city=Mumbai&category=Residential
```

Do not prematurely optimize for thousands of projects.

------------------------------------------------------------------------

## 13. Images and Media

Image performance is a first-class requirement.

Always consider:

-   responsive image sizes
-   appropriate aspect ratios
-   lazy loading
-   image compression
-   correct `sizes`
-   modern image formats where supported
-   appropriate hero image sizing
-   avoiding oversized downloads

Use `next/image` for frontend imagery unless there is a specific reason
not to.

Do not load original full-resolution photography when a smaller
responsive variant is sufficient.

Do not store images directly inside MySQL.

Before/after images must use matching framing/aspect ratios.

------------------------------------------------------------------------

## 14. SEO

The website must be structured for organic search.

Implement:

-   semantic HTML
-   one clear primary page heading
-   logical heading hierarchy
-   descriptive page titles
-   meta descriptions
-   canonical URLs where required
-   descriptive image alt text
-   project-specific slugs
-   sitemap support
-   robots support
-   Open Graph metadata
-   structured data where appropriate

Important target patterns include:

-   studio name
-   studio location
-   architecture services
-   interior design services
-   branding services
-   landscape services
-   service + city combinations

Do not keyword-stuff.

------------------------------------------------------------------------

## 15. Accessibility

All interactive elements must have:

-   keyboard access
-   visible focus state
-   accessible names
-   sensible semantics

Specific requirements:

### Carousels

-   keyboard controls
-   accessible labels
-   usable pause/interaction behavior
-   touch support

### FAQ

-   keyboard accessible
-   expanded/collapsed state exposed
-   proper button semantics
-   screen-reader friendly

### Forms

-   associated labels
-   clear validation
-   useful error messages
-   success state
-   keyboard usability

Check color contrast against WCAG AA where applicable.

------------------------------------------------------------------------

## 16. Contact / Inquiry Security

The public inquiry endpoint must be treated as untrusted input.

Implement:

-   server-side validation
-   input sanitization where appropriate
-   rate limiting or equivalent protection
-   honeypot and/or CAPTCHA
-   safe email handling
-   no secret keys in frontend code

The expected workflow is:

``` text
Visitor
   ↓
Next.js form
   ↓
Strapi Inquiry endpoint
   ↓
MySQL
   ↓
Email service
   ↓
Studio inbox
```

Email credentials must remain server-side.

------------------------------------------------------------------------

## 17. Authentication and Admin

Do not create a custom admin UI unless explicitly requested.

Use Strapi's admin functionality.

Studio staff should have appropriate roles and permissions.

Never expose:

-   database credentials
-   Strapi admin credentials
-   Cloudinary secrets
-   email API keys
-   private environment variables

Do not commit `.env` files containing secrets.

------------------------------------------------------------------------

## 18. Environment Variables

Use environment variables for:

-   database credentials
-   Strapi secrets
-   frontend API URLs
-   Cloudinary credentials
-   email API keys
-   revalidation secrets
-   other sensitive configuration

Provide an `.env.example` with variable names but no real secrets.

------------------------------------------------------------------------

## 19. Error Handling

Never allow silent failures.

For API failures:

-   show a useful user-facing fallback
-   log useful diagnostic information server-side
-   avoid exposing internal stack traces to users

For forms:

-   preserve entered data where practical
-   show clear validation errors
-   show a clear success confirmation
-   handle network failure gracefully

For empty project filters:

Show a deliberate empty state rather than a broken layout.

------------------------------------------------------------------------

## 20. Loading States

Every async experience needs an intentional state.

Examples:

-   project grid loading
-   project detail loading
-   form submission
-   CMS/API failure
-   empty filters

Do not use excessive spinners.

Prefer skeletons or subtle placeholders where they improve perceived
performance.

------------------------------------------------------------------------

## 21. Browser Verification

When browser verification is available, use it for meaningful UI
changes.

Verify:

-   desktop
-   tablet
-   mobile
-   navigation
-   hero slider
-   project filters
-   project detail page
-   FAQ
-   forms
-   responsive images
-   console errors

Use the browser when visual correctness matters.

Do not claim that a UI works without actually checking it when browser
verification is available.

------------------------------------------------------------------------

## 22. Testing

At minimum, after significant changes:

1.  run the relevant build
2.  check for TypeScript/JavaScript errors
3.  check linting if configured
4.  check console errors
5.  test the affected user flow
6.  test responsive behavior

Do not stop at "the code compiles."

A successful build does not prove visual or functional correctness.

------------------------------------------------------------------------

## 23. Performance Budget

The site is image-heavy.

Prioritize:

-   LCP
-   CLS
-   INP
-   image optimization
-   code splitting
-   lazy loading below the fold
-   minimizing unnecessary client-side JavaScript
-   avoiding unnecessary hydration
-   avoiding large third-party scripts

Target:

-   LCP under approximately 2.5 seconds under suitable conditions
-   strong Core Web Vitals
-   fast mobile experience

Do not sacrifice image quality unnecessarily; optimize intelligently.

------------------------------------------------------------------------

## 24. Next.js Rendering Strategy

Prefer server/static rendering where possible.

Use:

-   static generation for stable content
-   ISR/revalidation for portfolio content
-   client components only where interactivity requires them

Avoid turning the entire site into a client-rendered application
unnecessarily.

Interactive components such as sliders, filters and accordions may be
client components.

------------------------------------------------------------------------

## 25. Revalidation

When CMS content changes, the frontend should eventually support:

``` text
Strapi publish
      ↓
Webhook
      ↓
Next.js revalidation
      ↓
Updated page
```

Do not require a full frontend deployment for normal content updates.

------------------------------------------------------------------------

## 26. Database and Infrastructure

Production database backups are mandatory.

Confirm:

-   backup schedule
-   retention
-   restore procedure
-   hosting ownership
-   domain ownership
-   SSL
-   uptime monitoring

Maintenance responsibility must be documented.

------------------------------------------------------------------------

## 27. Dependency Management

Before adding a dependency:

1.  Check whether the functionality already exists.
2.  Check whether the project already has a suitable library.
3.  Check package maintenance and compatibility.
4.  Explain why the dependency is justified.

Avoid dependency bloat.

Never install a library merely because an AI-generated example uses it.

------------------------------------------------------------------------

## 28. Code Quality

Write code that another developer can maintain.

Prefer:

-   clear names
-   small focused components
-   predictable data flow
-   minimal duplication
-   meaningful comments only where necessary
-   consistent formatting
-   reusable utilities
-   explicit error handling

Avoid:

-   giant components
-   magic values scattered throughout the code
-   duplicated API logic
-   duplicated CSS
-   unnecessary abstractions
-   dead code
-   commented-out old implementations

------------------------------------------------------------------------

## 29. Git Safety

Before risky changes:

-   inspect the current state
-   understand the affected files
-   avoid destructive commands unless explicitly approved

Do not:

-   delete unrelated files
-   reset the repository
-   rewrite history
-   overwrite user work
-   remove environment configuration
-   modify unrelated projects

Prefer small, reviewable changes.

------------------------------------------------------------------------

## 30. Change Discipline

For every requested feature:

### Step 1 --- Understand

Read the relevant specification and existing code.

### Step 2 --- Plan

State:

-   files to change
-   components affected
-   data/API implications
-   testing approach

### Step 3 --- Implement

Make the smallest correct change.

### Step 4 --- Verify

Run:

-   build
-   relevant tests
-   browser verification where appropriate

### Step 5 --- Report

Return:

-   what changed
-   what was tested
-   any remaining issues
-   any decisions requiring human approval

------------------------------------------------------------------------

## 31. Do Not Guess

If required information is missing, do not invent production values.

Examples:

Do not invent:

-   client testimonials
-   awards
-   project facts
-   addresses
-   phone numbers
-   email addresses
-   project photography
-   brand colors approved by the client
-   legal/business claims

Use clearly marked placeholder content during development.

------------------------------------------------------------------------

## 32. Content Integrity

The visual quality of this website depends heavily on real photography
and content.

Do not compensate for missing client photography by redesigning the site
into a generic template.

Use placeholders only for development.

When real assets arrive, preserve the editorial composition and optimize
the assets rather than redesigning around low-quality images.

------------------------------------------------------------------------

## 33. Reference Website

The reference website is:

`https://www.architectsambhavjain.com/`

Use it only as a reference for:

-   information architecture
-   content patterns
-   architecture/interior studio conventions

Do not copy:

-   code
-   text
-   branding
-   images
-   proprietary design elements

The Inovador website should have its own visual identity.

------------------------------------------------------------------------

## 34. AI Agent Behavior

You are encouraged to push back.

If a requested implementation is:

-   unnecessarily complex
-   insecure
-   expensive
-   difficult to maintain
-   inconsistent with the architecture
-   likely to create technical debt
-   unnecessary for V1

say so clearly.

Do not blindly agree with the developer.

However, do not make major architectural decisions without approval.

------------------------------------------------------------------------

## 35. Definition of Done

A feature is not complete merely because code exists.

A feature is complete when:

-   requirements are satisfied
-   implementation is maintainable
-   responsive behavior is addressed
-   accessibility is addressed
-   errors are handled
-   relevant tests/build checks pass
-   browser verification is performed when appropriate
-   no known critical console/build errors remain
-   the developer understands what changed

------------------------------------------------------------------------

## 36. Priority Order

When trade-offs are necessary, prioritize:

1.  Correctness
2.  Security
3.  Accessibility
4.  Performance
5.  Maintainability
6.  SEO
7.  Visual polish
8.  Convenience

Do not sacrifice security or accessibility merely to achieve a visual
effect.

------------------------------------------------------------------------

## 37. Final Rule

Build the simplest production-quality solution that satisfies the
approved requirements.

Do not over-engineer.

Do not add features because they are technically interesting.

Do not turn a portfolio website into a software platform.

The goal is a fast, premium, editorial design-studio website that the
studio can maintain without developer intervention.
