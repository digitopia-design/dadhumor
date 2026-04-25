# Father's Day 2026 Campaign Brief

**Campaign window:** 1 June - 25 June 2026
**Father's Day (UK):** Sunday 21 June 2026
**Father's Day (US/CA):** Sunday 21 June 2026 (same date this year)
**Document version:** 1.0
**Owner:** Digitopia Design Ltd

---

## Why This Matters

Father's Day is the single biggest cultural moment for this brand. It's the literal showcase day. Skip it and we miss our biggest organic traffic spike of the year. Nail it and we own the conversation in our space.

This campaign also doubles as our **first proper marketing test** - giving us a controlled environment to measure email signup, share rates, and conversion to merchandise (if Bantered integration ships in time).

---

## Strategic Goals

1. **Traffic spike:** 10x normal daily visits during the week of 15-21 June
2. **Email list growth:** Capture 1,000+ emails via the lead magnet
3. **Share velocity:** Father's Day share cards shared 5x more than baseline
4. **Brand association:** "Dad Humor" appears in dad-joke-related Google searches by end of June
5. **Merch trial (if Phase 6 ships):** First commerce conversions

---

## Campaign Components

### 1. Dad Mode Toggle
**What:** Header toggle that swaps Stache for "Premium Dad Stache" - a version with Father's Day accessories (pipe, slippers, BBQ tongs, dad hat - generate 3 variants).

**When:** Available throughout campaign window (1-25 June).

**Why:** Creates an interactive, opt-in moment. Users actively engage with the campaign rather than passively consuming.

**Build notes:**
- Toggle persists in localStorage
- Auto-disables on 26 June (post-campaign)
- New asset variants generated via Midjourney before 1 June
- Subtle UI animation when toggled (Stache fades, accessory drops in)

### 2. Father's Day Landing Page (`/fathers-day`)
**What:** Dedicated landing page for the campaign.

**Sections:**
- Hero: Countdown to Father's Day + animated Premium Dad Stache
- "Send a joke to your dad" - one-tap share to WhatsApp/SMS
- "Jokes Your Dad Definitely Already Told" - curated collection
- Email capture for the lead magnet
- Footer: link to main app

**SEO:** Optimised for "father's day jokes," "dad jokes for father's day," "best dad jokes 2026"

**Live dates:** 1 June 2026 (3 weeks pre-event)

### 3. Limited-Edition Share Card Frames
**What:** Variant of standard OG share cards with Father's Day-specific framing.

**Visual treatment:**
- Subtle "Happy Father's Day 2026" badge top-right
- Slight border treatment in Cyber Yellow
- Premium Dad Stache instead of default Stache
- Footer text changes to "Send to your dad → dadhumor.app"

**Active window:** 1-25 June 2026 only. Logic in OG image route checks date.

**Three formats** (same as standard):
- 1080x1920 (Stories/TikTok)
- 1080x1080 (Feed)
- 1200x630 (OG/link preview)

### 4. Email Capture Lead Magnet
**Title:** "20 Brand New Dad Jokes for Father's Day"

**Format:** PDF download, designed in brand style (uses brand guidelines layout). Each joke has:
- Setup
- Punchline (in Cyber Yellow)
- Stache reaction in corner
- Brand watermark

**Bonus content in PDF:**
- "How to deliver a dad joke for maximum cringe" - guide
- Father's Day card templates (printable)
- Promo code for Bantered merch (if Phase 6 live)

**Service:** Recommend Resend (cheap, dev-friendly) or MailerLite (already in your connector list - might be the move).

**Subscriber tagging:** All sign-ups tagged `fathers_day_2026` for future campaign segmentation.

**Auto-responder sequence:**
- Day 0: Deliver PDF + welcome
- Day 3: "Want a joke a day until Father's Day?" - opt-in to daily countdown emails
- Day 7: "Best dad jokes voted by the community" + share prompt
- Day 21 (Father's Day): "Happy Father's Day - here are today's jokes" + final share push

### 5. Send-to-Dad Priority
**What:** Reorder share sheet during campaign window.

Default order:
1. Story
2. Insta
3. WhatsApp
4. Download

Father's Day order:
1. **Send to Dad** (NEW - opens native share with pre-filled "Happy Father's Day! Here's a joke for you →")
2. WhatsApp
3. Story
4. Download

Logic: dynamic ordering based on date.

### 6. "Jokes Your Dad Definitely Already Told"
**What:** Manually curated collection of 20 most stereotypically "dad" jokes from the seed set.

**Access:**
- Direct URL: `/collections/dad-classics`
- Linked from `/fathers-day`
- Featured during campaign in main app: "Take the test - have you heard them all?"

**Curation criteria:**
- Highly recognisable
- Pun or wordplay (the platonic dad joke form)
- Short and quotable
- "Said in a dad voice" energy

### 7. Post-Day Quiz (22-25 June)
**Title:** "How many of these did your dad tell you?"

**Format:** 10-question interactive quiz. Each question shows a classic dad joke. User taps "Yes" (heard it) or "No" (new to me).

**Results categories:**
- 0-2: "Apprentice Dad Joke Survivor - your dad clearly diversified"
- 3-5: "Dad Joke Tourist - you've sampled the buffet"
- 6-8: "Dad Joke Veteran - you've earned battle scars"
- 9-10: "Dad Joke Hostage - we're sorry, and also impressed"

**Shareable:** Each result generates a custom share card with the badge. Highly social.

**Conversion play:** "Take the test, then send it to your dad." Loops back to share mechanic.

---

## Pre-Launch Checklist (target: 25 May 2026)

- [ ] Premium Dad Stache assets generated (3 variants)
- [ ] Father's Day landing page built and styled
- [ ] OG share card frame variant built and tested
- [ ] Lead magnet PDF designed and proof-read
- [ ] Email service configured with auto-responder
- [ ] Dad Classics collection curated
- [ ] Send-to-Dad share priority logic deployed
- [ ] Analytics events for campaign added (track: dad_mode_toggled, fathers_day_lead_capture, send_to_dad_clicked)
- [ ] Social media content batch prepared for daily posting
- [ ] Press outreach pitch ready (1 week before)

---

## Promotional Calendar

| Date | Activity |
|---|---|
| **1 June** | Campaign goes live, landing page open, social push begins |
| **3 June** | Email blast to existing list with lead magnet |
| **7 June** | Reddit post in /r/Jokes, /r/DadJokes (pure value, soft mention) |
| **8-14 June** | Daily TikTok/Instagram posts featuring share cards |
| **10 June** | Pitch press: "We analysed 1000 dad jokes and here's the worst" (data play) |
| **15 June** | Email blast - "1 week to Father's Day" + countdown |
| **17 June** | Push viral content - "Vote for the most groan-worthy joke for Father's Day" |
| **20 June** | Email - "Tomorrow's the day" + final share push |
| **21 June** | **Father's Day** - homepage takeover, push notifications, all hands |
| **22 June** | Launch the post-day quiz, email blast |
| **23-25 June** | Social ride the coattails - "How was your Father's Day?" engagement |
| **26 June** | Campaign closes, Premium Dad Stache fades, post-mortem begins |

---

## Success Metrics

| Metric | Target | Stretch |
|---|---|---|
| Daily peak traffic | 10,000 visits | 50,000 |
| Email signups | 1,000 | 5,000 |
| Share cards generated | 5,000 | 20,000 |
| Quiz completions (post-day) | 500 | 2,000 |
| Social mentions of @dadhumor | 100 | 500 |
| Press placements | 1 | 3+ |
| Conversion to Bantered (if live) | 50 orders | 200 orders |

---

## Risks & Mitigations

**Risk: Server overload during peak**
Mitigation: Vercel auto-scales, but pre-warm the cache on 21 June morning. Edge-cache the landing page and joke API.

**Risk: Email service deliverability issues**
Mitigation: Test send to 5 different inbox providers before launch. Use established service (Resend or MailerLite, both have good reputation).

**Risk: Father's Day Stache asset doesn't generate well**
Mitigation: Lock asset generation by 1 May to give time for revisions. Have a fallback (just default Stache with a small "Happy Father's Day" badge) if mascot variants don't land.

**Risk: Trolls submit offensive jokes if submission feature is live**
Mitigation: All submissions go to moderation queue. No instant publishing. (Phase 5 feature, possibly not live yet - may not apply.)

---

## Tone Notes

The campaign should feel:
- **Affectionate, not cynical** - this is one of the few moments where Dad Humor's "ironic appreciation" shifts to "genuine appreciation"
- **Inclusive** - "your dad" can be any father figure, biological or otherwise. Don't get heavy-handed about it, just don't exclude
- **Light** - it's a fun campaign, not a heart-tugging Hallmark moment
- **Confident** - we own this space. The brand voice doesn't apologise.

**Sample microcopy for the campaign:**
- Hero: "Father's Day 2026. The one day a year his jokes are tolerated."
- CTA: "Send to your dad. He'll send three back."
- Email subject: "20 jokes your dad doesn't know yet (but soon will)"
- Quiz intro: "How many of these has your dad told you? Don't lie."
- Quiz win state: "Confirmed: you have lived a full life."

---

## Post-Campaign Review (target: 30 June 2026)

Review meeting agenda:
1. Hit/miss against success metrics
2. Top-performing share cards (data)
3. Email engagement rates
4. What broke, what worked
5. Document learnings for Father's Day 2027 brief
6. Carry over: which features should become permanent? (e.g. did Send-to-Dad share priority work so well it should always be there?)

This becomes a recurring annual playbook.
