@AGENTS.md

# CLAUDE.md

This file gives Claude context about the Dad Humor project. Claude reads this automatically at the start of every session. Keep it current.

---

## Project Summary

**Dad Humor** (dadhumor.app) - a mobile-first, single-joke-at-a-time dad joke experience. Mascot-driven (Stache), dark-mode-only, built to be shared not scrolled. Target audience is Gen-Z/Millennials who love dad jokes ironically.

**Owner:** Digitopia Design Ltd
**Stage:** MVP live, rebuilding for v1 launch
**Current phase:** Phase 2 - Technical Foundation

---

## Before You Do Anything

1. **Read `/docs/handover.md`** - full project context, data model, gesture system, brand
2. **Read `/docs/build-plan.md`** - sequenced tasks to work through
3. **Reference `/docs/dadhumor_mockup_v2.html`** whenever you need UX clarity - open it or read the source; it's self-contained and shows the intended feel

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

## Brand Tokens (Use These, No Hardcoded Values)

### Colours (Tailwind class → hex)
- `bg-midnight` / `#121212` - primary background
- `bg-charcoal` / `#1A1A1A` - surfaces
- `border-graphite` / `#333333` - borders
- `text-yellow` / `#E3FF00` - primary CTAs, punchlines
- `text-pink` / `#FF2E93` - Groan reactions
- `text-cyan` / `#00E0FF` - Share actions
- `text-lime` / `#7CFF6B` - Props reactions, success
- `text-red` / `#FF4D4D` - errors (with humour)
- `text-white` / `#FFFFFF` - body text
- `text-smoke` / `#A0A0A0` - muted text

### Fonts
- `font-display` - Clash Display (or Space Grotesk fallback) - headings, punchlines
- `font-body` - Inter - everything else

### Never
- Use light mode (dark mode is intentional brand)
- Hardcode colours - always use tokens
- Use emoji as decorative crutch (one or two, surgically placed)
- Apologise for jokes being bad (that's the point)
- Write corporate-friendly microcopy (write like a person)

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

## What's In Scope For v1

✅ 50 seed jokes with categories
✅ All 5 gestures working on mobile + desktop
✅ Dynamic OG share cards (3 formats)
✅ Individual joke permalinks (`/j/[slug]`)
✅ Stash via localStorage
✅ Full onboarding flow
✅ Analytics (Vercel + GA4 + PostHog)
✅ Haptic feedback (Android - iOS no-ops gracefully)
✅ Joke of the Day API
✅ Digital signage widget page
✅ WordPress plugin

## What's NOT In Scope For v1

❌ User accounts / auth
❌ User-submitted jokes
❌ Comments / replies
❌ Following / social graph
❌ Light mode (never - it's brand)
❌ AI-generated imagery per joke
❌ Audio / TTS readings
❌ Stache evolution / streaks

These are Phase 5+ features. Don't scope-creep into them.

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
