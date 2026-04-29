# Dad Humor - Project Handover

**Project:** dadhumor.app
**Owner:** Digitopia Design Ltd
**Document version:** 1.3
**Last updated:** April 2026
**Status:** MVP live, ready for Phase 2 (Technical Foundation)

**Related docs:**
- `build-plan.md` - sequenced tasks for Phase 2-8
- `fathers-day-campaign.md` - Father's Day 2026 brief (Phase 4.5)
- `bantered-integration-spec.md` - merchandise integration plan (Phase 6)
- `monetisation-roadmap.md` - revenue strategy across all phases

---

## 1. Project Overview

### Concept
A viral, mobile-first, TikTok-style web app dedicated to dad jokes. Single-joke-at-a-time delivery with rich interactions: reveal, react (Props/Groan), save (Stash), share. Built to be shared, not scrolled.

### Target audience
- **Primary:** Gen-Z and Millennials (18-40) who treat dad jokes as ironic comfort content. They share in group chats, post to stories, screenshot for reactions.
- **Secondary:** Actual dads who want fresh material.

### Current state
MVP is live at dadhumor.app with basic reveal interaction. Supabase connected, Vercel hosting, domain configured. Needs complete rebuild for full feature set.

### Brand in one line
*"Professionally unfunny since 2026."*
Unhinged Wholesome. Self-aware. Built to share. Premium design, stupid content.

---

## 2. Tech Stack

### Current / Committed
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Animation:** Framer Motion (to be added)

### To Be Added
- **Analytics:** Vercel Analytics + GA4 + PostHog (free tier)
- **OG Images:** `@vercel/og` for dynamic share cards
- **Haptic feedback:** Vibration API (with iOS fallback)

### Environment variables
Already configured locally and in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

To be added:
- `NEXT_PUBLIC_GA_ID` (GA4 measurement ID)
- `NEXT_PUBLIC_POSTHOG_KEY` (PostHog project key)
- `NEXT_PUBLIC_POSTHOG_HOST` (PostHog host URL)

---

## 3. Brand System (Summary)

Full brand guidelines are in `DadHumor_Brand_Guidelines_v1.0.pdf` (shared separately). Key tokens:

### Page Context Rules

The site uses two distinct visual contexts. The decision is behavioural, not structural.

**Brand Context (always dark, no toggle)**
Used for joke delivery, share artefacts, and visual brand moments. Punchy, scrolling, sharing.
- `/` - Main joke experience
- `/j/[slug]` - Individual joke permalinks
- `/fathers-day` - Campaign landing
- `/widget/signage` - Digital signage
- `/generate` - AI joke generator (Phase 5.5)
- `/leaderboard` - Battle mode (Phase 5)
- `/shop` - Product showcase
- API responses, OG image renders, share cards

**Reading Context (light default, dark toggle available)**
Used anywhere the user is consuming text for more than 30 seconds. Sustained reading.
- `/about`, `/privacy`, `/terms`, `/contact`, `/colophon`
- `/blog` - Article listing
- `/blog/[slug]` - Individual articles

**Decision rule for any new page:** Ask "is this a brand performance or a reading experience?"
- Performance = dark (no toggle)
- Reading = light default, dark toggle available
- When unsure, default to light with toggle

**Site shell stays consistent across both contexts.** Same logo treatment, same nav structure, same footer pattern. Only the page body content area changes context. Brand recognition stays intact.

### Colours - Brand Context (Dark)

```css
/* Backgrounds */
--bg-primary:    #121212;   /* Midnight - primary background */
--bg-surface:    #1A1A1A;   /* Charcoal - surfaces, cards */
--bg-elevated:   #242424;   /* Surface plus - elevated surface */
--bg-border:     #333333;   /* Graphite - borders */

/* Text */
--text-primary:   #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.7);   /* Replaces "Smoke" for text */
--text-tertiary:  rgba(255, 255, 255, 0.45);  /* Disabled, subtle */

/* Brand */
--brand-yellow:        #E3FF00;
--brand-yellow-hover:  #C9E600;

/* Reactions (refined for AA pass) */
--lime: #7CFF6B;     /* Props - unchanged */
--pink: #FF4DA6;     /* Groan - lightened from #FF2E93 for AA */
--cyan: #00E0FF;     /* Share - unchanged */
--red:  #FF6B6B;     /* Error - lightened from #FF4D4D for AA */

/* Decorative only - not for text */
--smoke: #A0A0A0;
```

### Colours - Reading Context (Light)

Used only on Reading Context pages. Warm, off-white tones - not pure white.

```css
/* Backgrounds */
--bg-primary:    #FAF8F2;   /* Cream - primary background */
--bg-surface:    #F4F1E8;   /* Paper - surfaces */
--bg-elevated:   #ECE8DA;   /* Surface plus - elevated */
--bg-border:     #DDD7C5;   /* Soft line - borders */

/* Text */
--text-primary:   #1A1A1A;
--text-secondary: rgba(26, 26, 26, 0.7);
--text-tertiary:  rgba(26, 26, 26, 0.5);

/* Brand - cyber yellow stays the brand colour but used differently */
--brand-yellow:  #E3FF00;   /* Same hex - context-dependent usage (see below) */

/* Reactions - deeper, accessible versions for cream backgrounds */
--lime: #2D8C1F;     /* Props - deep green */
--pink: #C2185B;     /* Groan - deep pink */
--cyan: #007A99;     /* Share - teal */
--red:  #C62828;     /* Error - classic red */
```

### Yellow In Light Mode - The "Pill" Treatment

Cyber Yellow on cream fails accessibility (1.1:1 contrast). The fix: yellow is wrapped in dark pills/blocks for any meaningful usage. This becomes a signature visual move.

**Patterns:**
- Logo wordmark: "HUMOR." appears as yellow text inside a dark pill
- Article title highlights: keywords get yellow background highlight on dark text
- Inline punchline emphasis: dark pill with yellow text
- Embedded joke cards: full dark midnight card embedded inside light article body
- CTAs: dark button with yellow text, OR yellow button with dark text (always high contrast)

This treatment maintains brand recognition while solving the contrast problem.

### Typography
- **Display:** Outfit (Google Fonts) - headings, punchlines, wordmark, weights 600-800
- **Body:** Inter (Google Fonts) - body text, setups, UI, weights 400-700

Both loaded via `next/font/google`. No local font files needed. Outfit replaced Clash Display/Space Grotesk after brand review (v1.3).

### Joke Card Type Rules
**Critical hierarchy: Setup uses body font (Inter), punchline uses display font (Outfit). Two different "voices" mirroring how comedians actually deliver setup vs punchline.**

| Element | Font | Mobile | Desktop | Weight | Colour |
|---|---|---|---|---|---|
| Setup | Inter | 22px | 32px | 400 (Regular) | white at 90% opacity |
| Punchline | Outfit | 38px | 60px | 700 (Bold) | Cyber Yellow |

**Dynamic sizing (length-aware):**
- Long setup (>40 chars): 20px / 28px
- Short punchline (<10 chars, e.g. "Bison."): 48px / 72px (BIGGER for drama)
- Long punchline (>60 chars): 28px / 44px

**Other rules:**
- Letter spacing: -0.01em on setup, -0.02em on punchline
- Line height: 1.35 on setup, 1.1 on punchline
- Gap between: 32px mobile, 40px desktop (the "comedic pause")
- Setup never animates - it's been there since load
- Punchline animates in with 100ms delay (the comedic beat)

**Why this works:**
- Setup feels conversational (Inter Regular), punchline lands hard (Outfit Bold)
- Two-axis hierarchy (font family + weight + size) creates clearer comedic timing
- White at 90% gives 17:1 contrast - WCAG AAA, no accessibility worry

### Wordmark
Stacked two-line lockup:
```
DAD
HUMOR.
```
- Font: **Outfit ExtraBold (800)**
- Letter spacing: -0.04em
- Line height: 0.9 (tight stack)
- "DAD" in primary text colour, "HUMOR." in Cyber Yellow on dark contexts
- On light contexts: "DAD" in dark text, "HUMOR." appears as yellow text inside a dark pill (the pill treatment)
- The full stop is part of the brand - always include it

### Mascot - Stache
Chunky cartoon handlebar moustache with expressive eyes above. No face - he IS the face. 9 expression states generated (smug, anticipation, laughing, groan, mind_blown, wink, sleep, pointing, shrug). Assets available as high-res PNGs.

**Cross-context note:** Stache assets were designed for dark backgrounds. In Reading Context (light pages), Stache always appears INSIDE dark embedded-joke cards or dark pill treatments - never directly on cream. This solves the cross-context contrast problem without regenerating any assets.

### Voice
"Your funniest uncle at 11pm - loud, self-aware, unembarrassed, a little too online."
- Lean into the badness, don't apologise for the jokes
- Self-aware, never cringe
- Chaotic but warm

---

## 4. Data Model

### Schema (current + planned)

```sql
create table jokes (
  id bigint primary key generated always as identity,
  setup text not null,
  punchline text not null,
  image_url text,              -- Future: AI-generated pop-art backgrounds
  audio_url text,               -- Future: AI TTS voiceovers
  groans_count integer default 0,
  props_count integer default 0,     -- NEW
  stash_count integer default 0,     -- NEW (global count of stashes)
  share_count integer default 0,     -- NEW
  view_count integer default 0,      -- NEW
  category text,                     -- NEW: pun, wordplay, anti-humour, observational, so-bad
  rating text default 'G',           -- NEW: G or PG
  slug text unique,                  -- NEW: URL-friendly identifier
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes needed
create index idx_jokes_category on jokes(category);
create index idx_jokes_props on jokes(props_count desc);
create index idx_jokes_groans on jokes(groans_count desc);
create index idx_jokes_slug on jokes(slug);
```

### Required RPC Functions

**`get_random_joke(exclude_ids bigint[])`** - returns a random joke, optionally excluding recently-seen IDs. Replaces the current `select *` + random index approach which won't scale past ~1,000 jokes.

**`get_joke_by_id(joke_id bigint)`** - fetches a single joke, increments view_count.

**`increment_props(joke_id bigint)`** - atomic counter increment. Prevents race conditions.

**`increment_groans(joke_id bigint)`** - atomic counter increment.

**`increment_shares(joke_id bigint)`** - atomic counter increment.

### Row Level Security (RLS)

- **SELECT:** public (anyone can read jokes)
- **UPDATE:** via RPC functions only (not direct client writes)
- **INSERT/DELETE:** admin only (for now)

### Storage
Public bucket `joke-assets` for future AI-generated PNG/MP3 assets.

### Future tables (v2)

```sql
-- User accounts (Supabase Auth)
-- create table profiles (
--   id uuid references auth.users primary key,
--   username text unique,
--   display_name text,
--   stache_level integer default 1,
--   streak_count integer default 0,
--   last_active_date date,
--   created_at timestamp with time zone default now()
-- );

-- User stash (saved jokes)
-- create table stashes (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid references profiles(id),
--   joke_id bigint references jokes(id),
--   collection_name text default 'default',
--   created_at timestamp with time zone default now(),
--   unique(user_id, joke_id)
-- );

-- User submissions
-- create table joke_submissions (...)
```

---

## 5. Gesture & Interaction Model

Core principle: **every gesture has a visible button equivalent.** Users can learn through either system.

### The 5 interactions

| Action | Gesture | Button | Keyboard | Haptic |
|---|---|---|---|---|
| Reveal punchline | Tap anywhere | - | `Space` | Light |
| Next joke | Swipe left | Yellow "Next →" | `←` or `Space` (after reveal) | Light |
| Props (respect) | Swipe right | Lime "🤝 Props" | `→` | Medium |
| Groan | Long-press Groan button (800ms) | Pink "🙄 Groan" (hold) | `G` | Building buzz → heavy thud |
| Share | Swipe up | Cyan share icon | `↑` or `S` | Light |
| Stash (save) | Double-tap card | Yellow pin icon | `Shift+S` | Double-buzz |

### Critical interaction details

- **Action bar only appears AFTER punchline reveal** (hidden initially)
- **Props auto-advances** to the next joke (Tinder-style commitment)
- **Groan requires long-press** - prevents accidental taps, matches emotional weight
- **Stash is idempotent** - tap once to save, tap again to unsave
- **Props/Groan are mutually non-exclusive** - user can do both on same joke
- **Props/Groan are one-time per joke per user** - tracked client-side (session for v1, account-bound for v2)

### Onboarding

First-time visitors get a 3-step overlay:
1. Meet Stache (brand intro)
2. Tap to reveal (core interaction)
3. Swipe to react (gesture cheatsheet)

Skippable. Stored in `localStorage` as `dh_onboarded: true` - only shown once per device.

### Subtle gesture hints

For the first 3 reveals in a session, three tiny pulsing coloured dots appear on the edges of the card (one per swipe direction) to hint at available gestures. Fade after 4 seconds. Peripheral teaching without being annoying.

---

## 6. Haptic Feedback System

Implement as a utility module `/src/utils/haptic.ts`:

```typescript
// Vibration API works on Android Chrome/Firefox/Samsung Internet.
// iOS Safari doesn't expose it on the web - we gracefully no-op there.
export const haptic = {
  supported: typeof navigator !== 'undefined' && 'vibrate' in navigator,
  light()    { if (this.supported) navigator.vibrate(10); },
  medium()   { if (this.supported) navigator.vibrate(20); },
  heavy()    { if (this.supported) navigator.vibrate(40); },
  double()   { if (this.supported) navigator.vibrate([15, 50, 15]); },
  groanBuild() { if (this.supported) navigator.vibrate([30, 60, 50, 40, 80, 30, 120]); },
  groanHit() { if (this.supported) navigator.vibrate([180, 40, 60]); },
  stop()     { if (this.supported) navigator.vibrate(0); }
};
```

Usage per interaction:
- Reveal: `haptic.light()`
- Props: `haptic.medium()`
- Stash: `haptic.double()`
- Groan (during long-press): `haptic.groanBuild()`
- Groan (completion): `haptic.groanHit()`
- Swipe complete: `haptic.light()`
- Groan cancelled (released early): `haptic.stop()`

---

## 7. Content

### Seed content
50 jokes ready to insert, available in `dadhumor_seed_jokes.sql`. Mix of:
- 15 puns
- 10 wordplay
- 8 anti-humour
- 8 observational
- 9 so-bad-they're-good

All G-rated, few PG. Each has a `category` field for filtering.

### Content strategy
- Phase 1: 50 seed jokes (manual)
- Phase 5: User submissions with moderation queue
- Phase 5+: AI-generated jokes with quality filter
- Phase 5+: Scraper from public dad joke datasets (already roadmapped)

---

## 8. Feature Roadmap

### Phase 2: Technical Foundation (NEXT - starting here)
- Supabase schema updates (new columns, indexes)
- RPC functions (random_joke, increment_*, get_by_id)
- Individual joke URLs (`/j/[slug]`)
- Analytics stack (Vercel Analytics + GA4 + PostHog)
- Component architecture refactor

### Phase 3: Core Features
- Full gesture system with Framer Motion
- Props + Groan + Stash (localStorage for v1)
- Action bar with full interactions
- Stache expression system (9 moods, swapped by context)
- Onboarding flow (3-step, skippable)
- Haptic feedback

### Phase 4: Launch Readiness + Viral Engine
- Dynamic OG share cards via `@vercel/og` (1080x1920, 1080x1080, 1200x630)
- Share sheet with native Web Share API
- Proper loading/error/404 states (with brand voice)
- Favicon + PWA manifest
- Cookie banner (UK/EU compliance)
- Privacy policy + terms
- SEO sitemap/robots.txt
- **Joke of the Day API** (`api.dadhumor.app/v1/joke-of-the-day`)
- **WordPress plugin** (free, for widget distribution)
- **Digital signage page** (hosted URL, 16:9 auto-refresh)

### Phase 4.5: Father's Day Campaign (June 2026) - NEW
Time-bound campaign for UK Father's Day (21 June 2026). See `fathers-day-campaign.md` for full brief.
- "Dad Mode" toggle - swaps to Premium Dad Stache (pipe/slippers/BBQ tongs)
- Limited-edition Father's Day share card frames
- Email capture lead magnet: "20 Brand New Dad Jokes for Father's Day"
- Dedicated landing page `/fathers-day` with countdown
- Send-to-Dad share priority
- "Jokes Your Dad Definitely Already Told" filter
- Father's Day-specific microcopy across the app
- Free downloadable Father's Day cards
- Post-day: "How many of these did your dad tell you?" interactive quiz

### Phase 4.6: Articles / Content System - NEW
MDX-powered article system for SEO content, data stories, guides, and legal pages.
- File-based: articles live in `/content/articles/` as `.mdx` files (no external CMS)
- Custom MDX components: `<JokeEmbed>`, `<StacheReact>`, `<Callout>`, `<GroanLeaderboard>`, `<DadJokeQuiz>`
- Routes: `/blog`, `/blog/[slug]`, `/[slug]` for static pages
- Per-article OG image generation via `@vercel/og`
- RSS feed at `/feed.xml`
- Initial 5-7 articles at launch
- Static pages: about, privacy, terms
- Foundation for Phase 8 press/data marketing

### Phase 5: v2 Features (post-launch, prioritised)
1. **Joke Battle Mode** (head-to-head voting, Elo rankings) - virality engine
2. **Custom Joke Collections** (level up Stash with themed collections) - retention
3. **Daily Streak + Stache Evolution** - daily return mechanic
4. **Send-a-Joke** (P2P messaging with tracking) - viral loop
5. **Hot Takes** (prewritten reactions)
6. **User submissions** with moderation
7. **Sound effects library** - drum roll, trombone "wah wah", applause, swipe whoosh, click, ding, snore. Toggle in header, OFF by default. localStorage persistence. Web Audio API. See Phase 7 detail below.
8. **AI Dad Voice** readings (ElevenLabs) - TikTok fuel

### Phase 5.5: AI Joke Generator - NEW
Standalone feature at `/generate`:
- Input: user-provided subject/topic
- Output: 3 AI-generated dad joke variations
- Model: Claude Haiku, GPT-4o-mini, or Gemini Flash (cheap and fast)
- Rate limit: 5/day free, 50/day premium
- "Submit to public feed" with moderation queue
- Strong system prompt with humour guardrails (no offensive content)
- Track Props/Groans on AI jokes vs curated jokes (quality monitoring)
- Tagline: "Make your dad joke worse, instantly."

### Phase 6: Bantered Integration (Merchandise) - NEW
Integration with owner's existing POD/Shopify brand. See `bantered-integration-spec.md`.
- `/shop` route with Shopify Buy Button or full embed
- "Buy this on a tee" button on individual jokes
- Joke-of-the-day → tee-of-the-week pipeline
- Cross-promotion between Dad Humor and Bantered brands
- Dedicated Dad Humor merchandise collection
- Initial product line: tees, hoodies, posters, mugs, greeting cards
- Print-ready file pipeline from joke selection to product mockup

### Phase 7: Sound System - NEW
Small but distinct phase. Can ship alongside Phase 5.
- Sound effect library (10 effects)
- Toggle UI in header (speaker icon)
- First-time prompt: "Want sound effects? They're stupid and great." (ON/OFF)
- Settings persistence in localStorage
- Web Audio API integration
- Volume normalised across effects
- All sounds preloaded after toggle enabled
- Default state: OFF (always)

### Phase 8: Press & Data Marketing - NEW
Quarterly content marketing engine driven by user data.
- Add `country_code` (from IP) to all event tracking
- Quarterly data review process
- Press release templates
- Curated journalist pitch list (BuzzFeed, Mashable, Daily Mail, MetroUK, MailOnline, ladbible, joe.co.uk)
- Story angles bank: "Most groaned-at joke," "UK vs US humour," "Mathematical formula for dad jokes," etc.
- Each story is a backlink-generating asset

### Phase 9+: Monetisation
See `monetisation-roadmap.md` for full priority order. Top items:
1. Sticker pack (£6.99)
2. Enamel pin (£8.99)
3. Greeting card multi-packs (£9.99)
4. The Dad Humor book (£14.99)
5. Tear-away daily calendar (£12.99 annually)
6. Wall calendar (£14.99 annually)
7. The Dad Humour Yearbook (£19.99 annually)
8. Premium tier (£2.99/mo)
9. Custom printed cards (£4.99 each)
10. Joke subscription box (£14.99/mo)
11. Pub Quiz Pack (£19.99)
12. Corporate Branded API (£49-99/mo + setup)
13. Wedding Speeches PDF (£9.99)
14. School/Teacher Pack (£29.99)

**Parked:** Stache plushie, AI Dad Voice, NFTs (skip)
**Killed:** SMS subscription

---

## 9. Analytics Events

Track via PostHog (primary) + GA4 (secondary):

| Event | Properties |
|---|---|
| `joke_viewed` | joke_id, category, referrer, country_code |
| `punchline_revealed` | joke_id, time_to_reveal_ms, country_code |
| `props_given` | joke_id, via (gesture/button/keyboard), country_code |
| `joke_groaned` | joke_id, via (gesture/button/keyboard), country_code |
| `joke_stashed` | joke_id, via, country_code |
| `joke_unstashed` | joke_id |
| `joke_shared` | joke_id, platform (story/insta/whatsapp/copy/native), country_code |
| `joke_skipped` | joke_id, time_on_joke_ms, country_code |
| `onboarding_started` | country_code |
| `onboarding_completed` | steps_viewed, country_code |
| `onboarding_skipped` | step_reached, country_code |
| `ai_joke_generated` | subject, country_code (Phase 5.5) |
| `sound_toggle_changed` | new_state, country_code (Phase 7) |

**Why country_code on everything:** powers the press/data strategy (Phase 8). Get geo data from request headers (Vercel provides `x-vercel-ip-country` for free) or PostHog's built-in geolocation. Not stored as PII - just country code.

Funnel to track: viewed → revealed → reacted (props/groan/stash/share).

---

## 10. URL Structure & SEO

### Routes
- `/` - Main app (random joke)
- `/j/[slug]` - Individual joke (shareable, indexable)
- `/j/[slug]/og` - Dynamic OG image for that joke
- `/category/[name]` - Browse by category (v2)
- `/about` - About + brand
- `/api/v1/joke-of-the-day` - Public API (Phase 4)
- `/widget/signage` - Digital signage page (Phase 4)

### Slug strategy
Auto-generated from joke setup, first 8 words max, URL-safe. Example:
- Setup: "Why don't eggs tell jokes?"
- Slug: `why-dont-eggs-tell-jokes`

Stored on the joke record, generated on insert via trigger.

### SEO basics
- Per-joke dynamic `<title>` and `<meta description>`
- Structured data (Joke schema if it exists, else Article)
- Sitemap generated dynamically from Supabase
- `robots.txt` allowing all

---

## 11. Assets

### Stache mascot (9 expressions)
Located in `/public/stache/` (to be added):
- `01-smug-default.png`
- `02-anticipation.png`
- `03-laughing.png`
- `04-groan.png`
- `05-mind-blown.png`
- `06-winking.png`
- `07-sleeping.png`
- `08-pointing.png`
- `09-shrugging.png`

All transparent PNGs, ~1024-2048px, ready to use. Background removed in Figma.

### Component approach
Build a typed `<Stache />` component:

```typescript
type StacheMood =
  | 'smug' | 'anticipation' | 'laughing' | 'groan'
  | 'mind-blown' | 'winking' | 'sleeping' | 'pointing' | 'shrugging';

interface StacheProps {
  mood?: StacheMood;        // default 'smug'
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;        // for entrance animations
}
```

This keeps expression logic centralised and makes it trivial to swap PNGs for SVGs later.

---

## 12. Reference Files

Outside this handover, these files are source material:
- `DadHumor_Brand_Guidelines_v1.0.pdf` - full brand bible
- `dadhumor_seed_jokes.sql` - 50 jokes ready to insert
- `dadhumor_mockup_v2.html` - interactive UX reference (open in browser to feel the interactions)
- `/public/stache/*.png` - mascot assets (to be added to repo)

---

## 13. Out of Scope For v1

Explicitly NOT doing at launch:
- User accounts / authentication
- User-submitted jokes
- AI-generated per-joke images (future)
- AI-generated per-joke audio (future)
- Comments / replies
- Following / social graph
- Light mode (brand is dark-mode only - intentional)

---

## 14. Success Metrics for v1

Defined success:
- 50 jokes live in database ✅ (seed ready)
- All 5 gestures working reliably on mobile and desktop
- Dynamic share cards generating correctly
- Joke of the Day API publicly accessible
- WordPress plugin published to WP.org directory
- No major bugs on launch day
- Average session: 2+ jokes viewed

This is a passion project, not commercial urgency. Ship when ready.
