=== Dad Humor – Daily Jokes ===
Contributors: digitopiadesign
Tags: jokes, dad jokes, humor, widget, shortcode, joke of the day
Requires at least: 5.8
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Display today's dad joke on your site. Shortcode, classic widget, and Gutenberg block. No API key needed.

== Description ==

Professionally unfunny since 2026.

Dad Humor pulls the Joke of the Day from [dadhumor.app](https://dadhumor.app) and puts it anywhere on your WordPress site. One joke per day, automatically rotated. Perfect for blogs, pub websites, office intranets, or anyone who believes terrible puns deserve a wider audience.

**Three ways to display a joke:**

* **Shortcode** — drop `[dad_joke]` anywhere in a post, page, or template
* **Classic Widget** — add to any sidebar from Appearance → Widgets
* **Gutenberg Block** — search "Dad Humor" in the block inserter

**Features:**
* Dark and light theme variants
* Optional category label
* Optional "More jokes" credit link (appreciated but not required)
* 1-hour caching via WordPress transients — no slowdown, no hammering the API
* No account, no API key, no tracking

**Shortcode options:**

`[dad_joke]` — default dark theme, category shown, link shown

`[dad_joke theme="light" show_category="false" show_link="false"]`

Options:
* `theme` — `dark` (default) or `light`
* `show_category` — `true` (default) or `false`
* `show_link` — `true` (default) or `false`

Jokes sourced from [dadhumor.app](https://dadhumor.app).

== Installation ==

1. Upload the `dadhumor-jokes` folder to `/wp-content/plugins/`
2. Activate the plugin via Plugins → Installed Plugins
3. Use `[dad_joke]` in any post or page, add the widget from Appearance → Widgets, or insert the Gutenberg block
4. Check Settings → Dad Humor to see today's joke and manage the cache

== Frequently Asked Questions ==

= Do I need an API key? =
No. The dadhumor.app API is free and public.

= How often does the joke change? =
Once per day. Everyone sees the same joke on the same day.

= Can I display a random joke instead of today's? =
Not in this version. Random joke support is planned for a future release.

= The joke isn't updating / showing yesterday's joke. =
Go to Settings → Dad Humor and click "Clear cache". The joke will refresh on the next page load.

= Can I remove the "More jokes at dadhumor.app" link? =
Yes — use `[dad_joke show_link="false"]` or uncheck it in the widget/block settings. It's appreciated but not required.

= Does it work with page caching plugins? =
Yes. The joke is cached server-side via WordPress transients, so it works alongside WP Super Cache, W3 Total Cache, etc.

== Screenshots ==

1. Dark theme — as displayed in a sidebar widget
2. Light theme — for light-background sites
3. Gutenberg block with Inspector Controls panel open
4. Settings page (Settings → Dad Humor)

== Changelog ==

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.0.0 =
Initial release.
