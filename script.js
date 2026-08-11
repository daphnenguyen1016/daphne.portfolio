/* ==========================================================================
   Daphne Nguyen — portfolio interactions
   No build step needed. Everything here is plain vanilla JS.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ruler doesn't depend on page content, so it can start immediately.
  initRuler(prefersReducedMotion);

  // Content comes from content/profile.json and content/projects.json —
  // both editable through /admin without touching any code. Cursor init
  // waits too, since it binds hover effects to links/cards that don't
  // exist until the content above is rendered.
  await Promise.all([loadProfile(), loadProjects()]);

  initMediaEmbeds();
  initProjectFilter();
  initReveal(prefersReducedMotion);
  initCursor(prefersReducedMotion);
});

/* --------------------------------------------------------------------------
   0) CONTENT LOADING — fetches the two JSON files the /admin panel edits,
   and renders them into the page. If you're previewing by double-clicking
   index.html, this will fail silently (browsers block local file fetches)
   — run a local server or preview on the deployed site instead. See
   README.md.
   -------------------------------------------------------------------------- */
async function loadProfile() {
  try {
    const res = await fetch('content/profile.json', { cache: 'no-store' });
    const data = await res.json();
    renderProfile(data);
  } catch (err) {
    console.warn('Could not load profile.json — is this running on a local server?', err);
  }
}

function renderProfile(p) {
  // Name — either a handwritten wordmark in the chosen font, or an
  // uploaded logo image if one was set in /admin.
  const identity = document.getElementById('identity');
  if (identity) {
    const existingName = identity.querySelector('.identity__name, .identity__logo');
    if (existingName) existingName.remove();

    let nameEl;
    if (p.logo_image) {
      nameEl = document.createElement('img');
      nameEl.className = 'identity__logo';
      nameEl.src = p.logo_image;
      nameEl.alt = p.name || '';
    } else {
      nameEl = document.createElement('h1');
      nameEl.className = 'identity__name';
      nameEl.textContent = p.name || '';
      nameEl.style.fontFamily = p.name_font === 'Inter'
        ? 'var(--font-body)'
        : `"${p.name_font || 'Homemade Apple'}", cursive`;
    }
    identity.insertBefore(nameEl, identity.firstChild);
  }

  const role = document.getElementById('identityRole');
  if (role) role.textContent = p.role || '';

  const bio = document.getElementById('bio');
  if (bio) {
    bio.innerHTML = '';
    [p.bio_1, p.bio_2].filter(Boolean).forEach((text) => {
      const para = document.createElement('p');
      para.textContent = text;
      bio.appendChild(para);
    });
  }

  const specs = document.getElementById('specs');
  if (specs) {
    specs.innerHTML = '';
    (p.specs || []).forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'specs__row';
      rowEl.innerHTML = `
        <dt class="specs__tag"></dt>
        <dd class="specs__value"></dd>`;
      rowEl.querySelector('.specs__tag').textContent = row.tag || '';
      rowEl.querySelector('.specs__value').textContent = row.value || '';
      specs.appendChild(rowEl);
    });
  }

  const contact = document.getElementById('contact');
  if (contact) {
    contact.innerHTML = '';
    if (p.email) {
      const a = document.createElement('a');
      a.className = 'contact__link';
      a.href = `mailto:${p.email}`;
      a.textContent = p.email;
      contact.appendChild(a);
    }
    if (p.phone) {
      const a = document.createElement('a');
      a.className = 'contact__link';
      a.href = `tel:${p.phone.replace(/[^\d+]/g, '')}`;
      a.textContent = p.phone;
      contact.appendChild(a);
    }
    if (p.location) {
      const span = document.createElement('span');
      span.className = 'contact__note';
      span.textContent = p.location;
      contact.appendChild(span);
    }
  }
}

async function loadProjects() {
  const list = document.getElementById('projectList');
  if (!list) return;
  try {
    const res = await fetch('content/projects.json', { cache: 'no-store' });
    const data = await res.json();
    renderProjects(data.items || [], list);
  } catch (err) {
    console.warn('Could not load projects.json — is this running on a local server?', err);
    list.innerHTML = '<p style="color:var(--color-gray);font-family:var(--font-mono);font-size:0.8rem;">Could not load projects. If you\'re previewing this file locally, run a local server instead of opening index.html directly — see README.md.</p>';
  }
}

function renderProjects(items, list) {
  list.innerHTML = '';
  items.forEach((item, i) => {
    const section = document.createElement('section');
    section.className = 'project';
    section.dataset.category = item.category || '';
    section.setAttribute('data-reveal', '');

    const index = String(i + 1).padStart(2, '0');
    const mediaSrc = item.platform === 'image' ? (item.image || '') : (item.video_src || '');

    section.innerHTML = `
      <div class="project__head">
        <span class="project__index">[${index}]</span>
        <h2 class="project__title"></h2>
        <span class="project__meta"></span>
      </div>
      <p class="project__desc"></p>
      <div class="project__media" data-platform="${item.platform || 'image'}" data-format="${item.format || 'horizontal'}" data-src="${mediaSrc}"></div>
    `;
    section.querySelector('.project__title').textContent = item.title || '';
    section.querySelector('.project__meta').textContent = [item.type_label, item.year].filter(Boolean).join(' · ');
    section.querySelector('.project__desc').textContent = item.description || '';

    list.appendChild(section);
  });
}

/* --------------------------------------------------------------------------
   1) RULER — a fixed column of even, equal-sized tick marks. The only
   moving piece is the marker, which travels top→bottom in proportion to
   how far the whole page has been scrolled.
   -------------------------------------------------------------------------- */
function initRuler(reduced) {
  const ruler = document.getElementById('ruler');
  const track = document.getElementById('rulerTrack');
  const counter = document.getElementById('rulerCounter');
  const marker = document.getElementById('rulerProgress');
  if (!track || !marker) return;

  const SPACING = 22; // px between ticks — all ticks are identical now

  function buildTicks() {
    track.innerHTML = '';
    const count = Math.ceil(window.innerHeight / SPACING) + 1;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const t = document.createElement('div');
      t.className = 'tick';
      t.style.top = (i * SPACING) + 'px';
      frag.appendChild(t);
    }
    track.appendChild(frag);
  }

  buildTicks();
  window.addEventListener('resize', debounce(buildTicks, 200));

  let targetY = 0;
  let currentY = 0;

  function travelRange() {
    return ruler.clientHeight - marker.offsetHeight;
  }

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function onScroll() {
    const p = scrollProgress();
    targetY = p * travelRange();
    if (counter) counter.textContent = String(Math.round(p * 100)).padStart(2, '0');
  }

  function frame() {
    // Low factor = a clearly visible, soft trailing motion rather than an
    // instant snap. This is the main lever if you want it to feel slower
    // or snappier — try 0.02 for even more drift, 0.07 for tighter.
    const factor = reduced ? 1 : 0.035;
    currentY += (targetY - currentY) * factor;
    marker.style.transform = `translateY(${currentY}px)`;
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  frame();
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* --------------------------------------------------------------------------
   2) CUSTOM CURSOR — dot and ring both trail behind the real cursor with a
   soft, visible lag (low lerp factor = more drift). Only enabled on
   devices with a fine pointer (mouse/trackpad).
   -------------------------------------------------------------------------- */
function initCursor(reduced) {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer || reduced) return;

  document.body.classList.add('cursor-active');

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    // Dot trails a little less than the ring, so it still feels "closer"
    // to the real pointer while the ring drifts more visibly behind it.
    dotX += (mouseX - dotX) * 0.18;
    dotY += (mouseY - dotY) * 0.18;
    ringX += (mouseX - ringX) * 0.07;
    ringY += (mouseY - ringY) * 0.07;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  }
  render();

  // Slight ring growth on hoverable elements for a bit of tactile feedback
  document.querySelectorAll('a, .project').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '44px';
      ring.style.height = '44px';
      ring.style.opacity = '0.85';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '30px';
      ring.style.height = '30px';
      ring.style.opacity = '0.5';
    });
  });
}

/* --------------------------------------------------------------------------
   3) SCROLL REVEAL — fade + slide up as elements enter the viewport.
   -------------------------------------------------------------------------- */
function initReveal(reduced) {
  const targets = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4) PROJECT MEDIA — reads data-platform / data-src / data-format off each
   .project__media element and renders the right thing:
   - platform="tiktok" or "facebook" → embeds the real video (vertical reel)
   - platform="image"                → shows a static image (presentation /
                                        graphic design key visual, horizontal)
   Leave data-src empty to show a friendly placeholder instead.

   HOW TO FILL IN REAL CONTENT:
   - TikTok:   data-src = just the numeric video ID from the share URL
               e.g. https://www.tiktok.com/@user/video/7261234567890123456
                                                    ^^^^^^^^^^^^^^^^^^^ this part
   - Facebook: data-src = the full video URL
               e.g. https://www.facebook.com/yourpage/videos/1234567890
   - Image:    data-src = a path to your image, e.g. "images/topzone-01.jpg"
   -------------------------------------------------------------------------- */
function initMediaEmbeds() {
  document.querySelectorAll('.project__media').forEach((el) => {
    const platform = el.dataset.platform;
    const src = (el.dataset.src || '').trim();

    if (!src) {
      const isImage = platform === 'image';
      el.innerHTML = `
        <div class="media-placeholder">
          <span class="media-placeholder__icon">${isImage ? '▢' : '▶'}</span>
          <span>${isImage
            ? 'Add your image path<br>in data-src'
            : `Add your ${platform === 'tiktok' ? 'TikTok' : 'Facebook'} video link<br>in data-src`}</span>
        </div>`;
      return;
    }

    if (platform === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = el.dataset.alt || '';
      img.loading = 'lazy';
      el.appendChild(img);
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;

    if (platform === 'tiktok') {
      iframe.src = `https://www.tiktok.com/embed/v2/${src}`;
    } else if (platform === 'facebook') {
      iframe.src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(src)}&show_text=0`;
    }

    el.appendChild(iframe);
  });
}

/* --------------------------------------------------------------------------
   5) CATEGORY FILTER — Banner / Reels / Presentation / Branding.
   Clicking a label shows only projects whose data-category matches.
   To add a category: add a <button data-category="..."> in the nav and
   set the same value on each matching <section class="project">.
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const nav = document.getElementById('projectFilter');
  if (!nav) return;

  const buttons = Array.from(nav.querySelectorAll('[data-category]'));
  const projects = Array.from(document.querySelectorAll('.project'));

  function applyFilter(category) {
    projects.forEach((p) => {
      p.style.display = (p.dataset.category === category) ? '' : 'none';
    });
    buttons.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.category === category);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.category));
  });

  const initial = nav.querySelector('.is-active')?.dataset.category || buttons[0]?.dataset.category;
  if (initial) applyFilter(initial);
}
