// Zero-dependency static file server for local previews.
// Usage: node tools/serve.mjs [port]   (default 4173)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..', 'site');
const PORT = Number(process.argv[2]) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((request, response) => {
  const url = decodeURIComponent((request.url || '/').split('?')[0]);
  let filePath = path.join(ROOT, url);
  if (url.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (!path.extname(filePath)) {
    const asHtml = filePath + '.html';
    if (fs.existsSync(asHtml)) filePath = asHtml;
    else if (fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');
  }
  if (!filePath.startsWith(ROOT)) { response.writeHead(403).end('Forbidden'); return; }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(ROOT, '404.html'), (notFoundError, notFoundData) => {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(notFoundError ? 'Not found' : notFoundData);
      });
      return;
    }
    response.writeHead(200, {
      'Content-Type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Sample Lodge Hotel site: http://localhost:' + PORT);
  console.log('Serving ' + ROOT);
});
