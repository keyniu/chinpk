// CHINPK Packaging - Main Script (Astro)
document.addEventListener('DOMContentLoaded', () => {

  // --- Skip Link ---
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.prepend(skipLink);
  const mainEl = document.querySelector('main');
  if (mainEl && !mainEl.id) mainEl.id = 'main-content';

  // --- Mobile Menu ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    const icon = menuBtn.querySelector('i');
    if (icon) { icon.classList.toggle('fa-bars'); icon.classList.toggle('fa-times'); }
  });
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const icon = menuBtn?.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
    });
  });

  // --- Navbar Scroll ---
  const navBar = document.querySelector('.nav-bar');
  window.addEventListener('scroll', () => {
    navBar?.classList.toggle('scrolled', window.pageYOffset > 10);
  }, { passive: true });

  // --- Cookie Consent ---
  if (!document.getElementById('cookie-consent') && !localStorage.getItem('cookie_consent')) {
    document.body.insertAdjacentHTML('beforeend', `<div id="cookie-consent" class="cookie-consent show" role="dialog" aria-label="Cookie consent">
      <div class="container">
        <p>We use cookies to improve your browsing experience. By continuing to use our site, you accept our <a href="/privacy">privacy policy</a>.</p>
        <div class="cookie-btns">
          <button id="cookie-decline" type="button" class="btn-decline">Decline</button>
          <button id="cookie-accept" type="button" class="btn-accept">Accept All</button>
        </div>
      </div>
    </div>`);
  }
  const cookieBanner = document.getElementById('cookie-consent');
  if (cookieBanner && !localStorage.getItem('cookie_consent')) {
    const accept = document.getElementById('cookie-accept');
    const decline = document.getElementById('cookie-decline');
    accept?.addEventListener('click', () => { localStorage.setItem('cookie_consent', 'accepted'); cookieBanner.classList.remove('show'); setTimeout(() => cookieBanner.remove(), 500); });
    decline?.addEventListener('click', () => { localStorage.setItem('cookie_consent', 'declined'); cookieBanner.classList.remove('show'); setTimeout(() => cookieBanner.remove(), 500); });
  }

  // --- WhatsApp Float ---
  if (!document.querySelector('.whatsapp-float')) {
    document.body.insertAdjacentHTML('beforeend', `<a href="https://wa.me/8615939482575" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">
      <i class="fab fa-whatsapp"></i><span class="tooltip">Chat on WhatsApp</span></a>`);
  }

  // --- Scroll Top ---
  if (!document.getElementById('scroll-top')) {
    document.body.insertAdjacentHTML('beforeend', `<button id="scroll-top" type="button" class="scroll-top" aria-label="Scroll to top"><i class="fas fa-arrow-up"></i></button>`);
  }
  const scrollBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => scrollBtn?.classList.toggle('visible', window.pageYOffset > 300), { passive: true });
  scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- Active Nav ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath.startsWith('/products') && href === '/products')) {
      link.classList.add('active');
    }
  });

  // --- Toast ---
  window.showToast = (message, type) => {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 4000);
  };

  // --- Search ---
  let searchData = null;
  const searchBar = document.getElementById('search-bar');
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchResults = document.getElementById('search-results');

  async function loadSearchData() {
    if (searchData) return searchData;
    if (window.PRODUCTS) { searchData = window.PRODUCTS; return searchData; }
    try {
      const resp = await fetch('/api/products.json');
      if (resp.ok) { searchData = await resp.json(); }
    } catch {}
    return searchData || [];
  }

  function getSearchScore(p, query) {
    const name = p.name.toLowerCase();
    const desc = (p.shortDesc || '').toLowerCase();
    const cat = (p.categoryLabel || '').toLowerCase();
    const apps = (p.applications || []).join(' ').toLowerCase();
    let specs = '';
    if (p.specs) { for (const sk in p.specs) specs += ' ' + (p.specs[sk] || '').toLowerCase(); }
    const full = name + ' ' + desc + ' ' + cat + ' ' + apps + ' ' + specs;
    if (!full.includes(query)) return 0;
    let score = 1;
    if (name.includes(query)) score += 10;
    if (name.startsWith(query)) score += 20;
    for (const w of name.split(' ')) { if (w === query) { score += 15; break; } }
    if (cat.includes(query)) score += 5;
    if (desc.includes(query)) score += 3;
    if (apps.includes(query)) score += 2;
    return score;
  }

  function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  async function doSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) { searchResults.innerHTML = ''; searchResults.className = 'search-results'; return; }
    const products = await loadSearchData();
    const scored = products.map(p => ({ product: p, score: getSearchScore(p, query) })).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    if (!scored.length) {
      searchResults.className = 'search-results empty';
      searchResults.innerHTML = `<p style="padding:2rem;text-align:center;color:#6b7280">No products found for "<strong>${escapeHtml(query)}</strong>"</p>`;
      return;
    }
    searchResults.className = 'search-results';
    let html = `<div class="search-results-count">${scored.length} product${scored.length !== 1 ? 's' : ''} found</div>`;
    for (const s of scored) {
      const p = s.product;
      const imgSrc = p.image || '';
      html += `<a href="/product-detail?id=${p.id}" class="search-result-item">
        ${imgSrc ? `<img src="${imgSrc}" alt="${p.name}" loading="lazy" width="56" height="56" onerror="this.style.display='none';this.parentElement.classList.add('no-image')">` : ''}
        <div class="info"><h4>${p.name}</h4><p>${p.categoryLabel || ''}</p></div></a>`;
    }
    searchResults.innerHTML = html;
  }

  searchBtn?.addEventListener('click', () => {
    searchBar?.classList.toggle('open');
    if (searchBar?.classList.contains('open')) { loadSearchData(); setTimeout(() => searchInput?.focus(), 200); }
  });
  searchClose?.addEventListener('click', () => { searchBar?.classList.remove('open'); if (searchInput) searchInput.value = ''; searchResults.innerHTML = ''; searchResults.className = 'search-results'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && searchBar?.classList.contains('open')) { searchBar.classList.remove('open'); if (searchInput) searchInput.value = ''; searchResults.innerHTML = ''; searchResults.className = 'search-results'; } });
  document.addEventListener('click', e => { if (searchBar?.classList.contains('open') && !searchBar.contains(e.target) && !searchBtn?.contains(e.target)) { searchBar.classList.remove('open'); if (searchInput) searchInput.value = ''; searchResults.innerHTML = ''; searchResults.className = 'search-results'; } });
  let searchTimer;
  searchInput?.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(doSearch, 200); });

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const urlProduct = new URLSearchParams(window.location.search).get('product');
    if (urlProduct) {
      const productSelect = document.getElementById('product');
      if (productSelect) {
        for (const opt of productSelect.options) { if (opt.value === urlProduct) { productSelect.value = urlProduct; break; } }
      }
      const inquirySummary = document.getElementById('inquiry-summary');
      const inquiryName = document.getElementById('inquiry-product-name');
      if (inquirySummary && inquiryName) {
        const names = { cans: 'PET Plastic Cans', jars: 'Plastic Jars', bottles: 'Plastic Bottles', custom: 'Custom Packaging' };
        inquiryName.textContent = names[urlProduct] || urlProduct;
        inquirySummary.classList.remove('hidden');
      }
    }
    window.clearInquiry = () => {
      document.getElementById('inquiry-summary')?.classList.add('hidden');
      const sel = document.getElementById('product'); if (sel) sel.value = '';
    };

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      const name = document.getElementById('name'); const email = document.getElementById('email'); const message = document.getElementById('message');
      contactForm.querySelectorAll('.form-error').forEach(el => { el.style.display = 'none'; });
      contactForm.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));

      const showError = (input, msg) => {
        if (!input) return;
        input.classList.add('error');
        const err = input.parentElement?.querySelector('.form-error');
        if (err) { err.textContent = msg; err.style.display = 'block'; }
      };

      if (!name?.value.trim()) { showError(name, 'Please enter your name'); valid = false; }
      if (!email?.value.trim()) { showError(email, 'Please enter your email'); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Please enter a valid email'); valid = false; }
      if (!message?.value.trim()) { showError(message, 'Please describe your requirements'); valid = false; }

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        const formData = {
          name: name.value.trim(),
          company: document.getElementById('company')?.value.trim() || '',
          email: email.value.trim(),
          phone: document.getElementById('phone')?.value.trim() || '',
          product: document.getElementById('product')?.value || '',
          quantity: document.getElementById('quantity')?.value || '',
          message: message.value.trim()
        };
        fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
          .catch(() => {})
          .finally(() => {
            showToast('Thank you! Our sales team will contact you within 24 hours.', 'success');
            contactForm.reset();
            document.getElementById('inquiry-summary')?.classList.add('hidden');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Inquiry';
          });
      }
    });
  }

  // --- Sample Form ---
  const sampleForm = document.getElementById('sample-form');
  sampleForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = sampleForm.querySelector('.btn-sample-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;
    setTimeout(() => { showToast('Sample request submitted! Our team will contact you within 24 hours.'); sampleForm.reset(); btn.innerHTML = 'Request Free Sample <i class="fas fa-arrow-right"></i>'; btn.disabled = false; }, 1000);
  });

  // --- Newsletter ---
  const newsletterForm = document.getElementById('news-newsletter-form');
  newsletterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn = newsletterForm.querySelector('button');
    if (!input?.value.trim()) return;
    btn.textContent = 'Subscribing...';
    btn.disabled = true;
    setTimeout(() => { showToast('Thank you for subscribing!'); input.value = ''; btn.textContent = 'Subscribe'; btn.disabled = false; }, 800);
  });

  // --- Download Catalog ---
  document.getElementById('btn-download-catalog')?.addEventListener('click', e => { e.preventDefault(); showToast('Catalog download will be available soon. Contact us for details.'); });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));
  } else { revealElements.forEach(el => el.classList.add('revealed')); }

  // --- Hero Carousel ---
  const heroCarousel = document.querySelector('.hero-carousel');
  if (heroCarousel) {
    const slides = heroCarousel.querySelectorAll('.slide');
    let current = 0;
    if (slides.length > 1) setInterval(() => { slides[current].classList.remove('active'); current = (current + 1) % slides.length; slides[current].classList.add('active'); }, 5000);
  }

  // --- Product Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn, .sidebar-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  if (tabBtns.length) {
    const switchTab = (hash) => {
      if (!hash || !hash.startsWith('#')) return false;
      let tabId = hash.replace('#', '');
      if (!tabId.startsWith('tab-')) tabId = 'tab-' + tabId;
      const target = document.querySelector(`[data-tab="${tabId}"]`);
      if (target && !target.classList.contains('active')) { target.click(); return true; }
      return false;
    };
    if (switchTab(window.location.hash)) {
      setTimeout(() => document.querySelector('.product-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    window.addEventListener('hashchange', () => switchTab(window.location.hash));
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        tabContents.forEach(c => c.id === target ? c.classList.add('active') : c.classList.remove('active'));
        document.getElementById(target)?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('revealed');
        });
      });
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    const item = btn.parentElement;
    const answer = item?.querySelector('.faq-answer');
    btn.setAttribute('aria-expanded', 'false');
    answer?.setAttribute('role', 'region');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement?.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) { openItem.classList.remove('open'); openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false'); }
      });
      if (isOpen) { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
      else { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  // --- Animated Counters ---
  let countersAnimated = false;
  const counterElements = document.querySelectorAll('.stat-number, .counter-number');
  if (counterElements.length && 'IntersectionObserver' in window) {
    const section = counterElements[0].closest('section') || counterElements[0].parentElement;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersAnimated) { countersAnimated = true; animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(section);
  }
  function animateCounters() {
    counterElements.forEach(el => {
      const text = el.textContent.trim();
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;
      const suffix = text.replace(/[0-9.]/g, '');
      const duration = 1500;
      let start;
      function step(ts) { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); const cur = num >= 100 ? Math.round(p * num) : Math.floor(p * num); el.textContent = cur + suffix; if (p < 1) requestAnimationFrame(step); else el.textContent = text; }
      requestAnimationFrame(step);
    });
  }

  // --- Image Fallback ---
  document.addEventListener('error', e => {
    const el = e.target;
    if (el.tagName !== 'IMG' || el.dataset.fbApplied) return;
    el.dataset.fbApplied = '1';
    const label = el.dataset.fallback || 'Image unavailable';
    el.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="#f0f7f3" width="600" height="400"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#166534" font-family="sans-serif" font-size="20">${label}</text></svg>`)}`;
    el.alt = label;
  }, true);
});
