// Interaction QA over the DevTools Protocol. Runs real clicks on the built
// pages and reports pass/fail per assertion. Usage: node tools/qa.mjs
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(here, '..', 'site');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9477;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CASES = [
  {
    page: 'index.html', width: 1440, name: 'home: hero, carousel, video, forms',
    script: async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = [];
      const test = (label, ok, info) => out.push({ label, ok: Boolean(ok), info: info === undefined ? '' : String(info) });

      const slideCount = document.querySelectorAll('.hero__slide').length;
      document.querySelector('[data-hero-next]').click();
      await wait(1400);
      const active = document.querySelector('.hero__slide.is-active');
      test('hero next advances slide', active && active.dataset.slide === '1', 'slide=' + (active && active.dataset.slide));
      test('hero counter updates', document.querySelector('[data-hero-current]').textContent.trim() === '02');
      const dotActive = document.querySelectorAll('.hero__dot.is-active').length;
      test('one hero dot active', dotActive === 1 && slideCount === 3, 'dots=' + dotActive);

      test('gallery band present', !!document.querySelector('.gallery-band .btn'));
      const carousel = document.querySelector('[data-carousel-track]');
      const before = carousel.scrollLeft;
      document.querySelector('[data-carousel-next]').click();
      await wait(900);
      test('room carousel scrolls', carousel.scrollLeft > before, before + ' -> ' + carousel.scrollLeft);

      const form = document.querySelector('[data-booking-form]');
      form.querySelector('button[type="submit"]').click();
      await wait(300);
      const status = form.querySelector('[data-form-status]');
      test('booking form blocks empty submit', status.classList.contains('is-error'), status.textContent.slice(0, 40));
      test('invalid fields flagged', form.querySelectorAll('.is-invalid').length >= 3, form.querySelectorAll('.is-invalid').length);

      const checkin = form.querySelector('[name="checkin"]');
      const checkout = form.querySelector('[name="checkout"]');
      checkin.value = '2026-11-10';
      checkin.dispatchEvent(new Event('change', { bubbles: true }));
      test('checkout min follows check-in', checkout.min === '2026-11-11', checkout.min);

      const newsletter = document.querySelector('[data-newsletter-form]');
      newsletter.querySelector('input[type="email"]').value = 'not-an-email';
      newsletter.querySelector('button[type="submit"]').click();
      await wait(200);
      test('newsletter rejects bad email', newsletter.querySelector('[data-form-status]').classList.contains('is-error'));

      window.scrollTo(0, 900);
      await wait(400);
      test('header turns solid on scroll', document.querySelector('[data-header]').classList.contains('is-solid'));
      return out;
    },
  },
  {
    page: 'index.html', width: 414, name: 'home (mobile): menu, layout',
    script: async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = [];
      const test = (label, ok, info) => out.push({ label, ok: Boolean(ok), info: info === undefined ? '' : String(info) });
      const toggle = document.querySelector('[data-nav-toggle]');
      test('hamburger visible on mobile', getComputedStyle(toggle).display !== 'none');
      toggle.click();
      await wait(600);
      const menu = document.getElementById('mobileMenu');
      test('mobile menu opens', menu.classList.contains('is-open') && !menu.hidden);
      test('body scroll locked', document.body.classList.contains('no-scroll'));
      test('aria-expanded set', toggle.getAttribute('aria-expanded') === 'true');
      const menuLink = menu.querySelector('a');
      menuLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
      menuLink.click();
      await wait(700);
      test('mobile menu closes on link', !menu.classList.contains('is-open'));
      test('body scroll restored', !document.body.classList.contains('no-scroll'));
      test('no horizontal overflow', document.documentElement.scrollWidth <= window.innerWidth + 1,
        document.documentElement.scrollWidth + ' vs ' + window.innerWidth);
      return out;
    },
  },
  {
    page: 'gallery.html', width: 1440, name: 'gallery: filters, lightbox',
    script: async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = [];
      const test = (label, ok, info) => out.push({ label, ok: Boolean(ok), info: info === undefined ? '' : String(info) });
      const items = document.querySelectorAll('.gallery-item').length;
      test('gallery rendered', items === 12, items);

      const culture = document.querySelector('[data-filter="culture"]');
      culture.click();
      await wait(250);
      const visible = [...document.querySelectorAll('.gallery-item')].filter((el) => !el.classList.contains('is-hidden')).length;
      test('culture filter shows 3', visible === 3, visible);
      test('filter count label updates', /3 photographs/.test(document.querySelector('[data-gallery-count]').textContent));

      document.querySelector('[data-filter="all"]').click();
      await wait(200);
      document.querySelector('.gallery-item [data-lightbox]').click();
      await wait(400);
      const lb = document.getElementById('lightbox');
      const img = lb.querySelector('[data-lb-img]');
      test('lightbox opens with image', !lb.hidden && img.getAttribute('src').includes('img/gallery/'));
      test('lightbox caption set', lb.querySelector('[data-lb-caption]').textContent.length > 5);
      lb.querySelector('[data-lb-next]').click();
      await wait(300);
      test('lightbox counter advances', lb.querySelector('[data-lb-count]').textContent.trim().startsWith('2 /'));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await wait(300);
      test('escape closes lightbox', lb.hidden);
      return out;
    },
  },
  {
    page: 'accommodation/bay-apartments.html', width: 1440, name: 'room: viewer, nav state',
    script: async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = [];
      const test = (label, ok, info) => out.push({ label, ok: Boolean(ok), info: info === undefined ? '' : String(info) });
      const viewer = document.querySelector('[data-viewer]');
      const main = viewer.querySelector('[data-viewer-img]');
      const first = main.getAttribute('src');
      viewer.querySelectorAll('[data-viewer-thumb]')[1].click();
      await wait(250);
      test('thumb swaps main image', main.getAttribute('src') !== first, main.getAttribute('src').split('/').pop());
      test('active thumb follows', viewer.querySelectorAll('.viewer__thumb')[1].classList.contains('is-active'));
      viewer.querySelector('[data-viewer-next]').click();
      await wait(250);
      test('viewer next works', viewer.querySelectorAll('.viewer__thumb')[2].classList.contains('is-active'));

      viewer.querySelector('[data-lightbox-open]').click();
      await wait(400);
      const lb = document.getElementById('lightbox');
      test('viewer opens lightbox', !lb.hidden && lb.querySelector('[data-lb-img]').getAttribute('src').includes('bay-3'));
      lb.querySelector('[data-lb-close]').click();
      await wait(300);

      test('accommodation nav marked current', !!document.querySelector('.nav-item.is-active .nav-link[aria-current]'));
      test('breadcrumb rendered', document.querySelectorAll('.breadcrumb li').length === 3);
      const wa = document.querySelector('a[href^="tel:"]');
      test('phone link present', !!wa, wa && wa.getAttribute('href'));
      return out;
    },
  },
  {
    page: '404.html', width: 1440, name: '404 page',
    script: async () => {
      const out = [];
      const test = (label, ok, info) => out.push({ label, ok: Boolean(ok), info: info === undefined ? '' : String(info) });
      test('404 heading present', !!document.querySelector('.notfound__title'));
      test('404 has return link', !!document.querySelector('.notfound a[href="index.html"]'));
      return out;
    },
  },
];

class CDP {
  constructor(ws, sessionId) { this.ws = ws; this.sessionId = sessionId; this.id = 0; this.pending = new Map(); this.errors = [];
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.method === 'Runtime.exceptionThrown') this.errors.push(message.params.exceptionDetails.text);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
      }
    });
  }
  send(method, params = {}, useSession = true) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, sessionId: useSession ? this.sessionId : undefined }));
    });
  }
}

const toUrl = (file) => {
  const segments = file.replace(/\\/g, '/').split('/');
  return 'file:///' + segments.map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment))).join('/');
};

async function runCase(testCase, index) {
  const port = 9500 + index;
  const profile = path.join(os.tmpdir(), 'qa-' + Date.now() + '-' + index);
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--disable-gpu',
    '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files',
    '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

  let version = null;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { const response = await fetch('http://127.0.0.1:' + port + '/json/version'); if (response.ok) { version = await response.json(); break; } } catch { /* wait */ }
    await sleep(250);
  }
  if (!version) throw new Error('chrome did not start for ' + testCase.page);

  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));
  const cdp = new CDP(ws, null);
  const targets = await cdp.send('Target.getTargets', {}, false);
  const page = targets.targetInfos.find((t) => t.type === 'page');
  const attached = await cdp.send('Target.attachToTarget', { targetId: page.targetId, flatten: true }, false);
  cdp.sessionId = attached.sessionId;
  let rows = [];
  try {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: testCase.width, height: 900, deviceScaleFactor: 1, mobile: testCase.width < 600,
  });
  await cdp.send('Page.navigate', { url: toUrl(path.join(SITE, testCase.page)) });
  await sleep(1700);
  const result = await cdp.send('Runtime.evaluate', {
    expression: '(' + testCase.script.toString() + ')()', awaitPromise: true, returnByValue: true,
  });
  rows = result.result.value || [];
  } catch (error) {
    console.log('\n' + testCase.name + '\n  RUNNER ERROR: ' + error.message);
    ws.close();
    chrome.kill();
    return { rows: [], errors: [error.message], caseFailures: 1 };
  }
  console.log('\n' + testCase.name);
  let caseFailures = 0;
  for (const row of rows) {
    if (!row.ok) caseFailures += 1;
    console.log('  ' + (row.ok ? 'PASS' : 'FAIL') + '  ' + row.label + (row.info ? '  [' + row.info + ']' : ''));
  }
  if (cdp.errors.length) { caseFailures += cdp.errors.length; console.log('  JS ERRORS: ' + cdp.errors.join(' | ')); }
  ws.close();
  chrome.kill();
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { rows, errors: cdp.errors, caseFailures };
}

const onlyArg = process.argv[2];
const only = onlyArg !== undefined ? Number(onlyArg) : null;
let failures = 0;
let checks = 0;
for (let index = 0; index < CASES.length; index += 1) {
  if (only !== null && only !== index) continue;
  const summary = await runCase(CASES[index], index);
  checks += summary.rows.length;
  failures += summary.caseFailures;
}
console.log('\n' + (checks - failures) + '/' + checks + ' checks passed');
process.exit(failures ? 1 : 0);
