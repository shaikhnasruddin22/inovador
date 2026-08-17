# Design.md — Inovador Design Studio

## 1. Design Principles
- **Editorial, not templated.** Feels like a design magazine spread, not a stock "agency template."
- **Photography leads.** Every layout decision should make the project photography look better, not compete with it.
- **Restraint over decoration.** Whitespace and typography do the work; UI chrome stays minimal.
- **Motion supports, never distracts.** Micro-interactions should feel like quality control, not gimmicks.

## 2. Color Palette
- **Base neutrals:** Black (`#111111`), White (`#FFFFFF`), Warm Gray (`#F4F1EC` background, `#8C877E` mid-gray text)
- **Accent (single tone):** TBD with client — suggest a muted terracotta or deep olive to read as "warm/design-forward" without looking like a generic brand blue. Used sparingly: links, active states, form focus rings, one CTA button.
- Avoid pure black on pure white for body text — use `#1A1A1A` on `#FDFCFA` to reduce harshness at scale.

## 3. Typography
- **Display/headings:** Large modern serif or high-contrast sans (e.g., a Söhne/Canela-style pairing) — needs licensing check or a Google Fonts equivalent (e.g., "Fraunces" for serif display, "Inter" or "General Sans" for body/UI).
- **Body:** Clean grotesk sans, generous line-height (1.6+), comfortable measure (~65-75 characters per line).
- **Testimonials:** Serif italic treatment to visually separate from UI copy, per the brief.
- Type scale: at least 5 steps (e.g., 14 / 16 / 20 / 32 / 56px+ for hero), with fluid/responsive scaling via `clamp()`.

## 4. Layout System
- 12-column grid, generous gutters (min 24px mobile, 40px+ desktop).
- Section vertical rhythm: large consistent spacing between sections (96–160px desktop) to reinforce the "editorial breathing room" feel.
- Full-bleed sections (hero, before/after) break the grid intentionally; content sections stay grid-aligned.

## 5. Page Structure (single scrolling homepage, per brief)
1. Hero — full-bleed rotating slider, one-line brand statement, subtle scroll cue
2. Featured Projects — filterable grid (city/category), hover reveal (image → title/location overlay)
3. About teaser — short copy block + "Know more" link to full About page
4. Our Process — 4 numbered steps, scroll-triggered fade/slide-in
5. Services — icon grid, 4-6 items, consistent icon weight/style
6. Before/After slider (optional, conditional on client having renovation-type work)
7. Testimonials — serif carousel, auto-advance with manual override
8. Press/Awards strip — logo row, grayscale with color-on-hover
9. FAQ — accordion, single-open-at-a-time
10. Contact — inquiry form + studio contact details, warm closing tone

## 6. Component States to Design (don't skip these)
- Hover / active / focus states for every interactive element (grid cards, accordion, form fields, nav)
- Loading state for the project grid when filtering
- Empty state if a filter returns no projects
- Form validation states (inline errors, success confirmation)
- Mobile nav (hamburger/drawer) — hero slider and before/after slider both need touch-friendly mobile variants

## 7. Motion Guidelines (Framer Motion)
- Scroll-in: fade + 16-24px translate-Y, staggered by ~80-100ms per item in a grid.
- Hover reveals: 200-300ms ease, no bouncy/springy easing (keeps the "editorial" tone serious rather than playful).
- Page transitions: keep subtle — a slight fade is enough; avoid full-screen wipes that slow perceived performance.
- Respect `prefers-reduced-motion` — disable non-essential animation for users who request it.

## 8. Imagery Guidelines
- Require consistent aspect ratios per grid slot (avoid masonry chaos that undercuts the "editorial" feel).
- All images need responsive srcsets — hero images especially, since they're the heaviest asset on the page.
- Before/after images must be pre-cropped to identical framing/dimensions by the client or during upload, or the slider will look broken.

## 9. Accessibility Notes
- Color contrast: verify accent tone against both white and warm-gray backgrounds meets WCAG AA.
- All carousels (hero, testimonials, before/after) need keyboard controls and ARIA labels, not just touch/mouse.
- Accordion (FAQ) must be keyboard-operable and screen-reader announced (expanded/collapsed state).

## 10. Deliverables Before Dev Starts
- Confirmed accent color + type pairing (client sign-off)
- At least placeholder photography for grid layout testing (real photography ideally, but stand-ins are acceptable to unblock frontend work)
- Icon set for services (consistent style — outline or filled, not mixed)
