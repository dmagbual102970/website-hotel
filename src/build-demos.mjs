// Build one personalised demo site per lead, from leads/<slug>/lead.json.
// Output: site/demos/<slug>/  (pages share the site-level /assets/, hero + og are per lead)
// Usage: node src/build-demos.mjs [slug]
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, rooms, facilities, services, slides } from './content.mjs';
import {
  homePage, roomPage, facilityPage, servicePage, galleryPage, locationPage, contactPage, creditsPage,
  setAssetRoot,
} from './render.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(here, '..', 'site');
const LEADS = path.join(here, '..', '..', 'leads');
const DEMO_BASE = 'https://dmagbual102970.github.io/website-hotel';

const DEMO_HERO_CSS = [
  '.hero .hero__overlay{background:',
  'linear-gradient(180deg, rgba(4,18,44,0.55) 0%, rgba(4,18,44,0.05) 30%, rgba(4,18,44,0.12) 62%, rgba(4,18,44,0.62) 100%),',
  'linear-gradient(90deg, rgba(4,18,44,0.36) 0%, rgba(4,18,44,0) 56%) !important;}',
  '.hero .hero__img{filter:brightness(1.1) saturate(1.05);}',
  '.hero .hero__title{text-shadow:0 2px 28px rgba(4,18,44,0.55);}',
  '.hero .hero__text{text-shadow:0 2px 20px rgba(4,18,44,0.5);}',
  '.hero .hero__eyebrow{text-shadow:0 1px 14px rgba(4,18,44,0.55);}',
  '.hero .hero__count,.hero .hero__scroll{text-shadow:0 1px 12px rgba(4,18,44,0.6);}',
  '.page-hero .page-hero__overlay{background:linear-gradient(180deg, rgba(4,18,44,0.66) 0%, rgba(4,18,44,0.18) 42%, rgba(4,18,44,0.58) 100%) !important;}',
  '.page-hero .page-hero__title,.page-hero .page-hero__lede{text-shadow:0 2px 22px rgba(4,18,44,0.55);}',
  '.page-hero .breadcrumb{text-shadow:0 1px 10px rgba(4,18,44,0.55);}',
].join('');

const savedSite = { ...site };
const savedSlide = { ...slides[0] };
const digits = (value = '') => String(value).replace(/[^\d+]/g, '');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function buildLead(slug) {
  const leadPath = path.join(LEADS, slug, 'lead.json');
  const lead = JSON.parse(await fs.readFile(leadPath, 'utf8'));
  const photos = path.join(LEADS, slug, 'photos');
  const heroSrc = path.join(photos, 'hero.jpg');
  const ogSrc = path.join(photos, 'og.jpg');
  await fs.access(heroSrc);

  // copy per-lead imagery into the deployed site (shared assets folder)
  const assetDir = path.join(SITE, 'assets', 'img', 'leads', slug);
  await ensureDir(assetDir);
  await fs.copyFile(heroSrc, path.join(assetDir, 'hero.jpg'));
  if (await fs.stat(ogSrc).then(() => true).catch(() => false)) {
    await fs.copyFile(ogSrc, path.join(assetDir, 'og.jpg'));
  }

  const display = lead.displayName || lead.businessName || slug;
  const town = lead.town || 'Papua New Guinea';
  const demoUrl = DEMO_BASE + '/demos/' + slug + '/';
  const brightHero = lead.demo?.brightHero !== false; // lead demos default to a brighter hero
  const ogUrl = DEMO_BASE + '/assets/img/leads/' + slug + '/og.jpg';

  Object.assign(site, {
    name: display,
    legalName: lead.businessName || display,
    brandTop: display,
    brandSub: lead.category === 'Guest Houses' ? 'Guest House' : 'Hotel & Apartments',
    tagline: (lead.category === 'Guest Houses' ? 'Guest house' : lead.category === 'Apartments' ? 'Apartments' : 'Hotel') + ' in ' + town + ', Papua New Guinea',
    description: display + ' offers rooms and apartments in ' + town + ', Papua New Guinea.',
    longDescription: display + ' offers rooms and apartments in ' + town + ', Papua New Guinea.',
    url: demoUrl,
    phoneLocal: lead.phone || '',
    phoneLocalRaw: digits(lead.phone),
    phoneMobile: lead.mobile || '',
    phoneMobileRaw: digits(lead.mobile),
    street: town + ', Papua New Guinea',
    postal: [town, 'Papua New Guinea'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(display + ', ' + town + ', Papua New Guinea'),
    sampleNotice: 'Sample website prepared for ' + display + ' \u2014 layout and content are for illustration only; imagery and details to be confirmed.',
    hideStats: true,
  });
  slides[0].image = 'img/leads/' + slug + '/hero.jpg';
  slides[0].title = 'Welcome to ' + display;
  slides[0].text = 'A quiet stay in ' + town;
  slides[0].eyebrow = 'Papua New Guinea';

  setAssetRoot('../../');

  const pages = [
    ['index.html', homePage()],
    ...rooms.map((room) => ['accommodation/' + room.slug + '.html', roomPage(room)]),
    ...facilities.map((f) => ['facilities/' + f.slug + '.html', facilityPage(f)]),
    ...services.map((s) => ['services/' + s.slug + '.html', servicePage(s)]),
    ['gallery.html', galleryPage()],
    ['location.html', locationPage()],
    ['contact.html', contactPage()],
    ['credits.html', creditsPage()],
  ];

  const outDir = path.join(SITE, 'demos', slug);
  await fs.rm(outDir, { recursive: true, force: true });
  await ensureDir(outDir);

  let bytes = 0;
  for (const [file, html] of pages) {
    let out = html;
    // absolute OG image for WhatsApp/social previews
    out = out.replace(/<meta property="og:image" content="[^"]*">/g, '<meta property="og:image" content="' + ogUrl + '">');
    // brighter hero for lead demos (night photos turn to mud under the default overlay)
    if (brightHero) {
      out = out.replace('</head>', '<style id="demo-hero-bright">' + DEMO_HERO_CSS + '</style>\n</head>');
    }
    // never index a personalised demo
    out = out.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n</head>');
    const dest = path.join(outDir, file);
    await ensureDir(path.dirname(dest));
    await fs.writeFile(dest, out, 'utf8');
    bytes += out.length;
  }
  await fs.writeFile(path.join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n', 'utf8');

  // restore the shared content model before the next lead
  Object.assign(site, savedSite);
  Object.assign(slides[0], savedSlide);
  setAssetRoot('');

  return { slug, display, town, demoUrl, ogUrl, pages: pages.length, kb: Math.round(bytes / 1024) };
}

async function main() {
  const only = process.argv[2];
  const entries = only ? [only] : (await fs.readdir(LEADS, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && e.name !== '_template' && e.name !== '_inbox')
    .map((e) => e.name);
  const results = [];
  for (const slug of entries) {
    if (only && !(await fs.stat(path.join(LEADS, slug, 'lead.json')).then(() => true).catch(() => false))) continue;
    try {
      results.push(await buildLead(slug));
    } catch (error) {
      console.log('SKIP ' + slug + ': ' + error.message);
    }
  }
  for (const r of results) {
    console.log(r.slug.padEnd(16) + r.pages + ' pages  ' + r.kb + ' KB  ' + r.demoUrl);
  }
  console.log('\nBuilt ' + results.length + ' demo(s) into site/demos/');
}

main().catch((error) => { console.error(error); process.exit(1); });
