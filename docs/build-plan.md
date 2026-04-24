# Dad Humor - Build Plan

Sequenced tasks for Claude Code to work through. Each task has clear acceptance criteria. Complete in order unless otherwise noted.

Current phase: **Phase 2 - Technical Foundation**

---

## Phase 2: Technical Foundation

### Task 2.1: Supabase Schema Update

**Goal:** Expand the `jokes` table to support all v1 features.

**What to do:**
1. Write SQL migration that:
   - Adds columns: `props_count` (integer, default 0), `stash_count` (integer, default 0), `share_count` (integer, default 0), `view_count` (integer, default 0), `category` (text), `rating` (text, default 'G'), `slug` (text, unique), `updated_at` (timestamp, default now())
   - All `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` so it's idempotent
   - Adds indexes on: `category`, `props_count desc`, `groans_count desc`, `slug`
   - Adds a trigger to auto-update `updated_at` on row change
   - Adds a function `generate_slug(text)` that creates URL-safe slugs from setup text
   - Adds a trigger that populates `slug` on insert if not provided
2. Apply via Supabase SQL Editor or Supabase CLI migration.

**Acceptance criteria:**
- `jokes` table has all new columns
- Existing jokes still work (backwards compatible)
- New jokes get auto-generated slugs
- Indexes visible in Supabase dashboard

**Gotchas:**
- Make sure slug generation handles: lowercase, strip punctuation, replace spaces with hyphens, max 60 chars, handle duplicates by appending `-2`, `-3` etc.
- Run on existing jokes to backfill slugs.

---

### Task 2.2: Seed The 50 Jokes

**Goal:** Populate the database with initial content.

**What to do:**
1. Use the SQL file `dadhumor_seed_jokes.sql` (provided separately).
2. Before running, check if jokes already exist - don't duplicate.
3. After running, verify slugs were generated correctly.

**Acceptance criteria:**
- Exactly 50 jokes in the database
- All have a `category` value (pun, wordplay, anti-humour, observational, so-bad)
- All have unique slugs
- Query `select category, count(*) from jokes group by category` returns expected distribution

---

### Task 2.3: Create RPC Functions

**Goal:** Atomic, scalable database operations. No more client-side random selection.

**Create these Postgres functions:**

**`get_random_joke(exclude_ids bigint[] default '{}')`**
- Returns one random joke
- Excludes any IDs in the passed array (used for "don't repeat last 10")
- Increments `view_count` on the returned joke
- If all jokes are excluded, return any random joke (graceful fallback)

**`get_joke_by_slug(slug_param text)`**
- Returns joke matching slug
- Increments `view_count`
- Returns null if not found

**`get_joke_by_id(id_param bigint)`**
- Returns joke by ID
- Increments `view_count`

**`increment_props(joke_id bigint)`**
- Atomic increment of `props_count`
- Returns new count

**`increment_groans(joke_id bigint)`**
- Atomic increment of `groans_count`
- Returns new count

**`increment_shares(joke_id bigint)`**
- Atomic increment of `share_count`
- Returns new count

**`get_top_jokes(by_metric text, limit_count int default 10)`**
- Returns top N jokes ordered by specified metric
- `by_metric` can be: 'props', 'groans', 'shares', 'views'
- Used for leaderboards and API endpoint

**Acceptance criteria:**
- All functions execute without error in Supabase SQL editor
- RLS policies allow anonymous calls to these functions
- Test each function: `select * from get_random_joke('{}'::bigint[])`

---

### Task 2.4: Set Up Analytics Stack

**Goal:** Track user behaviour from day one.

**What to do:**
1. Install packages:
   - `@vercel/analytics` (already might be, check)
   - `posthog-js`
   - Configure GA4 via Next.js Script component
2. Create `/src/lib/analytics.ts` with typed event tracking:
   ```typescript
   export type AnalyticsEvent =
     | 'joke_viewed'
     | 'punchline_revealed'
     | 'props_given'
     | 'joke_groaned'
     | 'joke_stashed'
     | 'joke_unstashed'
     | 'joke_shared'
     | 'joke_skipped'
     | 'onboarding_started'
     | 'onboarding_completed'
     | 'onboarding_skipped';

   export function track(event: AnalyticsEvent, properties?: Record<string, any>) { ... }
   ```
3. Initialise all three in `/src/app/layout.tsx`.
4. Environment variables needed in Vercel:
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST` (usually `https://eu.posthog.com` for EU users)

**Acceptance criteria:**
- Vercel Analytics dashboard shows pageviews
- PostHog dashboard shows at least one test event after deployment
- GA4 real-time view shows pageview on test visit
- `track()` function is type-safe - won't compile with invalid event names

---

### Task 2.5: Create Supabase Client Helpers

**Goal:** Clean, reusable data access layer. No Supabase calls scattered across components.

**Create `/src/lib/jokes.ts`:**
```typescript
import { supabase } from './supabase';

export type Joke = {
  id: number;
  setup: string;
  punchline: string;
  category: string;
  rating: string;
  slug: string;
  props_count: number;
  groans_count: number;
  stash_count: number;
  share_count: number;
  view_count: number;
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
};

export async function getRandomJoke(excludeIds: number[] = []): Promise<Joke | null> { ... }
export async function getJokeBySlug(slug: string): Promise<Joke | null> { ... }
export async function getJokeById(id: number): Promise<Joke | null> { ... }
export async function giveProps(jokeId: number): Promise<number> { ... }
export async function giveGroan(jokeId: number): Promise<number> { ... }
export async function recordShare(jokeId: number): Promise<number> { ... }
export async function getTopJokes(metric: 'props' | 'groans' | 'shares' | 'views', limit?: number): Promise<Joke[]> { ... }
```

**Create `/src/lib/supabase.ts`:**
- Keep the existing client
- Export typed helpers if the Supabase schema file exists, generate types via `supabase gen types`

**Acceptance criteria:**
- All data access goes through these helpers
- Full TypeScript types throughout
- Errors are logged and returned as null (not thrown)
- Works with server components AND client components

---

### Task 2.6: Implement Stash (localStorage) Client Helper

**Goal:** Save jokes locally without requiring accounts (for v1).

**Create `/src/lib/stash.ts`:**
```typescript
const STASH_KEY = 'dh_stash';

export type StashEntry = {
  joke_id: number;
  added_at: string; // ISO timestamp
};

export function getStash(): StashEntry[] { ... }
export function addToStash(jokeId: number): void { ... }
export function removeFromStash(jokeId: number): void { ... }
export function isStashed(jokeId: number): boolean { ... }
export function getStashCount(): number { ... }
export function clearStash(): void { ... }
```

Include SSR-safety (check `typeof window`).

Also create `/src/lib/reactions.ts` for tracking which jokes the user has already Props'd / Groaned / Stashed this session:
- Store reactions in localStorage per-joke: `{ [jokeId]: { props: true, groaned: false, stashed: true } }`
- Prevents double-counting when user revisits a joke

**Acceptance criteria:**
- Stash persists across page reloads
- Works with SSR without breaking
- No duplicate entries
- `getStashCount()` returns correct number

---

### Task 2.7: Routing - Individual Joke URLs

**Goal:** Every joke has a shareable, indexable URL.

**What to do:**
1. Create `/src/app/j/[slug]/page.tsx` - server component that fetches joke by slug
2. Generate dynamic metadata: title, description, OG tags
3. Show 404 if slug not found (using Next.js `notFound()`)
4. When landing on a joke permalink, the app shows that joke first, then continues randomly from there

**Acceptance criteria:**
- Visiting `/j/why-dont-eggs-tell-jokes` shows that specific joke
- Page has correct `<title>`, meta description, OG image
- 404s gracefully on invalid slugs
- Link preview on Slack/WhatsApp/Twitter shows proper card

---

### Task 2.8: Component Architecture Refactor

**Goal:** Break up the monolithic page.tsx into maintainable components.

**Directory structure:**
```
/src
  /app
    layout.tsx              // Root layout, analytics scripts, fonts
    page.tsx                // Random joke page (client component for interactions)
    /j/[slug]
      page.tsx              // Permalink page
    /api
      /v1
        /joke-of-the-day
          route.ts          // Phase 4
    /widget
      /signage
        page.tsx            // Phase 4
  /components
    JokeCard.tsx            // The main joke display
    ActionBar.tsx           // Props/Groan/Stash/Share/Next buttons
    Stache.tsx              // Mascot component with mood prop
    Logo.tsx                // Wordmark component
    Header.tsx              // Top nav
    Onboarding.tsx          // 3-step intro overlay
    ShareSheet.tsx          // Bottom sheet modal
    SwipeableCard.tsx       // Framer Motion wrapper for gestures
    CategoryPill.tsx        // Category badge
    StatPill.tsx            // Reusable stat display
    Toast.tsx               // Notification component
  /lib
    supabase.ts
    jokes.ts
    stash.ts
    reactions.ts
    analytics.ts
    haptic.ts               // Vibration API wrapper
    utils.ts                // General helpers
  /hooks
    useJoke.ts              // Joke fetching + state
    useSwipe.ts              // Gesture detection
    useOnboarding.ts        // Onboarding state
    useLocalStorage.ts      // Typed localStorage hook
  /types
    index.ts                // Shared TypeScript types
```

**Acceptance criteria:**
- No single file over ~200 lines
- Each component has a single responsibility
- Props are fully typed
- All components use brand tokens (no hardcoded colours)

---

### Task 2.9: Tailwind Theme Configuration

**Goal:** Lock in the brand as design tokens.

**Update `tailwind.config.ts`:**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight:  '#121212',
        charcoal:  '#1A1A1A',
        graphite:  '#333333',
        yellow:    '#E3FF00',
        pink:      '#FF2E93',
        cyan:      '#00E0FF',
        lime:      '#7CFF6B',
        red:       '#FF4D4D',
        smoke:     '#A0A0A0',
      },
      fontFamily: {
        display: ['var(--font-clash)', 'var(--font-space-grotesk)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bounce-once': 'bounceOnce 0.6s ease',
        'shake': 'shake 0.5s ease',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'float-up': 'floatUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-12px) scale(1.1)' },
          '60%': { transform: 'translateY(0) scale(0.95)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px) rotate(-3deg)' },
          '75%': { transform: 'translateX(8px) rotate(3deg)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.7)' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(1.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Also add global background halftone pattern in `globals.css`:**
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, #1f1f1f 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}
```

**Acceptance criteria:**
- Can use `bg-yellow`, `text-midnight`, `border-graphite` etc throughout
- Fonts loaded via `next/font` in layout.tsx
- All brand animations available as Tailwind classes

---

## Phase 3: Core Features

### Task 3.1: Build The Stache Component

```typescript
// src/components/Stache.tsx
import Image from 'next/image';

type StacheMood =
  | 'smug' | 'anticipation' | 'laughing' | 'groan'
  | 'mind-blown' | 'winking' | 'sleeping' | 'pointing' | 'shrugging';

const MOOD_MAP: Record<StacheMood, string> = {
  'smug':         '/stache/01-smug-default.png',
  'anticipation': '/stache/02-anticipation.png',
  'laughing':     '/stache/03-laughing.png',
  'groan':        '/stache/04-groan.png',
  'mind-blown':   '/stache/05-mind-blown.png',
  'winking':      '/stache/06-winking.png',
  'sleeping':     '/stache/07-sleeping.png',
  'pointing':     '/stache/08-pointing.png',
  'shrugging':    '/stache/09-shrugging.png',
};

const SIZE_MAP = {
  sm: 60,
  md: 100,
  lg: 160,
  xl: 240,
};

interface StacheProps {
  mood?: StacheMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean; // for above-fold images
}

export function Stache({ mood = 'smug', size = 'md', className, priority }: StacheProps) {
  const pixelSize = SIZE_MAP[size];
  return (
    <Image
      src={MOOD_MAP[mood]}
      alt={`Stache - ${mood}`}
      width={pixelSize}
      height={pixelSize * 0.625} // maintain aspect ratio of the PNGs
      priority={priority}
      className={className}
    />
  );
}
```

**Acceptance criteria:**
- All 9 moods render correctly
- Lazy-loaded by default (Next.js Image handles it)
- Can be sized via prop
- Has correct alt text for accessibility

---

### Task 3.2: Build The SwipeableCard With Framer Motion

Handle left/right/up swipes on the joke card. Includes:
- Drag with visual rotation
- Threshold detection (100px triggers action)
- Indicator overlays ("NEXT", "PROPS", "SHARE") during drag
- Spring-back if below threshold
- Haptic feedback on completion

Reference the interactions in `dadhumor_mockup_v2.html` - they work well and are user-validated.

---

### Task 3.3: Build The ActionBar

Buttons for Props, Groan (long-press), Stash, Share, Next. Each triggers both the visual state change AND the correct haptic. Shows only when punchline is revealed.

Critical detail: **Groan must be a long-press (800ms)** with visible progress ring. Short tap = no-op (prevents accidents). Early release = cancels + stops haptic.

---

### Task 3.4: Build The Onboarding Overlay

3-step walkthrough shown once per device. Skippable. Stored in localStorage as `dh_onboarded: true`. Reference design in the mockup.

---

### Task 3.5: Build The ShareSheet

Bottom drawer modal with:
- Live preview of the share card
- 4 platform buttons (Story, Insta, WhatsApp, Download)
- Copy link button

Actual share card generation is Phase 4 - for now, buttons can just trigger the Web Share API with text, or copy the joke URL to clipboard.

---

### Task 3.6: Wire Everything Together In page.tsx

Main app page orchestrates:
- Fetch random joke on mount
- Handle all gesture and button interactions
- Manage reveal state
- Fire analytics events
- Track reactions via reactions.ts
- Render Stache with context-appropriate mood (e.g. `laughing` when Props given, `groan` when Groaned)

---

### Task 3.7: Keyboard Controls

Desktop users get full keyboard support:
- `Space` - reveal / next
- `←` - next (skip)
- `→` - props
- `↑` - share
- `G` - groan (triggers long-press animation)
- `S` - stash
- `Esc` - close modals

---

## Phase 4: Launch Readiness + Viral Engine

### Task 4.1: Dynamic OG Share Cards

Install `@vercel/og`. Create `/src/app/api/og/[slug]/route.tsx` that renders a 1200x630 PNG of a joke using:
- Midnight background with halftone pattern
- Stache image (mood based on joke metrics - high Props = laughing, high Groans = groan)
- Setup in white, punchline in yellow
- Wordmark bottom-right
- Stats pill

Reference the share card section in the brand guidelines PDF for exact layout.

Then update the joke permalink page's metadata to use this dynamic OG URL.

**Extension:** Also generate 1080x1920 (stories) and 1080x1080 (feed) versions via query param: `?format=story|feed|og`.

---

### Task 4.2: Joke of the Day API

Create public endpoint at `/api/v1/joke-of-the-day`:

```typescript
// GET /api/v1/joke-of-the-day
// Response: { id, setup, punchline, category, slug, permalink, share_card_url, date }
```

- Uses the same joke every day (seed based on date: `joke_id = (day_of_year % total_jokes) + 1`)
- Cached at edge
- CORS headers for embedding
- Rate limit: 1000 req/day per IP (using Vercel KV or Upstash)
- Returns proper error responses

Bonus: query param `?format=json|html|text` for different integrations.

---

### Task 4.3: Digital Signage Page

Create `/widget/signage` - a full-screen, auto-refreshing joke display designed for office TVs / reception screens / coffee shops.

- Full-screen dark mode
- Very large type (optimised for 1920x1080 and 4K)
- Shows today's joke
- Auto-refreshes at midnight
- Subtle Dad Humor branding
- No interactivity needed

Can be loaded in any browser in kiosk mode. Huge for organic distribution.

---

### Task 4.4: WordPress Plugin

Build a separate WordPress plugin (separate repo: `digitopia/dadhumor-wp`):
- Shortcode `[dad_joke]` - displays today's joke
- Widget for sidebars
- Block for Gutenberg
- Uses the public API
- Settings page for styling options
- "Powered by Dad Humor" subtle credit link

Submit to WP.org directory after testing.

---

### Task 4.5: Launch Polish

Checklist items, each fairly small:
- Proper loading states (skeleton, not "Loading...")
- Error states with brand voice: "Oof. That one bombed. Try again?"
- 404 page with a joke on it: "This page walked into a bar. It's not there anymore."
- Favicon (use simplified Stache)
- PWA manifest with icons
- Cookie banner (UK GDPR compliant - Cookiebot free tier or self-rolled)
- Privacy policy (can draft from template)
- Terms of service (basic)
- Sitemap.xml (dynamic from Supabase)
- robots.txt
- Open Graph meta on all pages
- Twitter card meta on all pages

---

## Shared Conventions

### Code style
- Functional components only (no class components)
- Named exports over default exports where possible
- Tailwind classes in JSX, no CSS modules unless unavoidable
- Use `cn()` utility (clsx) for conditional classes
- Absolute imports via `@/` prefix (already configured in tsconfig)

### Testing
Not a priority for v1. Add Vitest later when needed. For now:
- Manual testing on mobile (iOS Safari + Android Chrome) after each major task
- TypeScript strictness catches most issues
- Vercel preview deployments for every branch

### Git workflow
- Branch per task: `feat/task-2-1-schema-update`
- Commit messages in lowercase, imperative: "add slug generation trigger"
- PR descriptions should reference the task number from this plan

### Deployment
- Every push to `main` auto-deploys to production
- Every push to a branch creates a preview deployment
- Database migrations run manually via Supabase SQL editor (for now)
- Environment variables managed in Vercel dashboard

---

## Getting Stuck?

If a task's acceptance criteria aren't clear, or if there's a better way to implement something, push back and ask. Don't silently deviate from the plan.

Also fine to say "this needs more thinking" and escalate back to the human.

Current working focus: **Phase 2, Task 2.1**. Start there.
