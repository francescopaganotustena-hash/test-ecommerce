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
    this.isAuthenticated = sessionStorage.getItem(ADMIN_CONFIG.authSessionKey) === 'true';
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

    if (this.isAuthenticated) {
      this.showDashboard();
      return;
    }

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
    const bytes = new TextEncoder().encode(String(password || ''));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async handleLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const passwordConfirmInput = document.getElementById('admin-password-confirm');
    const errorDiv = document.getElementById('login-error');
    const password = passwordInput?.value?.trim() || '';

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

    sessionStorage.setItem(ADMIN_CONFIG.authSessionKey, 'true');
    this.isAuthenticated = true;
    errorDiv.classList.add('d-none');
    this.showDashboard();
  }

  logout() {
    sessionStorage.removeItem(ADMIN_CONFIG.authSessionKey);
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
    adminProducts.init();
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
    this.init();
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  sanitizeImageSrc(src) {
    const value = String(src || '').trim();
    if (
      value.startsWith('assets/') ||
      value.startsWith('./assets/') ||
      value.startsWith('../assets/') ||
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:image/')
    ) {
      return this.escapeHtml(value);
    }
    return ADMIN_CONFIG.defaultImage;
  }

  init() {
    this.loadProducts();
    this.bindEvents();
    this.renderProductsTable();
  }

  // Carica prodotti da localStorage o usa quelli di default
  loadProducts() {
    const stored = localStorage.getItem(ADMIN_CONFIG.storageKey);
    if (stored) {
      this.products = JSON.parse(stored);
    } else {
      // Usa i prodotti di default da products.js
      this.products = [...TechStoreProducts.products];
      this.saveProducts();
    }
  }

  // Salva prodotti in localStorage
  saveProducts() {
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
      productImage = imageInput?.value || ADMIN_CONFIG.defaultImage;
    }

    const allowedCategories = ['televisori', 'smartphone', 'tablet', 'notebook', 'audio', 'smart-home'];
    const rawCategory = document.getElementById('product-category').value;
    const safeCategory = allowedCategories.includes(rawCategory) ? rawCategory : 'televisori';

    const productData = {
      id: this.currentEditId || this.getNextId(),
      name: document.getElementById('product-name').value.trim(),
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
  adminAuth = new AdminAuth();
  adminProducts = new AdminProducts();
});

// Espone le funzioni globalmente per gli onclick
window.adminProducts = {
  editProduct: (id) => adminProducts?.editProduct(id),
  deleteProduct: (id) => adminProducts?.deleteProduct(id)
};
