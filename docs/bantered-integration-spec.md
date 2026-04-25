# Bantered Integration Spec

**Project:** Dad Humor → Bantered merchandise integration
**Document version:** 1.0
**Owner:** Digitopia Design Ltd
**Status:** Planned for Phase 6 (post-launch)

---

## Strategic Frame

Dad Humor is the content engine. Bantered is the commerce engine. Most content brands struggle to monetise because they don't own product manufacturing. We do.

**The play:**
- Dad Humor drives traffic via virality (the content brand)
- Every joke, share, and engagement is a soft pipeline to merchandise
- Bantered fulfils the orders (existing POD/Shopify infrastructure)
- Revenue flows back to fund Dad Humor growth

This is a flywheel: content → traffic → commerce → revenue → content investment → more content → more traffic.

---

## Brand Relationship

**Public framing:** Dad Humor is "by Bantered" or "powered by Bantered" depending on context.

**Why this hierarchy:**
- Bantered is the parent brand with proven infrastructure
- Dad Humor benefits from Bantered's logistics legitimacy
- Bantered benefits from Dad Humor's viral content pipeline
- Customers see consistency across both touchpoints

**Visual treatment:**
- Dad Humor footer: "by Bantered" subtle credit
- Bantered footer: "Powered by Dad Humor" on Dad Humor collection pages
- Email footers cross-reference where appropriate
- No heavy co-branding in main UI (each brand maintains its own identity)

---

## Phase 6 Scope (Initial Integration)

### 6.1 Shop Route On Dad Humor

Add `/shop` route on dadhumor.app.

**Two implementation options:**

**Option A: Shopify Buy Button SDK (recommended)**
- Embed Shopify products inline via JS SDK
- Users browse and buy without leaving Dad Humor
- Cart is hosted by Shopify (handles checkout)
- Single-page experience
- More dev work but better UX

**Option B: Direct redirect**
- `/shop` redirects to `bantered.com/collections/dad-humor`
- Users browse on Bantered's existing site
- Lower dev effort
- Disconnected experience

**Recommendation: Option A.** Worth the effort for retained traffic.

**Implementation:**
- Add Shopify Buy Button script to layout
- Create `/shop` page with featured products
- Style with Dad Humor brand tokens (Shopify allows custom CSS)
- Use Stache imagery on product cards

### 6.2 "Buy On A Tee" Per-Joke Button

On individual joke pages (`/j/[slug]`), add a CTA after the punchline reveal:

> **"Want this on a tee?"** [Get yours →]

**Mechanics:**
- Button visible only after punchline reveal
- Links to a custom Bantered product page with the joke text injected
- If Bantered supports it: dynamic product mockup generation (joke text on tee template)
- If not: links to a generic "design your own" product flow

**Positioning:**
- Subtle, not pushy
- Below the action bar (Props/Groan/etc), so it doesn't compete with primary actions
- Only appears for jokes with high engagement (props_count > 100, configurable threshold)

### 6.3 Tee-of-the-Week Pipeline

Weekly content/commerce loop:

1. **Monday:** Admin selects winning joke from previous week's data (most Props)
2. **Tuesday:** Auto-generate product mockup (joke on tee template)
3. **Wednesday:** Push to Bantered as new product, set as featured
4. **Thursday-Sunday:** Promote across Dad Humor + email list
5. **Following Monday:** Repeat

**Tooling needed:**
- Admin dashboard with "Tee of the Week" picker
- Mockup generator (Photoshop action automated, or use Placeit API, or Bannerbear)
- Shopify API integration for product creation
- Email template for "This week's tee" notification

**Pricing:** £24.99 standard, £29.99 premium fabric. (Adjust to Bantered's existing price points.)

### 6.4 Cross-Brand Header/Footer

**Dad Humor header:** No change - keep clean.
**Dad Humor footer:** Add subtle `by Bantered` text linking to bantered.com.
**Bantered header:** No change.
**Bantered footer (Dad Humor collection pages):** Add `Powered by Dad Humor` linking to dadhumor.app.

---

## Initial Product Line

Phase 6 launch products. All print-on-demand via existing Bantered infrastructure.

### Apparel
- **Tees** (£24.99) - rotating joke designs, Stache designs
- **Hoodies** (£44.99) - premium positioning, Stache hero design
- **Aprons** (£29.99) - "Licensed Dad Joke Practitioner" + Stache

### Print
- **Posters** (£19.99) - single jokes in pop-art style, A3 size
- **Greeting cards** (£4.99 single, £19.99 5-pack) - birthdays, Father's Day, just-because
- **Greeting card multipacks** (£24.99) - mixed occasions

### Drinkware
- **Mugs** (£14.99) - "Best Dad Joke" + signature jokes
- **Travel mugs** (£19.99)

### Stationery
- **Notebook** (£12.99) - "Dad's Joke Journal" - record the ones that landed
- **Sticker pack** (£6.99) - all 9 Stache expressions
- **Enamel pin** (£8.99) - signature Smug Stache

---

## Phase 6 Deliverables Checklist

### Pre-Launch
- [ ] Bantered Shopify collection created: "Dad Humor"
- [ ] Initial 10 product designs created
- [ ] Product mockups designed
- [ ] Pricing locked in
- [ ] Print-ready files prepared
- [ ] Shopify Buy Button SDK keys obtained

### Build
- [ ] `/shop` route built with embedded Shopify
- [ ] Per-joke "Buy on a tee" button + product page wiring
- [ ] Cross-brand footer links
- [ ] Admin tool for weekly tee selection
- [ ] Mockup auto-generation

### Launch
- [ ] First tee-of-the-week selected and live
- [ ] Email blast to existing list
- [ ] Social posts across both brands
- [ ] Press release: "Dad Humor launches merchandise"

---

## Phase 6.5+ Future Products

These are for later, but worth designing for:

### Annual Products
- **Tear-away calendar** (£12.99) - 365 jokes, one per day. Christmas product.
- **Wall calendar** (£14.99) - 12 jokes, illustrated by Stache. Annual.
- **The Dad Humour Yearbook** (£19.99) - hardback, year's best jokes + data.

### The Book
- **"500 Dad Jokes From The Internet's Premier Authority"** (£14.99 paperback, £24.99 hardback)
- Self-publish via Amazon KDP or commission Bantered's print partners
- Coffee table positioning, illustrated throughout

### Subscription Products
- **Joke subscription box** (£14.99/mo) - monthly themed merch + new jokes
- Use Cratejoy or Subbly platform
- Recurring revenue play

### B2B Products
- **Pub Quiz Pack** (£19.99) - PDF + printed deck for pubs/parties
- **School/Teacher Pack** (£29.99) - classroom-safe with lesson plans
- **Corporate Branded Joke API** (£500-2000 setup, £49-99/mo) - Slack channels, intranets

### Niche Products
- **Wedding Speeches PDF** (£9.99) - "100 Dad-Approved One-Liners for Father of the Bride"
- **Dad Coaching course** (£14.99 video) - "How To Tell A Dad Joke Properly"

---

## Revenue Modelling

Conservative estimate, first year post-launch:

| Channel | Avg Order | Volume/year | Revenue |
|---|---|---|---|
| Tees | £24.99 | 500 | £12,495 |
| Hoodies | £44.99 | 100 | £4,499 |
| Mugs | £14.99 | 300 | £4,497 |
| Stickers | £6.99 | 800 | £5,592 |
| Greeting cards | £19.99 (avg) | 200 | £3,998 |
| Posters | £19.99 | 150 | £2,999 |
| **Total** | | | **£34,080** |

Less Bantered's POD costs (~40% of retail) and platform fees (~5%): net **~£18,000 first year**.

Reinvest into Phase 7+ feature development and content scaling.

---

## Bantered-Side Considerations

This integration affects Bantered's existing infrastructure:

- New collection "Dad Humor" added to product taxonomy
- May need new SKUs if products are exclusive to this collection
- Customer service may receive Dad Humor-specific queries (train accordingly)
- Analytics segmentation: tag Dad Humor traffic separately
- Email marketing: Dad Humor subscribers should NOT auto-merge into general Bantered list (different audience expectation)

---

## Open Questions To Resolve Before Phase 6

1. Will Dad Humor have its own checkout/cart, or always defer to Bantered?
2. Are products exclusive to Dad Humor, or do they appear in main Bantered catalogue too?
3. Single Stripe/Shopify Payments account, or separate?
4. How are customer emails handled - one list or two?
5. What's the returns policy? Same as Bantered or specific?

These can be answered during Phase 6 kickoff. No urgency before then.
