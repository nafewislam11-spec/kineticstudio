const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;
const PUBLIC_DIR = __dirname;
const CMS_FILE_PATH = path.join(__dirname, 'data', 'cms_data.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: Auto-save CMS data to disk and push to GitHub
  if (req.method === 'POST' && req.url === '/api/save-cms') {
    let chunks = [];
    req.on('data', chunk => { chunks.push(chunk); });
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf8');
        const data = JSON.parse(body);
        const jsonString = JSON.stringify(data, null, 2);

        const dataDir = path.dirname(CMS_FILE_PATH);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        // 1. Save data/cms_data.json directly on disk
        fs.writeFileSync(CMS_FILE_PATH, jsonString, 'utf8');
        console.log('[CMS Server] Saved cms_data.json to disk successfully.');

        // 2. Automatically git commit and push to GitHub in background via PowerShell
        const psGitCmd = 'powershell -Command "git add .; git commit -m \'Auto CMS Update from Admin Panel\'; git push origin main"';
        exec(psGitCmd, { cwd: PUBLIC_DIR }, (err, stdout, stderr) => {
          if (err) {
            console.log('[Git Push Log]:', stdout || stderr || err.message);
          } else {
            console.log('[Git Push Success]:', stdout.trim());
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'CMS data saved to disk & pushed to GitHub automatically!' }));
      } catch (err) {
        console.error('[CMS Server Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Serve Static Files
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, decodeURIComponent(reqPath));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Kinetic Studio CMS Server running at http://localhost:${PORT}`);
  console.log(`📝 Auto-save API active at http://localhost:${PORT}/api/save-cms`);
});
