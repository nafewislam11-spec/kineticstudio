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

        // 2. Direct Update index.html static source code on disk
        updateIndexHtmlFile(data);

        // 3. Automatically git commit and push to GitHub in background via PowerShell
        const psGitCmd = 'powershell -Command "git add .; git commit -m \'Auto CMS Update from Admin Panel\'; git push origin main"';
        exec(psGitCmd, { cwd: PUBLIC_DIR }, (err, stdout, stderr) => {
          if (err) {
            console.log('[Git Push Log]:', stdout || stderr || err.message);
          } else {
            console.log('[Git Push Success]:', stdout.trim());
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'CMS data & index.html saved to disk & pushed to GitHub automatically!' }));
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

function updateIndexHtmlFile(data) {
  try {
    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    let html = fs.readFileSync(indexPath, 'utf8');

    // 1. Logo / Brand Name
    if (data.brandName) {
      const parts = data.brandName.trim().split(/\s+/);
      const first = parts[0] || 'Kinetic';
      const second = parts.slice(1).join(' ') || '';
      html = html.replace(/(<text x="64" y="19"[^>]*>)([^<]*)(<\/text>)/gi, `$1${first}$3`);
      html = html.replace(/(<text x="64" y="39"[^>]*>)([^<]*)(<\/text>)/gi, `$1${second}$3`);
    }

    // 2. Favicon
    if (data.brandFavicon) {
      html = html.replace(/(<link [^>]*rel="icon"[^>]*href=")([^"]*)(")/gi, `$1${data.brandFavicon}$3`);
    }

    // 3. Hero Badge
    if (data.heroBadge) {
      html = html.replace(/(<div class="pb-badge"[^>]*>)([\s\S]*?)(<\/div>)/i, (match, p1, p2, p3) => {
        const arrMatch = p2.match(/<span class="pb-arr"[^>]*>[\s\S]*?<\/span>/i);
        const arrHtml = arrMatch ? arrMatch[0] : ' <span class="pb-arr">↗</span>';
        return `${p1}${data.heroBadge.replace(/↗/g, '').trim()} ${arrHtml}${p3}`;
      });
    }

    // 4. Hero H1
    if (data.heroH1) {
      const h1Formatted = data.heroH1.replace(/\n/g, '<br/>');
      html = html.replace(/(<h1 class="pb-h1"[^>]*>)([\s\S]*?)(<\/h1>)/i, `$1${h1Formatted}$3`);
    }

    // 5. Hero Subtitle
    if (data.heroSub) {
      const subFormatted = data.heroSub.replace(/\n/g, '<br/>');
      html = html.replace(/(<p class="pb-sub"[^>]*>)([\s\S]*?)(<\/p>)/i, `$1${subFormatted}$3`);
    }

    // 6. Hero CTA Pill & Keycap
    if (data.heroCta) {
      html = html.replace(/(<p class="pb-cta-pill">)([^<]*)(<\/p>)/i, `$1${data.heroCta}$3`);
    }
    if (data.heroKeycap) {
      html = html.replace(/(<p class="pb-keycap-letter">)([^<]*)(<\/p>)/i, `$1${data.heroKeycap}$3`);
    }

    // 7. VSL Section
    if (data.vslTitle) {
      const vslFormatted = data.vslTitle.replace(/\n/g, '<br/>');
      html = html.replace(/(<h2 class="pb2-h"[^>]*>)([\s\S]*?)(<\/h2>)/i, `$1${vslFormatted}$3`);
    }
    if (data.vslP1) {
      html = html.replace(/(<div class="pb2-pill[^"]*pb2-p1c"[^>]*>[\s\S]*?<span class="pb2-pilltxt">)([^<]*)(<\/span>)/i, `$1${data.vslP1}$3`);
    }
    if (data.vslP2) {
      html = html.replace(/(<div class="pb2-pill[^"]*pb2-p2c"[^>]*>[\s\S]*?<span class="pb2-pilltxt">)([^<]*)(<\/span>)/i, `$1${data.vslP2}$3`);
    }
    if (data.vslP3) {
      html = html.replace(/(<div class="pb2-pill[^"]*pb2-p3c"[^>]*>[\s\S]*?<span class="pb2-pilltxt">)([^<]*)(<\/span>)/i, `$1${data.vslP3}$3`);
    }
    if (data.vslRevTitle) {
      html = html.replace(/(<p class="pb2-loveh">)([^<]*)(<\/p>)/i, `$1${data.vslRevTitle}$3`);
    }

    // 8. Bento Section
    if (data.bentoTitle) {
      html = html.replace(/(<h2 class="pb5-h">)([\s\S]*?)(<\/h2>)/i, `$1${data.bentoTitle}$3`);
    }
    if (data.bentoSub) {
      html = html.replace(/(<p class="pb5-sub">)([\s\S]*?)(<\/p>)/i, `$1${data.bentoSub}$3`);
    }
    if (data.bento1Stat) {
      html = html.replace(/(<p class="pb5-b1stat">)([^<]*)(<\/p>)/i, `$1${data.bento1Stat}$3`);
    }
    if (data.bento3Num) {
      html = html.replace(/(<p class="pb5-b3num">)([^<]*)(<\/p>)/i, `$1${data.bento3Num}$3`);
    }

    // 9. Pricing Section
    if (data.priceSecTitle) {
      html = html.replace(/(<h2 class="pb9-h"[^>]*>)([\s\S]*?)(<\/h2>)/i, `$1${data.priceSecTitle}$3`);
    }
    if (data.priceSecSub) {
      html = html.replace(/(<p class="pb9-sub"[^>]*>)([\s\S]*?)(<\/p>)/i, `$1${data.priceSecSub}$3`);
    }

    // Pricing Card 1 & Card 2
    let cardIdx = 0;
    html = html.replace(/<div class="pb9-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, (match) => {
      cardIdx++;
      if (cardIdx === 1) {
        if (data.p1Name) match = match.replace(/(<p class="pb9-plan">)([\s\S]*?)(<\/p>)/i, `$1${data.p1Name}$3`);
        if (data.p1Chosen) match = match.replace(/(<p class="pb9-chtx">)([\s\S]*?)(<\/p>)/i, `$1${data.p1Chosen}$3`);
        if (data.p1Price) match = match.replace(/(<p class="pb9-amt">)([\s\S]*?)(<\/p>)/i, `$1${data.p1Price}$3`);
        if (data.p1Tagline) match = match.replace(/(<p class="pb9-tagline">)([\s\S]*?)(<\/p>)/i, `$1${data.p1Tagline}$3`);
        if (data.p1BtnText) match = match.replace(/(<p class="pb9-btntx">)([\s\S]*?)(<\/p>)/i, `$1${data.p1BtnText}$3`);
      } else if (cardIdx === 2) {
        if (data.p2Name) match = match.replace(/(<p class="pb9-plan">)([\s\S]*?)(<\/p>)/i, `$1${data.p2Name}$3`);
        if (data.p2Chosen) match = match.replace(/(<p class="pb9-chtx">)([\s\S]*?)(<\/p>)/i, `$1${data.p2Chosen}$3`);
        if (data.p2Price) match = match.replace(/(<p class="pb9-amt">)([\s\S]*?)(<\/p>)/i, `$1${data.p2Price}$3`);
        if (data.p2Tagline) match = match.replace(/(<p class="pb9-tagline">)([\s\S]*?)(<\/p>)/i, `$1${data.p2Tagline}$3`);
        if (data.p2BtnText) match = match.replace(/(<p class="pb9-btntxb">)([\s\S]*?)(<\/p>)/i, `$1${data.p2BtnText}$3`);
      }
      return match;
    });

    // 10. FAQ Title
    if (data.faqSecTitle) {
      html = html.replace(/(<h2 class="pb10-h">)([\s\S]*?)(<\/h2>)/i, `$1${data.faqSecTitle}$3`);
    }

    // 11. Footer Headline & Copyright
    if (data.footerTitle) {
      html = html.replace(/(<h2 class="pb11-ready"[^>]*>)([\s\S]*?)(<\/h2>)/i, `$1${data.footerTitle}$3`);
    }
    if (data.copyright) {
      html = html.replace(/(<p class="pb11-bl"[^>]*>)([\s\S]*?)(<\/p>)/i, `$1${data.copyright}$3`);
    }
    if (data.email) {
      html = html.replace(/(<p class="pb11-mail">)([^<]*)(<\/p>)/gi, `$1${data.email}$3`);
    }

    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('[CMS Server] Updated static index.html source code on disk successfully.');
  } catch (err) {
    console.warn('[CMS Server HTML Update Warning]:', err.message);
  }
}
