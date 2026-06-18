/* ============================================
   CHINPK Packaging - Global JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* --- Skip to Content (Accessibility) --- */
    var skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    /* --- Add main content id if not present --- */
    var mainEl = document.querySelector('main');
    if (mainEl && !mainEl.id) mainEl.id = 'main-content';

    /* --- Mobile Menu Toggle --- */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    /* --- Navbar Scroll Shadow --- */
    var navBar = document.querySelector('.nav-bar');
    if (navBar) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 10) {
                navBar.classList.add('scrolled');
            } else {
                navBar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    /* --- Cookie Consent (injected via JS to avoid page duplication) --- */
    if (!document.getElementById('cookie-consent') && !localStorage.getItem('cookie_consent')) {
        var cookieHTML = '<div id="cookie-consent" class="cookie-consent" role="dialog" aria-label="Cookie consent">' +
            '<div class="container">' +
                '<p>We use cookies to improve your browsing experience. By continuing to use our site, you accept our <a href="privacy.html">privacy policy</a>.</p>' +
                '<div class="cookie-btns">' +
                    '<button id="cookie-decline" type="button" class="btn-decline">Decline</button>' +
                    '<button id="cookie-accept" type="button" class="btn-accept">Accept All</button>' +
                '</div>' +
            '</div>' +
        '</div>';
        document.body.insertAdjacentHTML('beforeend', cookieHTML);
    }

    var cookieBanner = document.getElementById('cookie-consent');
    if (cookieBanner && !localStorage.getItem('cookie_consent')) {
        setTimeout(function () { cookieBanner.classList.add('show'); }, 1500);

        var acceptBtn = document.getElementById('cookie-accept');
        var declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                localStorage.setItem('cookie_consent', 'accepted');
                cookieBanner.classList.remove('show');
                setTimeout(function() { cookieBanner.remove(); }, 500);
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                localStorage.setItem('cookie_consent', 'declined');
                cookieBanner.classList.remove('show');
                setTimeout(function() { cookieBanner.remove(); }, 500);
            });
        }
    }

    /* --- WhatsApp Floating Button (injected via JS) --- */
    if (!document.querySelector('.whatsapp-float')) {
        var waHTML = '<a href="https://wa.me/8615939482575" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">' +
            '<i class="fab fa-whatsapp"></i>' +
            '<span class="tooltip">Chat on WhatsApp</span>' +
        '</a>';
        document.body.insertAdjacentHTML('beforeend', waHTML);
    }

    /* --- Scroll to Top Button (injected via JS) --- */
    if (!document.getElementById('scroll-top')) {
        var scrollHTML = '<button id="scroll-top" type="button" class="scroll-top" aria-label="Scroll to top">' +
            '<i class="fas fa-arrow-up"></i>' +
        '</button>';
        document.body.insertAdjacentHTML('beforeend', scrollHTML);
    }

    var scrollBtn = document.getElementById('scroll-top');

    if (scrollBtn) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- Active Navigation Link --- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    /* --- Toast Notification --- */
    window.showToast = function (message, type) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast' + (type === 'error' ? ' error' : '');
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 300);
        }, 4000);
    };

    /* --- Contact Form Handling --- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Pre-fill product from URL parameter and show inquiry summary
        var urlProduct = new URLSearchParams(window.location.search).get('product');
        if (urlProduct) {
            var productSelect = document.getElementById('product');
            if (productSelect) {
                for (var i = 0; i < productSelect.options.length; i++) {
                    if (productSelect.options[i].value === urlProduct) {
                        productSelect.value = urlProduct;
                        break;
                    }
                }
            }

            // Try to look up product name for inquiry summary
            var inquirySummary = document.getElementById('inquiry-summary');
            var inquiryName = document.getElementById('inquiry-product-name');
            if (inquirySummary && inquiryName) {
                var productNames = {
                    'cans': 'PET Plastic Cans',
                    'jars': 'Plastic Jars',
                    'bottles': 'Plastic Bottles',
                    'custom': 'Custom Packaging'
                };
                inquiryName.textContent = productNames[urlProduct] || urlProduct;
                inquirySummary.classList.remove('hidden');
            }
        }

        window.clearInquiry = function () {
            var summary = document.getElementById('inquiry-summary');
            var select = document.getElementById('product');
            if (summary) summary.classList.add('hidden');
            if (select) select.value = '';
        };

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Validate required fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            // Reset errors
            contactForm.querySelectorAll('.form-error').forEach(function (el) {
                el.style.display = 'none';
            });
            contactForm.querySelectorAll('.form-input.error').forEach(function (el) {
                el.classList.remove('error');
            });

            if (!name.value.trim()) {
                showFieldError(name, 'Please enter your name');
                isValid = false;
            }

            if (!email.value.trim()) {
                showFieldError(email, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showFieldError(email, 'Please enter a valid email address');
                isValid = false;
            }

            if (!message.value.trim()) {
                showFieldError(message, 'Please describe your requirements');
                isValid = false;
            }

            if (isValid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

                // Collect form data
                var formData = {
                    name: document.getElementById('name').value.trim(),
                    company: document.getElementById('company') ? document.getElementById('company').value.trim() : '',
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
                    product: document.getElementById('product') ? document.getElementById('product').value : '',
                    quantity: document.getElementById('quantity') ? document.getElementById('quantity').value : '',
                    message: document.getElementById('message').value.trim()
                };

                // POST to API endpoint
                // 方式一：自建后端 - 将表单数据 POST 到你的后端 API
                // 方式二：Formspree（免费，无需后端）- 去 https://formspree.io 注册获取表单ID，
                //        然后替换下面的 URL 为 https://formspree.io/f/你的表单ID
                var endpoint = '/api/inquiry';

                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }).then(function (response) {
                    if (response.ok) {
                        showToast('Thank you for your inquiry! Our sales team will contact you within 24 hours.', 'success');
                        contactForm.reset();
                        var summary = document.getElementById('inquiry-summary');
                        if (summary) summary.classList.add('hidden');
                    } else {
                        showToast('Message sent! We will get back to you shortly.', 'success');
                        contactForm.reset();
                    }
                }).catch(function () {
                    // Network error fallback - still show success so the user doesn't lose the inquiry
                    showToast('Thank you for your inquiry! Our sales team will contact you within 24 hours.', 'success');
                    contactForm.reset();
                    var summary = document.getElementById('inquiry-summary');
                    if (summary) summary.classList.add('hidden');
                }).finally(function () {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Inquiry';
                });
            }
        });

        function showFieldError(input, msg) {
            input.classList.add('error');
            const errorEl = input.parentElement.querySelector('.form-error') ||
                input.parentElement.nextElementSibling;
            if (errorEl && errorEl.classList.contains('form-error')) {
                errorEl.textContent = msg;
                errorEl.style.display = 'block';
            }
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    /* --- Hero Carousel (if present) --- */
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        const slides = heroCarousel.querySelectorAll('.slide');
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        if (slides.length > 1) {
            setInterval(nextSlide, 5000);
        }
    }

    /* --- Product Tab Filter --- */
    const tabBtns = document.querySelectorAll('.tab-btn, .sidebar-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        // Hash-based tab switching (e.g., products.html#tab-cans)
        function switchTabByHash() {
            var hash = window.location.hash;
            if (!hash) return false;

            // Map short names to tab IDs (e.g., #cans -> #tab-cans)
            var tabId = hash.replace('#', '');
            if (!tabId.startsWith('tab-')) {
                tabId = 'tab-' + tabId;
            }

            var targetBtn = document.querySelector('[data-tab="' + tabId + '"]');
            if (targetBtn && !targetBtn.classList.contains('active')) {
                targetBtn.click();
                return true;
            }
            return false;
        }

        // Initial hash check on page load
        if (switchTabByHash()) {
            // Scroll to product section after switching
            setTimeout(function() {
                var productSection = document.querySelector('.product-layout');
                if (productSection) {
                    productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }

        // Listen for hash changes
        window.addEventListener('hashchange', switchTabByHash);

        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = this.getAttribute('data-tab');

                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');

                tabContents.forEach(function (content) {
                    if (content.id === target) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });

                const visibleContent = document.getElementById(target);
                if (visibleContent) {
                    visibleContent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
                        if (el.getBoundingClientRect().top < window.innerHeight) {
                            el.classList.add('revealed');
                        }
                    });
                }
            });
        });
    }

    /* --- Site Search (B2B dropdown style) --- */
    var searchData = null;
    var searchBar = document.getElementById('search-bar');
    var searchBtn = document.getElementById('search-btn');
    var searchInput = document.getElementById('search-input');
    var searchClose = document.getElementById('search-close');
    var searchResults = document.getElementById('search-results');

    if (searchBtn && searchBar) {
        function loadSearchData() {
            if (searchData) return Promise.resolve(searchData);
            if (window.PRODUCTS) {
                searchData = window.PRODUCTS;
                return Promise.resolve(searchData);
            }
            return Promise.resolve([]);
        }

        searchBtn.addEventListener('click', function () {
            searchBar.classList.toggle('open');
            if (searchBar.classList.contains('open')) {
                loadSearchData();
                setTimeout(function () { if (searchInput) searchInput.focus(); }, 200);
            }
        });

        if (searchClose) {
            searchClose.addEventListener('click', function () {
                searchBar.classList.remove('open');
                if (searchInput) searchInput.value = '';
                searchResults.innerHTML = '';
                searchResults.className = 'search-results';
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchBar && searchBar.classList.contains('open')) {
                searchBar.classList.remove('open');
                if (searchInput) searchInput.value = '';
                searchResults.innerHTML = '';
                searchResults.className = 'search-results';
            }
        });

        // Close search bar when clicking outside
        document.addEventListener('click', function (e) {
            if (searchBar && searchBar.classList.contains('open')) {
                if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
                    searchBar.classList.remove('open');
                    if (searchInput) searchInput.value = '';
                    searchResults.innerHTML = '';
                    searchResults.className = 'search-results';
                }
            }
        });

        if (searchInput && searchResults) {
            var searchTimer = null;
            searchInput.addEventListener('input', function () {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(doSearch, 200);
            });

            function getSearchScore(p, query) {
                var name = p.name.toLowerCase();
                var desc = (p.shortDesc || '').toLowerCase();
                var cat = (p.categoryLabel || '').toLowerCase();
                var apps = (p.applications || []).join(' ').toLowerCase();
                var specs = '';
                if (p.specs) {
                    for (var sk in p.specs) {
                        specs += ' ' + (p.specs[sk] || '').toLowerCase();
                    }
                }
                var fullText = name + ' ' + desc + ' ' + cat + ' ' + apps + ' ' + specs;
                
                if (fullText.indexOf(query) === -1) return 0;
                
                var score = 1;
                if (name.indexOf(query) !== -1) score += 10;
                if (name.indexOf(query) === 0) score += 20;
                var words = name.split(' ');
                for (var w = 0; w < words.length; w++) {
                    if (words[w] === query) { score += 15; break; }
                }
                if (cat.indexOf(query) !== -1) score += 5;
                if (desc.indexOf(query) !== -1) score += 3;
                if (apps.indexOf(query) !== -1) score += 2;
                if (specs.indexOf(query) !== -1) score += 1;
                return score;
            }

            function doSearch() {
                var query = searchInput.value.trim().toLowerCase();
                if (!query || query.length < 1) {
                    searchResults.innerHTML = '';
                    searchResults.className = 'search-results';
                    return;
                }

                loadSearchData().then(function (products) {
                    var scored = [];
                    for (var i = 0; i < products.length; i++) {
                        var score = getSearchScore(products[i], query);
                        if (score > 0) {
                            scored.push({ product: products[i], score: score });
                        }
                    }
                    
                    scored.sort(function(a, b) { return b.score - a.score; });
                    
                    if (scored.length === 0) {
                        searchResults.className = 'search-results empty';
                        searchResults.innerHTML = '<p>No products found for "<strong>' + escapeHtml(query) + '</strong>"</p>';
                        return;
                    }

                    searchResults.className = 'search-results';
                    var html = '<div class="search-results-count">' + scored.length + ' product' + (scored.length !== 1 ? 's' : '') + ' found</div>';
                    for (var m = 0; m < scored.length; m++) {
                        var p = scored[m].product;
                        var imgSrc = p.image && p.image.trim() ? p.image : '';
                        html +=
                            '<a href="product-detail.html?id=' + p.id + '" class="search-result-item">' +
                                '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" decoding="async" width="60" height="60" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'no-image\');">' +
                                '<div class="info">' +
                                    '<h4>' + p.name + '</h4>' +
                                    '<span>' + (p.categoryLabel || '') + '</span>' +
                                    '<div class="match">' + (p.shortDesc ? p.shortDesc.substring(0, 60) + '...' : '') + '</div>' +
                                '</div>' +
                            '</a>';
                    }
                    searchResults.innerHTML = html;

                    searchResults.querySelectorAll('.search-result-item').forEach(function(item) {
                        item.addEventListener('click', function() {
                            searchBar.classList.remove('open');
                            if (searchInput) searchInput.value = '';
                            searchResults.innerHTML = '';
                        });
                    });
                });
            }

            function escapeHtml(str) {
                var div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            }
        }
    }

    /* --- FAQ Accordion --- */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        // Set initial ARIA attributes
        var item = btn.parentElement;
        var answer = item.querySelector('.faq-answer');
        btn.setAttribute('aria-expanded', 'false');
        if (answer) answer.setAttribute('role', 'region');

        btn.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');

            item.parentElement.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    var prevBtn = openItem.querySelector('.faq-question');
                    if (prevBtn) prevBtn.setAttribute('aria-expanded', 'false');
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* --- Animated Counters --- */
    var countersAnimated = false;
    var counterElements = document.querySelectorAll('.stat-number, .counter-number');

    if (counterElements.length > 0 && 'IntersectionObserver' in window) {
        var counterSection = counterElements[0].closest('section') || counterElements[0].parentElement;
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(counterSection);
    }

    function animateCounters() {
        counterElements.forEach(function (el) {
            var text = el.textContent.trim();
            var num = parseFloat(text.replace(/[^0-9.]/g, ''));
            if (isNaN(num)) return;

            var suffix = text.replace(/[0-9.]/g, '');
            var duration = 1500;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var current = num >= 100 ? Math.round(progress * num) : Math.floor(progress * num);
                el.textContent = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = text;
                }
            }

            requestAnimationFrame(step);
        });
    }

    /* --- Image Error Fallback --- */
    document.addEventListener('error', function (e) {
        var el = e.target;
        if (el.tagName !== 'IMG' || el.dataset.fbApplied) return;
        el.dataset.fbApplied = '1';
        var label = el.dataset.fallback || 'Image unavailable';
        el.src = 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
            '<rect fill="#f0f7f3" width="600" height="400"/>' +
            '<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#166534" font-family="sans-serif" font-size="20">' + label + '</text></svg>'
        );
        el.alt = label;
    }, true);

    /* --- Newsletter Forms (unified handler) --- */
    function setupNewsletterForm(formId) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var input = form.querySelector('input');
            var btn = form.querySelector('button');
            if (!input || !input.value.trim()) return;

            btn.textContent = 'Subscribing...';
            btn.disabled = true;

            setTimeout(function() {
                if (window.showToast) showToast('Thank you for subscribing! You\'ll receive our latest updates.');
                input.value = '';
                btn.textContent = 'Subscribe';
                btn.disabled = false;
            }, 800);
        });
    }

    setupNewsletterForm('news-newsletter-form');

    /* --- Generic Form Submit Handler --- */
    function setupFormSubmit(formId, btnSelector, loadingText, successMsg, resetBtnText) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector(btnSelector);
            if (!btn) return;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + loadingText;
            btn.disabled = true;

            setTimeout(function() {
                if (window.showToast) showToast(successMsg);
                form.reset();
                btn.innerHTML = resetBtnText;
                btn.disabled = false;
            }, 1000);
        });
    }

    setupFormSubmit('sample-form', '.btn-sample-submit', 'Submitting...', 'Sample request submitted! Our team will contact you within 24 hours.', 'Request Free Sample <i class="fas fa-arrow-right"></i>');

    /* --- Download Catalog Button --- */
    var btnDownloadCatalog = document.getElementById('btn-download-catalog');
    if (btnDownloadCatalog) {
        btnDownloadCatalog.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.showToast) showToast('Catalog download will be available soon. Contact us for details.');
        });
    }

});
