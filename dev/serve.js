// Zero-dependency static server for the Playwright smoke test. Serves the repo
// root so the harness can load ../dist/hass-3d-floorplan.js and ./dev/models.
// Sends Last-Modified and honours If-Modified-Since with 304 so the card's
// model-cache revalidation path behaves as it would against a real server.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel === '/') rel = '/dev/harness.html';
    // Prevent path traversal outside the repo root.
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) {
        res.writeHead(404);
        res.end('not found: ' + rel);
        return;
      }
      const lastModified = st.mtime.toUTCString();
      if (req.headers['if-modified-since'] === lastModified) {
        res.writeHead(304, { 'Last-Modified': lastModified });
        res.end();
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
        'Content-Length': st.size,
        'Last-Modified': lastModified,
      });
      fs.createReadStream(file).pipe(res);
    });
  })
  .listen(PORT, () => console.log('hass-3d-floorplan harness on http://localhost:' + PORT + '/'));
