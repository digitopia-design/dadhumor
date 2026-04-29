# CLAUDE.md

This file gives Claude context about the Dad Humor project. Claude reads this automatically at the start of every session. Keep it current.

**Document version:** 1.3

---

## Project Summary

**Dad Humor** (dadhumor.app) - a mobile-first, single-joke-at-a-time dad joke experience. Mascot-driven (Stache), dark-mode-only, built to be shared not scrolled. Target audience is Gen-Z/Millennials who love dad jokes ironically.

**Owner:** Digitopia Design Ltd
**Stage:** MVP live, rebuilding for v1 launch
**Current phase:** Phase 2 - Technical Foundation
**Sister brand:** Bantered (POD/Shopify, owned by same parent) - merch integration planned for Phase 6
**Content system:** MDX-based articles in Phase 4.6 (no external CMS)

---

## Before You Do Anything

1. **Read `/docs/handover.md`** - full project context, data model, gesture system, brand
2. **Read `/docs/build-plan.md`** - sequenced tasks to work through
3. **Reference `/docs/dadhumor_mockup_v2.html`** whenever you need UX clarity - open it or read the source; it's self-contained and shows the intended feel
4. **For phase-specific work, read the relevant strategy doc:**
   - `/docs/fathers-day-campaign.md` (Phase 4.5)
   - `/docs/bantered-integration-spec.md` (Phase 6)
   - `/docs/monetisation-roadmap.md` (Phase 9+ context)

If any of those files are missing, stop and ask the user where they are.

---

## Tech Stack

- **Framework:** Next.js 14+ App Router, TypeScript
- **Styling:** Tailwind CSS (brand tokens defined in `tailwind.config.ts`)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Animation:** Framer Motion
- **Analytics:** Vercel Analytics + GA4 + PostHog
- **OG Images:** `@vercel/og`

---

## Page Context Rules (CRITICAL - read this carefully)

The site uses a dual-context theme system. **The decision is behavioural, not structural.**

### Brand Context (always dark, no toggle)
Punchy, scrolling, sharing. Joke delivery and visual brand moments.
- `/` - Main joke experience
- `/j/[slug]` - Individual joke permalinks
- `/fathers-day` - Campaign landing
- `/widget/signage` - Digital signage
- `/generate` - AI joke generator
- `/leaderboard` - Battle mode (Phase 5)
- `/shop` - Product showcase
- API responses, OG image renders, share cards

### Reading Context (light default, dark toggle available)
Sustained reading. Articles, legal, about, etc.
- `/about`, `/privacy`, `/terms`, `/contact`, `/colophon`
- `/blog` - Article listing
- `/blog/[slug]` - Individual articles

### Decision rule for any new page:
Ask "is this a brand performance or a reading experience?"
- Performance = dark (no toggle)
- Reading = light default, dark toggle available
- When unsure, default to light with toggle

**Site shell stays consistent across both contexts.** Same logo, same nav, same footer pattern. Only the body content area changes context.

---

## Brand Tokens (Use These, No Hardcoded Values)

### Context-aware tokens (preferred)

These swap automatically based on `data-theme` attribute:

```
bg-bg               -- primary background
bg-bg-surface       -- surfaces, cards
bg-bg-elevated      -- elevated surfaces
border-bg-border    -- borders

text-text           -- primary text
text-text-secondary -- muted text (replaces "smoke")
text-text-tertiary  -- disabled, very subtle
text-text-inverse   -- text on opposite-context backgrounds

text-brand-yellow   -- the iconic yellow
bg-brand-yellow     -- yellow as background

text-reaction-lime  -- Props
text-reaction-pink  -- Groan
text-reaction-cyan  -- Share
text-reaction-red   -- Errors
```

### Direct brand colours (use when context-independent)

For things that NEVER change theme (share cards, OG images, etc.):
```
bg-midnight    /* #121212 */
bg-charcoal    /* #1A1A1A */
bg-cream       /* #FAF8F2 */
bg-paper       /* #F4F1E8 */
text-yellow    /* #E3FF00 */
```

### Fonts
- `font-display` - Outfit - headings, punchlines, wordmark (weights 600-800)
- `font-body` - Inter - body text, setups, UI (weights 400-700)

### Yellow on light backgrounds - the "pill treatment"
Cyber Yellow on cream fails accessibility (1.1:1). The fix: yellow always appears INSIDE a dark pill/block on light pages. Patterns:
- Logo: "HUMOR." appears as yellow text inside a dark pill
- Title highlights: yellow background highlight on dark text
- Inline emphasis: dark pill with yellow text
- Embedded jokes: full midnight card embedded inside light article body
- CTAs: dark button with yellow text

This becomes a signature visual move - it actually strengthens brand recognition.

### Never
- Use light mode on Brand Context pages (joke app, etc.)
- Use cyber yellow as text directly on cream backgrounds (always wrap in dark pill)
- Hardcode hex colours - always use tokens
- Use emoji as decorative crutch (one or two, surgically placed)
- Apologise for jokes being bad (that's the point)
- Write corporate-friendly microcopy

---

## Voice & Microcopy Guidelines

Brand voice: *"Your funniest uncle at 11pm - loud, self-aware, unembarrassed, a little too online."*

**Write like this:**
- ✅ "Fetching fresh groans..." (not "Loading...")
- ✅ "This page walked into a bar. It's not there anymore." (not "404 Not Found")
- ✅ "Oof. That one bombed. Try again?" (not "An error occurred")
- ✅ "Noted. Your groan has been logged." (not "Thanks!")
- ✅ "Brace yourself. Tap." (not "Tap to reveal")

**Never write:**
- ❌ "Please wait while we load your content"
- ❌ "Thank you for your interaction"
- ❌ Any form of corporate-speak

Every string is a chance to reinforce brand. Make each one land.

---

## Gesture System (5 Core Interactions)

Every gesture has a button equivalent. Users can learn either way.

| Action | Mobile | Desktop | Haptic |
|---|---|---|---|
| Reveal | Tap | `Space` | `haptic.light()` |
| Next | Swipe left | `←` or `Space` | `haptic.light()` |
| Props | Swipe right | `→` | `haptic.medium()` |
| Groan | Long-press button (800ms) | `G` | Build buzz → heavy thud |
| Share | Swipe up | `↑` or `S` | `haptic.light()` |
| Stash | Double-tap card | `Shift+S` | `haptic.double()` |

**Critical:** The action bar appears only AFTER the punchline is revealed. Never before.

---

## Code Conventions

### Components
- Functional components only, no classes
- Named exports over default: `export function MyComponent()` not `export default`
- Props always typed via `interface`
- Tailwind classes inline, no CSS modules
- Use `cn()` (clsx) utility for conditional classes

### File organisation
```
/src
  /app         - Next.js routes
  /components  - Reusable UI components
  /lib         - Business logic, data access, utilities
  /hooks       - Custom React hooks
  /types       - Shared TypeScript types
```

### Imports
- Use `@/` absolute imports: `import { Stache } from '@/components/Stache'`
- Group imports: third-party first, then `@/` imports, then relative

### Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types/interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`

---

## Supabase Rules

- **Never** write directly to the jokes table from the client - use RPC functions
- **Always** use the typed helpers in `/src/lib/jokes.ts`
- **Always** handle errors gracefully - return null, don't throw
- RLS is enabled - test that anonymous users can read + call RPCs

---

## Performance Rules

- Images always via `next/image` (handles lazy loading, format selection, sizing)
- Stache PNGs are large - use `priority` only on above-fold images
- Minimise client-side JavaScript - prefer server components where possible
- Framer Motion is heavy - only use on pages that need it
- Bundle size target: under 200KB gzipped for initial page load

---

## Accessibility

- All interactive elements have visible focus states
- Colour contrast passes WCAG AA minimum
- Keyboard navigation works for all gestures
- Gestures have button equivalents (already core to the design)
- Haptic is additive, never required for function
- Alt text on all Stache images
- Reduce motion preference respected (wrap Framer Motion with `useReducedMotion`)

---

## What's In Scope For v1 (Phases 2-4)

✅ 50 seed jokes with categories
✅ All 5 gestures working on mobile + desktop
✅ Dynamic OG share cards (3 formats)
✅ Individual joke permalinks (`/j/[slug]`)
✅ Stash via localStorage
✅ Full onboarding flow
✅ Analytics (Vercel + GA4 + PostHog) with country tracking
✅ Haptic feedback (Android - iOS no-ops gracefully)
✅ Joke of the Day API
✅ Digital signage widget page
✅ WordPress plugin

## What's For Phases 4.5-8 (Post-Launch, Time-bound or Strategic)

🟡 Phase 4.5 - Father's Day campaign (June 2026)
🟡 Phase 4.6 - Articles / content system (MDX-based, lightweight)
🟡 Phase 5 - Battle mode, collections, streaks, Send-a-Joke, user submissions
🟡 Phase 5.5 - AI joke generator
🟡 Phase 6 - Bantered merchandise integration
🟡 Phase 7 - Sound effects (toggle, off by default)
🟡 Phase 8 - Press/data marketing infrastructure

## What's NOT In Scope At All

❌ Light mode on Brand Context pages (joke app stays dark forever - see Page Context Rules above)
❌ NFTs/blockchain
❌ SMS subscription
❌ AI-generated imagery per joke (different from AI joke text generator)
❌ Comments / replies / threaded discussions
❌ Following / social graph

These are explicitly out. Don't scope-creep into them.

**Note on light mode:** As of v1.3, light mode IS permitted on Reading Context pages (articles, legal, about). It's NOT permitted on Brand Context pages (joke app, share cards, etc.). Read the Page Context Rules section above for the full picture.

---

## When You Hit A Decision Point

**If the task is clear and unambiguous:** just do it.

**If multiple valid approaches exist:** pick the one that's faster to ship and more maintainable. Mention the decision in the PR description.

**If it requires a brand or strategic decision:** stop and ask the user. Don't guess on brand.

**If it's outside the build plan:** flag it. Don't scope-creep.

---

## Testing Approach

No formal test suite for v1. Rely on:
- TypeScript strictness (`strict: true` in tsconfig)
- Manual testing on mobile (iOS Safari + Android Chrome) after each task
- Vercel preview deployments for PR review
- Lighthouse checks before each deploy

Add Vitest later if/when the app grows.

---

## Deployment

- Every push to `main` = production deploy
- Every branch push = preview deploy
- Database migrations run manually via Supabase SQL editor
- Secrets managed in Vercel dashboard

---

## Communication Style

User prefers:
- UK English
- Direct, actionable responses
- Options (Option 1 / Option 2) with pros/cons when multiple routes exist
- Clear structure with headings and bullets
- No fluff, no over-praise
- Assumptions made explicit
- Use `-` instead of em-dashes

When you finish a task, give a brief summary of:
1. What you did
2. Any decisions you made
3. What to test
4. What's next

Don't narrate every step as you work - just ship the work and summarise.

---

## Asset Locations

- Stache mascot PNGs: `/public/stache/01-*.png` through `09-*.png`
- Brand guidelines (PDF): `/docs/DadHumor_Brand_Guidelines_v1.0.pdf`
- Seed jokes (SQL): `/docs/dadhumor_seed_jokes.sql`
- UX mockup (HTML): `/docs/dadhumor_mockup_v2.html`

If these aren't where expected, ask the user - don't invent paths.
