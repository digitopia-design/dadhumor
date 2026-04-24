# Dad Humor - Project Handover

**Project:** dadhumor.app
**Owner:** Digitopia Design Ltd
**Document version:** 1.0
**Last updated:** April 2026
**Status:** MVP live, ready for Phase 2 (Technical Foundation)

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

### Colours
```css
--midnight: #121212;   /* Primary background */
--charcoal: #1A1A1A;   /* Surfaces, secondary buttons */
--graphite: #333333;   /* Borders */
--yellow:   #E3FF00;   /* Primary CTAs, punchlines */
--pink:     #FF2E93;   /* Groan button, negative reactions */
--cyan:     #00E0FF;   /* Share, secondary CTAs */
--lime:     #7CFF6B;   /* Props (positive reactions), success */
--red:      #FF4D4D;   /* Errors (with humour) */
--white:    #FFFFFF;   /* Primary text */
--smoke:    #A0A0A0;   /* Muted text */
```

### Typography
- **Display:** Clash Display (Fontshare) - headings, punchlines, wordmark
- **Fallback:** Space Grotesk (Google Fonts, free)
- **Body:** Inter (Google Fonts)

### Wordmark
Stacked two-line lockup:
```
DAD
HUMOR.
```
"DAD" in white, "HUMOR." in Cyber Yellow. The full stop is part of the brand - always include it.

### Mascot - Stache
Chunky cartoon handlebar moustache with expressive eyes above. No face - he IS the face. 9 expression states generated (smug, anticipation, laughing, groan, mind_blown, wink, sleep, pointing, shrug). Assets available as high-res PNGs.

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

### Phase 5: v2 Features (post-launch, prioritised)
1. **Joke Battle Mode** (head-to-head voting, Elo rankings) - virality engine
2. **Custom Joke Collections** (level up Stash with themed collections) - retention
3. **Daily Streak + Stache Evolution** - daily return mechanic
4. **Send-a-Joke** (P2P messaging with tracking) - viral loop
5. **Hot Takes** (prewritten reactions)
6. **User submissions** with moderation
7. **AI Dad Voice** readings (ElevenLabs) - TikTok fuel

### Phase 6+: Monetisation
Priority order:
1. Sticker pack (£6.99)
2. Enamel pin (£8.99)
3. Greeting card packs (£9.99)
4. Book (£14.99)
5. Premium tier (£2.99/mo)
6. Custom printed cards (£4.99)

**Parked:** Stache plushie, corporate workshop pack, AI Dad Voice (explore later)
**Killed:** SMS subscription

---

## 9. Analytics Events

Track via PostHog (primary) + GA4 (secondary):

| Event | Properties |
|---|---|
| `joke_viewed` | joke_id, category, referrer |
| `punchline_revealed` | joke_id, time_to_reveal_ms |
| `props_given` | joke_id, via (gesture/button/keyboard) |
| `joke_groaned` | joke_id, via (gesture/button/keyboard) |
| `joke_stashed` | joke_id, via |
| `joke_unstashed` | joke_id |
| `joke_shared` | joke_id, platform (story/insta/whatsapp/copy/native) |
| `joke_skipped` | joke_id, time_on_joke_ms |
| `onboarding_started` | - |
| `onboarding_completed` | steps_viewed |
| `onboarding_skipped` | step_reached |

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
