import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const directory = path.resolve(process.argv[2] ?? 'dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = (await walk(directory)).filter((file) => !file.endsWith('sw.js') && !file.endsWith('offline-register.js') && !file.endsWith('.hbc') && !file.endsWith('metadata.json')
  && path.dirname(file) !== path.join(directory, 'assets')
  // All-platform exports also contain native copies; web only needs its hashed banks.
  && (!file.endsWith('.m4a') || file.includes(`${path.sep}banks${path.sep}`)));
const urls = files.map((file) => '/' + path.relative(directory, file).replaceAll('\\', '/'));
urls.push('/offline-register.js');
const version = createHash('sha256');
version.update(await readFile(import.meta.filename));
for (const file of files.sort()) version.update(await readFile(file));
const cacheName = `intervalify-${version.digest('hex').slice(0, 16)}`;
const worker = `// Generated offline cache: all app code and bundled instrument samples.
const CACHE = ${JSON.stringify(cacheName)};
const URLS = ${JSON.stringify(urls)};
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  for (let i = 0; i < URLS.length; i += 20) await cache.addAll(URLS.slice(i, i + 20));
  // A replacement waits for old tabs to close, so lazy chunks stay version-consistent.
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith('intervalify-') && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(event.request.url, { ignoreSearch: true });
    if (hit) {
      const range = event.request.headers.get('range');
      if (range) {
        const bytes = await hit.arrayBuffer();
        const match = /^bytes=(\\d*)-(\\d*)$/.exec(range);
        if (match) {
          const start = match[1] ? Number(match[1]) : Math.max(0, bytes.byteLength - Number(match[2]));
          const end = match[1] && match[2] ? Math.min(Number(match[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
          if (start > end || start >= bytes.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + bytes.byteLength } });
          return new Response(bytes.slice(start, end + 1), { status: 206, headers: {
            'Content-Type': hit.headers.get('content-type') || 'audio/mp4',
            'Content-Range': 'bytes ' + start + '-' + end + '/' + bytes.byteLength,
            'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes'
          }});
        }
      }
      return hit;
    }
    if (event.request.mode === 'navigate') return (await cache.match('/index.html')) || fetch(event.request);
    return fetch(event.request);
  })());
});
`;
await writeFile(path.join(directory, 'sw.js'), worker);
await writeFile(path.join(directory, 'offline-register.js'), `
if ('serviceWorker' in navigator) {
  const announce = (state) => { window.__intervalifyOffline = state; window.dispatchEvent(new Event('intervalify-offline')); };
  announce('preparing');
  navigator.serviceWorker.register('/sw.js').then(registration => {
    if (registration.active) announce('ready');
    const watch = worker => { if (!worker) return; worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') announce('ready');
      if (worker.state === 'redundant' && !registration.active) announce('failed');
    }); };
    watch(registration.installing);
    registration.addEventListener('updatefound', () => watch(registration.installing));
  }).catch(() => announce('failed'));
}
`);
const htmlPath = path.join(directory, 'index.html');
let html = await readFile(htmlPath, 'utf8');
if (!html.includes('offline-register.js')) html = html.replace('</body>', '<script src="/offline-register.js"></script></body>');
html = html.replace(/<title>.*?<\/title>/, '<title>Intervalify</title>');
await writeFile(htmlPath, html);
console.log(`Offline web cache prepared: ${urls.length} files, ${cacheName}. Serve at the domain root over HTTPS or localhost.`);
