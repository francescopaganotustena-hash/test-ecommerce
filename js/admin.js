/**
 * TECHSTORE - Admin Panel
 * Gestione prodotti con CRUD e localStorage
 */

// ============================================
// CONFIGURAZIONE
// ============================================

const ADMIN_CONFIG = {
  storageKey: 'techstore_products',
  defaultImage: 'assets/images/products/placeholder-product.svg',
  authSessionKey: 'admin_auth',
  passwordHashKey: 'techstore_admin_password_hash'
};

// ============================================
// AUTENTICAZIONE
// ============================================

class AdminAuth {
  constructor() {
    this.isAuthenticated = false;
    this.hasConfiguredPassword = Boolean(localStorage.getItem(ADMIN_CONFIG.passwordHashKey));
    this.init();
  }

  init() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Per sicurezza, invalida eventuali sessioni legacy persistite.
    sessionStorage.removeItem(ADMIN_CONFIG.authSessionKey);
    this.updateLoginStateUI();
  }

  updateLoginStateUI() {
    const hint = document.getElementById('admin-login-hint');
    const confirmGroup = document.getElementById('admin-password-confirm-group');
    const confirmInput = document.getElementById('admin-password-confirm');
    if (!hint || !confirmGroup || !confirmInput) return;

    if (this.hasConfiguredPassword) {
      hint.textContent = 'Accesso riservato all\'amministratore.';
      confirmGroup.classList.add('d-none');
      confirmInput.required = false;
      return;
    }

    hint.textContent = 'Primo accesso: imposta una password admin (minimo 10 caratteri).';
    confirmGroup.classList.remove('d-none');
    confirmInput.required = true;
  }

  async hashPassword(password) {
    const value = String(password || '');
    if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      const bytes = new TextEncoder().encode(value);
      const digest = await window.crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    // Fallback per contesti non sicuri (es. accesso via IP LAN http://10.0.0.x).
    return this.sha256Fallback(value);
  }

  sha256Fallback(input) {
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const maxWord = 0x100000000;
    const words = [];
    let result = '';

    const utf8 = unescape(encodeURIComponent(input));
    for (let i = 0; i < utf8.length; i += 1) {
      words[i >> 2] |= utf8.charCodeAt(i) << ((3 - (i % 4)) * 8);
    }
    words[utf8.length >> 2] |= 0x80 << ((3 - (utf8.length % 4)) * 8);
    words[(((utf8.length + 8) >> 6) << 4) + 15] = utf8.length * 8;

    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    for (let i = 0; i < words.length; i += 16) {
      const w = new Array(64).fill(0);
      for (let t = 0; t < 16; t += 1) {
        w[t] = words[i + t] || 0;
      }
      for (let t = 16; t < 64; t += 1) {
        const s0 = rightRotate(w[t - 15], 7) ^ rightRotate(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        const s1 = rightRotate(w[t - 2], 17) ^ rightRotate(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;

      for (let t = 0; t < 64; t += 1) {
        const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + s1 + ch + k[t] + w[t]) % maxWord;
        const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (s0 + maj) % maxWord;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) % maxWord;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) % maxWord;
      }

      h0 = (h0 + a) % maxWord;
      h1 = (h1 + b) % maxWord;
      h2 = (h2 + c) % maxWord;
      h3 = (h3 + d) % maxWord;
      h4 = (h4 + e) % maxWord;
      h5 = (h5 + f) % maxWord;
      h6 = (h6 + g) % maxWord;
      h7 = (h7 + h) % maxWord;
    }

    [h0, h1, h2, h3, h4, h5, h6, h7].forEach((hashPart) => {
      result += (hashPart >>> 0).toString(16).padStart(8, '0');
    });

    return result;
  }

  async handleLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const passwordConfirmInput = document.getElementById('admin-password-confirm');
    const errorDiv = document.getElementById('login-error');
    const password = passwordInput?.value?.trim() || '';

    try {
      if (!this.hasConfiguredPassword) {
        const passwordConfirm = passwordConfirmInput?.value?.trim() || '';
        if (password.length < 10) {
          errorDiv.textContent = 'La password admin deve avere almeno 10 caratteri.';
          errorDiv.classList.remove('d-none');
          return;
        }
        if (password !== passwordConfirm) {
          errorDiv.textContent = 'Le password non coincidono.';
          errorDiv.classList.remove('d-none');
          return;
        }

        const hash = await this.hashPassword(password);
        localStorage.setItem(ADMIN_CONFIG.passwordHashKey, hash);
        this.hasConfiguredPassword = true;
        this.updateLoginStateUI();
      } else {
        const expectedHash = localStorage.getItem(ADMIN_CONFIG.passwordHashKey);
        const hash = await this.hashPassword(password);
        if (!expectedHash || hash !== expectedHash) {
          errorDiv.textContent = 'Password errata. Riprova.';
          errorDiv.classList.remove('d-none');
          return;
        }
      }
    } catch (error) {
      console.error('Errore autenticazione admin:', error);
      errorDiv.textContent = 'Errore durante l\'autenticazione. Riprova.';
      errorDiv.classList.remove('d-none');
      return;
    }

    this.isAuthenticated = true;
    errorDiv.classList.add('d-none');
    this.showDashboard();
  }

  logout() {
    this.isAuthenticated = false;
    document.getElementById('login-screen').classList.remove('d-none');
    document.getElementById('admin-dashboard').classList.add('d-none');
    document.getElementById('admin-password').value = '';
    const confirmInput = document.getElementById('admin-password-confirm');
    if (confirmInput) confirmInput.value = '';
    this.updateLoginStateUI();
  }

  showDashboard() {
    document.getElementById('login-screen').classList.add('d-none');
    document.getElementById('admin-dashboard').classList.remove('d-none');
    if (adminProducts && typeof adminProducts.init === 'function') {
      adminProducts.init();
      adminProducts.renderProductsTable();
    }
  }
}

// ============================================
// GESTIONE PRODOTTI
// ============================================

class AdminProducts {
  constructor() {
    this.products = [];
    this.currentEditId = null;
    this.deleteId = null;
    this.initialized = false;
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  isAllowedCatalogImageSource(src) {
    return Boolean(this.normalizeCatalogImageSource(src));
  }

  normalizeCatalogImageSource(src) {
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
        // Fall through and keep the original source as a valid remote URL.
      }

      return value;
    }

    return '';
  }

  isLikelyUrl(value) {
    return /^https?:\/\//i.test(String(value || '').trim());
  }

  getSafeProductName(product) {
    const rawName = String(product?.name || '').trim();
    if (rawName && !this.isLikelyUrl(rawName)) {
      return rawName;
    }

    const productId = Number(product?.id) || 0;
    const canonicalName = Array.isArray(window.TechStoreProducts?.products)
      ? window.TechStoreProducts.products.find((p) => Number(p.id) === productId)?.name
      : '';
    const safeCanonical = String(canonicalName || '').trim();
    if (safeCanonical && !this.isLikelyUrl(safeCanonical)) {
      return safeCanonical;
    }

    const brand = String(product?.brand || '').trim();
    if (brand) {
      return `${brand} prodotto`;
    }

    return productId ? `Prodotto ${productId}` : 'Prodotto senza nome';
  }

  normalizeProductImages(product) {
    const normalizedMainImage = this.normalizeCatalogImageSource(product.image);
    const normalizedImage = normalizedMainImage || ADMIN_CONFIG.defaultImage;
    const normalizedImages = Array.isArray(product.images)
      ? product.images
          .map((img) => this.normalizeCatalogImageSource(img))
          .filter(Boolean)
      : [];

    return {
      ...product,
      name: this.getSafeProductName(product),
      image: normalizedImage,
      images: normalizedImages.length ? normalizedImages : [normalizedImage]
    };
  }

  sanitizeImageSrc(src) {
    const normalizedSource = this.normalizeCatalogImageSource(src);
    if (normalizedSource) {
      return this.escapeHtml(normalizedSource);
    }
    return ADMIN_CONFIG.defaultImage;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.loadProducts();
    this.bindEvents();
    this.renderProductsTable();
  }

  // Carica prodotti da localStorage o usa quelli di default
  loadProducts() {
    const stored = localStorage.getItem(ADMIN_CONFIG.storageKey);
    if (stored) {
      const parsedProducts = JSON.parse(stored);
      this.products = Array.isArray(parsedProducts)
        ? parsedProducts.map((product) => this.normalizeProductImages(product))
        : [];
      this.saveProducts();
    } else {
      // Usa i prodotti di default da products.js
      this.products = [...TechStoreProducts.products].map((product) => this.normalizeProductImages(product));
      this.saveProducts();
    }
  }

  // Salva prodotti in localStorage
  saveProducts() {
    this.products = this.products.map((product) => this.normalizeProductImages(product));
    localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(this.products));
    // Aggiorna anche la variabile globale per il sito
    TechStoreProducts.products = this.products;
  }

  bindEvents() {
    // Filtro categoria
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
      filterCategory.addEventListener('change', () => this.renderProductsTable());
    }

    // Bottone nuovo prodotto
    const addBtn = document.getElementById('add-product-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddForm());
    }

    // Link sidebar
    document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Torna alla lista
    const backBtn = document.getElementById('back-to-list');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.switchView('products'));
    }

    // Annulla form
    const cancelBtn = document.getElementById('cancel-form');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.switchView('products'));
    }

    // Salva prodotto
    const productForm = document.getElementById('product-form');
    if (productForm) {
      productForm.addEventListener('submit', (e) => this.handleSave(e));
    }

    // Preview immagine
    const imageInput = document.getElementById('product-image');
    if (imageInput) {
      imageInput.addEventListener('input', () => this.updateImagePreview());
    }

    // Toggle tipo immagine (URL vs Upload)
    const imageSourceUrl = document.getElementById('image-source-url');
    const imageSourceUpload = document.getElementById('image-source-upload');
    if (imageSourceUrl && imageSourceUpload) {
      imageSourceUrl.addEventListener('change', () => this.toggleImageSource());
      imageSourceUpload.addEventListener('change', () => this.toggleImageSource());
    }

    // Upload immagine da file
    const imageFileInput = document.getElementById('product-image-file');
    if (imageFileInput) {
      imageFileInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    // Conferma eliminazione
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
    }

    // Toggle sidebar mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }
  }

  // Renderizza la tabella dei prodotti
  renderProductsTable() {
    const tbody = document.getElementById('products-table-body');
    const noProducts = document.getElementById('no-products');
    const filterCategory = document.getElementById('filter-category')?.value || '';

    if (!tbody) return;

    let filtered = this.products;
    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      noProducts.classList.remove('d-none');
      return;
    }

    noProducts.classList.add('d-none');

    tbody.innerHTML = filtered.map(product => {
      const categoryToken = String(product.category || '')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');
      return `
      <tr>
        <td>${Number(product.id) || 0}</td>
        <td>
          <img src="${this.sanitizeImageSrc(product.image || ADMIN_CONFIG.defaultImage)}"
               alt="${this.escapeHtml(product.name)}"
               class="product-thumb"
               onerror="this.src='${ADMIN_CONFIG.defaultImage}'">
        </td>
        <td>
          <strong>${this.escapeHtml(product.name)}</strong>
          ${product.isNew ? '<span class="badge bg-primary ms-1">Nuovo</span>' : ''}
          ${product.discount > 0 ? `<span class="badge bg-danger ms-1">-${product.discount}%</span>` : ''}
        </td>
        <td>${this.escapeHtml(product.brand)}</td>
        <td><span class="category-badge category-${categoryToken}">${this.getCategoryLabel(categoryToken)}</span></td>
        <td>
          ${product.discount > 0
            ? `<span class="text-danger fw-bold">€${Number(product.price).toFixed(2)}</span>
               <span class="text-muted text-decoration-line-through small">€${Number(product.originalPrice).toFixed(2)}</span>`
            : `€${Number(product.price).toFixed(2)}`
          }
        </td>
        <td>
          ${product.inStock
            ? `<span class="text-success">${product.stock} pz</span>`
            : '<span class="text-danger">Non disponibile</span>'
          }
        </td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-primary" onclick="adminProducts.editProduct(${Number(product.id) || 0})" title="Modifica">
              ✏️
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="adminProducts.deleteProduct(${Number(product.id) || 0})" title="Elimina">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
    }).join('');
  }

  getCategoryLabel(category) {
    const labels = {
      'televisori': 'TV',
      'smartphone': 'Phone',
      'tablet': 'Tablet',
      'notebook': 'Notebook',
      'audio': 'Audio',
      'smart-home': 'Smart Home'
    };
    return labels[category] || category;
  }

  // Cambia vista
  switchView(view) {
    document.querySelectorAll('.admin-view').forEach(v => v.classList.add('d-none'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

    if (view === 'products') {
      document.getElementById('view-products').classList.remove('d-none');
      document.querySelector('.sidebar-link[data-view="products"]')?.classList.add('active');
      this.renderProductsTable();
    } else if (view === 'add') {
      document.getElementById('view-form').classList.remove('d-none');
      document.querySelector('.sidebar-link[data-view="add"]')?.classList.add('active');
      this.resetForm();
    }
  }

  // Mostra form per aggiungere
  showAddForm() {
    this.currentEditId = null;
    document.getElementById('form-title').textContent = 'Nuovo Prodotto';
    this.resetForm();
    this.switchView('add');
  }

  // Modifica prodotto esistente
  editProduct(id) {
    // Assicura che id sia un numero per il confronto
    const productId = Number(id);
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      console.error('Prodotto non trovato:', id, this.products);
      return;
    }

    this.currentEditId = productId;
    document.getElementById('form-title').textContent = 'Modifica Prodotto';

    // Compila il form
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-brand').value = product.brand || '';
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-price').value = product.price || '';
    document.getElementById('product-original-price').value = product.originalPrice || '';
    document.getElementById('product-discount').value = product.discount || 0;

    // Gestione immagine: determina se è base64 o URL
    const imageValue = product.image || '';
    const imageInput = document.getElementById('product-image');

    if (imageValue.startsWith('data:')) {
      // Immagine base64 - usa modalità upload
      imageInput.dataset.uploadedImage = imageValue;
      imageInput.value = '';
      document.getElementById('image-source-upload').checked = true;
    } else {
      // Immagine URL - usa modalità URL
      imageInput.dataset.uploadedImage = '';
      imageInput.value = imageValue;
      document.getElementById('image-source-url').checked = true;
    }

    this.toggleImageSource();
    document.getElementById('product-rating').value = product.rating || 0;
    document.getElementById('product-reviews').value = product.reviews || 0;
    document.getElementById('product-stock').value = product.stock || 0;
    document.getElementById('product-instock').checked = product.inStock !== false;
    document.getElementById('product-featured').checked = product.featured === true;
    document.getElementById('product-new').checked = product.isNew === true;

    this.updateImagePreview();
    document.querySelectorAll('.admin-view').forEach(v => v.classList.add('d-none'));
    document.getElementById('view-form').classList.remove('d-none');
  }

  // Reset form
  resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-image').value = ADMIN_CONFIG.defaultImage;
    document.getElementById('product-image').dataset.uploadedImage = '';
    document.getElementById('product-image-file').value = '';
    // Reset toggle a URL
    document.getElementById('image-source-url').checked = true;
    this.toggleImageSource();
    this.updateImagePreview();
  }

  // Preview immagine
  updateImagePreview() {
    const preview = document.getElementById('image-preview');
    const imageInput = document.getElementById('product-image');
    const imageSource = document.querySelector('input[name="imageSource"]:checked')?.value || 'url';

    // Usa l'immagine caricata se presente, altrimenti usa l'URL
    let imageUrl = ADMIN_CONFIG.defaultImage;

    if (imageSource === 'url') {
      imageUrl = imageInput?.value || ADMIN_CONFIG.defaultImage;
    } else {
      // Immagine caricata da file (già in base64)
      const uploadedImage = imageInput?.dataset?.uploadedImage || '';
      imageUrl = uploadedImage || ADMIN_CONFIG.defaultImage;
    }

    if (preview) {
      preview.innerHTML = `<img src="${this.sanitizeImageSrc(imageUrl)}" alt="Preview" onerror="this.parentElement.innerHTML='<span>📷</span>'">`;
    }
  }

  // Toggle tra URL e upload file
  toggleImageSource() {
    const imageSource = document.querySelector('input[name="imageSource"]:checked')?.value || 'url';
    const urlInputGroup = document.getElementById('url-input-group');
    const fileInputGroup = document.getElementById('file-input-group');

    if (imageSource === 'url') {
      urlInputGroup?.classList.remove('d-none');
      fileInputGroup?.classList.add('d-none');
    } else {
      urlInputGroup?.classList.add('d-none');
      fileInputGroup?.classList.remove('d-none');
    }

    this.updateImagePreview();
  }

  // Gestione upload immagine (conversione in base64)
  handleImageUpload(event) {
    const file = event.target.files[0];
    const imageInput = document.getElementById('product-image');

    if (!file) return;

    // Verifica che sia un'immagine
    if (!file.type.startsWith('image/')) {
      this.showToast('Seleziona un file immagine valido', 'error');
      return;
    }

    // Limite dimensione (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('L\'immagine non deve superare 5MB', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result;
      // Salva l'immagine base64 nel dataset dell'input
      if (imageInput) {
        imageInput.dataset.uploadedImage = base64Image;
      }
      this.updateImagePreview();
      this.showToast('Immagine caricata!', 'success');
    };

    reader.onerror = () => {
      this.showToast('Errore nel caricamento dell\'immagine', 'error');
    };

    reader.readAsDataURL(file);
  }

  // Salva prodotto (create or update)
  handleSave(e) {
    e.preventDefault();

    // Determina l'immagine da usare (base64 o URL)
    const imageInput = document.getElementById('product-image');
    const imageSource = document.querySelector('input[name="imageSource"]:checked')?.value || 'url';
    let productImage = ADMIN_CONFIG.defaultImage;

    if (imageSource === 'upload' && imageInput?.dataset?.uploadedImage) {
      // Usa l'immagine caricata (base64)
      productImage = imageInput.dataset.uploadedImage;
    } else {
      // Usa l'URL inserito
      const typedValue = String(imageInput?.value || '').trim();
      if (typedValue && !this.isAllowedCatalogImageSource(typedValue)) {
        this.showToast('Sono consentiti solo percorsi locali (assets/...) o upload file.', 'error');
        return;
      }
      productImage = typedValue || ADMIN_CONFIG.defaultImage;
    }

    const allowedCategories = ['televisori', 'smartphone', 'tablet', 'notebook', 'audio', 'smart-home'];
    const rawCategory = document.getElementById('product-category').value;
    const safeCategory = allowedCategories.includes(rawCategory) ? rawCategory : 'televisori';

    const productData = {
      id: this.currentEditId || this.getNextId(),
      name: this.getSafeProductName({ id: this.currentEditId || this.getNextId(), brand: document.getElementById('product-brand').value.trim(), name: document.getElementById('product-name').value.trim() }),
      brand: document.getElementById('product-brand').value.trim(),
      category: safeCategory,
      description: document.getElementById('product-description').value.trim(),
      price: parseFloat(document.getElementById('product-price').value) || 0,
      originalPrice: parseFloat(document.getElementById('product-original-price').value) || 0,
      discount: parseInt(document.getElementById('product-discount').value) || 0,
      image: productImage,
      images: [productImage],
      rating: parseFloat(document.getElementById('product-rating').value) || 0,
      reviews: parseInt(document.getElementById('product-reviews').value) || 0,
      stock: parseInt(document.getElementById('product-stock').value) || 0,
      inStock: document.getElementById('product-instock').checked,
      featured: document.getElementById('product-featured').checked,
      isNew: document.getElementById('product-new').checked,
      specs: {}
    };

    if (this.currentEditId) {
      // Update esistente
      const index = this.products.findIndex(p => p.id === this.currentEditId);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...productData };
      }
    } else {
      // Nuovo prodotto
      this.products.unshift(productData);
    }

    this.saveProducts();
    this.showToast(this.currentEditId ? 'Prodotto aggiornato!' : 'Prodotto aggiunto!', 'success');
    this.switchView('products');
  }

  // Genera prossimo ID
  getNextId() {
    return Math.max(0, ...this.products.map(p => p.id)) + 1;
  }

  // Elimina prodotto
  deleteProduct(id) {
    const productId = Number(id);
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.deleteId = id;
    document.getElementById('delete-product-name').textContent = product.name;

    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  confirmDelete() {
    if (this.deleteId) {
      this.products = this.products.filter(p => p.id !== this.deleteId);
      this.saveProducts();
      this.showToast('Prodotto eliminato!', 'success');
      this.renderProductsTable();
      this.deleteId = null;
    }
    bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
  }

  // Mostra toast
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// ============================================
// INIZIALIZZAZIONE
// ============================================

let adminAuth;
let adminProducts;

document.addEventListener('DOMContentLoaded', () => {
  adminProducts = new AdminProducts();
  adminAuth = new AdminAuth();
});

// Espone le funzioni globalmente per gli onclick
window.adminProducts = {
  editProduct: (id) => adminProducts?.editProduct(id),
  deleteProduct: (id) => adminProducts?.deleteProduct(id)
};
