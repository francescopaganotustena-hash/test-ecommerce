/**
 * TECHSTORE - Gestione Carrello
 * Funzionalità carrello con persistenza localStorage
 */

class ShoppingCart {
  constructor() {
    this.storageKey = 'techstore_cart';
    this.discountKey = 'techstore_discount';
    this.items = this.loadCart();
    this.appliedDiscount = this.loadDiscount();
    this.listeners = [];
  }

  // Carica sconto da localStorage
  loadDiscount() {
    try {
      const saved = localStorage.getItem(this.discountKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  // Salva sconto su localStorage
  saveDiscount() {
    try {
      if (this.appliedDiscount) {
        localStorage.setItem(this.discountKey, JSON.stringify(this.appliedDiscount));
      } else {
        localStorage.removeItem(this.discountKey);
      }
    } catch (e) {
      console.error('Errore nel salvataggio dello sconto:', e);
    }
  }

  // Carica carrello da localStorage
  loadCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      return this.normalizeSavedItems(parsed);
    } catch (e) {
      console.error('Errore nel caricamento del carrello:', e);
      return [];
    }
  }

  normalizeSavedItems(items) {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      if (!window.TechStoreProducts || !Array.isArray(window.TechStoreProducts.products)) {
        return item;
      }

      const liveProduct = window.TechStoreProducts.products.find((p) => p.id === item.id);
      if (!liveProduct) return item;

      return {
        ...item,
        name: liveProduct.name,
        brand: liveProduct.brand,
        price: liveProduct.price,
        originalPrice: liveProduct.originalPrice,
        discount: liveProduct.discount,
        image: liveProduct.image,
        category: liveProduct.category,
        maxStock: liveProduct.stock
      };
    });
  }

  // Salva carrello su localStorage
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.notifyListeners();
    } catch (e) {
      console.error('Errore nel salvataggio del carrello:', e);
    }
  }

  // Aggiungi prodotto al carrello
  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      // Prodotto già presente, aggiorna quantità
      this.items[existingIndex].quantity += quantity;
    } else {
      // Nuovo prodotto
      this.items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        category: product.category,
        quantity: quantity,
        maxStock: product.stock
      });
    }

    this.saveCart();
    this.showToast('success', `${product.name} aggiunto al carrello!`);

    // Emetti evento per aggiornare UI
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'add', product } }));

    return true;
  }

  // Rimuovi prodotto dal carrello
  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === parseInt(productId));
    if (index > -1) {
      const removedItem = this.items[index];
      this.items.splice(index, 1);
      this.saveCart();
      this.showToast('info', `${removedItem.name} rimosso dal carrello`);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'remove', productId } }));
      return true;
    }
    return false;
  }

  // Aggiorna quantità prodotto
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === parseInt(productId));
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = Math.min(quantity, item.maxStock);
        this.saveCart();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'update', productId, quantity } }));
      }
      return true;
    }
    return false;
  }

  // Incrementa quantità
  incrementQuantity(productId) {
    const item = this.items.find(item => item.id === parseInt(productId));
    if (item && item.quantity < item.maxStock) {
      item.quantity++;
      this.saveCart();
      return true;
    }
    return false;
  }

  // Decrementa quantità
  decrementQuantity(productId) {
    const item = this.items.find(item => item.id === parseInt(productId));
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      } else {
        this.removeItem(productId);
      }
      return true;
    }
    return false;
  }

  // Svuota carrello
  clearCart() {
    this.items = [];
    this.appliedDiscount = null;
    this.saveCart();
    this.saveDiscount();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'clear' } }));
  }

  // Ottieni numero totale di articoli
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calcola subtotale
  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calcola sconto totale
  getTotalSavings() {
    return this.items.reduce((total, item) => {
      const originalTotal = item.originalPrice * item.quantity;
      const actualTotal = item.price * item.quantity;
      return total + (originalTotal - actualTotal);
    }, 0);
  }

  // Calcola totale con spedizione
  getTotal(shippingCost = 0) {
    const subtotal = this.getSubtotal();
    const discountAmount = this.getDiscountAmount();
    const discountedSubtotal = subtotal - discountAmount;
    const total = discountedSubtotal + (subtotal >= 50 || subtotal === 0 ? 0 : shippingCost);
    return total;
  }

  // Verifica se il carrello è vuoto
  isEmpty() {
    return this.items.length === 0;
  }

  // Ottieni tutti gli articoli
  getItems() {
    return this.items;
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  normalizeImageSrc(src) {
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

  sanitizeImageSrc(src) {
    const normalizedSource = this.normalizeImageSrc(src);
    if (normalizedSource) {
      return this.escapeHtml(normalizedSource);
    }
    return 'assets/images/products/placeholder-product.svg';
  }

  // Applica codice sconto (simulato)
  applyDiscountCode(code) {
    const validCodes = {
      'BENVENUTO10': 10,
      'TECH20': 20,
      'SALDI30': 30
    };

    const upperCode = code.toUpperCase().trim();
    if (validCodes[upperCode]) {
      this.appliedDiscount = {
        code: upperCode,
        percentage: validCodes[upperCode]
      };
      this.saveDiscount();
      this.notifyListeners();
      return {
        valid: true,
        discount: validCodes[upperCode],
        message: `Codice applicato: ${upperCode} (-${validCodes[upperCode]}%)`
      };
    }
    return {
      valid: false,
      message: 'Codice sconto non valido'
    };
  }

  // Rimuovi codice sconto
  removeDiscountCode() {
    this.appliedDiscount = null;
    this.saveDiscount();
    this.notifyListeners();
  }

  // Ottieni sconto applicato
  getAppliedDiscount() {
    return this.appliedDiscount;
  }

  // Calcola ammontare sconto
  getDiscountAmount() {
    if (!this.appliedDiscount) return 0;
    const subtotal = this.getSubtotal();
    return subtotal * (this.appliedDiscount.percentage / 100);
  }

  // Notifica aggiornamenti
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.items));
  }

  // Mostra toast notifica
  showToast(type, message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = document.createElement('span');
    icon.textContent = this.getToastIcon(type);
    const text = document.createElement('span');
    text.textContent = String(message ?? '');
    toast.append(icon, text);
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  getToastIcon(type) {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '•';
    }
  }

  // Aggiorna UI del carrello
  updateCartUI() {
    // Aggiorna badge contatore
    const cartBadges = document.querySelectorAll('.cart-count');
    const totalItems = this.getTotalItems();
    
    cartBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    // Aggiorna pagina carrello se presente
    this.updateCartPage();
  }

  updateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    const items = this.getItems();
    
    if (items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="text-center py-5">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
          <h3>Il tuo carrello è vuoto</h3>
          <p class="text-muted mb-4">Scopri i nostri prodotti e aggiungi qualcosa al carrello!</p>
          <a href="catalogo.html" class="btn btn-primary btn-lg">Vai allo shop</a>
        </div>
      `;
      document.getElementById('cart-summary')?.remove();
      return;
    }

    let html = '';
    items.forEach(item => {
      const safeName = this.escapeHtml(item.name);
      const safeBrand = this.escapeHtml(item.brand);
      const safeImage = this.sanitizeImageSrc(item.image);
      const discountedPrice = item.discount > 0 
        ? (item.price * (1 - item.discount / 100)).toFixed(2)
        : item.price;
      
      html += `
        <div class="cart-item card mb-3" data-id="${item.id}">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-2">
                <img src="${safeImage}" alt="${safeName}" class="img-fluid rounded" style="max-height: 120px; object-fit: cover;">
              </div>
              <div class="col-md-4">
                <h5 class="mb-1">${safeName}</h5>
                <p class="text-muted mb-0">${safeBrand}</p>
                ${item.discount > 0 ? `<span class="badge badge-sale mt-1">-${item.discount}%</span>` : ''}
              </div>
              <div class="col-md-2 text-center">
                <div class="quantity-control d-flex align-items-center justify-content-center gap-2">
                  <button class="btn btn-sm btn-outline-primary" onclick="cart.decrementQuantity(${item.id})">-</button>
                  <input type="number" value="${item.quantity}" min="1" max="${item.maxStock}"
                         class="form-control form-control-sm text-center" style="width: 60px;"
                         onchange="cart.updateQuantity(${item.id}, parseInt(this.value))" oninput="this.value = Math.min(Math.max(this.value, 1), ${item.maxStock})">
                  <button class="btn btn-sm btn-outline-primary" onclick="cart.incrementQuantity(${item.id})">+</button>
                </div>
              </div>
              <div class="col-md-2 text-center">
                <p class="mb-0 fw-bold">€${Number(discountedPrice).toFixed(2)}</p>
                ${item.discount > 0 ? `<small class="text-muted text-decoration-line-through">€${item.originalPrice.toFixed(2)}</small>` : ''}
              </div>
              <div class="col-md-2 text-end">
                <p class="mb-2 fw-bold text-primary">€${(Number(discountedPrice) * item.quantity).toFixed(2)}</p>
                <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem(${item.id})">
                  Rimuovi
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;

    // Aggiorna riepilogo
    this.updateCartSummary();
  }

  updateCartSummary() {
    const summaryContainer = document.getElementById('cart-summary');
    if (!summaryContainer) return;

    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const discountAmount = this.getDiscountAmount();
    const total = this.getTotal(shipping);
    const savings = this.getTotalSavings();
    const appliedDiscount = this.getAppliedDiscount();

    summaryContainer.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h4 class="card-title mb-4">Riepilogo Ordine</h4>
          
          <div class="d-flex justify-content-between mb-2">
            <span>Subtotale</span>
            <span>€${subtotal.toFixed(2)}</span>
          </div>
          
          ${savings > 0 ? `
          <div class="d-flex justify-content-between mb-2 text-success">
            <span>Risparmio</span>
            <span>-€${savings.toFixed(2)}</span>
          </div>
          ` : ''}

          ${discountAmount > 0 ? `
          <div class="d-flex justify-content-between mb-2 text-success">
            <span>Sconto codice ${this.escapeHtml(appliedDiscount?.code)}</span>
            <span>-€${discountAmount.toFixed(2)}</span>
          </div>
          ` : ''}
          
          <div class="d-flex justify-content-between mb-2">
            <span>Spedizione</span>
            <span>${shipping === 0 ? '<span class="text-success">GRATIS</span>' : '€' + shipping.toFixed(2)}</span>
          </div>
          
          ${subtotal < 50 ? `
          <div class="alert alert-info mt-3 mb-3 py-2" style="font-size: 0.875rem;">
            Aggiungi altri <strong>€${(50 - subtotal).toFixed(2)}</strong> per avere la spedizione gratuita!
          </div>
          ` : ''}
          
          <hr>
          
          <div class="d-flex justify-content-between mb-4">
            <strong>Totale</strong>
            <strong class="text-primary" style="font-size: 1.5rem;">€${total.toFixed(2)}</strong>
          </div>

          <div class="promo-code-input">
            <input id="promo-code" class="form-control" type="text" placeholder="Inserisci codice sconto">
            <button type="button" class="btn btn-outline-primary" onclick="applyPromoCode()">Applica</button>
          </div>
          
          <a href="checkout.html" class="btn btn-accent btn-lg btn-block mb-3">
            Procedi al Checkout
          </a>
          
          <a href="catalogo.html" class="btn btn-outline-primary btn-block">
            Continua gli acquisti
          </a>
          
          <div class="mt-4">
            <p class="mb-2"><small>🔒 Pagamento sicuro</small></p>
            <p class="mb-0"><small>📦 Spedizione in 24/48h</small></p>
          </div>
        </div>
      </div>
    `;
  }
}

// Istanzia carrello globale
const cart = new ShoppingCart();

// Esporta globalmente
window.cart = cart;
window.TechStoreCart = {
  cart,
  ShoppingCart
};
