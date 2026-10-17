# Sample Lodge Hotel — website template

A complete, responsive boutique-hotel website built as static HTML, CSS and
vanilla JavaScript. No frameworks, no runtime dependencies, no external requests
at runtime — fonts and images are self-hosted.

The brand, contact details and copy are **placeholders** for a fictional hotel
("Sample Lodge Hotel") on the Papua New Guinea coast. Every photo is openly
licensed stock photography, credited on the built-in [credits page](site/credits.html).

---

## What is in here

| Folder | Purpose |
| --- | --- |
| `site/` | **The website.** Deploy this folder as-is to any static host. |
| `src/` | Content model (`content.mjs`), templates (`render.mjs`), photo credits (`credits.json`) and the build script. |
| `tools/` | Local helpers: preview server, screenshot tool, interaction QA, smoke test. |
| `preview/` | Reference screenshots of the finished build. |

### Pages (21)

* `index.html` — home: hero slideshow, welcome, booking enquiry, accommodation, services, gallery band, CTA
* `accommodation/` — Bay Apartments, Seaside Room, Long Term Cottage, Garden Terrace, Budget Room
* `facilities/` — Art & Craft Gallery, Waterfront Bar & Restaurant, Cafe & Gift Shop, Gym & Fitness Centre, Conference & Boardroom, Business Centre & Wi-Fi, Swimming Pool, Spa & Wellness
* `services/` — Laundry & Room Service, Airport Transfers
* `gallery.html` — filterable photo gallery with lightbox
* `location.html` — getting here, map panel and a guide to the coast
* `contact.html` — booking enquiry, contact details, FAQ, directions
* `credits.html` — photo attribution
* `404.html` — not-found page

---

## Preview locally

Open `site/index.html` directly, or serve it (recommended):

```bash
npm start            # http://localhost:4173
# or
node tools/serve.mjs 8080
```

Node 18+ is enough — there is no install step.

---

## Editing content

All copy, rates, contact details, gallery items and image references live in
**`src/content.mjs`**:

```js
export const site = {
  name: "Sample Lodge Hotel",
  email: "admin@samplewebsite.com",
  street: "1234 Sample Address",
  postal: ["1234 Sample Address", "Location", "Papua New Guinea"],
  phoneLocal: "+675 123 4567",
  ...
};
```

Change a room price in `rooms[].rate`, add a photo in `gallery`,
switch the hero slides in `slides`, then rebuild:

```bash
npm run build
```

The build writes all HTML into `site/` and regenerates `sitemap.xml`
and `robots.txt`. Styling is in `site/assets/css/site.css`;
behaviour is in `site/assets/js/site.js`.

### Before you launch

1. Replace the placeholder brand name, address, phone numbers and
   `admin@samplewebsite.com` in `src/content.mjs`.
2. Replace the stock photography in `site/assets/img/` with your own,
   then update `src/credits.json` (or delete the credits page and its footer link).
3. Update `site.url` in `src/content.mjs` so sitemap and social images point at your domain.
4. Wire the forms to a real endpoint (see below).

---

## Design system

| Token | Value |
| --- | --- |
| Deep navy | `#0a1f54` (sections, footer `#061530`) |
| Ocean sky | `#2aa9e0` (accents, buttons) |
| Warm sand | `#f7f4ee` (alternating sections, cards) |
| Ink / muted | `#152132` / `#58687a` |
| Display type | Montserrat 400–700, uppercase with wide tracking |
| Body type | Hind 300–600 |
| Accent type | Playfair Display italic |

Fonts are self-hosted latin subsets in `site/assets/fonts/`. The logo and
favicons are an original "sun over the sea" mark in `site/assets/img/`
(`logo-white.svg`, `logo-navy.svg`, `favicon-*.png`).

Components: sticky transparent-to-solid header, full-bleed hero carousel,
split intro, booking panel, navy accommodation carousel, service grid with a
centre portrait, gallery band, image viewers with lightbox, masonry gallery,
FAQ accordion, rate cards, CTA bands, four-column footer.

---

## How the forms work

There is no server, so both forms are static-site friendly:

* **Booking enquiry** — validates name, email and dates, then opens the
  visitor's email app with a pre-filled message to the configured address.
* **Newsletter** — validates the address and opens the same kind of email.

To collect submissions through a service, point the form at an endpoint
(e.g. Formspree, Netlify Forms, Cloudflare Workers) inside
`src/render.mjs` → `bookingForm()` and replace the `mailto:` handoff in
`site/assets/js/site.js` with a `fetch()` POST.

---

## Per-lead demo sites

Personalised demos for individual prospects are generated from the lead material in the parent
project (`../leads/<slug>/`) and written into `site/demos/<slug>/`. Each demo shares the site-level
`/assets/` folder (CSS, JS, fonts, stock photography) and only adds its own hero and OG image, so a
demo costs roughly 0.5 MB rather than a 12 MB duplicate.

```bash
npm run build          # generic public site (root)
npm run demos          # every lead that has photos/hero.jpg  -> site/demos/<slug>/
npm run demos lodge-10 # just one lead
```

Each demo is generated with:

* the lead's name, town, phones and Google Maps link from `lead.json`
* its own hero (`assets/img/leads/<slug>/hero.jpg`) and OG card (`.../og.jpg`)
* `noindex, nofollow` meta plus a local `robots.txt` (`Disallow: /`)
* an on-page sample notice in the footer

The public demo at the site root is never modified by a per-lead build.

## Quality checks

```bash
npm run smoke   # loads every page, fails on JS/console/network errors
npm run qa      # real clicks: hero, carousel, lightbox, filters, mobile menu, form validation
npm run shots   # regenerates screenshots into tools/shots/
```

---

## Photography

The site uses openly licensed stock photography sourced through the Openverse
index (StockSnap, Rawpixel, Wikimedia Commons, WordPress Photo Directory). Each
image is attributed with photographer and licence on `credits.html`.
CC0 / public-domain images need no attribution; CC BY and CC BY-SA images are
credited as required. All images are illustrative and do not depict this
fictional property.

---

## Deployment

Upload the contents of `site/` to any static host (Netlify, Cloudflare Pages,
GitHub Pages, cPanel, S3). `404.html` is picked up automatically by most hosts.
