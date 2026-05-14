# Design System: AhmedHall — Municipality Hall Booking System

## 1. Visual Theme & Atmosphere

A restrained, daily-app interface with predictable symmetric layouts and fluid CSS motion. The atmosphere is municipal-official — trustworthy, calm, and unpretentious. Not a showcase, a tool. Warm terracotta accents against cool blue-neutral canvases create subtle tension without distraction. Arabic-first RTL reading flow with generous whitespace that communicates reliability, not emptiness. Density sits at Daily App Balanced (4–7), variance at Predictable Symmetric (1–3), motion at Fluid CSS (4–7).

## 2. Color Palette & Roles

- **Canvas Tint** (#F5F7FA) — Page background. Cool blue-neutral, almost white
- **Pure Surface** (#FFFFFF) — Card, sidebar, and container fills
- **Charcoal Slate** (#3B3E44) — Primary text, headings, high-emphasis content
- **Muted Steel** (#7A7F88) — Secondary text, descriptions, metadata, placeholder labels
- **Terracotta** (#C94A34) — Single accent for primary CTAs, active states, selected nav items, focus rings, chart highlights. Warm, saturated but controlled
- **Bone Border** (#D5DAE2) — Card borders, 1px structural lines, input borders
- **Shell Base** (#EDF0F5) — Muted/sidebar surface, secondary button backgrounds, table row hover
- **Coral Alert** (#C94434) — Destructive actions, error states, deletion warnings
- **Verdant** (#3B8B5E) — Success states, confirmed bookings, payment completed indicators
- **Dark Canvas** (#181B20) — Dark mode page background
- **Dark Surface** (#21242B) — Dark mode card and container fills
- **Dark Border** (#2E3138) — Dark mode structural borders

Neutrals are tinted toward a cool blue (hue ~250, chroma ≤0.02). Pure black (#000) and pure white (#FFF) are never used.

## 3. Typography Rules

- **Display & Headings:** Geist — Track-tight (`tracking-tighter`), weight-driven hierarchy. H1 at text-2xl md:text-3xl with font-bold. No massive H1s. Hierarchy through weight and color, not scale alone
- **Body:** Cairo (Arabic) / Geist (Latin) — Relaxed leading (`leading-relaxed`), max-width 65ch for readable text blocks. Secondary text in Muted Steel (#7A7F88)
- **Mono:** Geist Mono — For numbers in high-density views, metadata, timestamps, and calendar dates
- **Scale:** 1.25 ratio between steps. Flat scales are avoided
- **Banned:** Inter, Times New Roman, Georgia, Garamond, Palatino, generic system fonts for premium contexts. Serif fonts are strictly banned — this is a dashboard, not editorial

## 4. Component Stylings

- **Primary Buttons:** Terracotta fill, white text, `rounded-full`, 1rem base radius. No outer glow. Tactile `-translate-y-[1px]` push on `:active`. `scale-[0.98]` on press for physical feedback. Hover: brightness shift, no scale
- **Secondary Buttons:** Shell Base (#EDF0F5) fill or ghost outline variant. Same radius, same active feedback
- **Destructive Buttons:** Coral Alert (#C94434) fill, white text. Same interaction model
- **Cards:** Pure white fill, 1px Bone Border stroke, `rounded-[1rem]` base. Shadow (`shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]`) is whisper-thin. Used only when elevation communicates hierarchy. Nested cards are always wrong. In high-density views, replace with `border-t` dividers or negative space
- **Inputs:** Label above input, error text below. 1px Bone Border, focus ring in Terracotta. No floating labels. `gap-2` for input blocks. `rounded-lg`
- **Sidebar:** Shell Base surface, Terracotta active indicator. Compact, utilitarian. No icons larger than needed for recognition
- **Tables:** Clean header row with subtle bottom border, no card boxes. Row hover in Shell Base. Sortable column headers where applicable
- **Loaders:** Skeletal shimmer matching exact layout dimensions — rectangular blocks for cards, lines for text. No generic circular spinners. Animation: shimmer gradient sweep
- **Empty States:** Composed Arabic message indicating what to do next. Not just "لا توجد بيانات" — includes action prompt
- **Error States:** Inline, red text below the relevant field. Toast for system-level errors via Sonner (`position: top-center`)
- **Modals:** Alert dialogs for confirmations (delete, cancel). Used sparingly — prefer inline actions

## 5. Layout Principles

- **Grid-first:** CSS Grid for all multi-element layouts. No flexbox percentage math (`w-[calc(33%-1rem)]`)
- **Dashboard shell:** Sidebar + header + content area pattern. Sidebar collapsible
- **Page max-width:** `max-w-[1400px] mx-auto` for content regions
- **Content padding:** `p-6` inside dashboard, consistent across all pages
- **Vertical rhythm:** `space-y-8` between sections, `space-y-4` between related elements
- **Cards-only-when-needed:** Stats use value-label pairs without card wrappers. Tables use clean dividers, not row cards
- **Full-height sections:** `min-h-[100dvh]`, never `h-screen` (iOS Safari)
- **Responsive collapse:** All multi-column layouts collapse to single column below 768px. No horizontal overflow

## 6. Motion & Interaction

- **Easing:** `cubic-bezier(0.19, 1, 0.22, 1)` — ease-out-expo throughout. No bounce, no elastic
- **Duration:** 200–300ms for most transitions
- **Staggered reveals:** CSS `animation-delay` cascade via `.stagger-1` through `.stagger-4` (0ms, 60ms, 120ms, 180ms). Used for dashboard sections on page load
- **Micro-interactions:** Buttons get `transition: all 200ms var(--ease-out-expo)`. Hover/active state changes only
- **Reduced motion:** All animations respect `prefers-reduced-motion: reduce` — immediate opacity, no transforms
- **Perpetual motion:** None. This is a municipal tool, not a showcase. No pulsing badges, no floating elements, no auto-carousels
- **Performance:** Only `transform` and `opacity` are animated. Never `top`, `left`, `width`, `height`

## 7. Anti-Patterns (Banned)

- No emojis anywhere in the interface
- No Inter font
- No serif fonts (this is a dashboard)
- No pure black (#000) or pure white (#FFF)
- No neon/outer glow shadows on any element
- No oversaturated accents (single Terracotta accent, chroma < 0.22)
- No gradient text (`background-clip: text`)
- No glassmorphism — no blurs, no frosted glass panels
- No custom mouse cursors
- No overlapping elements — every element occupies its own clear spatial zone
- No 3-column equal card layout grids
- No centered Hero sections (no hero at all — this is a dashboard)
- No generic placeholder names ("John Doe", "Acme")
- No fake round numbers (99.99%, 50%)
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- No filler UI text ("Scroll to explore", bouncing chevrons)
- No broken Unsplash image links
- No nested cards
- No side-stripe colored borders on cards or list items
- No floating action buttons or speed dials
- No parallax, scroll hijacking, or complex scroll-triggered effects
- No particle effects, confetti, or celebration animations
