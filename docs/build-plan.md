# Dad Humor - Build Plan

Sequenced tasks for Claude Code to work through. Each task has clear acceptance criteria. Complete in order unless otherwise noted.

Current phase: **Phase 2 - Technical Foundation**

**Document version:** 1.3
**Related docs:**
- `handover.md` - project context, data model, brand
- `fathers-day-campaign.md` - Phase 4.5 detailed brief
- `bantered-integration-spec.md` - Phase 6 merchandise integration
- `monetisation-roadmap.md` - revenue strategy

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

**Goal:** Lock in the dual-context brand as design tokens.

**Architecture:** Use CSS custom properties for context-dependent values. The `data-theme` attribute on the `<body>` or root element switches between brand context (dark, default) and reading context (light). Tailwind references the CSS variables, not raw hex values.

**Step 1 - Update `globals.css` with the token system:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ========================================
   BRAND CONTEXT (DARK) - default everywhere
   except Reading Context pages
   ======================================== */
:root,
[data-theme="dark"] {
  /* Backgrounds */
  --bg-primary:    #121212;
  --bg-surface:    #1A1A1A;
  --bg-elevated:   #242424;
  --bg-border:     #333333;

  /* Text */
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary:  rgba(255, 255, 255, 0.45);
  --text-inverse:   #1A1A1A;

  /* Brand */
  --brand-yellow:        #E3FF00;
  --brand-yellow-hover:  #C9E600;

  /* Reactions */
  --reaction-lime: #7CFF6B;
  --reaction-pink: #FF4DA6;
  --reaction-cyan: #00E0FF;
  --reaction-red:  #FF6B6B;

  /* Decorative only */
  --smoke: #A0A0A0;
}

/* ========================================
   READING CONTEXT (LIGHT) - articles & legal
   Only applied where data-theme="light"
   ======================================== */
[data-theme="light"] {
  /* Backgrounds */
  --bg-primary:    #FAF8F2;
  --bg-surface:    #F4F1E8;
  --bg-elevated:   #ECE8DA;
  --bg-border:     #DDD7C5;

  /* Text */
  --text-primary:   #1A1A1A;
  --text-secondary: rgba(26, 26, 26, 0.7);
  --text-tertiary:  rgba(26, 26, 26, 0.5);
  --text-inverse:   #FFFFFF;

  /* Brand - yellow stays cyber yellow but used inside dark pills */
  --brand-yellow:        #E3FF00;
  --brand-yellow-hover:  #C9E600;

  /* Reactions - deeper for accessibility on cream */
  --reaction-lime: #2D8C1F;
  --reaction-pink: #C2185B;
  --reaction-cyan: #007A99;
  --reaction-red:  #C62828;
}

/* Halftone background pattern - context-aware */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
  color: var(--text-primary);
}

/* No-flash theme application */
html { background: var(--bg-primary); }
body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

**Step 2 - Update `tailwind.config.ts` to consume the variables:**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Context-aware tokens (use these by default)
        bg: {
          DEFAULT: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          border: 'var(--bg-border)',
        },
        text: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        brand: {
          yellow: 'var(--brand-yellow)',
          'yellow-hover': 'var(--brand-yellow-hover)',
        },
        reaction: {
          lime: 'var(--reaction-lime)',
          pink: 'var(--reaction-pink)',
          cyan: 'var(--reaction-cyan)',
          red:  'var(--reaction-red)',
        },

        // Direct brand colours (use only when context-independent)
        // e.g. share cards always use these regardless of page theme
        midnight: '#121212',
        charcoal: '#1A1A1A',
        cream:    '#FAF8F2',
        paper:    '#F4F1E8',
        yellow:   '#E3FF00',
        smoke:    '#A0A0A0',
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
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

**Step 3 - Load fonts via next/font in `layout.tsx`:**

```typescript
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// In the JSX:
<html lang="en" className={`${outfit.variable} ${inter.variable}`}>
```

**Step 4 - Add the no-flash theme script** (Phase 4.6 - covered in Task 4.6.x_theme_toggle, but stub here):

The layout.tsx should have an inline script BEFORE React hydrates that reads the saved theme preference and sets `data-theme` on `<html>`. This prevents the flash of wrong theme on page load.

**Acceptance criteria:**
- Can use `bg-bg`, `text-text`, `text-brand-yellow`, `bg-reaction-pink` etc throughout
- Tokens swap correctly when `data-theme` attribute changes
- Fonts loaded via `next/font/google` in layout.tsx
- All brand animations available as Tailwind classes
- Default theme is `dark` (no attribute = brand context)
- Halftone pattern adapts to context (subtle dark dots on dark, subtle light dots on cream)

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

### Task 4.5: Launch Polish (final task before launch)

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

## Phase 4.5: Father's Day Campaign

**See `fathers-day-campaign.md` for full brief.** High-level tasks below.

### Task 4.5.1: Father's Day Landing Page
Create `/fathers-day` route with countdown to 21 June 2026. Use existing brand system. Hero, share CTA, "Send to Dad" feature, email capture.

### Task 4.5.2: Dad Mode Toggle
Header toggle that swaps Stache asset to "Premium Dad Stache" (with pipe/slippers/tongs accessory - generate via Midjourney first). Persists in localStorage. Auto-disables 1 week after Father's Day.

### Task 4.5.3: Father's Day Share Card Frame
Variant of OG share cards with Father's Day border/badge. Active only during campaign window (1 June - 25 June 2026). Logic in `/api/og/[slug]/route.tsx` - check current date.

### Task 4.5.4: Email Capture Flow
Lead magnet: "20 Brand New Dad Jokes for Father's Day" - PDF download. Uses existing email service (recommend Resend or MailerLite). Auto-tags subscribers as `fathers_day_2026`.

### Task 4.5.5: "Jokes Your Dad Definitely Already Told" Filter
Curated collection accessible via `/collections/dad-classics`. Manual curation of the 20 most stereotypically "dad" jokes from the seed set.

### Task 4.5.6: Send-to-Dad Priority
Re-order share sheet during campaign window so "Send to Dad" appears first (uses native share or pre-filled WhatsApp/SMS).

### Task 4.5.7: Post-Day Quiz
"How many of these did your dad tell you?" - 10-question quiz showing classic dad jokes. User taps "Yes/No" for each. Results: "You're a [Dad-Joke Apprentice/Survivor/Veteran/Hostage]." Shareable.

---

## Phase 4.6: Articles / Content System

Adds an MDX-powered article system for SEO content, data stories, guides, and legal pages. Lightweight, file-based, lives in the repo. Powers the press/data strategy in Phase 8 and supports Father's Day SEO content.

**Approach:** MDX files under `/content/`, statically generated, custom React components for inline interactivity (live joke embeds, Stache reactions, leaderboard widgets). No external CMS - articles are committed to Git, deploys are publishes.

### Task 4.6.1: MDX Infrastructure

**Goal:** Set up the content pipeline.

**What to do:**
1. Install packages:
   - `next-mdx-remote` (serves MDX from filesystem)
   - `gray-matter` (frontmatter parsing)
   - `remark-gfm` (GitHub-flavoured markdown)
   - `rehype-slug` (auto heading IDs)
   - `rehype-autolink-headings` (anchor links)
   - `reading-time` ("5 min read" calc)
2. Create directory structure:
   ```
   /content
     /articles      ← blog posts
     /pages         ← static pages (about, privacy, terms)
   /src/components/mdx
     index.tsx      ← exports all MDX components
   /src/lib
     content.ts     ← article fetching/parsing helpers
   ```
3. Add `content.ts` helper functions:
   - `getAllArticles()` - returns array of article metadata, sorted by date desc
   - `getArticleBySlug(slug)` - returns single article with parsed MDX
   - `getAllPages()` / `getPageBySlug(slug)` - same for static pages
   - `getArticlesByCategory(cat)` / `getArticlesByTag(tag)` - filtering
   - All functions exclude `draft: true` articles in production
4. Define TypeScript types for Article and Page in `/src/types/content.ts`.

**Acceptance criteria:**
- Can place a `.mdx` file in `/content/articles/` and read it programmatically via helper functions
- Frontmatter parsing works correctly
- Draft articles are hidden in production (NODE_ENV check)
- All helpers fully typed

### Task 4.6.2: Frontmatter Schema

**Goal:** Lock in the metadata schema so articles are consistent.

Required frontmatter for articles:
```yaml
---
title: "The 10 Worst Dad Jokes Ever Told (Backed By Data)"
slug: "10-worst-dad-jokes-data"
description: "We analysed 50,000 user reactions. The results will horrify you."
date: 2026-05-15
updated: 2026-05-15           # optional, defaults to date
author: "Stache"               # currently always Stache, future: support other authors
category: "data"               # one of: data | guides | press | brand | jokes
tags: ["data", "groan-rankings", "research"]
ogImage: "/articles/og/10-worst-dad-jokes.png"  # optional, falls back to default
featured: true                 # appears in featured section on /blog
draft: false                   # if true, hidden in production
---
```

Required frontmatter for static pages (simpler):
```yaml
---
title: "About Dad Humor"
slug: "about"
description: "Why we built the internet's premier dad joke authority."
updated: 2026-04-20
---
```

Validate frontmatter via Zod schema. Throw clear errors if required fields missing.

**Acceptance criteria:**
- Articles fail to build if required frontmatter missing
- Defaults applied correctly (e.g., `updated` defaults to `date`)
- Type-safe throughout

### Task 4.6.3: Article Listing Page (`/blog`)

**Goal:** The main blog index.

**What to build:**
- Route: `/src/app/blog/page.tsx`
- Static generation
- Featured article hero (if any article has `featured: true`)
- Article cards in a grid (3 columns desktop, 1 mobile)
- Each card shows: thumbnail (from ogImage or default), title, description, category pill, date, reading time
- Pagination if more than 12 articles
- Category filter pills at the top
- Search (client-side, simple fuzzy match) - optional, can defer

**Visual style:**
- Use brand tokens (Midnight bg, Charcoal cards, Cyber Yellow accents)
- Stache decorative element (e.g. pointing Stache next to "Latest" heading)
- Hover state on cards: slight Yellow border glow
- Reading time and category pills use existing component patterns

**SEO:**
- Page meta title: "Articles - Dad Humor"
- Description: brand voice
- OG image: a generic blog OG (can be the default)

**Acceptance criteria:**
- Renders all non-draft articles
- Sorted newest first
- Category filtering works
- Mobile responsive
- Lighthouse SEO score 95+

### Task 4.6.4: Article Detail Page (`/blog/[slug]`)

**Goal:** Individual article view.

**What to build:**
- Route: `/src/app/blog/[slug]/page.tsx`
- Static generation with `generateStaticParams()`
- Renders MDX content with custom components
- Article header: title, description, date, reading time, category pill, share buttons
- Article body: prose styling, max-width readable column
- Article footer: related articles (same category, 3 max), author bio (Stache), comment-free CTA back to main app
- 404 if slug not found (use Next.js `notFound()`)

**Prose typography:**
- Body: Inter, 18px, line-height 1.7
- Headings: Clash Display
- Code blocks: dark theme, monospace
- Block quotes: Yellow left border
- Images: rounded corners, captions in Smoke
- Links: Cyber Yellow underline on hover

**SEO per article:**
- Use `generateMetadata()` to build:
  - `<title>` from frontmatter
  - `<meta description>` from frontmatter
  - OG tags (image, title, description, url, type=article)
  - Twitter card tags
  - Canonical URL
- Add `Article` schema.org structured data via JSON-LD
- Set `<link rel="alternate" type="application/rss+xml">` for RSS

**Acceptance criteria:**
- Articles render correctly with all custom components
- SEO meta is fully populated
- Structured data validates in Google's Rich Results Test
- Mobile responsive
- Lighthouse score 95+ across all categories

### Task 4.6.5: Custom MDX Components

**Goal:** Reusable React components that authors can drop into MDX.

Build these in `/src/components/mdx/`:

**`<JokeEmbed slug="..." />`**
- Fetches joke by slug from Supabase at build time (or revalidate hourly)
- Renders a mini joke card inline with reveal interaction
- Uses existing JokeCard component, scaled down
- Falls back gracefully if joke not found

**`<StacheReact mood="..." caption="..." size="sm|md|lg" />`**
- Inline Stache image with caption underneath
- Uses existing Stache component
- Default size: md
- Caption styled in Smoke, italic

**`<Callout type="data|warning|tip|joke">...</Callout>`**
- Styled callout box
- `data` - cyan border, "📊 DATA" label
- `warning` - red border, "⚠️ HEADS UP" label
- `tip` - lime border, "💡 TIP" label
- `joke` - yellow border, "🎭 JOKE" label
- Children render as normal MDX inside

**`<GroanLeaderboard limit={10} category="..." />`**
- Live leaderboard pulled from Supabase at build time
- Default limit: 10
- Optional category filter
- Each row: rank, joke setup (truncated), groan count, link to joke
- Refreshes on next deploy or revalidate (set ISR to 24h)

**`<PropsLeaderboard limit={10} category="..." />`**
- Same as GroanLeaderboard but ordered by props_count
- Uses lime accent instead of pink

**`<DadJokeQuiz questions={[...]} />`**
- Inline interactive quiz component
- Takes array of joke objects as questions
- User answers Yes/No for each ("Have you heard this?")
- Shows result at the end with shareable card
- Uses brand patterns from main app

**`<TweetEmbed id="..." />`**
- Embed a tweet (use react-tweet or similar)
- For citing user reactions in articles

**`<ImageGrid columns={2|3|4}>...</ImageGrid>`**
- Wraps multiple images in a responsive grid
- Useful for "here's all 9 Stache moods" kinds of articles

**Acceptance criteria:**
- All components fully typed
- All use brand tokens (no hardcoded colours)
- All work in MDX without imports (registered globally via mdx-components.tsx)
- Mobile responsive
- Components fail gracefully if data missing

### Task 4.6.6: Static Pages System

**Goal:** Use the same MDX system for non-article pages, all in Reading Context (light theme).

**What to build:**
- Route: `/src/app/[slug]/page.tsx` (catch-all for static pages)
- Reads from `/content/pages/`
- Same MDX rendering pipeline as articles
- Apply Reading Context (light theme by default)
- Slightly different layout (no "back to blog" nav, no related articles)

**Initial pages to create (all in light theme):**
- `/about` - the brand story
- `/privacy` - privacy policy (use a template, customise for actual data collected)
- `/terms` - terms of service (use a template)
- `/contact` - simple contact info
- `/colophon` - tech stack, credits, fonts (developers love these)

**Theming:**
- These pages set `data-theme="light"` on the layout wrapper
- Inherit the same theme toggle behaviour as articles (via Task 4.6.x_theme below)
- User's saved theme preference applies across all Reading Context pages

**Acceptance criteria:**
- All static pages render in light theme by default
- Each has correct SEO metadata
- Theme toggle works consistently across articles and static pages
- Routing works without conflicting with `/blog/[slug]` or `/j/[slug]`
- Brand Context pages (joke app, etc.) remain unaffected by theme changes here

### Task 4.6.7: Theme System Implementation

**Goal:** Implement the dual-context theme system - dark Brand Context default, light Reading Context with toggle.

**Architecture:**
- Brand Context pages: `data-theme="dark"` (or no attribute - dark is default)
- Reading Context pages: `data-theme="light"` by default, can be toggled to `"dark"` by user
- Theme preference persisted in localStorage as `dh_reading_theme: "light" | "dark"`
- Brand Context pages NEVER respond to the saved theme - they're locked dark

**What to build:**

**1. Theme detection script (no-flash):**
Add to `layout.tsx` - inline `<script>` that runs BEFORE React hydrates. Determines correct theme and sets `data-theme` attribute on `<html>`.

```tsx
// Place inline in <head> via dangerouslySetInnerHTML
const themeScript = `
  (function() {
    const isReadingContext = ${/* server-determined boolean based on route */};
    if (!isReadingContext) {
      document.documentElement.setAttribute('data-theme', 'dark');
      return;
    }
    const saved = localStorage.getItem('dh_reading_theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      // Default for reading context = light
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;
```

**2. Page-level theme detection:**
Create `/src/lib/theme.ts`:
```typescript
const READING_CONTEXT_PATHS = [
  '/about', '/privacy', '/terms', '/contact', '/colophon',
  '/blog', // and all sub-paths
];

export function isReadingContext(pathname: string): boolean {
  return READING_CONTEXT_PATHS.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  );
}
```

**3. Layout wrapper:**
Each Reading Context page wraps content in a layout that:
- Sets `data-theme` based on user preference
- Renders the theme toggle in the header
- Listens for system preference changes

**4. ThemeToggle component:**
Create `/src/components/ThemeToggle.tsx`:
- Sun/moon icon button
- Click toggles between `light` and `dark`
- Saves to localStorage as `dh_reading_theme`
- Updates `data-theme` attribute on `<html>`
- Smooth icon transition
- Only renders on Reading Context pages

**5. useTheme hook:**
Create `/src/hooks/useTheme.ts`:
```typescript
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    setTheme(current || 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dh_reading_theme', next);
    setTheme(next);
  };

  return { theme, toggle };
}
```

**Acceptance criteria:**
- Joke app routes (`/`, `/j/[slug]`, etc.) are ALWAYS dark, no toggle visible
- Reading routes (`/about`, `/blog/*`, etc.) default to light with toggle in header
- No flash of wrong theme on page load (the inline script handles this)
- Theme preference persists across page navigations within Reading Context
- Theme preference persists across browser sessions
- Brand Context routes ignore the saved preference (always dark regardless)
- Toggle icon animates smoothly between sun and moon

### Task 4.6.8: RSS Feed

**Goal:** RSS feed at `/feed.xml` for articles.

**What to do:**
- Create `/src/app/feed.xml/route.ts`
- Generate RSS 2.0 XML
- Include all non-draft articles
- Author: Stache
- Categories from frontmatter
- Full article body in `<content:encoded>` (CDATA wrapped)
- Properly cached (revalidate every hour)

Add `<link rel="alternate" type="application/rss+xml">` to article and blog pages so feed readers detect it.

**Acceptance criteria:**
- Feed validates at validator.w3.org/feed
- Opens correctly in Feedly, Reeder, etc.
- Updates on next deploy

### Task 4.6.9: Sitemap Inclusion

**Goal:** All articles and pages in sitemap.xml.

Update existing `/src/app/sitemap.ts` to include:
- All article URLs with `lastmod` from `updated` frontmatter
- All static page URLs
- Priority: 0.8 for articles, 0.5 for static pages, 1.0 for homepage

**Acceptance criteria:**
- Sitemap includes all content
- Validates in Google Search Console
- Lastmod dates correct

### Task 4.6.10: Initial Article Drafts

**Goal:** Ship 3-5 articles at launch to seed the system.

Articles to create (Claude Code can write the content):

1. **About Dad Humor** (`/about`)
   - Brand story, mission, who we are
   - 400-600 words
   - Stache origin story
   - Mention Bantered parent brand

2. **How To Tell A Dad Joke (Properly)** (`/blog/how-to-tell-a-dad-joke`)
   - Practical guide with humour
   - 800-1000 words
   - Use Callout components
   - Include 5-10 example jokes via JokeEmbed
   - SEO target: "how to tell a dad joke"

3. **The 25 Best Father's Day Jokes Of 2026** (`/blog/best-fathers-day-jokes-2026`)
   - Listicle, 1500 words
   - Time-sensitive (publish 1 June 2026)
   - Each joke has a JokeEmbed
   - Strong SEO target: "father's day jokes"
   - Featured on Father's Day landing page

4. **Why We Built Dad Humor** (`/blog/why-we-built-dad-humor`)
   - Founder story, suitable for press
   - 600-800 words
   - First-person from Stache (or Digitopia voice - decide)
   - Good for backlink outreach

5. **The Anatomy Of A Dad Joke** (`/blog/anatomy-of-a-dad-joke`)
   - Educational/entertaining breakdown
   - 1000 words
   - Visual breakdown of setup/punchline structure
   - Categorisation explanation (puns vs wordplay etc.)
   - Stache reactions throughout

6. **Privacy Policy** (`/privacy`)
   - Standard UK GDPR-compliant policy
   - Use a template, customise for the actual data collected (analytics, localStorage)

7. **Terms of Service** (`/terms`)
   - Standard ToS template
   - Customise for the service offered

**Acceptance criteria:**
- All articles published (draft: false)
- All have correct frontmatter
- All include at least one custom MDX component where appropriate
- Privacy and Terms reviewed for compliance accuracy
- Internal links between articles where relevant

### Task 4.6.11: OG Image Generation For Articles

**Goal:** Each article gets a branded OG image without manual design work.

**What to do:**
- Create `/src/app/articles/og/[slug]/route.tsx` using `@vercel/og`
- Layout:
  - Midnight background with halftone pattern
  - "DAD HUMOR." wordmark top-left
  - Article title (large, white, Clash Display)
  - "Articles" pill or category badge
  - Stache mascot bottom-right (mood based on category - e.g., `pointing` for guides, `mind-blown` for data pieces)
  - Subtle "dadhumor.app" footer
- Each article frontmatter `ogImage` defaults to this dynamic URL
- Override with custom static image if provided

**Acceptance criteria:**
- OG images generate correctly for each article
- Renders in Twitter card preview, Facebook debugger, Slack unfurl
- 1200x630 dimensions
- Loads in under 1 second

### Task 4.6.12: Reading Experience Polish

Small but important details:

- **Reading progress bar** at top of article (1px Cyber Yellow, fills as you scroll)
- **Estimated reading time** in article header
- **Table of contents** sidebar on desktop for long articles (auto-generated from h2/h3 tags)
- **"Back to top"** button after scrolling past 50%
- **Share buttons** in article header AND footer (Twitter, LinkedIn, copy link, native share on mobile)
- **Print stylesheet** (clean black-on-white, hides interactive components)

**Acceptance criteria:**
- Reading progress works smoothly
- Table of contents updates active state on scroll
- Share buttons fire correctly
- Print preview looks clean

---

## Phase 5: v2 Features (Post-Launch)

Tasks for the highest-priority v2 features. Detail to be expanded when work begins.

### Task 5.1: Joke Battle Mode
Head-to-head voting. Two jokes shown, user picks winner. Elo rating system in Postgres. New `joke_battles` table. Real-time leaderboard at `/leaderboard/all-time`.

### Task 5.2: Custom Joke Collections
Authenticated users can create themed collections from their Stash. Collections have public share URLs. New tables: `collections`, `collection_jokes`. Requires Phase 5.x auth setup first.

### Task 5.3: Daily Streak + Stache Evolution
Track consecutive daily visits. Stache asset progresses through tiers (Day 1 thin → Day 365 magnificent). Requires user accounts. Showcase on profile page.

### Task 5.4: Send-a-Joke
P2P share with tracking link. User enters recipient name, app generates a custom URL `/sent/[token]` that shows the joke + custom message. Sender gets notified when link is opened.

---

## Phase 5.5: AI Joke Generator

**See `handover.md` Phase 5.5 for context.**

### Task 5.5.1: AI Generation Endpoint
Create `/api/generate` route. Accept `subject` parameter. Call AI provider (start with Claude Haiku via Anthropic API for cost). Return 3 variations. Strong system prompt - included below.

System prompt for AI generation:
```
You are a dad joke generator for dadhumor.app. Generate 3 dad joke variations on the user's topic.

Rules:
- Pure pun-based humour, wordplay, or anti-humour
- Setup + punchline format
- G-rated, never offensive
- No mentions of: religion, politics, race, gender, weight, mental health, or anything that could harm
- Aim for the "groan" reaction - the worse, the better
- Keep punchlines under 60 characters
- Return only the 3 jokes as JSON: [{setup, punchline}, {setup, punchline}, {setup, punchline}]
```

### Task 5.5.2: Generator UI Page
Create `/generate` route. Input field, "Generate" button, three result cards each with same Props/Groan/Share/Stash actions as main jokes. Reuses existing components.

### Task 5.5.3: Rate Limiting
Use Vercel KV or Upstash Redis. 5 generations per day per IP for free, 50 for premium (when premium exists). Return 429 with friendly error message in brand voice.

### Task 5.5.4: Submit-To-Feed Flow
"Submit to public feed" button on AI-generated jokes. Goes to a `joke_submissions` table for moderation. Email admin on new submission. Approval flow comes in Phase 5.x.

### Task 5.5.5: AI Joke Tracking
Tag AI-generated jokes with `source: 'ai'` field in DB. Track Props/Groans separately to monitor quality. Surface comparison data ("AI jokes get 30% fewer props than curated").

---

## Phase 6: Bantered Integration

**See `bantered-integration-spec.md` for full plan.** High-level tasks below.

### Task 6.1: Shop Route + Shopify Buy Button
Add `/shop` route. Embed Shopify Buy Button SDK or redirect to bantered.com/dadhumor collection. Use Shopify's preset that matches brand colours.

### Task 6.2: "Buy on a Tee" Per-Joke Button
Add button on individual joke pages: "Get this on a tee →". Links to product page on Bantered Shopify with the joke pre-selected/customised.

### Task 6.3: Tee-Of-The-Week Pipeline
Admin tool to select a joke each week, auto-generate product mockup (PNG with joke text on tee template), push to Bantered as new product. Featured prominently on `/shop`.

### Task 6.4: Cross-Brand Header
Add Bantered logo + "by Bantered" subtle credit in footer. Bantered side adds "Powered by Dad Humor" on relevant collection pages.

---

## Phase 7: Sound System

### Task 7.1: Sound Asset Library
Source 10 sound effects (under 1 second each, normalised volume):
- `drumroll.mp3` - reveal anticipation
- `wahwah.mp3` - groan (THE classic dad joke trombone)
- `applause.mp3` - props
- `ding.mp3` - share
- `whoosh.mp3` - swipe
- `click.mp3` - stash
- `snore.mp3` - idle/loading
- `tada.mp3` - mind-blown moments
- `fanfare.mp3` - achievement (Phase 5)
- `boo.mp3` - extra groan punctuation

Source from Freesound.org or commission from Fiverr (~£50). Store in `/public/sounds/`.

### Task 7.2: Sound Manager Utility
Create `/src/lib/sound.ts`:
```typescript
export const sound = {
  enabled: false,
  init() { /* preload all assets if enabled */ },
  play(name: SoundName) { /* play if enabled */ },
  toggle() { /* flip state, save to localStorage */ },
};
```
Uses Web Audio API. Handles preloading. Respects `prefers-reduced-motion` (also disable sound by default if set).

### Task 7.3: Sound Toggle UI
Speaker icon in header. Three states: muted (default), enabled, "first-time" prompt. First-time prompt is a small toast: "Sound effects? They're stupid and great. [On] [Off]"

### Task 7.4: Wire Sound Into Interactions
Call `sound.play()` from existing interaction handlers. No haptic conflicts - sound and haptic both fire. Match logic:
- Reveal → drumroll
- Props → applause
- Groan → wahwah (this is essential)
- Share → ding
- Swipe → whoosh
- Stash → click

---

## Phase 8: Press & Data Marketing

### Task 8.1: Country Tracking
Add `country_code` to all PostHog/GA4 events. Source from `x-vercel-ip-country` header (free with Vercel). Backfill onto existing events if possible.

### Task 8.2: Internal Stats Dashboard
Create `/admin/stats` (auth-protected). Shows:
- Top jokes by props/groans/shares globally
- Top jokes by country (UK/US/AU at minimum)
- Trend lines over time
- Submission queue
Uses Supabase queries + simple chart library (Recharts).

### Task 8.3: Quarterly Report Templates
Markdown templates in `/docs/press/` for:
- "Most Groaned Joke of [Quarter]"
- "[Country] vs [Country] Humour Analysis"
- "The Mathematical Formula for the Perfect Dad Joke"
Each template has data placeholders that admin fills from dashboard.

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
