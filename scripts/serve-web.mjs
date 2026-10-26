// Local production preview with SPA fallback; never exposes the server beyond localhost.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 8081);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.m4a': 'audio/mp4', '.png': 'image/png', '.ico': 'image/x-icon', '.css': 'text/css', '.ttf': 'font/ttf' };
createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  let file = path.resolve(root, relative || 'index.html');
  if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
  if (!existsSync(file) || !statSync(file).isFile()) {
    if (path.extname(relative)) { response.writeHead(404); response.end(); return; }
    file = path.join(root, 'index.html');
  }
  const size = statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range ?? '');
  if (range) {
    const start = Number(range[1]), end = Math.min(Number(range[2] || size - 1), size - 1);
    if (start > end || start >= size) { response.writeHead(416, { 'Content-Range': `bytes */${size}` }); response.end(); return; }
    response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    createReadStream(file, { start, end }).pipe(response);
  } else { response.writeHead(200, { ...headers, 'Content-Length': size }); createReadStream(file).pipe(response); }
}).listen(port, '127.0.0.1', () => console.log(`Intervalify production preview: http://127.0.0.1:${port} (${root})`));
