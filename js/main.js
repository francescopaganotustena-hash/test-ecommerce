/**
 * TECHSTORE - JavaScript Principale
 * Funzionalità globali e UI components
 */

// ============================================
// HEADER & NAVIGATION
// ============================================

class HeaderController {
  constructor() {
    this.searchInput = null;
    this.mobileMenu = null;
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSearch();
    this.setupScrollHeader();
    this.setupScrollToTop();
  }

  // Menu mobile hamburger
  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (!toggle) return;

    const menuElements = this.ensureMobileMenuElements();
    if (!menuElements) return;

    this.mobileMenu = menuElements.menu;
    this.mobileMenuOverlay = menuElements.overlay;
    this.mobileMenuCloseBtn = menuElements.closeBtn;

    toggle.addEventListener('click', () => {
      this.mobileMenu?.classList.add('active');
      this.mobileMenuOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    this.mobileMenuCloseBtn?.addEventListener('click', this.closeMobileMenu.bind(this));
    this.mobileMenuOverlay?.addEventListener('click', this.closeMobileMenu.bind(this));

    this.mobileMenu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        this.closeMobileMenu();
      }
    });

    window.addEventListener('pageshow', () => {
      this.closeMobileMenu();
    });
  }

  ensureMobileMenuElements() {
    let menu = document.querySelector('.mobile-menu');
    let overlay = document.querySelector('.mobile-menu-overlay');

    if (!menu || !overlay) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="mobile-menu-overlay"></div>
        <div class="mobile-menu">
          <div class="mobile-menu-header">
            <a href="index.html" class="header-logo">🔌 Tech<span>Store</span></a>
            <button class="mobile-menu-close" aria-label="Chiudi menu">✕</button>
          </div>
          <nav class="mobile-menu-nav">
            <a href="index.html" class="mobile-menu-link">🏠 Home</a>
            <a href="catalogo.html" class="mobile-menu-link">🛍️ Catalogo</a>
            <a href="catalogo.html?sale=true" class="mobile-menu-link">🏷️ Offerte</a>
            <a href="account.html" class="mobile-menu-link">👤 Account</a>
            <a href="carrello.html" class="mobile-menu-link">🛒 Carrello</a>
            <a href="chi-siamo.html" class="mobile-menu-link">ℹ️ Chi Siamo</a>
            <a href="contatti.html" class="mobile-menu-link">📞 Contatti</a>
          </nav>
        </div>
      `;

      const nodes = Array.from(wrapper.children);
      document.body.append(...nodes);

      menu = document.querySelector('.mobile-menu');
      overlay = document.querySelector('.mobile-menu-overlay');
    }

    const closeBtn = menu?.querySelector('.mobile-menu-close') || null;
    return menu && overlay ? { menu, overlay, closeBtn } : null;
  }

  closeMobileMenu() {
    const menu = this.mobileMenu || document.querySelector('.mobile-menu');
    const overlay = this.mobileMenuOverlay || document.querySelector('.mobile-menu-overlay');
    menu?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Ricerca prodotti
  setupSearch() {
    const searchForms = document.querySelectorAll('.search-form');
    if (!searchForms.length) return;

    searchForms.forEach((searchForm) => {
      const searchInput = searchForm.querySelector('.search-input');
      if (!searchInput) return;

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `catalogo.html?search=${encodeURIComponent(query)}`;
        }
      });
    });
  }

  // Header che cambia allo scroll
  setupScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }

  // Bottone scroll-to-top
  setupScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================
// COMPONENTI UI
// ============================================

class UIComponents {
  static escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  static normalizeImageSrc(src) {
    const value = String(src || '').trim();
    if (!value) return '';

    if (
      value.startsWith('assets/') ||
      value.startsWith('./assets/') ||
      value.startsWith('../assets/') ||
      value.startsWith('data:image/')
    ) {
      return value;
    }

    if (/^https?:\/\//i.test(value)) {
      try {
        const parsedUrl = new URL(value, window.location.origin);
        const normalizedPath = parsedUrl.pathname.replace(/^\/+/, '');

        if (normalizedPath.startsWith('assets/')) {
          return normalizedPath;
        }

        const assetsIndex = parsedUrl.pathname.toLowerCase().indexOf('/assets/');
        if (assetsIndex >= 0) {
          return parsedUrl.pathname.slice(assetsIndex + 1);
        }
      } catch (error) {
        // Keep the original source when it is a valid remote URL.
      }

      return value;
    }

    return '';
  }

  static sanitizeImageSrc(src) {
    const normalizedSource = this.normalizeImageSrc(src);
    if (normalizedSource) {
      return this.escapeHtml(normalizedSource);
    }
    return 'assets/images/products/placeholder-product.svg';
  }

  // Genera stelle rating
  static renderStars(rating, showNumber = true, reviewCount = 0) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = '<div class="stars">';
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        html += '<span class="star filled">★</span>';
      } else if (i === fullStars && hasHalfStar) {
        html += '<span class="star half">★</span>';
      } else {
        html += '<span class="star">☆</span>';
      }
    }
    
    html += '</div>';
    
    if (showNumber) {
      html += `<span class="rating-number">${rating.toFixed(1)}</span>`;
      if (reviewCount > 0) {
        html += `<span class="review-count">(${reviewCount})</span>`;
      }
    }
    
    return html;
  }

  // Formatta prezzo
  static formatPrice(price, currency = '€') {
    return `${currency}${Number(price).toFixed(2).replace('.', ',')}`;
  }

  // Calcola prezzo scontato
  static getDiscountedPrice(originalPrice, discountPercent) {
    if (discountPercent <= 0) return originalPrice;
    return (originalPrice * (1 - discountPercent / 100)).toFixed(2);
  }

  // Genera badge sconto
  static renderBadge(product) {
    if (product.isNew && product.discount > 0) {
      return `<span class="badge badge-new">Nuovo</span>`;
    }
    if (product.isNew) {
      return `<span class="badge badge-new">Nuovo</span>`;
    }
    if (product.discount > 0) {
      return `<span class="badge badge-sale">-${product.discount}%</span>`;
    }
    if (product.featured) {
      return `<span class="badge badge-hot">In evidenza</span>`;
    }
    return '';
  }

  // Crea card prodotto
  static renderProductCard(product) {
    const discountedPrice = this.getDiscountedPrice(product.price, product.discount);
    const stars = this.renderStars(product.rating, true, product.reviews);
    const badge = this.renderBadge(product);
    const safeName = this.escapeHtml(product.name);
    const safeBrand = this.escapeHtml(product.brand);
    const safeImage = this.sanitizeImageSrc(product.image);
    
    const safeId = Number(product.id) || 0;
    const safeCategory = this.escapeHtml(String(product.category || '').replace(/[^a-z0-9-]/gi, '').toLowerCase());

    return `
      <div class="product-card card" data-id="${safeId}" data-category="${safeCategory}">
        <div class="product-image-wrapper">
          <a href="prodotto.html?id=${safeId}">
            <img src="${safeImage}" alt="${safeName}" class="card-img-top product-image" loading="lazy" decoding="async" onerror="window.TechStoreUI && window.TechStoreUI.handleImageError(this)">
          </a>
          ${badge ? `<div class="product-badges">${badge}</div>` : ''}
          <button class="wishlist-btn" aria-label="Aggiungi ai preferiti">
            <span>♡</span>
          </button>
        </div>
        <div class="card-body">
          <p class="product-brand text-muted mb-1">${safeBrand}</p>
          <h3 class="product-title">
            <a href="prodotto.html?id=${safeId}">${safeName}</a>
          </h3>
          <div class="product-rating mb-2">
            ${stars}
          </div>
          <div class="product-price">
            <span class="current-price text-primary fw-bold">€${Number(discountedPrice).toFixed(2)}</span>
            ${product.discount > 0 ? `<span class="original-price text-muted text-decoration-line-through ms-2">€${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-block mt-3 add-to-cart-btn" data-id="${safeId}">
            <span>🛒</span> Aggiungi al carrello
          </button>
        </div>
      </div>
    `;
  }

  // Crea card categoria
  static renderCategoryCard(category) {
    return `
      <div class="category-card card text-center" data-category="${category.id}">
        <div class="card-body">
          <div class="category-icon" style="font-size: 3rem; margin-bottom: 1rem;">${category.icon}</div>
          <h3 class="category-name mb-0">${category.name}</h3>
          <a href="catalogo.html?category=${category.id}" class="stretched-link"></a>
        </div>
      </div>
    `;
  }
}

function getProductImageFallback() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F5F7FA"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
        <linearGradient id="box" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5B6B7D"/>
          <stop offset="100%" stop-color="#2F3D4A"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <g transform="translate(300 248)">
        <rect x="-90" y="-70" width="180" height="140" rx="14" fill="url(#box)"/>
        <path d="M-90 -20 L0 40 L90 -20" fill="none" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="0" cy="-6" r="14" fill="#cbd5e1"/>
      </g>
      <g fill="#334155" text-anchor="middle" font-family="Arial, sans-serif">
        <text x="300" y="392" font-size="28" font-weight="700">TechStore</text>
        <text x="300" y="425" font-size="24">Immagine non disponibile</text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function handleImageError(img) {
  if (!img || img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = getProductImageFallback();
  img.alt = img.alt || 'Immagine non disponibile';
}

function setupImageFallbacks() {
  const bindFallback = (img) => {
    if (!img || img.dataset.fallbackBound === 'true') return;
    img.dataset.fallbackBound = 'true';
    img.addEventListener('error', () => handleImageError(img));
  };

  document.querySelectorAll('img').forEach(bindFallback);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') {
          bindFallback(node);
        } else {
          node.querySelectorAll?.('img').forEach(bindFallback);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function setupDeferredTracking() {
  const config = window.TechStoreTrackingConfig;
  if (!config || window.__techstoreTrackingInitialized) return;

  const gaMeasurementId = String(config.gaMeasurementId || '').trim();
  const fbPixelId = String(config.fbPixelId || '').trim();
  const isPlaceholder = (value) => !value || /^[GX-]*X+$/i.test(value);
  const hasGa = !isPlaceholder(gaMeasurementId);
  const hasPixel = !isPlaceholder(fbPixelId);

  if (!hasGa && !hasPixel) return;

  window.__techstoreTrackingInitialized = true;
  let started = false;
  let timeoutId = null;
  const listeners = [];

  const loadScript = (src) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };

  const start = () => {
    if (started) return;
    started = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    listeners.forEach(({ type, handler }) => {
      window.removeEventListener(type, handler);
    });

    if (hasGa) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaMeasurementId);
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`);
    }

    if (hasPixel) {
      window.fbq = window.fbq || function fbq(){ fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];
      window.fbq('init', fbPixelId);
      window.fbq('track', 'PageView');
      loadScript('https://connect.facebook.net/en_US/fbevents.js');
    }
  };

  const scheduleStart = () => {
    if (!started) {
      timeoutId = window.setTimeout(start, 1200);
    }
  };

  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((type) => {
    const handler = () => scheduleStart();
    listeners.push({ type, handler });
    window.addEventListener(type, handler, { passive: true, once: true });
  });

  window.addEventListener('load', () => {
    if (!started) {
      timeoutId = window.setTimeout(start, 1800);
    }
  }, { once: true });

  window.setTimeout(start, 9000);
}

// ============================================
// FUNZIONI CARRELLO E LOGIN
// ============================================

function performUserLogout(options = {}) {
  const { redirectTo = null } = options;

  localStorage.removeItem('techstore_session');
  localStorage.removeItem('techstore_user');

  if (window.cart && typeof window.cart.clearCart === 'function') {
    window.cart.clearCart();
  } else {
    localStorage.removeItem('techstore_cart');
    localStorage.removeItem('techstore_discount');
  }

  if (redirectTo) {
    window.location.href = redirectTo;
  } else {
    location.reload();
  }
}

// Aggiorna il contatore del carrello nell'header
function updateCartCount() {
  const cartCountEl = document.querySelector('.cart-count');
  if (!cartCountEl) return;

  const count = window.cart ? window.cart.getTotalItems() : 0;
  if (count > 0) {
    cartCountEl.textContent = count;
    cartCountEl.style.display = 'inline-flex';
  } else {
    cartCountEl.style.display = 'none';
  }
}

// Aggiorna l'header in base allo stato di login
function updateHeaderForLogin() {
  let session = null;
  let user = null;
  try {
    session = JSON.parse(localStorage.getItem('techstore_session') || 'null');
  } catch (e) {
    session = null;
  }
  try {
    user = JSON.parse(localStorage.getItem('techstore_user') || 'null');
  } catch (e) {
    user = null;
  }

  // Elementi da modificare nella top bar
  const topBarAuthLink = Array.from(document.querySelectorAll('.top-bar-links a')).find((link) => {
    const href = link.getAttribute('href') || '';
    const text = (link.textContent || '').toLowerCase();
    return href.includes('login.html') || href.includes('account.html') || text.includes('area cliente') || text.includes('ciao');
  });

  // Trova tutti i link di login/registrazione nell'header actions
  const headerActionLinks = Array.from(document.querySelectorAll('.header-actions a.header-action'));
  const headerActionsLogin = headerActionLinks.find((link) => {
    const icon = link.querySelector('.header-action-icon')?.textContent || '';
    const label = (link.querySelector('.header-action-label')?.textContent || '').toLowerCase();
    return icon.includes('👤') || label.includes('accedi') || label.includes('account');
  });
  const headerActionsRegister = headerActionLinks.find((link) => {
    const icon = link.querySelector('.header-action-icon')?.textContent || '';
    const label = (link.querySelector('.header-action-label')?.textContent || '').toLowerCase();
    return icon.includes('📝') || label.includes('registrati');
  });

  const loginLabel = headerActionsLogin?.querySelector('.header-action-label');
  const loginIcon = headerActionsLogin?.querySelector('.header-action-icon');
  const logoutLink = document.querySelector('.header-action-logout');

  if (session && session.loggedIn && user) {
    // Utente loggato - aggiorna top bar
    if (topBarAuthLink) {
      topBarAuthLink.textContent = `Ciao, ${user.firstname || session.firstname || 'Utente'}`;
      topBarAuthLink.href = 'account.html';
    }

    // Aggiorna header actions - link Accedi
    if (headerActionsLogin) {
      headerActionsLogin.href = 'account.html';
      if (loginLabel) loginLabel.textContent = user.firstname || session.firstname || 'Account';
      if (loginIcon) loginIcon.textContent = '👤';
    }

    // Rimuovi il link "Registrati" se l'utente è loggato
    if (headerActionsRegister) {
      headerActionsRegister.style.display = 'none';
    }

    // Aggiungi link "Esci" se non presente
    if (!logoutLink) {
      const newLogoutLink = document.createElement('a');
      newLogoutLink.className = 'header-action header-action-logout d-none d-md-flex';
      newLogoutLink.href = '#';
      newLogoutLink.innerHTML = '<span class="header-action-icon">🚪</span><span class="header-action-label">Esci</span>';
      newLogoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        performUserLogout();
      });
      const actionsContainer = document.querySelector('.header-actions');
      if (actionsContainer) {
        actionsContainer.appendChild(newLogoutLink);
      }
    } else {
      logoutLink.style.display = '';
    }
  } else {
    // Stato guest: ripristina sempre link "Accedi" funzionante.
    if (topBarAuthLink) {
      topBarAuthLink.textContent = 'Area Cliente';
      topBarAuthLink.href = 'login.html';
    }

    if (headerActionsLogin) {
      headerActionsLogin.href = 'login.html';
      if (loginLabel) loginLabel.textContent = 'Accedi';
      if (loginIcon) loginIcon.textContent = '👤';
    }

    if (headerActionsRegister) {
      headerActionsRegister.style.display = '';
      headerActionsRegister.href = 'login.html';
    }

    if (logoutLink) {
      logoutLink.remove();
    }
  }
}

// ============================================
// GESTIONE PAGINA CATALOGO
// ============================================

class CatalogPage {
  constructor() {
    this.products = TechStoreProducts.products;
    this.filteredProducts = [...this.products];
    this.currentSort = 'default';
    this.itemsPerPage = 12;
    this.currentPage = 1;
    this.init();
  }

  init() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;

    this.setupFilters();
    this.setupSort();
    this.setupPagination();
    this.loadFromURL();
    this.render();
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const search = params.get('search');
    const brand = params.get('brand');
    const sale = params.get('sale');

    if (category) {
      this.filteredProducts = TechStoreProducts.getProductsByCategory(category);
      const catFilter = document.getElementById('category-filter');
      if (catFilter) catFilter.value = category;
    }
    if (search) {
      this.filteredProducts = TechStoreProducts.searchProducts(search);
      const topSearchInput = document.getElementById('search-input');
      const catalogSearchInput = document.getElementById('catalog-search-input');
      if (topSearchInput) topSearchInput.value = search;
      if (catalogSearchInput) catalogSearchInput.value = search;
    }
    if (brand) {
      this.filteredProducts = this.filteredProducts.filter(p => p.brand === brand);
      const brandFilter = document.getElementById('brand-filter');
      if (brandFilter) brandFilter.value = brand;
    }
    if (sale === 'true') {
      this.filteredProducts = this.filteredProducts.filter(p => p.discount > 0);
      const onSaleFilter = document.getElementById('on-sale-filter');
      if (onSaleFilter) onSaleFilter.checked = true;
    }
  }

  setupFilters() {
    // Filtro categoria
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        if (e.target.value) {
          this.filteredProducts = TechStoreProducts.getProductsByCategory(e.target.value);
        } else {
          this.filteredProducts = [...this.products];
        }
        this.currentPage = 1;
        this.render();
      });
    }

    // Filtro brand
    const brandFilter = document.getElementById('brand-filter');
    if (brandFilter) {
      brandFilter.addEventListener('change', (e) => {
        this.applyFilters();
      });
    }

    // Filtro prezzo
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
      priceFilter.addEventListener('input', () => this.applyFilters());
    }

    // Checkbox in stock
    const inStockFilter = document.getElementById('in-stock-filter');
    if (inStockFilter) {
      inStockFilter.addEventListener('change', () => this.applyFilters());
    }

    // Checkbox in offerta
    const onSaleFilter = document.getElementById('on-sale-filter');
    if (onSaleFilter) {
      onSaleFilter.addEventListener('change', () => this.applyFilters());
    }

    // Bottone applica filtri
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => this.applyFilters());
    }
  }

  applyFilters() {
    const category = document.getElementById('category-filter')?.value;
    const brand = document.getElementById('brand-filter')?.value;
    const search = document.getElementById('catalog-search-input')?.value?.trim();
    const maxPrice = document.getElementById('price-filter')?.value;
    const inStock = document.getElementById('in-stock-filter')?.checked;
    const onSale = document.getElementById('on-sale-filter')?.checked;

    this.filteredProducts = TechStoreProducts.filterProducts({
      category: category || undefined,
      brand: brand || undefined,
      search: search || undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock || undefined,
      onSale: onSale || undefined
    });

    this.currentPage = 1;
    this.render();
  }

  setupSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.filteredProducts = TechStoreProducts.sortProducts(this.filteredProducts, this.currentSort);
        this.render();
      });
    }
  }

  setupPagination() {
    // Implementazione base pagination
  }

  render() {
    const catalogGrid = document.getElementById('catalog-grid');
    const resultsCount = document.getElementById('results-count');
    const pagination = document.getElementById('pagination');

    if (!catalogGrid) return;

    // Aggiorna conteggio risultati
    if (resultsCount) {
      resultsCount.textContent = `${this.filteredProducts.length} prodotti trovati`;
    }

    // Ordina prodotti
    this.filteredProducts = TechStoreProducts.sortProducts(this.filteredProducts, this.currentSort);

    // Renderizza griglia
    if (this.filteredProducts.length === 0) {
      catalogGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
          <h3>Nessun prodotto trovato</h3>
          <p class="text-muted">Prova a modificare i filtri di ricerca</p>
        </div>
      `;
      if (pagination) pagination.innerHTML = '';
      return;
    }

    // Paginazione
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageProducts = this.filteredProducts.slice(startIndex, endIndex);

    let html = '';
    pageProducts.forEach(product => {
      html += `<div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">`;
      html += UIComponents.renderProductCard(product);
      html += `</div>`;
    });

    catalogGrid.innerHTML = html;

    // Renderizza pagination
    this.renderPagination(totalPages, pagination);

    // Attiva bottoni "Aggiungi al carrello"
    this.setupAddToCartButtons();
  }

  renderPagination(totalPages, container) {
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = '<nav><ul class="pagination justify-content-center">';
    
    // Previous
    html += `<li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${this.currentPage - 1}">Precedente</a>
    </li>`;

    // Pagine
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        html += `<li class="page-item ${i === this.currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    // Next
    html += `<li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${this.currentPage + 1}">Successiva</a>
    </li>`;

    html += '</ul></nav>';
    container.innerHTML = html;

    // Event listeners
    container.querySelectorAll('.page-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.id);
        const product = TechStoreProducts.getProductById(productId);
        if (product && window.cart) {
          window.cart.addItem(product, 1);
        }
      });
    });
  }
}

// ============================================
// INIZIALIZZAZIONE
// ============================================

// Il carrello è già inizializzato in cart.js (const cart = new ShoppingCart())
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Ascolta eventi del carrello per aggiornare il contatore
  window.addEventListener('cartUpdated', () => {
    updateCartCount();
  });

  // Inizializza header
  new HeaderController();

  // Aggiorna header in base allo stato di login
  updateHeaderForLogin();

  // Fallback immagini prodotto
  setupImageFallbacks();

  // Tracking non critico (deferred)
  setupDeferredTracking();

  // Inizializza pagina catalogo se presente
  if (document.getElementById('catalog-grid')) {
    new CatalogPage();
  }

  // Animazioni scroll
  setupScrollAnimations();
});

// Animazioni elementi allo scroll
function setupScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slideInUp');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .btn, section > *').forEach(el => {
    observer.observe(el);
  });
}

// Esporta globalmente
window.TechStoreUI = {
  UIComponents,
  CatalogPage,
  HeaderController,
  handleImageError,
  performUserLogout
};
