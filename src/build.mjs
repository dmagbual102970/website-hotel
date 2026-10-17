// Static site build: renders every page from src/ into site/.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, rooms, facilities, services } from './content.mjs';
import {
  homePage, roomPage, facilityPage, servicePage, galleryPage, locationPage, contactPage, notFoundPage, creditsPage,
} from './render.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, '..', 'site');

const pages = [
  ['index.html', homePage()],
  ...rooms.map((room) => ['accommodation/' + room.slug + '.html', roomPage(room)]),
  ...facilities.map((facility) => ['facilities/' + facility.slug + '.html', facilityPage(facility)]),
  ...services.map((service) => ['services/' + service.slug + '.html', servicePage(service)]),
  ['gallery.html', galleryPage()],
  ['location.html', locationPage()],
  ['contact.html', contactPage()],
  ['404.html', notFoundPage()],
  ['credits.html', creditsPage()],
];

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(([file]) => {
    const loc = file === 'index.html' ? site.url + '/' : site.url + '/' + file.replace(/\.html$/, '');
    return '  <url><loc>' + loc + '</loc></url>';
  }).join('\n') +
  '\n</urlset>\n';

const robots = 'User-agent: *\nAllow: /\n\nSitemap: ' + site.url + '/sitemap.xml\n';

async function main() {
  // Remove previously generated HTML so renamed pages do not linger.
  async function cleanHtml(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'assets') await cleanHtml(full);
      } else if (entry.name.endsWith('.html') || entry.name === 'sitemap.xml' || entry.name === 'robots.txt') {
        await fs.rm(full, { force: true });
      }
    }
  }
  await cleanHtml(OUT);
  let bytes = 0;
  for (const [file, html] of pages) {
    const dest = path.join(OUT, file);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html, 'utf8');
    bytes += html.length;
    console.log('  ' + file.padEnd(56) + (html.length / 1024).toFixed(1) + ' KB');
  }
  await fs.writeFile(path.join(OUT, 'sitemap.xml'), sitemap, 'utf8');
  await fs.writeFile(path.join(OUT, 'robots.txt'), robots, 'utf8');
  console.log('\nBuilt ' + pages.length + ' pages (' + (bytes / 1024).toFixed(0) + ' KB of HTML) into site/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
