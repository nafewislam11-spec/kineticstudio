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

    // 6b. Hero Marquee Creator Cards
    const c1 = data.heroCreator1 || "assets/hero_creator_ai1.png";
    const c2 = data.heroCreator2 || "assets/hero_creator_ai2.png";
    const c3 = data.heroCreator3 || "assets/media__1786183997336.png";

    if (c1 || c2 || c3) {
      let cardsHtml = '';
      const imgs = [c1, c2, c3];
      for (let loop = 0; loop < 10; loop++) {
        imgs.forEach(imgSrc => {
          cardsHtml += `<div class="hero-card-item"><img src="${imgSrc.replace(/"/g, '&quot;')}" alt="Creator Card"/></div>`;
        });
      }
      html = html.replace(/(<div class="pb-track"[^>]*>)([\s\S]*?)(<\/div>\s*<div class="pb-keycap-wrap">)/i, `$1${cardsHtml}$3`);
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

    // Pricing Card (Single centered card)
    let cardIdx = 0;
    html = html.replace(/<div class="pb9-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, (match) => {
      cardIdx++;
      if (cardIdx === 1) {
        const name = data.p2Name || data.p1Name;
        const chosen = data.p2Chosen || data.p1Chosen;
        const price = data.p2Price || data.p1Price;
        const tagline = data.p2Tagline || data.p1Tagline;
        const btnText = data.p2BtnText || data.p1BtnText;
        if (name) match = match.replace(/(<p class="pb9-plan">)([\s\S]*?)(<\/p>)/i, `$1${name}$3`);
        if (chosen) match = match.replace(/(<p class="pb9-chtx">)([\s\S]*?)(<\/p>)/i, `$1${chosen}$3`);
        if (price) match = match.replace(/(<p class="pb9-amt">)([\s\S]*?)(<\/p>)/i, `$1${price}$3`);
        if (tagline) match = match.replace(/(<p class="pb9-tagline">)([\s\S]*?)(<\/p>)/i, `$1${tagline}$3`);
        if (btnText) match = match.replace(/(<p class="pb9-btntx[b]?">)([\s\S]*?)(<\/p>)/i, `$1${btnText}$3`);
      }
      return match;
    });

    // 9b. Pricing Testimonial Highlight Card
    if (data.priceTestiName) {
      html = html.replace(/(<p class="pb9-tname">)([^<]*)(<\/p>)/i, `$1${data.priceTestiName}$3`);
    }
    if (data.priceTestiRole) {
      html = html.replace(/(<p class="pb9-trole">)([^<]*)(<\/p>)/i, `$1${data.priceTestiRole}$3`);
    }
    if (data.priceTestiQuote) {
      const cleanQuote = data.priceTestiQuote.replace(/^“|”$/g, '').trim();
      html = html.replace(/(<p class="pb9-tqt">)([\s\S]*?)(<\/p>)/i, `$1“${cleanQuote}”$3`);
    }
    if (data.priceTestiBadge) {
      html = html.replace(/(<p class="pb9-cast">)([^<]*)(<\/p>)/i, `$1${data.priceTestiBadge}$3`);
    }
    if (data.priceTestiAvatar && data.priceTestiAvatar.indexOf('6a56342450e1cbfab39c8686') === -1) {
      html = html.replace(/(<div class="pb9-wade"[^>]*>)([\s\S]*?)(<\/div>)/i, `<div class="pb9-wade" style="background-image: url('${data.priceTestiAvatar}'); background-size: cover; background-position: center;"></div>`);
    } else {
      html = html.replace(/(<div class="pb9-wade"[^>]*>)([\s\S]*?)(<\/div>)/i, `<div class="pb9-wade"></div>`);
    }

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
