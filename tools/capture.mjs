// Precise page captures through the Chrome DevTools Protocol.
// One browser, one target, sequential navigations. Viewport shots scroll first.
// Full-page shots use captureBeyondViewport with a clip.
// Usage: node tools/capture.mjs [--only name,name]
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'tools', 'shots');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9455;
const MAX_EDGE = 7600;

const VIEWS = [
  { name: 'home-hero', page: 'index.html', width: 1440, height: 940, scroll: 0 },
  { name: 'home-welcome', page: 'index.html', width: 1440, height: 940, scroll: '#welcome' },
  { name: 'home-booking', page: 'index.html', width: 1440, height: 940, scroll: '#booking' },
  { name: 'home-rooms', page: 'index.html', width: 1440, height: 940, scroll: '#accommodation' },
  { name: 'home-features', page: 'index.html', width: 1440, height: 940, scroll: '#facilities' },
  { name: 'home-gallery-band', page: 'index.html', width: 1440, height: 900, scroll: '#gallery-preview' },
  { name: 'home-footer', page: 'index.html', width: 1440, height: 900, scroll: 'end' },
  { name: 'home-hero-mobile', page: 'index.html', width: 414, height: 860, scroll: 0, mobile: true },
  { name: 'home-welcome-mobile', page: 'index.html', width: 414, height: 860, scroll: '#welcome', mobile: true },
  { name: 'home-rooms-mobile', page: 'index.html', width: 414, height: 860, scroll: '#accommodation', mobile: true },
  { name: 'home-booking-mobile', page: 'index.html', width: 414, height: 860, scroll: '#booking', mobile: true },
  { name: 'home-full', page: 'index.html', width: 1440, full: true },
  { name: 'room', page: 'accommodation/bay-apartments.html', width: 1440, height: 940, scroll: 0 },
  { name: 'room-detail', page: 'accommodation/bay-apartments.html', width: 1440, height: 940, scroll: '.layout' },
  { name: 'room-full', page: 'accommodation/bay-apartments.html', width: 1440, full: true },
  { name: 'facility-full', page: 'facilities/waterfront-bar-restaurant.html', width: 1440, full: true },
  { name: 'gallery-grid', page: 'gallery.html', width: 1440, height: 940, scroll: '.section--gallery' },
  { name: 'gallery-full', page: 'gallery.html', width: 1440, full: true },
  { name: 'location-full', page: 'location.html', width: 1440, full: true },
  { name: 'contact-full', page: 'contact.html', width: 1440, full: true },
  { name: 'room-mobile', page: 'accommodation/bay-apartments.html', width: 414, height: 860, scroll: 0, mobile: true },
  { name: 'room-mobile-body', page: 'accommodation/bay-apartments.html', width: 414, height: 860, scroll: '.layout', mobile: true },
  { name: 'contact-mobile', page: 'contact.html', width: 414, height: 860, scroll: 0, mobile: true },
  { name: 'services-full', page: 'services/airport-transfers.html', width: 1440, full: true },
  { name: 'artefact-full', page: 'facilities/artefact-haus.html', width: 1440, full: true },
  { name: '404-full', page: '404.html', width: 1440, height: 900, scroll: 0 },
  { name: 'credits-full', page: 'credits.html', width: 1440, full: true },
  { name: 'mobile-menu', page: 'index.html', width: 414, height: 860, mobile: true, scroll: 0, preScript: 'document.querySelector("[data-nav-toggle]").click()' },
  { name: 'gallery-lightbox', page: 'gallery.html', width: 1440, height: 900, scroll: '.section--gallery', preScript: 'document.querySelector(".gallery-item [data-lightbox]").click()' },
];

const onlyArg = process.argv.indexOf('--only');
const only = onlyArg > -1 ? process.argv[onlyArg + 1].split(',') : null;
const views = only ? VIEWS.filter((view) => only.includes(view.name)) : VIEWS;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const withTimeout = (promise, ms, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout: ' + label)), ms)),
]);

const toUrl = (file) => {
  const segments = file.replace(/\\/g, '/').split('/');
  return 'file:///' + segments.map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment))).join('/');
};

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method) {
        (this.listeners.get(message.method) || []).forEach((fn) => fn(message.params));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return withTimeout(new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    }), 30000, method);
  }
  once(method) {
    return new Promise((resolve) => {
      const handler = (params) => {
        const list = this.listeners.get(method) || [];
        this.listeners.set(method, list.filter((fn) => fn !== handler));
        resolve(params);
      };
      this.listeners.set(method, [...(this.listeners.get(method) || []), handler]);
    });
  }
}

const profile = path.join(os.tmpdir(), 'capture-' + Date.now());
const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu', '--hide-scrollbars',
  '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files',
  '--force-device-scale-factor=1', '--user-data-dir=' + profile, 'about:blank',
], { stdio: 'ignore' });

let version = null;
for (let attempt = 0; attempt < 80; attempt += 1) {
  try {
    const response = await fetch('http://127.0.0.1:' + PORT + '/json/version');
    if (response.ok) { version = await response.json(); break; }
  } catch { /* not ready */ }
  await sleep(250);
}
if (!version) throw new Error('Chrome did not expose the debugging port');

const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve);
  ws.addEventListener('error', reject);
});
const cdp = new CDP(ws);
await cdp.send('Target.setDiscoverTargets', { discover: true });

// Keep one page target and reuse it for every view.
const targets = await cdp.send('Target.getTargets');
const pageTarget = targets.targetInfos.find((info) => info.type === 'page');
const attached = await cdp.send('Target.attachToTarget', { targetId: pageTarget.targetId, flatten: true });
const sessionId = attached.sessionId;

const session = {
  send(method, params = {}) {
    const id = ++cdp.id;
    return withTimeout(new Promise((resolve, reject) => {
      cdp.pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    }), 30000, method);
  },
};

await session.send('Page.enable');
await session.send('Runtime.enable');
await fs.mkdir(OUT, { recursive: true });

for (const view of views) {
  const started = Date.now();
  const [file, fragment] = view.page.split('#');
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: view.width,
    height: view.full ? 1400 : view.height || 940,
    deviceScaleFactor: 1,
    mobile: Boolean(view.mobile),
  });
  const loaded = cdp.once('Page.loadEventFired');
  await session.send('Page.navigate', { url: toUrl(path.join(SITE, file)) + (fragment ? '#' + fragment : '') });
  await withTimeout(loaded, 20000, 'load ' + view.page).catch(() => {});
  await sleep(900);

  if (view.preScript) {
    await session.send('Runtime.evaluate', { expression: view.preScript });
    await sleep(600);
  }
  const metrics = await session.send('Runtime.evaluate', {
    expression: '(async () => {' +
      'const sleep = (ms) => new Promise((r) => setTimeout(r, ms));' +
      'await Promise.all([...document.images].map((img) => img.complete ? 0 : new Promise((r) => { img.onload = r; img.onerror = r; setTimeout(r, 4000); })));' +
      'await sleep(300);' +
      'document.documentElement.style.scrollBehavior = "auto";' +
      'const scroll = ' + JSON.stringify(typeof view.scroll === 'string' ? view.scroll : (view.full ? 'top' : view.scroll || 0)) + ';' +
      'const h = document.documentElement.scrollHeight;' +
      'let y = 0;' +
      'if (scroll === "end" || scroll === "bottom") y = h;' +
      'else if (typeof scroll === "string" && scroll) { const el = document.querySelector(scroll); if (el) y = el.getBoundingClientRect().top + window.scrollY - 40; }' +
      'else if (typeof scroll === "number") y = scroll;' +
      'if (!' + JSON.stringify(Boolean(view.preScript)) + ') window.scrollTo(0, y);' +
      'await sleep(700);' +
      'return { h, y: Math.round(window.scrollY) };' +
    '})()',
    awaitPromise: true,
    returnByValue: true,
  });
  const height = Number(metrics.result.value && metrics.result.value.h) || 1000;
  const scrollY = Number(metrics.result.value && metrics.result.value.y) || 0;

  let params;
  if (view.full) {
    const scale = Math.min(1, MAX_EDGE / height);
    await session.send('Emulation.setDeviceMetricsOverride', {
      width: view.width, height: Math.min(height, 2000), deviceScaleFactor: 1, mobile: Boolean(view.mobile),
    });
    await sleep(400);
    params = {
      format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: view.width, height, scale },
    };
  } else {
    params = { format: 'png' };
  }
  const captured = await session.send('Page.captureScreenshot', params);
  const dest = path.join(OUT, view.name + '.png');
  await fs.writeFile(dest, Buffer.from(captured.data, 'base64'));
  console.log(view.name.padEnd(20) + 'scrollY=' + scrollY + '  ' + Math.round((Date.now() - started) / 1000) + 's');
}

chrome.kill();
await fs.rm(profile, { recursive: true, force: true }).catch(() => {});
console.log('\ndone');
process.exit(0);
