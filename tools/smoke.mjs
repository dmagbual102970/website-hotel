// Visits every built page and reports JS errors, failed requests and console
// errors. Usage: node tools/smoke.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(here, '..', 'site');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9522;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function walk(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}
const pages = (await walk(SITE)).sort();
const toUrl = (file) => {
  const segments = file.replace(/\\/g, '/').split('/');
  return 'file:///' + segments.map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment))).join('/');
};

const profile = path.join(os.tmpdir(), 'smoke-' + Date.now());
spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu', '--no-first-run',
  '--no-default-browser-check', '--allow-file-access-from-files', '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });

let version = null;
for (let i = 0; i < 80; i += 1) {
  try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/version'); if (r.ok) { version = await r.json(); break; } } catch {}
  await sleep(250);
}
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener('open', resolve));
let id = 0; const pending = new Map();
let current = { errors: [], failed: [], logs: [] };
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') current.errors.push(message.params.exceptionDetails.text + ' ' + (message.params.exceptionDetails.exception && message.params.exceptionDetails.exception.description || '').slice(0, 200));
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') current.logs.push(message.params.entry.text);
  if (message.method === 'Network.loadingFailed') current.failed.push((message.params.requestId || '') + ' ' + message.params.errorText);
  if (message.id && pending.has(message.id)) { const { resolve, reject } = pending.get(message.id); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : resolve(message.result); }
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const mid = ++id; pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params, sessionId })); });

const targets = await send('Target.getTargets');
const page = targets.targetInfos.find((t) => t.type === 'page');
const attached = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true });
const sid = attached.sessionId;
await send('Page.enable', {}, sid);
await send('Runtime.enable', {}, sid);
await send('Log.enable', {}, sid);
await send('Network.enable', {}, sid);

let problems = 0;
for (const file of pages) {
  current = { errors: [], failed: [], logs: [] };
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sid);
  await send('Page.navigate', { url: toUrl(file) }, sid);
  await sleep(1400);
  const rel = path.relative(SITE, file);
  const issues = []
    .concat(current.errors.map((e) => 'JS: ' + e))
    .concat(current.logs.map((l) => 'console: ' + l))
    .concat(current.failed.filter((f) => !/ERR_ABORTED/.test(f)).map((f) => 'request: ' + f));
  if (issues.length) {
    problems += issues.length;
    console.log('FAIL ' + rel);
    for (const issue of issues) console.log('     ' + issue);
  } else {
    console.log('ok   ' + rel);
  }
}
console.log('\n' + (pages.length - 0) + ' pages checked, ' + problems + ' problems');
process.exit(problems ? 1 : 0);
