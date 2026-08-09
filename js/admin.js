// Kinetic Studio Admin CMS Engine

document.addEventListener('DOMContentLoaded', function () {
  var DEFAULT_PASSWORD = 'Nafew@12345';
  var STORAGE_KEY = 'kinetic_cms_data';
  var PASS_KEY = 'kinetic_admin_pass';

  // State
  var currentFaqs = [];
  var currentPortfolio = [];
  var currentTestimonials = [];
  var currentAligns = { h1: 'left', sub: 'left' };

  // 1. Login & Session Security
  var loginOverlay = document.getElementById('loginOverlay');
  var loginForm = document.getElementById('loginForm');
  var passwordInput = document.getElementById('passwordInput');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');

  function getStoredPassword() {
    return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
  }

  function checkSession() {
    if (sessionStorage.getItem('kinetic_admin_logged') === 'true') {
      if (loginOverlay) loginOverlay.style.display = 'none';
    } else {
      if (loginOverlay) loginOverlay.style.display = 'flex';
    }
  }
  checkSession();

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var entered = passwordInput.value.trim();
      if (entered === getStoredPassword()) {
        sessionStorage.setItem('kinetic_admin_logged', 'true');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        showToast('Login Successful! Welcome to CMS Dashboard.');
      } else {
        if (loginError) loginError.style.display = 'block';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('kinetic_admin_logged');
      location.reload();
    });
  }

  // 2. Navigation Tabs
  var navItems = document.querySelectorAll('.cms-nav-item');
  var sections = document.querySelectorAll('.cms-section');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = item.getAttribute('data-target');
      navItems.forEach(function (n) { n.classList.remove('active'); });
      sections.forEach(function (s) { s.classList.remove('active'); });

      item.classList.add('active');
      var targetSec = document.getElementById(target);
      if (targetSec) targetSec.classList.add('active');
    });
  });

  // 3. Alignment Buttons
  var alignGroups = document.querySelectorAll('.align-btn-group');
  alignGroups.forEach(function (group) {
    var field = group.getAttribute('data-target-field');
    var btns = group.querySelectorAll('.align-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (field) {
          currentAligns[field] = btn.getAttribute('data-align');
        }
      });
    });
  });

  function setGroupAlign(field, alignVal) {
    currentAligns[field] = alignVal || 'left';
    var group = document.querySelector('.align-btn-group[data-target-field="' + field + '"]');
    if (!group) return;
    var btns = group.querySelectorAll('.align-btn');
    btns.forEach(function (btn) {
      if (btn.getAttribute('data-align') === currentAligns[field]) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 4. File Upload Handler (Base64 conversion)
  function bindFileUploaders() {
    var fileInputs = document.querySelectorAll('.media-file-input');
    fileInputs.forEach(function (fileInput) {
      fileInput.onchange = function () {
        var file = fileInput.files[0];
        var targetId = fileInput.getAttribute('data-target-input');
        if (!file || !targetId) return;

        var reader = new FileReader();
        reader.onload = function (e) {
          var dataUrl = e.target.result;
          var targetElem = document.getElementById(targetId);
          if (targetElem) {
            targetElem.value = dataUrl;
            // Dispatch input event so live listeners catch it
            targetElem.dispatchEvent(new Event('input', { bubbles: true }));
            showToast('File uploaded & attached successfully! 📁');
          }
        };
        reader.readAsDataURL(file);
      };
    });
  }
  bindFileUploaders();

  // 5. Default Data Configuration
  function getDefaults() {
    return {
      brandName: "Kinetic Studio",
      brandFavicon: "assets/kinetic_favicon.png",
      navCtaText: "LET'S TALK!",
      navCtaLink: "https://calendly.com",
      heroBadge: "50+ top creators served ↗",
      heroBadgeSize: "13",
      heroH1: "We make creators\nimpossible to ignore",
      heroH1Align: "left",
      heroH1Size: "64",
      heroSub: "Your largest growth starts with Kinetic Studio",
      heroSubAlign: "left",
      heroSubSize: "18",
      heroCta: "Book A Quick Call",
      heroWatchText: "▶ Watch How We Do · 2 mins",
      heroWatchUrl: "#pb-work",
      heroCreator1: "assets/hero_creator_1.png",
      heroCreator2: "assets/hero_creator_ai1.png",
      heroCreator3: "assets/hero_creator_ai2.png",
      heroKeycap: "K",
      
      vslTitle: "Built For Your Growth With The System You Always Wanted.",
      vslP1: "220k",
      vslP2: "11.2m",
      vslP3: "220k",
      vslImg: "assets/kinetic_3d_keycaps_collage.png",
      vslRevTitle: "Newest Fresh client's loves 🤍",
      vslRev1Img: "",
      vslRev1Txt: "Absolutely loved it!",
      vslRev1Url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      vslRev2Img: "",
      vslRev2Txt: "Banger videos they do!",
      vslRev2Url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      vslRev3Img: "",
      vslRev3Txt: "10/10 motions stuffs!",
      vslRev3Url: "https://www.youtube.com/embed/dQw4w9WgXcQ",

      creatorsLabel: "Ultra big Creators we worked with ✦",
      creatorsBadge: "50+ top creators served ↗",
      c1Img: "", c1Video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      c2Img: "", c2Video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      c3Img: "", c3Video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      c4Img: "", c4Video: "https://www.youtube.com/embed/dQw4w9WgXcQ",

      portTitle: "Previous Projects",
      portSub: "Our three Element Framework for top notch product videos",
      portTabs: "Longform, Shortform",
      portfolioCards: [
        { title: "High-Retention Longform Edit #1", category: "Longform", img: "https://i.vimeocdn.com/video/2181592486-d5f8668384a597399bee6f95123cee0110f3989d3282707f4f8bdc12c3543c73-d_960x540?region=us", video: "https://player.vimeo.com/video/1211423680" },
        { title: "Creator Brand Longform Showcase", category: "Longform", img: "https://i.vimeocdn.com/video/2153077864-73486f3bc26bd213dff51016d95737991d85ef5db333efa45ffceed14d1af36b-d_960x540?region=us", video: "https://player.vimeo.com/video/1188735532" },
        { title: "FANSLINK STUDIOS VSL Edit", category: "Longform", img: "https://i.vimeocdn.com/video/2153077315-967d7b22515ed51bb7246b6c650100140ebb4efea82b8bda28782862c897baa7-d_960x540?region=us", video: "https://player.vimeo.com/video/1188734977" },
        { title: "The Truth About Cap Rate in Real Estate", category: "Shortform", img: "https://i.vimeocdn.com/video/2153079991-f86869f7d8ddfd0e3c9ce4a392d99c47c7bb03a703a8d52572d3dc072c7cf3c8-d_960x540?region=us", video: "https://player.vimeo.com/video/1188737184" },
        { title: "Short Form Motion Edit", category: "Shortform", img: "https://i.vimeocdn.com/video/2173133541-5ec3cbdb9d5d574bd8315e615c8efdf7919664028594ce8cbde3f070e8a32ebd-d_960x540?region=us", video: "https://player.vimeo.com/video/1204728257" },
        { title: "High-Converting Short Video", category: "Shortform", img: "https://i.vimeocdn.com/video/2153079128-5cad69da0840358b4aa68c60a273065759d24a839631c4dd5fc4e0ad1ccff48b-d_960x540?region=us", video: "https://player.vimeo.com/video/1188736573" }
      ],

      feat1Title: "Audience Research", feat1Desc: "We research your audience before anything else.",
      feat2Title: "Content Calendar", feat2Desc: "Your largest growth starts with Kinetic Studio",
      feat3Title: "Growth Automation", feat3Desc: "Your largest growth starts with Kinetic Studio",
      feat4Title: "Ready for 10X Growth", feat4Desc: "Your largest growth starts with Kinetic Studio",

      bentoTitle: "The Massive Creator\nGrowth Is Here",
      bentoSub: "Our three Element Framework for top notch product videos",
      bento1Quote: "“With just 5,000 subscribers, Spencer now generates $350K per month”",
      bento1Stat: "250%",
      bento1StatSub: "Revenue Growth",
      bento1Video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      bento2Chip: "👑 20% Discounted",
      bento2Title: "Creator's Growth Pack",
      bento2Img: "",
      bento3Num: "200+",
      bento3Sub: "Awesome case studies",
      bento3BtnText: "Check em out!",
      bento3BtnLink: "#pb-work",
      bentoSlots1: "5/10 slots left",
      bentoSlots2: "Add your Project ✋",

      revTitle: "Creators just\nlove us",
      revSub: "Our three Element Framework for top notch product videos",
      testimonials: [
        { quote: "“We went from inconsistent to posting every single week.”", name: "John Michael", handle: "@Youtube 1.1M Subscribers", avatar: "", video: "" },
        { quote: "“The editing and retention on our VSLs went up 300%.”", name: "Micheal Jordan", handle: "@Youtube 1.1M Subscribers", avatar: "", video: "" },
        { quote: "“Best video team we have ever partnered with for SaaS.”", name: "Alex Becker", handle: "@Instagram 200k Followers", avatar: "", video: "" },
        { quote: "“Delivered on time every single week. Unbeatable quality.”", name: "Spencer H.", handle: "@Youtube 500k Subscribers", avatar: "", video: "" }
      ],

      procTitle: "Our 4 Step Process",
      procSub: "Our three Element Framework for top notch product videos",
      proc1Pill: "01 Review", proc1Title: "01 — Content Analysis", proc1Desc: "We review the footage, script, references, and requirements to understand the video's direction.",
      proc2Pill: "02 Edit", proc2Title: "02 — Video Editing", proc2Desc: "We transform raw footage into a clean, engaging, retention-focused video with precise cuts, motion graphics, sound design, and visual effects.",
      proc3Pill: "03 Polish", proc3Title: "03 — Visual Polish", proc3Desc: "Color grading, audio cleanup, animations, transitions, captions, and final details to make every video feel premium.",
      proc4Pill: "04 Thumbnail", proc4Title: "04 — Thumbnail Design", proc4Desc: "We create a high-click-through thumbnail that matches the video's topic, style, and target audience.",

      proofNum: "200+",
      proofKeycap: "K",
      proofLabel: "Creators Served",
      proofImg: "assets/6a5616d5e6ece131416b4697_pb-scatter-right-final.png",

      priceSecTitle: "Pricing",
      priceSecSub: "Our three Element Framework for top notch product videos",
      p1Name: "One off video",
      p1Chosen: "Chosen by Pre-seed Startups",
      p1Price: "$5,499",
      p1Slots: "06/10 Slots Left this month",
      p1Tagline: "Effortless automation for individuals and small teams.",
      p1BtnText: "Book a call",
      p1Features: "Strategy-led video production\nCustom motion design and visuals\nDesigned for retention & growth\nClear timelines and predictable delivery",
      
      p2Name: "Custom Growth Pack",
      p2Chosen: "Chosen by 1M+ Creators & Brands",
      p2Price: "Custom",
      p2Slots: "Limited slots left this month",
      p2Tagline: "Complete YouTube & social growth automation tailored for scale.",
      p2BtnText: "Book a call →",
      p2Features: "Full channel & content strategy\nWeekly high-retention video edits\nShorts, VSLs & custom thumbnail suite\nDedicated lead editor & motion designer",

      priceTestiName: "Wade Warren",
      priceTestiRole: "Founder of Castari",
      priceTestiQuote: "Prompt delivery and top-notch quality. Impressed with the speed and accuracy",
      priceTestiBadge: "✦ Castari",

      faqSecTitle: "Frequently Asked Questions",
      faqBtnText: "Book A Call",
      faqBtnUrl: "#pb-cta",
      faqEmail: "hello@kineticstudio.co",
      faqs: [
        { q: "What types of videos do you create for personal brands?", a: "YouTube long-form videos, high-converting VSLs, product launch films, shorts/reels, and podcast cutdowns — built for retention." },
        { q: "Do you work with creators at all subscriber levels?", a: "Yes. Whether you're starting out or already have 1M+ subscribers, our system scales with your content strategy." },
        { q: "What makes your videos different from typical editors?", a: "Strategy-first scripting, custom motion design, and retention editing — no stock templates, every frame is engineered for engagement." },
        { q: "What does your production process look like?", a: "Onboarding, idea analysis, script/storyboard, edit & motion design, review, and final delivery. You stay informed at every step." },
        { q: "How long does it take to produce a video?", a: "Short-form videos ship in 48-72 hours; long-form YouTube videos and VSLs in 1 to 2 weeks." }
      ],

      email: "hello@kineticstudio.co",
      footerTitle: "Ready to ride?",
      copyright: "All Rights Reserved | Kinetic Studio 2026",
      socTw: "https://x.com",
      socYt: "https://youtube.com",
      socIg: "https://instagram.com",
      socLi: "https://linkedin.com"
    };
  }

  // 6. Load Data Into Form (Merging loaded data with defaults!)
  function loadCMSData() {
    var raw = localStorage.getItem(STORAGE_KEY);
    var parsed = raw ? JSON.parse(raw) : {};
    var data = Object.assign({}, getDefaults(), parsed);

    function setVal(id, val) {
      var elem = document.getElementById(id);
      if (elem) elem.value = (val !== undefined && val !== null) ? val : '';
    }

    // Header & Hero
    setVal('cms-brand-name', data.brandName);
    setVal('cms-brand-favicon', data.brandFavicon);
    setVal('cms-nav-cta-text', data.navCtaText);
    setVal('cms-nav-cta-link', data.navCtaLink);
    setVal('cms-hero-badge', data.heroBadge);
    setVal('cms-hero-badge-size', data.heroBadgeSize || '13');
    setVal('cms-hero-h1', data.heroH1);
    setVal('cms-hero-h1-size', data.heroH1Size || '64');
    setGroupAlign('h1', data.heroH1Align || 'left');
    setVal('cms-hero-sub', data.heroSub);
    setVal('cms-hero-sub-size', data.heroSubSize || '18');
    setGroupAlign('sub', data.heroSubAlign || 'left');
    setVal('cms-hero-cta', data.heroCta);
    setVal('cms-hero-watch-text', data.heroWatchText);
    setVal('cms-hero-watch-url', data.heroWatchUrl);
    setVal('cms-hero-c1-img', data.heroCreator1);
    setVal('cms-hero-c2-img', data.heroCreator2);
    setVal('cms-hero-c3-img', data.heroCreator3);
    setVal('cms-hero-keycap', data.heroKeycap);

    // VSL
    setVal('cms-vsl-title', data.vslTitle);
    setVal('cms-vsl-p1', data.vslP1);
    setVal('cms-vsl-p2', data.vslP2);
    setVal('cms-vsl-p3', data.vslP3);
    setVal('cms-vsl-img', data.vslImg);
    setVal('cms-vsl-rev-title', data.vslRevTitle);
    setVal('cms-vsl-rev1-img', data.vslRev1Img);
    setVal('cms-vsl-rev1-txt', data.vslRev1Txt);
    setVal('cms-vsl-rev1-url', data.vslRev1Url);
    setVal('cms-vsl-rev2-img', data.vslRev2Img);
    setVal('cms-vsl-rev2-txt', data.vslRev2Txt);
    setVal('cms-vsl-rev2-url', data.vslRev2Url);
    setVal('cms-vsl-rev3-img', data.vslRev3Img);
    setVal('cms-vsl-rev3-txt', data.vslRev3Txt);
    setVal('cms-vsl-rev3-url', data.vslRev3Url);

    // Creators
    setVal('cms-creators-label', data.creatorsLabel);
    setVal('cms-creators-badge', data.creatorsBadge);
    setVal('cms-c1-img', data.c1Img); setVal('cms-c1-video', data.c1Video);
    setVal('cms-c2-img', data.c2Img); setVal('cms-c2-video', data.c2Video);
    setVal('cms-c3-img', data.c3Img); setVal('cms-c3-video', data.c3Video);
    setVal('cms-c4-img', data.c4Img); setVal('cms-c4-video', data.c4Video);

    // Portfolio
    setVal('cms-port-title', data.portTitle);
    setVal('cms-port-sub', data.portSub);
    setVal('cms-port-tabs', data.portTabs);
    currentPortfolio = data.portfolioCards || [];
    currentPortfolio = currentPortfolio.filter(function(card) {
      return !card.video || card.video.indexOf('1203350991') === -1;
    });
    if (!currentPortfolio || currentPortfolio.length === 0 || currentPortfolio.length > 6 || (currentPortfolio[0] && currentPortfolio[0].category === "Youtube videos")) {
      currentPortfolio = JSON.parse(JSON.stringify(defaultData.portfolioCards));
    }
    renderPortfolioInputs();

    // Features & Bento
    setVal('cms-feat1-title', data.feat1Title); setVal('cms-feat1-desc', data.feat1Desc);
    setVal('cms-feat2-title', data.feat2Title); setVal('cms-feat2-desc', data.feat2Desc);
    setVal('cms-feat3-title', data.feat3Title); setVal('cms-feat3-desc', data.feat3Desc);
    setVal('cms-feat4-title', data.feat4Title); setVal('cms-feat4-desc', data.feat4Desc);

    setVal('cms-bento-title', data.bentoTitle);
    setVal('cms-bento-sub', data.bentoSub);
    setVal('cms-bento1-quote', data.bento1Quote);
    setVal('cms-bento1-stat', data.bento1Stat);
    setVal('cms-bento1-stat-sub', data.bento1StatSub);
    setVal('cms-bento1-video', data.bento1Video);
    setVal('cms-bento2-chip', data.bento2Chip);
    setVal('cms-bento2-title', data.bento2Title);
    setVal('cms-bento2-img', data.bento2Img);
    setVal('cms-bento3-num', data.bento3Num);
    setVal('cms-bento3-sub', data.bento3Sub);
    setVal('cms-bento3-btn-text', data.bento3BtnText);
    setVal('cms-bento3-btn-link', data.bento3BtnLink);
    setVal('cms-bento-slots1', data.bentoSlots1);
    setVal('cms-bento-slots2', data.bentoSlots2);

    // Testimonials
    setVal('cms-rev-title', data.revTitle);
    setVal('cms-rev-sub', data.revSub);
    currentTestimonials = data.testimonials || [];
    renderTestimonialInputs();

    // Process & Proof
    setVal('cms-proc-title', data.procTitle);
    setVal('cms-proc-sub', data.procSub);
    setVal('cms-proc1-pill', data.proc1Pill); setVal('cms-proc1-title', data.proc1Title);
    setVal('cms-proc2-pill', data.proc2Pill); setVal('cms-proc2-title', data.proc2Title);
    setVal('cms-proc3-pill', data.proc3Pill); setVal('cms-proc3-title', data.proc3Title);
    setVal('cms-proc4-pill', data.proc4Pill); setVal('cms-proc4-title', data.proc4Title);
    setVal('cms-proc-bar-txt', data.procBarTxt);
    setVal('cms-proc-bar-url', data.procBarUrl);

    setVal('cms-proof-num', data.proofNum);
    setVal('cms-proof-keycap', data.proofKeycap);
    setVal('cms-proof-label', data.proofLabel);
    setVal('cms-proof-img', data.proofImg);

    // Pricing
    setVal('cms-price-sec-title', data.priceSecTitle);
    setVal('cms-price-sec-sub', data.priceSecSub);
    setVal('cms-p1-name', data.p1Name);
    setVal('cms-p1-chosen', data.p1Chosen);
    setVal('cms-p1-price', data.p1Price);
    setVal('cms-p1-slots', data.p1Slots);
    setVal('cms-p1-tagline', data.p1Tagline);
    setVal('cms-p1-btn-text', data.p1BtnText);
    setVal('cms-p1-features', data.p1Features);

    setVal('cms-p2-name', data.p2Name);
    setVal('cms-p2-chosen', data.p2Chosen);
    setVal('cms-p2-price', data.p2Price);
    setVal('cms-p2-slots', data.p2Slots);
    setVal('cms-p2-tagline', data.p2Tagline);
    setVal('cms-p2-btn-text', data.p2BtnText);
    setVal('cms-p2-features', data.p2Features);

    setVal('cms-price-testi-name', data.priceTestiName);
    setVal('cms-price-testi-role', data.priceTestiRole);
    setVal('cms-price-testi-quote', data.priceTestiQuote);
    setVal('cms-price-testi-badge', data.priceTestiBadge);

    // FAQs
    setVal('cms-faq-sec-title', data.faqSecTitle);
    setVal('cms-faq-btn-text', data.faqBtnText);
    setVal('cms-faq-btn-url', data.faqBtnUrl);
    setVal('cms-faq-email', data.faqEmail);
    currentFaqs = data.faqs || [];
    renderFaqInputs();

    // General & Footer
    setVal('cms-email', data.email);
    setVal('cms-footer-title', data.footerTitle);
    setVal('cms-copyright', data.copyright);
    setVal('cms-soc-tw', data.twitterLink);
    setVal('cms-soc-yt', data.youtubeLink);
    setVal('cms-soc-ig', data.instagramLink);
    setVal('cms-soc-li', data.linkedinLink);

    var savedToken = localStorage.getItem('kinetic_gh_token') || '';
    setVal('githubTokenInput', savedToken);
  }

  // 7. Render Repeater Inputs (FAQs, Portfolio, Testimonials)
  function renderFaqInputs() {
    var container = document.getElementById('faqList');
    if (!container) return;
    container.innerHTML = '';

    currentFaqs.forEach(function (faq, idx) {
      var card = document.createElement('div');
      card.className = 'cms-repeater-card';
      card.innerHTML =
        '<div class="cms-repeater-header">' +
          '<span class="cms-repeater-title">FAQ #' + (idx + 1) + '</span>' +
          '<button type="button" class="cms-btn-danger remove-faq-btn" data-idx="' + idx + '">Delete Item</button>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Question</label>' +
          '<input type="text" class="admin-input faq-q-input" data-idx="' + idx + '" value="' + escapeAttr(faq.q) + '" />' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Answer</label>' +
          '<textarea class="admin-input faq-a-input" data-idx="' + idx + '">' + escapeHtml(faq.a) + '</textarea>' +
        '</div>';
      container.appendChild(card);
    });

    container.querySelectorAll('.faq-q-input').forEach(function (input) {
      input.addEventListener('input', function () {
        currentFaqs[this.getAttribute('data-idx')].q = this.value;
      });
    });
    container.querySelectorAll('.faq-a-input').forEach(function (input) {
      input.addEventListener('input', function () {
        currentFaqs[this.getAttribute('data-idx')].a = this.value;
      });
    });
    container.querySelectorAll('.remove-faq-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFaqs.splice(parseInt(this.getAttribute('data-idx')), 1);
        renderFaqInputs();
      });
    });
  }

  var addFaqBtn = document.getElementById('addFaqBtn');
  if (addFaqBtn) {
    addFaqBtn.addEventListener('click', function () {
      currentFaqs.push({ q: "New Question Title", a: "Answer text goes here." });
      renderFaqInputs();
    });
  }

  function renderPortfolioInputs() {
    var container = document.getElementById('portfolioCardsList');
    if (!container) return;
    container.innerHTML = '';

    currentPortfolio.forEach(function (item, idx) {
      var card = document.createElement('div');
      card.className = 'cms-repeater-card';
      var imgInputId = 'port-img-' + idx;
      card.innerHTML =
        '<div class="cms-repeater-header">' +
          '<span class="cms-repeater-title">Portfolio Card #' + (idx + 1) + '</span>' +
          '<button type="button" class="cms-btn-danger remove-port-btn" data-idx="' + idx + '">Delete Card</button>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">' +
          '<div class="form-group">' +
            '<label class="form-label">Card Title / Caption</label>' +
            '<input type="text" class="admin-input port-title-input" data-idx="' + idx + '" value="' + escapeAttr(item.title) + '" />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Category</label>' +
            '<select class="admin-input port-cat-select" data-idx="' + idx + '">' +
              '<option value="Longform"' + (item.category && item.category.toLowerCase().indexOf('long') !== -1 ? ' selected' : '') + '>Longform</option>' +
              '<option value="Shortform"' + (item.category && item.category.toLowerCase().indexOf('short') !== -1 ? ' selected' : '') + '>Shortform</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Thumbnail Image (URL or Upload)</label>' +
          '<div class="media-picker-group">' +
            '<input type="text" class="admin-input port-img-input" id="' + imgInputId + '" data-idx="' + idx + '" value="' + escapeAttr(item.img || '') + '" />' +
            '<label class="media-upload-btn">📁 Upload <input type="file" class="media-file-input" accept="image/*" data-target-input="' + imgInputId + '" style="display:none;" /></label>' +
          '</div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Video URL (Vimeo / YouTube / Direct Embed)</label>' +
          '<input type="text" class="admin-input port-video-input" data-idx="' + idx + '" value="' + escapeAttr(item.video || '') + '" placeholder="https://player.vimeo.com/video/..." />' +
        '</div>';
      container.appendChild(card);
    });

    container.querySelectorAll('.port-title-input').forEach(function (input) {
      input.addEventListener('input', function () { currentPortfolio[this.getAttribute('data-idx')].title = this.value; });
    });
    container.querySelectorAll('.port-cat-select').forEach(function (select) {
      select.addEventListener('change', function () { currentPortfolio[this.getAttribute('data-idx')].category = this.value; });
    });
    container.querySelectorAll('.port-img-input').forEach(function (input) {
      input.addEventListener('input', function () { currentPortfolio[this.getAttribute('data-idx')].img = this.value; });
    });
    container.querySelectorAll('.port-video-input').forEach(function (input) {
      input.addEventListener('input', function () { currentPortfolio[this.getAttribute('data-idx')].video = this.value; });
    });
    container.querySelectorAll('.remove-port-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentPortfolio.splice(parseInt(this.getAttribute('data-idx')), 1);
        renderPortfolioInputs();
      });
    });
    bindFileUploaders();
  }

  var addPortfolioBtn = document.getElementById('addPortfolioBtn');
  if (addPortfolioBtn) {
    addPortfolioBtn.addEventListener('click', function () {
      currentPortfolio.push({ title: "New Video Title", category: "Shortform", img: "", video: "https://player.vimeo.com/video/1203350991" });
      renderPortfolioInputs();
    });
  }

  var resetPortfolioBtn = document.getElementById('resetPortfolioBtn');
  if (resetPortfolioBtn) {
    resetPortfolioBtn.addEventListener('click', function () {
      if (confirm('Reset portfolio cards to Framer video defaults?')) {
        currentPortfolio = JSON.parse(JSON.stringify(defaultData.portfolioCards));
        renderPortfolioInputs();
      }
    });
  }

  function renderTestimonialInputs() {
    var container = document.getElementById('testimonialsList');
    if (!container) return;
    container.innerHTML = '';

    currentTestimonials.forEach(function (item, idx) {
      var card = document.createElement('div');
      card.className = 'cms-repeater-card';
      var avatarId = 'testi-avatar-' + idx;
      card.innerHTML =
        '<div class="cms-repeater-header">' +
          '<span class="cms-repeater-title">Testimonial #' + (idx + 1) + '</span>' +
          '<button type="button" class="cms-btn-danger remove-testi-btn" data-idx="' + idx + '">Delete Card</button>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Quote Text</label>' +
          '<textarea class="admin-input testi-quote-input" data-idx="' + idx + '">' + escapeHtml(item.quote) + '</textarea>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">' +
          '<div class="form-group">' +
            '<label class="form-label">Author Name</label>' +
            '<input type="text" class="admin-input testi-name-input" data-idx="' + idx + '" value="' + escapeAttr(item.name) + '" />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Handle / Follower Subtitle</label>' +
            '<input type="text" class="admin-input testi-handle-input" data-idx="' + idx + '" value="' + escapeAttr(item.handle) + '" />' +
          '</div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Avatar Photo (URL or Upload)</label>' +
          '<div class="media-picker-group">' +
            '<input type="text" class="admin-input testi-avatar-input" id="' + avatarId + '" data-idx="' + idx + '" value="' + escapeAttr(item.avatar || '') + '" />' +
            '<label class="media-upload-btn">📁 Upload <input type="file" class="media-file-input" accept="image/*" data-target-input="' + avatarId + '" style="display:none;" /></label>' +
          '</div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Video Review Link (Optional Popup)</label>' +
          '<input type="text" class="admin-input testi-video-input" data-idx="' + idx + '" value="' + escapeAttr(item.video || '') + '" placeholder="https://www.youtube.com/embed/..." />' +
        '</div>';
      container.appendChild(card);
    });

    container.querySelectorAll('.testi-quote-input').forEach(function (input) {
      input.addEventListener('input', function () { currentTestimonials[this.getAttribute('data-idx')].quote = this.value; });
    });
    container.querySelectorAll('.testi-name-input').forEach(function (input) {
      input.addEventListener('input', function () { currentTestimonials[this.getAttribute('data-idx')].name = this.value; });
    });
    container.querySelectorAll('.testi-handle-input').forEach(function (input) {
      input.addEventListener('input', function () { currentTestimonials[this.getAttribute('data-idx')].handle = this.value; });
    });
    container.querySelectorAll('.testi-avatar-input').forEach(function (input) {
      input.addEventListener('input', function () { currentTestimonials[this.getAttribute('data-idx')].avatar = this.value; });
    });
    container.querySelectorAll('.testi-video-input').forEach(function (input) {
      input.addEventListener('input', function () { currentTestimonials[this.getAttribute('data-idx')].video = this.value; });
    });
    container.querySelectorAll('.remove-testi-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentTestimonials.splice(parseInt(this.getAttribute('data-idx')), 1);
        renderTestimonialInputs();
      });
    });
    bindFileUploaders();
  }

  var addTestimonialBtn = document.getElementById('addTestimonialBtn');
  if (addTestimonialBtn) {
    addTestimonialBtn.addEventListener('click', function () {
      currentTestimonials.push({ quote: "“Loved working with Kinetic Studio!”", name: "New Client", handle: "@Youtube Creator", avatar: "", video: "" });
      renderTestimonialInputs();
    });
  }

  // 8. Save All CMS Data
  function saveCMSData() {
    function getVal(id) {
      var elem = document.getElementById(id);
      return elem ? elem.value : '';
    }

    var data = {
      brandName: getVal('cms-brand-name'),
      brandFavicon: getVal('cms-brand-favicon'),
      navCtaText: getVal('cms-nav-cta-text'),
      navCtaLink: getVal('cms-nav-cta-link'),
      heroBadge: getVal('cms-hero-badge'),
      heroBadgeSize: getVal('cms-hero-badge-size'),
      heroH1: getVal('cms-hero-h1'),
      heroH1Align: currentAligns.h1 || 'left',
      heroH1Size: getVal('cms-hero-h1-size'),
      heroSub: getVal('cms-hero-sub'),
      heroSubAlign: currentAligns.sub || 'left',
      heroSubSize: getVal('cms-hero-sub-size'),
      heroCta: getVal('cms-hero-cta'),
      heroWatchText: getVal('cms-hero-watch-text'),
      heroWatchUrl: getVal('cms-hero-watch-url'),
      heroCreator1: getVal('cms-hero-c1-img'),
      heroCreator2: getVal('cms-hero-c2-img'),
      heroCreator3: getVal('cms-hero-c3-img'),
      heroKeycap: getVal('cms-hero-keycap'),

      vslTitle: getVal('cms-vsl-title'),
      vslP1: getVal('cms-vsl-p1'),
      vslP2: getVal('cms-vsl-p2'),
      vslP3: getVal('cms-vsl-p3'),
      vslImg: getVal('cms-vsl-img'),
      vslRevTitle: getVal('cms-vsl-rev-title'),
      vslRev1Img: getVal('cms-vsl-rev1-img'),
      vslRev1Txt: getVal('cms-vsl-rev1-txt'),
      vslRev1Url: getVal('cms-vsl-rev1-url'),
      vslRev2Img: getVal('cms-vsl-rev2-img'),
      vslRev2Txt: getVal('cms-vsl-rev2-txt'),
      vslRev2Url: getVal('cms-vsl-rev2-url'),
      vslRev3Img: getVal('cms-vsl-rev3-img'),
      vslRev3Txt: getVal('cms-vsl-rev3-txt'),
      vslRev3Url: getVal('cms-vsl-rev3-url'),

      creatorsLabel: getVal('cms-creators-label'),
      creatorsBadge: getVal('cms-creators-badge'),
      c1Img: getVal('cms-c1-img'), c1Video: getVal('cms-c1-video'),
      c2Img: getVal('cms-c2-img'), c2Video: getVal('cms-c2-video'),
      c3Img: getVal('cms-c3-img'), c3Video: getVal('cms-c3-video'),
      c4Img: getVal('cms-c4-img'), c4Video: getVal('cms-c4-video'),

      portTitle: getVal('cms-port-title'),
      portSub: getVal('cms-port-sub'),
      portTabs: getVal('cms-port-tabs'),
      portfolioCards: currentPortfolio,

      feat1Title: getVal('cms-feat1-title'), feat1Desc: getVal('cms-feat1-desc'),
      feat2Title: getVal('cms-feat2-title'), feat2Desc: getVal('cms-feat2-desc'),
      feat3Title: getVal('cms-feat3-title'), feat3Desc: getVal('cms-feat3-desc'),
      feat4Title: getVal('cms-feat4-title'), feat4Desc: getVal('cms-feat4-desc'),

      bentoTitle: getVal('cms-bento-title'),
      bentoSub: getVal('cms-bento-sub'),
      bento1Quote: getVal('cms-bento1-quote'),
      bento1Stat: getVal('cms-bento1-stat'),
      bento1StatSub: getVal('cms-bento1-stat-sub'),
      bento1Video: getVal('cms-bento1-video'),
      bento2Chip: getVal('cms-bento2-chip'),
      bento2Title: getVal('cms-bento2-title'),
      bento2Img: getVal('cms-bento2-img'),
      bento3Num: getVal('cms-bento3-num'),
      bento3Sub: getVal('cms-bento3-sub'),
      bento3BtnText: getVal('cms-bento3-btn-text'),
      bento3BtnLink: getVal('cms-bento3-btn-link'),
      bentoSlots1: getVal('cms-bento-slots1'),
      bentoSlots2: getVal('cms-bento-slots2'),

      revTitle: getVal('cms-rev-title'),
      revSub: getVal('cms-rev-sub'),
      testimonials: currentTestimonials,

      procTitle: getVal('cms-proc-title'),
      procSub: getVal('cms-proc-sub'),
      proc1Pill: getVal('cms-proc1-pill'), proc1Title: getVal('cms-proc1-title'),
      proc2Pill: getVal('cms-proc2-pill'), proc2Title: getVal('cms-proc2-title'),
      proc3Pill: getVal('cms-proc3-pill'), proc3Title: getVal('cms-proc3-title'),
      proc4Pill: getVal('cms-proc4-pill'), proc4Title: getVal('cms-proc4-title'),
      procBarTxt: getVal('cms-proc-bar-txt'),
      procBarUrl: getVal('cms-proc-bar-url'),

      proofNum: getVal('cms-proof-num'),
      proofKeycap: getVal('cms-proof-keycap'),
      proofLabel: getVal('cms-proof-label'),
      proofImg: getVal('cms-proof-img'),

      priceSecTitle: getVal('cms-price-sec-title'),
      priceSecSub: getVal('cms-price-sec-sub'),
      p1Name: getVal('cms-p1-name'),
      p1Chosen: getVal('cms-p1-chosen'),
      p1Price: getVal('cms-p1-price'),
      p1Slots: getVal('cms-p1-slots'),
      p1Tagline: getVal('cms-p1-tagline'),
      p1BtnText: getVal('cms-p1-btn-text'),
      p1Features: getVal('cms-p1-features'),

      p2Name: getVal('cms-p2-name'),
      p2Chosen: getVal('cms-p2-chosen'),
      p2Price: getVal('cms-p2-price'),
      p2Slots: getVal('cms-p2-slots'),
      p2Tagline: getVal('cms-p2-tagline'),
      p2BtnText: getVal('cms-p2-btn-text'),
      p2Features: getVal('cms-p2-features'),

      priceTestiName: getVal('cms-price-testi-name'),
      priceTestiRole: getVal('cms-price-testi-role'),
      priceTestiQuote: getVal('cms-price-testi-quote'),
      priceTestiBadge: getVal('cms-price-testi-badge'),

      faqSecTitle: getVal('cms-faq-sec-title'),
      faqBtnText: getVal('cms-faq-btn-text'),
      faqBtnUrl: getVal('cms-faq-btn-url'),
      faqEmail: getVal('cms-faq-email'),
      faqs: currentFaqs,

      email: getVal('cms-email'),
      footerTitle: getVal('cms-footer-title'),
      copyright: getVal('cms-copyright'),
      socTw: getVal('cms-soc-tw'),
      socYt: getVal('cms-soc-yt'),
      socIg: getVal('cms-soc-ig'),
      socLi: getVal('cms-soc-li')
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // 1. Call local Node server auto-save API (disk write + git push)
    fetch('/api/save-cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json();
    }).then(function (resData) {
      showToast('Saved to Code & Auto-Pushed to GitHub! 🚀');
    }).catch(function () {
      showToast('Changes Saved Live! 🚀');
    });

    // 2. Direct GitHub REST API push (for live GitHub Pages host)
    var ghToken = localStorage.getItem('kinetic_gh_token') || '';
    if (ghToken) {
      pushToGitHubAPI(data, ghToken).then(function (ok) {
        if (ok) showToast('Auto-Pushed directly to GitHub API! 🚀');
      });
    }
  }

  function pushToGitHubAPI(jsonData, token) {
    if (!token) return Promise.resolve(false);
    var repoOwner = 'nafewislam11-spec';
    var repoName = 'kineticstudio';
    var filePath = 'data/cms_data.json';
    var apiUrl = 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contents/' + filePath;
    var jsonString = JSON.stringify(jsonData, null, 2);
    var contentBase64 = btoa(unescape(encodeURIComponent(jsonString)));

    return fetch(apiUrl, {
      headers: {
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github.v3+json'
      }
    }).then(function (res) {
      return res.ok ? res.json() : null;
    }).then(function (fileData) {
      var sha = fileData ? fileData.sha : undefined;
      var payload = {
        message: 'Auto CMS Update from Admin Panel',
        content: contentBase64,
        branch: 'main'
      };
      if (sha) payload.sha = sha;

      return fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': 'token ' + token,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }).then(function (res) {
      if (res.ok) {
        console.log('[GitHub API Direct Push Success]');
        return true;
      }
      return false;
    }).catch(function (err) {
      console.warn('[GitHub API Push Error]:', err);
      return false;
    });
  }

  var saveAllBtn = document.getElementById('saveAllBtn');
  if (saveAllBtn) saveAllBtn.addEventListener('click', saveCMSData);

  var saveGithubTokenBtn = document.getElementById('saveGithubTokenBtn');
  if (saveGithubTokenBtn) {
    saveGithubTokenBtn.addEventListener('click', function () {
      var token = (document.getElementById('githubTokenInput').value || '').trim();
      localStorage.setItem('kinetic_gh_token', token);
      showToast('GitHub Token Saved Successfully! 🔑');
    });
  }

  // 9. Update Password
  var updatePasswordBtn = document.getElementById('updatePasswordBtn');
  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('click', function () {
      var newPass = document.getElementById('newAdminPassword').value.trim();
      if (newPass) {
        localStorage.setItem(PASS_KEY, newPass);
        document.getElementById('newAdminPassword').value = '';
        showToast('Admin password updated successfully! 🔒');
      }
    });
  }

  // 10. Export & Import Backup JSON
  var exportGithubJsonBtn = document.getElementById('exportGithubJsonBtn');
  if (exportGithubJsonBtn) {
    exportGithubJsonBtn.addEventListener('click', function () {
      saveCMSData();
      var raw = localStorage.getItem(STORAGE_KEY);
      var blob = new Blob([raw || JSON.stringify(getDefaults(), null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'cms_data.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded cms_data.json! Place it inside data/ folder & push to GitHub 🚀');
    });
  }

  var exportBackupBtn = document.getElementById('exportBackupBtn');
  if (exportBackupBtn) {
    exportBackupBtn.addEventListener('click', function () {
      var raw = localStorage.getItem(STORAGE_KEY);
      var blob = new Blob([raw || JSON.stringify(getDefaults(), null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'kinetic_cms_backup_' + (new Date().toISOString().slice(0,10)) + '.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  var importJsonFile = document.getElementById('importJsonFile');
  if (importJsonFile) {
    importJsonFile.addEventListener('change', function () {
      var file = this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var parsed = JSON.parse(e.target.result);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          loadCMSData();
          showToast('CMS Data Imported Successfully! 📦');
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    });
  }

  var resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', function () {
      if (confirm('Are you sure you want to reset all CMS content and media to factory defaults?')) {
        localStorage.removeItem(STORAGE_KEY);
        loadCMSData();
        showToast('Factory Defaults Restored! 🔄');
      }
    });
  }

  function showToast(msg) {
    var toast = document.getElementById('cmsToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(function () { toast.style.display = 'none'; }, 3000);
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function escapeAttr(str) {
    return (str || '').replace(/"/g, "&quot;");
  }

  // Initialize Form
  loadCMSData();
});
