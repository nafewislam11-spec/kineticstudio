// Main Frontend JavaScript for Kinetic Studio (Dynamic CMS Integration)

document.addEventListener('DOMContentLoaded', function () {
  // 1. Lenis Smooth Scroll Initialization
  var lenis = null;

  function initLenis() {
    var isTouch = window.matchMedia('(pointer: coarse)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduceMotion) return;

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js';
    script.onload = function () {
      if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
          duration: 1.1,
          easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5
        });
        window.lenis = lenis;

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    };
    document.body.appendChild(script);
  }
  initLenis();

  // 2. Smooth Scroll Anchor Link Handler
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        var headerOffset = 90;

        if (window.lenis) {
          window.lenis.scrollTo(targetElement, { offset: -headerOffset, duration: 1.2 });
        } else {
          var elementPosition = targetElement.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 3. Video Popup Modal Logic
  function openVideoModal(url) {
    var modal = document.getElementById('cmsVideoModal');
    var container = document.getElementById('cmsVideoContainer');
    if (!url || url === '#' || !modal || !container) return;

    var embedUrl = url;
    if (embedUrl.indexOf('youtube.com/watch?v=') !== -1) {
      embedUrl = embedUrl.replace('watch?v=', 'embed/') + '?autoplay=1';
    } else if (embedUrl.indexOf('youtu.be/') !== -1) {
      embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1';
    } else if (embedUrl.indexOf('vimeo.com/') !== -1 && embedUrl.indexOf('player.vimeo.com') === -1) {
      embedUrl = embedUrl.replace('vimeo.com/', 'player.vimeo.com/video/') + '?autoplay=1';
    } else if (embedUrl.indexOf('player.vimeo.com/video/') !== -1 && embedUrl.indexOf('autoplay=') === -1) {
      embedUrl += (embedUrl.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1';
    }

    if (embedUrl.indexOf('http') === 0) {
      container.innerHTML = '<iframe src="' + embedUrl + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>';
    } else {
      container.innerHTML = '<video src="' + embedUrl + '" controls autoplay style="width:100%;height:100%;object-fit:cover;"></video>';
    }

    modal.style.display = 'flex';
    setTimeout(function () {
      modal.classList.add('active');
    }, 10);
  }

  function closeVideoModal() {
    var modal = document.getElementById('cmsVideoModal');
    var container = document.getElementById('cmsVideoContainer');
    if (!modal || !container) return;
    modal.classList.remove('active');
    setTimeout(function () {
      modal.style.display = 'none';
      container.innerHTML = '';
    }, 300);
  }

  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;

  var videoClose = document.getElementById('cmsVideoClose');
  var videoModal = document.getElementById('cmsVideoModal');
  if (videoClose) videoClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // 4. Scroll Reveal Animations
  var revealElements = document.querySelectorAll(
    '.trusted-wrap, .pb-h1, .pb-sub, .pb-ctas, .hero-marquee-item, .pb2-vsl-in2, .pb3-wrap, .pb4-head, .pb4-card, .pb5-sec > div, .pb6-wrap, .pb6-c1, .pb6-c2, .pb6-c3, .pb8-h, .pb8-step, .pb9-h, .pb9-card, .pb10-h, .pb10-faq'
  );

  revealElements.forEach(function (el) { el.classList.add('reveal-init'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('revealed'); });
  }

  // 5. Default CMS Schema (Fallback Defaults)
  function getDefaults() {
    return {
      brandName: "Kinetic Studio",
      brandFavicon: "assets/kinetic_favicon.png",
      navCtaText: "LET'S TALK!",
      navCtaLink: "#pb-cta",
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
      proc1Pill: "One", proc1Title: "Idea Analysis",
      proc2Pill: "Two", proc2Title: "Writing Content",
      proc3Pill: "Three", proc3Title: "Editing the Video",
      proc4Pill: "Four", proc4Title: "Creating thumbnail",
      procBarTxt: "▪ Watch Process In detail",
      procBarUrl: "#pb-work",

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

  // 6. Complete Real-time CMS Data Integration
  function applyCMSData() {
    var STORAGE_KEY = 'kinetic_cms_data';
    var raw = localStorage.getItem(STORAGE_KEY);
    var parsed = raw ? JSON.parse(raw) : {};
    var data = Object.assign({}, getDefaults(), parsed);

    try {
      // Helper functions
      function setText(selector, text) {
        if (text === undefined || text === null) return;
        var elems = document.querySelectorAll(selector);
        elems.forEach(function (el) { el.textContent = text; });
      }

      function setHtml(selector, html) {
        if (html === undefined || html === null) return;
        var elems = document.querySelectorAll(selector);
        elems.forEach(function (el) { el.innerHTML = html; });
      }

      function setAttr(selector, attr, val) {
        if (!val) return;
        var elems = document.querySelectorAll(selector);
        elems.forEach(function (el) { el.setAttribute(attr, val); });
      }

      function setBg(selector, url) {
        if (!url) return;
        var elems = document.querySelectorAll(selector);
        elems.forEach(function (el) {
          el.style.backgroundImage = 'url("' + url + '")';
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
        });
      }

      // --- 1. Header & Navbar ---
      if (data.brandName) {
        var parts = data.brandName.trim().split(/\s+/);
        var firstPart = parts[0] || 'Kinetic';
        var secondPart = parts.slice(1).join(' ') || '';
        document.querySelectorAll('.kinetic-logo-svg').forEach(function (svg) {
          var t1 = svg.querySelector('text:first-of-type');
          var t2 = svg.querySelector('text:nth-of-type(2)');
          if (t1) t1.textContent = firstPart;
          if (t2) t2.textContent = secondPart;
        });
      }
      if (data.brandFavicon) {
        var favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        favicons.forEach(function (f) { f.href = data.brandFavicon; });
      }
      if (data.navCtaText) setText('.button-03 .paragraph-02-m', data.navCtaText);
      if (data.navCtaLink) setAttr('.button-03', 'href', data.navCtaLink);

      // --- 2. Hero Section ---
      if (data.heroBadge) setText('.pb-badge', data.heroBadge);
      var badgeElem = document.querySelector('.pb-badge');
      if (badgeElem && data.heroBadgeSize) badgeElem.style.fontSize = data.heroBadgeSize + 'px';

      var h1Elem = document.querySelector('.pb-h1');
      if (h1Elem) {
        if (data.heroH1) h1Elem.innerHTML = data.heroH1.replace(/\n/g, '<br/>');
        if (data.heroH1Size) h1Elem.style.fontSize = data.heroH1Size + 'px';
        if (data.heroH1Align) h1Elem.style.textAlign = data.heroH1Align;
      }

      var subElem = document.querySelector('.pb-sub');
      if (subElem) {
        if (data.heroSub) subElem.innerHTML = data.heroSub.replace(/\n/g, '<br/>');
        if (data.heroSubSize) subElem.style.fontSize = data.heroSubSize + 'px';
        if (data.heroSubAlign) subElem.style.textAlign = data.heroSubAlign;
      }

      if (data.heroCta) setText('.pb-cta-pill', data.heroCta);

      var watchElem = document.querySelector('.pb-watch');
      if (watchElem) {
        if (data.heroWatchText) watchElem.textContent = data.heroWatchText;
        if (data.heroWatchUrl) {
          watchElem.setAttribute('href', data.heroWatchUrl);
          if (data.heroWatchUrl.indexOf('http') === 0) {
            watchElem.onclick = function (e) {
              e.preventDefault();
              openVideoModal(data.heroWatchUrl);
            };
          }
        }
      }

      // Dynamic Hero Marquee Cards Strip Rendering (3 Images)
      var heroTrack = document.querySelector('.pb-track');
      if (heroTrack) {
        var imgs = [
          data.heroCreator1 || "assets/hero_creator_1.png",
          data.heroCreator2 || "assets/hero_creator_ai1.png",
          data.heroCreator3 || "assets/hero_creator_ai2.png"
        ];
        
        var cardsHtml = '';
        for (var loop = 0; loop < 10; loop++) {
          imgs.forEach(function (imgSrc) {
            cardsHtml += '<div class="hero-card-item">';
            cardsHtml += '<img src="' + escapeHtml(imgSrc) + '" alt="Creator Card" loading="lazy" />';
            cardsHtml += '</div>';
          });
        }
        heroTrack.innerHTML = cardsHtml;
      }
      if (data.heroKeycap) setText('.pb-keycap-letter', data.heroKeycap);

      // --- 3. VSL & Stat Pills ---
      if (data.vslTitle) setHtml('.pb2-h', data.vslTitle.replace(/\n/g, '<br/>'));
      if (data.vslP1) setText('.pb2-p1c .pb2-pilltxt', data.vslP1);
      if (data.vslP2) setText('.pb2-p2c .pb2-pilltxt', data.vslP2);
      if (data.vslP3) setText('.pb2-p3c .pb2-pilltxt', data.vslP3);
      if (data.vslImg) setAttr('.pb2-3d-keycaps-img', 'src', data.vslImg);

      if (data.vslRevTitle) setText('.pb2-loveh', data.vslRevTitle);
      if (data.vslRev1Txt) setText('.pb2-tab:nth-child(1) .pb2-tabt', data.vslRev1Txt);
      if (data.vslRev2Txt) setText('.pb2-tab:nth-child(2) .pb2-tabt', data.vslRev2Txt);
      if (data.vslRev3Txt) setText('.pb2-tab:nth-child(3) .pb2-tabt', data.vslRev3Txt);

      if (data.vslRev1Img) setBg('.pb2-bgth1', data.vslRev1Img);
      if (data.vslRev2Img) setBg('.pb2-bgth2', data.vslRev2Img);
      if (data.vslRev3Img) setBg('.pb2-bgth3', data.vslRev3Img);

      var revTabs = document.querySelectorAll('.pb2-tab');
      revTabs.forEach(function (tab, i) {
        var videoUrl = data['vslRev' + (i + 1) + 'Url'];
        if (videoUrl) {
          tab.style.cursor = 'pointer';
          tab.onclick = function () { openVideoModal(videoUrl); };
        }
      });

      // --- 4. Creators Showcase ---
      if (data.creatorsLabel) setHtml('.pb3-label', data.creatorsLabel + ' <span class="pb3-star"></span>');
      if (data.creatorsBadge) setHtml('.pb3-badge', data.creatorsBadge);

      for (var c = 1; c <= 4; c++) {
        var cImg = data['c' + c + 'Img'];
        var cVid = data['c' + c + 'Video'];
        var cCard = document.querySelector('.pb3-row .pb3-card:nth-child(' + c + ')');
        if (cCard) {
          if (cImg) {
            var ph = cCard.querySelector('.pb3-ph');
            if (ph) {
              ph.style.backgroundImage = 'url("' + cImg + '")';
              ph.style.backgroundSize = 'cover';
            }
          }
          if (cVid) {
            cCard.style.cursor = 'pointer';
            cCard.onclick = (function (vidUrl) {
              return function () { openVideoModal(vidUrl); };
            })(cVid);
          }
        }
      }

      // --- 5. Portfolio Section ---
      if (!data.portfolioCards || data.portfolioCards.length === 0 || data.portfolioCards.length > 6 || (data.portfolioCards[0] && data.portfolioCards[0].category === "Youtube videos")) {
        data.portfolioCards = defaultData.portfolioCards;
        data.portTabs = defaultData.portTabs;
        data.portTitle = defaultData.portTitle;
      }
      data.portfolioCards = data.portfolioCards.filter(function(card) {
        return !card.video || card.video.indexOf('1203350991') === -1;
      });
      if (data.portTitle) setText('.pb4-h', data.portTitle);
      if (data.portSub) setText('.pb4-sub', data.portSub);

      function normalizeCategory(cat) {
        if (!cat) return '';
        var c = cat.toLowerCase().trim();
        if (c.indexOf('short') !== -1) return 'shortform';
        if (c.indexOf('long') !== -1 || c.indexOf('youtube') !== -1 || c.indexOf('vsl') !== -1) return 'longform';
        return c;
      }

      function toEmbedUrl(url, autoplay) {
        if (!url) return '';
        var embedUrl = url;
        if (embedUrl.indexOf('youtube.com/watch?v=') !== -1) {
          embedUrl = embedUrl.replace('watch?v=', 'embed/');
        } else if (embedUrl.indexOf('youtu.be/') !== -1) {
          embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
        } else if (embedUrl.indexOf('vimeo.com/') !== -1 && embedUrl.indexOf('player.vimeo.com') === -1) {
          embedUrl = embedUrl.replace('vimeo.com/', 'player.vimeo.com/video/');
        }
        if (autoplay) {
          embedUrl += (embedUrl.indexOf('?') !== -1 ? '&' : '?') + 'autoplay=1';
        } else if (embedUrl.indexOf('player.vimeo.com/video/') !== -1 && embedUrl.indexOf('title=') === -1) {
          embedUrl += (embedUrl.indexOf('?') !== -1 ? '&' : '?') + 'title=0&byline=0&portrait=0';
        }
        return embedUrl;
      }

      function renderPortfolioGrid(activeCategory) {
        var pGrid = document.querySelector('.pb4-grid');
        if (!pGrid || !data.portfolioCards || !Array.isArray(data.portfolioCards)) return;

        var filtered = data.portfolioCards;
        if (activeCategory) {
          var targetNorm = normalizeCategory(activeCategory);
          var matched = data.portfolioCards.filter(function (card) {
            if (!card.category) return false;
            return normalizeCategory(card.category) === targetNorm;
          });
          if (matched.length > 0) filtered = matched;
        }

        pGrid.innerHTML = '';
        var row1 = document.createElement('div'); row1.className = 'pb4-r';
        var row2 = document.createElement('div'); row2.className = 'pb4-r';

        filtered.forEach(function (card, idx) {
          var cardEl = document.createElement('div');
          var isShort = card.category && card.category.toLowerCase().indexOf('short') !== -1;
          cardEl.className = 'pb4-card';
          cardEl.style.height = isShort ? '380px' : '230px';
          cardEl.style.background = '#000';
          cardEl.style.borderRadius = '12px';
          cardEl.style.border = '1px solid rgba(255, 255, 255, 0.12)';
          cardEl.style.boxShadow = 'none';

          if (card.video) {
            var embedUrl = toEmbedUrl(card.video, false);
            cardEl.innerHTML = '<iframe src="' + embedUrl + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:none;border-radius:12px;display:block;"></iframe>';
          } else {
            var bgStyle = card.img ? 'style="background-image:url(\'' + card.img + '\');background-size:cover;background-position:center;"' : '';
            cardEl.innerHTML =
              '<div class="pb4-th" ' + bgStyle + '></div>' +
              (card.title ? '<div style="position:absolute;bottom:12px;left:12px;right:12px;background:rgba(0,0,0,0.7);padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;color:#fff;pointer-events:none;">' + escapeHtml(card.title) + '</div>' : '');
          }

          if (idx < 3) row1.appendChild(cardEl);
          else row2.appendChild(cardEl);
        });

        pGrid.appendChild(row1);
        if (row2.children.length > 0) pGrid.appendChild(row2);
      }

      // Ensure portTabs is Longform, Shortform
      data.portTabs = "Longform, Shortform";

      var defaultTabCategory = 'Longform';
      var tabsWrap = document.querySelector('.pb4-tabs');
      if (tabsWrap) {
        var tabList = data.portTabs.split(',');
        tabsWrap.innerHTML = '';
        tabList.forEach(function (tName, tIdx) {
          var tElem = document.createElement('p');
          var cleanCat = tName.trim();
          if (tIdx === 0) defaultTabCategory = cleanCat;
          tElem.className = 'pb4-tab' + (tIdx === 0 ? ' pb4-tabon' : '');
          tElem.textContent = cleanCat;
          tElem.style.cursor = 'pointer';
          tabsWrap.appendChild(tElem);
        });
      }

      // Delegated tab click handler
      document.addEventListener('click', function (e) {
        var tab = e.target.closest('.pb4-tab');
        if (tab && tab.closest('.pb4-tabs')) {
          if (e && e.preventDefault) e.preventDefault();
          var allTabs = document.querySelectorAll('.pb4-tab');
          allTabs.forEach(function (tb) { tb.classList.remove('pb4-tabon'); });
          tab.classList.add('pb4-tabon');
          var category = tab.textContent.trim();
          renderPortfolioGrid(category);
        }
      });

      if (data.portfolioCards && Array.isArray(data.portfolioCards) && data.portfolioCards.length > 0) {
        renderPortfolioGrid(defaultTabCategory);
      }

      // Feature Info Cards
      for (var f = 1; f <= 4; f++) {
        var fTitle = data['feat' + f + 'Title'];
        var fDesc = data['feat' + f + 'Desc'];
        var ib = document.querySelector('.pb4-icons .pb4-ib:nth-child(' + f + ')');
        if (ib) {
          if (fTitle) {
            var ibh = ib.querySelector('.pb4-ibh');
            if (ibh) ibh.innerHTML = '<span class="pb4-hw"></span>' + escapeHtml(fTitle);
          }
          if (fDesc) setText('.pb4-icons .pb4-ib:nth-child(' + f + ') .pb4-ibd', fDesc);
        }
      }

      // --- 6. Bento Section ---
      if (data.bentoTitle) setHtml('.pb6-h', data.bentoTitle.replace(/\n/g, '<br/>'));
      if (data.bentoSub) setText('.pb6-sub', data.bentoSub);
      if (data.bento1Quote) setText('.pb6-quote', data.bento1Quote);
      if (data.bento1Stat) setText('.pb6-stb', data.bento1Stat);
      if (data.bento1StatSub) setText('.pb6-sts', data.bento1StatSub);
      if (data.bento1Video) {
        var b1Play = document.querySelector('.pb6-vth');
        if (b1Play) {
          b1Play.style.cursor = 'pointer';
          b1Play.onclick = function () { openVideoModal(data.bento1Video); };
        }
      }

      if (data.bento2Chip) setText('.pb6-chip', data.bento2Chip);
      if (data.bento2Title) setText('.pb6-c2t', data.bento2Title);
      if (data.bento2Img) setBg('.pb6-c2 .pb6-collage', data.bento2Img);

      if (data.bento3Num) setText('.pb6-c3num', data.bento3Num);
      if (data.bento3Sub) setText('.pb6-c3sub', data.bento3Sub);
      if (data.bento3BtnText) setText('.pb6-c3lbl', data.bento3BtnText);

      if (data.bentoSlots1) setText('.pb6-sl1', data.bentoSlots1);
      if (data.bentoSlots2) setText('.pb6-sl2', data.bentoSlots2);

      // --- 7. Testimonials Marquee ---
      if (data.revTitle) setHtml('.pb5-h', data.revTitle.replace(/\n/g, '<br/>'));
      if (data.revSub) setText('.pb5-sub', data.revSub);

      if (data.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
        var tTrack = document.querySelector('.pb5-track');
        if (tTrack) {
          tTrack.innerHTML = '';
          data.testimonials.forEach(function (t, idx) {
            var card = document.createElement('div');
            card.className = 'pb5-card';

            var avatarStyle = t.avatar ? 'style="background-image:url(\'' + t.avatar + '\');background-size:cover;"' : '';
            card.innerHTML =
              '<div class="pb5-p pb5-p' + ((idx % 4) + 1) + '" ' + avatarStyle + '></div><div class="pb5-grad"></div>' +
              '<div class="pb5-ct"><p class="pb5-q">' + escapeHtml(t.quote) + '</p><p class="pb5-nm">' + escapeHtml(t.name) + '</p><p class="pb5-hd">' + escapeHtml(t.handle) + '</p></div>' +
              '<div class="pb5-pl"><span class="pb5-plbg"></span></div>';

            if (t.video) {
              card.style.cursor = 'pointer';
              card.onclick = function () { openVideoModal(t.video); };
            }
            tTrack.appendChild(card);
          });
        }
      }

      // --- 8. Process & Proof ---
      if (data.procTitle) setText('.pb8-h', data.procTitle);
      if (data.procSub) setText('.pb8-sub', data.procSub);

      for (var p = 1; p <= 4; p++) {
        var pill = data['proc' + p + 'Pill'];
        var pTitle = data['proc' + p + 'Title'];
        var sElem = document.querySelector('.pb8-s' + p);
        if (sElem) {
          if (pill) {
            var pillSpan = sElem.querySelector('.pb8-pill');
            if (pillSpan) pillSpan.innerHTML = '<span class="pb8-pic"></span>' + escapeHtml(pill);
          }
          if (pTitle) setText('.pb8-s' + p + ' .pb8-t', pTitle);
        }
      }

      if (data.procBarTxt) setText('.pb8-btx', data.procBarTxt);
      if (data.procBarUrl) setAttr('.pb8-bar', 'href', data.procBarUrl);

      if (data.proofNum) {
        var proofH1 = document.querySelector('.pb7-row h2:first-child');
        if (proofH1) proofH1.textContent = data.proofNum;
      }
      if (data.proofKeycap) setText('.pb7-key-3d', data.proofKeycap);
      if (data.proofLabel) {
        var proofH2 = document.querySelector('.pb7-row h2:last-child');
        if (proofH2) proofH2.textContent = data.proofLabel;
      }
      if (data.proofImg) setAttr('.pb7-right3', 'src', data.proofImg);

      // --- 9. Pricing Section ---
      if (data.priceSecTitle) setText('.pb9-h', data.priceSecTitle);
      if (data.priceSecSub) setText('.pb9-sub', data.priceSecSub);

      // Pricing Card 1
      var p1Card = document.querySelector('.pb9-cards .pb9-card:nth-child(1)');
      if (p1Card) {
        if (data.p1Name) setText('.pb9-cards .pb9-card:nth-child(1) .pb9-plan', data.p1Name);
        if (data.p1Chosen) setText('.pb9-cards .pb9-card:nth-child(1) .pb9-chtx', data.p1Chosen);
        if (data.p1Price) setText('.pb9-cards .pb9-card:nth-child(1) .pb9-amt', data.p1Price);
        if (data.p1Slots) setText('.pb9-cards .pb9-card:nth-child(1) .pb9-slott', data.p1Slots);
        if (data.p1Tagline) setText('.pb9-cards .pb9-card:nth-child(1) .pb9-tagline', data.p1Tagline);
        if (data.p1BtnText) setText('.pb9-cards .pb9-card:nth-child(1) .pb9-btntx', data.p1BtnText);

        if (data.p1Features) {
          var fWrap1 = p1Card.querySelector('div:last-child');
          if (fWrap1) {
            var items1 = data.p1Features.split('\n');
            var fHtml1 = '<p class="pb9-lbl">Package Includes</p>';
            items1.forEach(function (line) {
              if (line.trim()) fHtml1 += '<div class="pb9-item"><span class="pb9-chk"></span><p class="pb9-itx">' + escapeHtml(line.trim()) + '</p></div>';
            });
            fWrap1.innerHTML = fHtml1;
          }
        }
      }

      // Pricing Card 2
      var p2Card = document.querySelector('.pb9-cards .pb9-card:nth-child(2)');
      if (p2Card) {
        if (data.p2Name) setText('.pb9-cards .pb9-card:nth-child(2) .pb9-plan', data.p2Name);
        if (data.p2Chosen) setText('.pb9-cards .pb9-card:nth-child(2) .pb9-chtx', data.p2Chosen);
        if (data.p2Price) setText('.pb9-cards .pb9-card:nth-child(2) .pb9-amt', data.p2Price);
        if (data.p2Slots) setText('.pb9-cards .pb9-card:nth-child(2) .pb9-slott', data.p2Slots);
        if (data.p2Tagline) setText('.pb9-cards .pb9-card:nth-child(2) .pb9-tagline', data.p2Tagline);
        if (data.p2BtnText) setText('.pb9-cards .pb9-card:nth-child(2) .pb9-btntxb', data.p2BtnText);

        if (data.p2Features) {
          var fWrap2 = p2Card.querySelector('div:last-child');
          if (fWrap2) {
            var items2 = data.p2Features.split('\n');
            var fHtml2 = '<p class="pb9-lbl">Package Includes</p>';
            items2.forEach(function (line) {
              if (line.trim()) fHtml2 += '<div class="pb9-item"><span class="pb9-chk"></span><p class="pb9-itx">' + escapeHtml(line.trim()) + '</p></div>';
            });
            fWrap2.innerHTML = fHtml2;
          }
        }
      }

      if (data.priceTestiName) setText('.pb9-tname', data.priceTestiName);
      if (data.priceTestiRole) setText('.pb9-trole', data.priceTestiRole);
      if (data.priceTestiQuote) setHtml('.pb9-tqt', '“' + escapeHtml(data.priceTestiQuote) + '”');
      if (data.priceTestiBadge) setText('.pb9-cast', data.priceTestiBadge);

      // --- 10. FAQs Section ---
      if (data.faqSecTitle) setText('.pb10-h', data.faqSecTitle);
      if (data.faqBtnText) setText('.pb10-cta', data.faqBtnText);
      if (data.faqBtnUrl) setAttr('.pb10-cta', 'href', data.faqBtnUrl);
      if (data.faqEmail) {
        var emailLink = document.querySelector('.pb10-notel');
        if (emailLink) {
          emailLink.href = 'mailto:' + data.faqEmail;
        }
      }

      if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
        var faqList = document.querySelector('.pb10-list');
        if (faqList) {
          faqList.innerHTML = '';
          data.faqs.forEach(function (faq, idx) {
            var num = (idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1);
            var item = document.createElement('div');
            item.className = 'pb10-faq';
            item.innerHTML =
              '<div class="pb10-q"><p class="pb10-no">[ ' + num + ' ]</p><p class="pb10-qt">' + escapeHtml(faq.q) + '</p><p class="pb10-chev">⌄</p></div>' +
              '<div class="pb10-a">' + escapeHtml(faq.a) + '</div>';
            faqList.appendChild(item);
          });

          // Accordion handlers
          faqList.querySelectorAll('.pb10-q').forEach(function (q) {
            q.addEventListener('click', function () {
              q.parentElement.classList.toggle('pb10-open');
            });
          });
        }
      }

      // --- 11. Footer & General ---
      if (data.email) {
        setText('.pb11-mail', data.email);
        var mails = document.querySelectorAll('a[href^="mailto:"]');
        mails.forEach(function (m) { m.href = 'mailto:' + data.email; });
      }
      if (data.footerTitle) setText('.pb11-ready', data.footerTitle);
      if (data.copyright) setText('.pb11-bl', data.copyright);

    } catch (e) {
      console.warn('Error parsing CMS data in main.js:', e);
    }
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // Apply CMS Data initially
  applyCMSData();

  // Listen for real-time changes across tabs & window focus
  window.addEventListener('storage', function (e) {
    if (e.key === 'kinetic_cms_data') {
      applyCMSData();
    }
  });

  window.addEventListener('focus', function () {
    applyCMSData();
  });
});
