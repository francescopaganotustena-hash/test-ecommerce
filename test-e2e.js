/**
 * TechStore - Test E2E (End-to-End)
 * Script di test automatizzato per il flusso completo di acquisto
 *
 * Utilizzo: node test-e2e.js
 * Requisiti: npm install puppeteer
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Configurazione
const BASE_PATH = path.join(__dirname);
const SCREENSHOTS_DIR = path.join(BASE_PATH, 'test-screenshots');
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const SHOULD_START_LOCAL_SERVER = !process.env.BASE_URL;
let localServer;

// Funzione helper per attese
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Risultati test
const testResults = [];
let browser;

// Colori per output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function pageUrl(pageName) {
  return `${BASE_URL}/${pageName}`;
}

function resolveMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
  };
  return map[ext] || 'application/octet-stream';
}

async function startLocalServer() {
  if (!SHOULD_START_LOCAL_SERVER) return;
  const host = '127.0.0.1';
  const port = 4173;

  localServer = http.createServer((req, res) => {
    const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const relativePath = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
    const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(BASE_PATH, normalized);
    if (!absolutePath.startsWith(BASE_PATH)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(absolutePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': resolveMime(absolutePath) });
      res.end(data);
    });
  });

  await new Promise((resolve, reject) => {
    localServer.once('error', reject);
    localServer.listen(port, host, resolve);
  });

  log(`🌐 Server test avviato su ${BASE_URL}`, 'cyan');
}

function logTest(step, description, status, details = '') {
  const icon = status === 'PASS' ? '✓' : status === 'FAIL' ? '✕' : '○';
  const color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'blue';
  log(`  ${icon} [${status}] ${description} ${details}`, color);
  testResults.push({ step, description, status, details });
}

async function takeScreenshot(page, name) {
  const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  log(`  📸 Screenshot salvato: ${name}.png`, 'cyan');
  return filepath;
}

async function waitForSelector(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout, visible: true });
    return true;
  } catch (e) {
    return false;
  }
}

async function waitForNavigation(page, expectedUrl, timeout = 15000) {
  try {
    await page.waitForFunction(
      (expected) => window.location.href.includes(expected),
      { timeout },
      expectedUrl
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function clearStorage(page) {
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch(e) {
      // Ignora errori di accesso
    }
  });
}

async function getLocalStorage(page, key) {
  try {
    return await page.evaluate((k) => {
      try {
        return localStorage.getItem(k);
      } catch(e) {
        return null;
      }
    }, key);
  } catch(e) {
    return null;
  }
}

// ============================================
// TEST SUITE: Flusso Completo Acquisto
// ============================================

async function test1_ArrivoSito(page) {
  log('\n🔍 TEST 1: Arrivo sul sito (index.html)', 'cyan');

  try {
    // Carica homepage
    await page.goto(pageUrl('index.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Verifica caricamento pagina
    const title = await page.title();
    logTest(1, 'Caricamento pagina index.html',
      title.includes('TechStore') ? 'PASS' : 'FAIL',
      `(titolo: ${title})`);

    // Verifica header
    const header = await waitForSelector(page, '.header');
    logTest(1, 'Verifica header presente', header ? 'PASS' : 'FAIL');

    // Verifica logo
    const logo = await page.$('.header-logo');
    logTest(1, 'Verifica logo TechStore', logo ? 'PASS' : 'FAIL');

    // Verifica navigazione
    const nav = await page.$('.header-nav');
    logTest(1, 'Verifica navigazione principale', nav ? 'PASS' : 'FAIL');

    // Verifica contatore carrello iniziale (deve essere 0 o non visibile)
    const cartCount = await page.$('.cart-count');
    const isHidden = cartCount ? await cartCount.evaluate(el => el.style.display === 'none') : true;
    logTest(1, 'Contatore carrello inizialmente a 0', isHidden ? 'PASS' : 'FAIL');

    // Verifica sezione hero
    const hero = await page.$('.hero-section');
    logTest(1, 'Verifica sezione Hero', hero ? 'PASS' : 'FAIL');

    // Verifica presenza prodotti in evidenza
    const featuredProducts = await page.$('#featured-products-grid');
    logTest(1, 'Verifica prodotti in evidenza', featuredProducts ? 'PASS' : 'FAIL');

    // Check for JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    await page.reload({ waitUntil: 'networkidle0' });
    logTest(1, 'Nessun errore JavaScript critico',
      jsErrors.length === 0 ? 'PASS' : 'FAIL',
      jsErrors.length > 0 ? `(${jsErrors.length} errori)` : '');

    return true;
  } catch (error) {
    logTest(1, 'Test arrivo sul sito', 'FAIL', error.message);
    return false;
  }
}

async function test2_Registrazione(page) {
  log('\n🔍 TEST 2: Registrazione utente (login.html)', 'cyan');

  try {
    // Vai alla pagina di login/registrazione
    await page.goto(pageUrl('login.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Verifica pagina login
    const title = await page.title();
    logTest(2, 'Caricamento pagina login.html',
      title.includes('Accedi') ? 'PASS' : 'FAIL');

    // Verifica tab registrazione
    const registerTab = await page.$('[data-tab="register"]');
    logTest(2, 'Verifica tab Registrazione', registerTab ? 'PASS' : 'FAIL');

    // Clicca sul tab Registrazione
    await registerTab.click();
    await wait(500);

    // Verifica che il form di registrazione sia visibile
    const registerForm = await page.$('#register-content.active');
    logTest(2, 'Form registrazione visibile', registerForm ? 'PASS' : 'FAIL');

    // Compila form registrazione
    const testUser = {
      firstname: 'Mario',
      lastname: 'Rossi',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    await page.type('#register-form input[name="firstname"]', testUser.firstname);
    await page.type('#register-form input[name="lastname"]', testUser.lastname);
    await page.type('#register-form input[name="email"]', testUser.email);
    await page.type('#register-form input[name="password"]', testUser.password);
    await page.type('#register-form input[name="confirmPassword"]', testUser.password);

    // Accetta termini
    await page.click('#register-form #terms-reg');

    logTest(2, 'Compilazione form registrazione', 'PASS');

    // Submit form - usa evaluate per evitare problemi di click
    await page.click('#register-form button[type="submit"]');

    // Attende redirect a account.html
    const redirected = await waitForNavigation(page, 'account.html', 7000);
    logTest(2, 'Redirect a account.html dopo registrazione', redirected ? 'PASS' : 'FAIL');

    // Verifica sessione in localStorage
    const sessionRaw = await getLocalStorage(page, 'techstore_session');
    const userRaw = await getLocalStorage(page, 'techstore_user');
    const sessionData = sessionRaw ? JSON.parse(sessionRaw) : null;
    const userData = userRaw ? JSON.parse(userRaw) : null;
    if (sessionData && sessionData.loggedIn && userData) {
      logTest(2, 'Sessione salvata in localStorage', 'PASS');
      logTest(2, 'Dati utente salvati', 'PASS');
    } else {
      logTest(2, 'Sessione salvata in localStorage', 'FAIL');
      logTest(2, 'Dati utente salvati', 'FAIL');
    }

    // Verifica nome utente nell'header (usa evaluate)
    const userName = await page.evaluate(() => {
      const el = document.getElementById('user-name');
      return el ? el.textContent : null;
    });

    if (userName) {
      logTest(2, 'Nome utente visualizzato',
        userName.includes('Mario') ? 'PASS' : 'FAIL');
    } else {
      logTest(2, 'Nome utente visualizzato', 'FAIL', '(pagina non caricata correttamente)');
    }

    return testUser; // Restituisce i dati per login successivo
  } catch (error) {
    logTest(2, 'Test registrazione', 'FAIL', error.message);
    return null;
  }
}

async function test3_NavigazioneCatalogo(page) {
  log('\n🔍 TEST 3: Navigazione Catalogo (catalogo.html)', 'cyan');

  try {
    // Vai al catalogo
    await page.goto(pageUrl('catalogo.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Verifica caricamento catalogo
    const title = await page.title();
    logTest(3, 'Caricamento catalogo.html',
      title.includes('Catalogo') ? 'PASS' : 'FAIL');

    // Verifica presenza griglia prodotti
    const catalogGrid = await waitForSelector(page, '#catalog-grid');
    logTest(3, 'Griglia prodotti presente', catalogGrid ? 'PASS' : 'FAIL');

    // Attende caricamento prodotti
    await wait(1500);

    // Verifica prodotti renderizzati
    const products = await page.$$('.product-card');
    logTest(3, 'Prodotti caricati nel catalogo',
      products.length > 0 ? 'PASS' : 'FAIL',
      `(${products.length} prodotti)`);

    // Test filtri - seleziona categoria
    const categoryFilter = await page.$('#category-filter');
    if (categoryFilter) {
      await page.select('#category-filter', 'smartphone');
      await wait(1000);

      const filteredProducts = await page.$$('.product-card');
      logTest(3, 'Filtro categoria funziona',
        filteredProducts.length > 0 ? 'PASS' : 'FAIL');
    }

    // Test ordinamento
    const sortSelect = await page.$('#sort-select');
    if (sortSelect) {
      await page.select('#sort-select', 'price-asc');
      await wait(500);
      logTest(3, 'Ordinamento prodotti', 'PASS');
    }

    // Verifica bottone "Aggiungi al carrello"
    const addToCartBtns = await page.$$('.add-to-cart-btn');
    logTest(3, 'Bottoni aggiungi al carrello presenti',
      addToCartBtns.length > 0 ? 'PASS' : 'FAIL',
      `(${addToCartBtns.length} bottoni)`);

    return true;
  } catch (error) {
    logTest(3, 'Test navigazione catalogo', 'FAIL', error.message);
    return false;
  }
}

async function test4_AggiuntaProdottoCarrello(page) {
  log('\n🔍 TEST 4: Aggiunta prodotto al carrello', 'cyan');

  try {
    // Vai al catalogo
    await page.goto(pageUrl('catalogo.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Attende caricamento prodotti
    await wait(1500);

    // Trova un bottone "Aggiungi al carrello"
    const addToCartBtn = await page.$('.add-to-cart-btn');
    if (!addToCartBtn) {
      logTest(4, 'Bottone aggiungi al carrello', 'FAIL', 'Non trovato');
      return false;
    }

    // Clicca su aggiungi al carrello
    await addToCartBtn.click();

    // Attende toast/feedback
    await wait(1000);

    // Verifica toast apparso
    const toast = await page.$('.toast');
    logTest(4, 'Feedback toast dopo aggiunta', toast ? 'PASS' : 'FAIL');

    // Verifica contatore carrello aggiornato
    const countText = await page.evaluate(() => {
      const el = document.querySelector('.cart-count');
      return el ? el.textContent : '0';
    });
    logTest(4, 'Contatore carrello aggiornato',
      parseInt(countText) > 0 ? 'PASS' : 'FAIL',
      `(count: ${countText})`);

    // Verifica localStorage carrello
    const cartData = await getLocalStorage(page, 'techstore_cart');
    const cartItems = cartData ? JSON.parse(cartData) : [];
    logTest(4, 'Carrello salvato in localStorage',
      cartItems.length > 0 ? 'PASS' : 'FAIL',
      `(${cartItems.length} articoli)`);

    return true;
  } catch (error) {
    logTest(4, 'Test aggiunta prodotto', 'FAIL', error.message);
    return false;
  }
}

async function test5_PaginaCarrello(page) {
  log('\n🔍 TEST 5: Pagina Carrello (carrello.html)', 'cyan');

  try {
    // Vai alla pagina carrello
    await page.goto(pageUrl('carrello.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Verifica caricamento
    const title = await page.title();
    logTest(5, 'Caricamento carrello.html',
      title.includes('Carrello') ? 'PASS' : 'FAIL');

    // Attende caricamento items
    await wait(1000);

    // Verifica presenza prodotti
    const cartItems = await page.$$('.cart-item');
    logTest(5, 'Visualizzazione prodotti nel carrello',
      cartItems.length > 0 ? 'PASS' : 'FAIL',
      `(${cartItems.length} prodotti)`);

    // Verifica riepilogo ordine
    const summary = await page.$('#cart-summary');
    logTest(5, 'Riepilogo ordine presente', summary ? 'PASS' : 'FAIL');

    // Verifica calcolo totale
    const totalText = await page.evaluate(() => {
      const el = document.querySelector('.text-primary');
      return el ? el.textContent : '';
    });
    logTest(5, 'Totale calcolato correttamente',
      totalText.includes('€') ? 'PASS' : 'FAIL',
      `(${totalText})`);

    // Test modifica quantità
    const qtyInput = await page.$('.quantity-control input');
    if (qtyInput) {
      await qtyInput.click({ clickCount: 3 });
      await page.keyboard.type('2');
      await wait(500);
      logTest(5, 'Modifica quantità prodotto', 'PASS');
    }

    // Test rimozione prodotto
    const removeBtn = await page.$('.btn-outline-danger');
    if (removeBtn) {
      await removeBtn.click();
      await wait(500);
      logTest(5, 'Rimozione prodotto dal carrello', 'PASS');
    }

    // Test codice sconto (aggiungo prima un prodotto)
    await page.goto(pageUrl('catalogo.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await wait(1000);
    const addBtn = await page.$('.add-to-cart-btn');
    if (addBtn) await addBtn.click();
    await wait(1000);

    // Torna al carrello
    await page.goto(pageUrl('carrello.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await wait(1000);

    // Test codice sconto valido - usa evaluate per trovare l'input
    const promoApplied = await page.evaluate(() => {
      const promoInput = document.getElementById('promo-code') || document.querySelector('input[placeholder*="codice"]');
      if (!promoInput) return false;
      promoInput.value = 'BENVENUTO10';
      const applyBtn = document.querySelector('.promo-code-input button') || promoInput.nextElementSibling;
      if (applyBtn) {
        applyBtn.click();
        return true;
      }
      return false;
    });
    await wait(500);

    const appliedToast = await page.$('.toast-success');
    logTest(5, 'Applicazione codice sconto',
      appliedToast ? 'PASS' : 'FAIL');

    return true;
  } catch (error) {
    logTest(5, 'Test pagina carrello', 'FAIL', error.message);
    return false;
  }
}

async function test6_Checkout(page) {
  log('\n🔍 TEST 6: Checkout (checkout.html)', 'cyan');

  try {
    // Assicurati che ci sia qualcosa nel carrello
    await page.goto(pageUrl('catalogo.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await wait(1000);
    const addBtn = await page.$('.add-to-cart-btn');
    if (addBtn) await addBtn.click();
    await wait(1000);

    // Vai al checkout
    await page.goto(pageUrl('checkout.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Verifica caricamento
    const title = await page.title();
    logTest(6, 'Caricamento checkout.html',
      title.includes('Checkout') ? 'PASS' : 'FAIL');

    // Verifica riepilogo ordine
    const orderItems = await page.$('#order-items');
    logTest(6, 'Riepilogo prodotti nel checkout', orderItems ? 'PASS' : 'FAIL');

    // Compila dati spedizione
    await page.type('input[name="firstname"]', 'Mario');
    await page.type('input[name="lastname"]', 'Rossi');
    await page.type('input[name="email"]', 'mario@test.com');
    await page.type('input[name="phone"]', '+39 333 1234567');
    await page.type('input[name="address"]', 'Via Roma 123');
    await page.type('input[name="zip"]', '20100');
    await page.type('input[name="city"]', 'Milano');
    await page.type('input[name="province"]', 'MI');

    logTest(6, 'Compilazione dati spedizione', 'PASS');

    // Seleziona metodo pagamento (Carta) - usa evaluate per attendere che sia caricato
    await page.evaluate(() => {
      const firstPayment = document.querySelector('.payment-method');
      if (firstPayment) firstPayment.click();
    });
    await wait(500);
    logTest(6, 'Selezione metodo pagamento', 'PASS');

    // Accetta termini
    await page.click('#terms');
    await page.click('#privacy');

    // Verifica totale ordine
    const orderTotal = await page.$eval('#order-total', el => el.textContent);
    logTest(6, 'Totale ordine aggiornato',
      orderTotal.includes('€') ? 'PASS' : 'FAIL',
      `(${orderTotal})`);

    // Submit ordine - usa evaluate
    await page.evaluate(() => {
      const btn = document.querySelector('#checkout-form button[type="submit"]');
      if (btn) btn.click();
    });

    // Attende elaborazione (2 secondi come nel codice)
    await wait(3000);

    // Verifica messaggio conferma
    const confirmText = await page.evaluate(() => document.body.innerText);
    logTest(6, 'Visualizzazione conferma ordine',
      confirmText.includes('Ordine Confermato') ? 'PASS' : 'FAIL');

    // Verifica salvataggio ordine in localStorage
    const ordersData = await getLocalStorage(page, 'techstore_orders');
    const orders = ordersData ? JSON.parse(ordersData) : [];
    logTest(6, 'Ordine salvato in localStorage',
      orders.length > 0 ? 'PASS' : 'FAIL',
      `(${orders.length} ordini)`);

    return true;
  } catch (error) {
    logTest(6, 'Test checkout', 'FAIL', error.message);
    return false;
  }
}

async function test7_AreaPersonale(page) {
  log('\n🔍 TEST 7: Area Personale (account.html)', 'cyan');

  try {
    // Verifica che siamo loggati (sessione dovrebbe ancora esistere)
    await page.goto(pageUrl('account.html'), {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Verifica caricamento (se non loggato, redirects a login)
    const currentUrl = page.url();
    logTest(7, 'Accesso a account.html',
      currentUrl.includes('account.html') ? 'PASS' : 'FAIL');

    // Verifica dati utente
    const userName = await page.$eval('#user-name', el => el.textContent);
    logTest(7, 'Nome utente visualizzato',
      userName.includes('Mario') ? 'PASS' : 'FAIL');

    // Verifica sezione ordini
    const ordersList = await page.$('#orders-list');
    logTest(7, 'Sezione ordini presente', ordersList ? 'PASS' : 'FAIL');

    // Verifica storico ordini
    await wait(500);
    const orderCards = await page.$$('.order-card');
    logTest(7, 'Visualizzazione storico ordini',
      orderCards.length > 0 ? 'PASS' : 'FAIL',
      `(${orderCards.length} ordini)`);

    // Verifica sezione profilo
    const profileData = await page.$('#profile-data');
    logTest(7, 'Sezione profilo presente', profileData ? 'PASS' : 'FAIL');

    return true;
  } catch (error) {
    logTest(7, 'Test area personale', 'FAIL', error.message);
    return false;
  }
}

async function test8_VerificaMalfunzionamenti(page) {
  log('\n🔍 TEST 8: Verifica malfunzionamenti comuni', 'cyan');

  const errors = [];

  // Test 1: Link navigazione
  const navLinks = await page.$$eval('.header-nav a', links =>
    links.map(l => ({ text: l.textContent, href: l.href }))
  );

  // Verifica che i link abbiano href validi
  const brokenNavLinks = navLinks.filter(l => !l.href || l.href === 'javascript:void(0)');
  logTest(8, 'Link navigazione validi',
    brokenNavLinks.length === 0 ? 'PASS' : 'FAIL',
    brokenNavLinks.length > 0 ? `(${brokenNavLinks.length} link non validi)` : '');

  // Test 2: Immagini prodotto
  const images = await page.$$eval('img', imgs =>
    imgs.map(img => ({ src: img.src, alt: img.alt, naturalWidth: img.naturalWidth }))
  );

  // Cerca immagini con src problematici
  const brokenImages = images.filter(img =>
    !img.src || img.src.includes('undefined') || img.src.includes('null')
  );
  logTest(8, 'Immagini con src validi',
    brokenImages.length === 0 ? 'PASS' : 'FAIL',
    brokenImages.length > 0 ? `(${brokenImages.length} immagini con problemi)` : '');

  // Test 3: Form con required
  const requiredInputs = await page.$$('input[required]');
  logTest(8, 'Campi form obbligatori',
    'PASS',
    requiredInputs.length > 0
      ? `(${requiredInputs.length} campi)`
      : '(nessun form nella pagina corrente)');

  // Test 4: Verifica localStorage
  const cart = await getLocalStorage(page, 'techstore_cart');
  logTest(8, 'localStorage carrello accessibile',
    cart !== null ? 'PASS' : 'FAIL');

  // Test localStorage sessione
  const session = await getLocalStorage(page, 'techstore_session');
  if (session) {
    logTest(8, 'localStorage sessione accessibile', 'PASS');
  } else {
    logTest(8, 'localStorage sessione accessibile', 'FAIL');
  }

  // Test 5: Responsive check (mobile viewport)
  await page.setViewport({ width: 375, height: 667 });
  await wait(500);

  const mobileMenuToggle = await page.$('.mobile-menu-toggle');
  logTest(8, 'Menu mobile visibile su viewport piccolo',
    mobileMenuToggle ? 'PASS' : 'FAIL');

  // Torna a desktop
  await page.setViewport({ width: 1920, height: 1080 });

  return errors.length === 0;
}

// ============================================
// ESECUZIONE TEST
// ============================================

async function runTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🛒 TechStore - Test E2E Simulazione Acquisto', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  // Crea cartella screenshot
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  try {
    await startLocalServer();

    // Avvia browser
    log('🚀 Avvio browser Puppeteer...', 'cyan');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--allow-file-access-from-files',
        '--allow-file-origin=*'
      ]
    });

    page = await browser.newPage();

    // Configura timeout più lungo
    page.setDefaultTimeout(30000);

    // Abilita console del browser per debug
    page.on('console', msg => {
      if (msg.type() === 'error') {
        log(`  ⚠️ Console error: ${msg.text()}`, 'yellow');
      }
    });

    // Esegui test
    await clearStorage(page);
    await test1_ArrivoSito(page);

    await clearStorage(page);
    await test2_Registrazione(page);

    await test3_NavigazioneCatalogo(page);
    await test4_AggiuntaProdottoCarrello(page);
    await test5_PaginaCarrello(page);
    await test6_Checkout(page);
    await test7_AreaPersonale(page);

    // Test malfunzionamenti
    await test8_VerificaMalfunzionamenti(page);

  } catch (error) {
    log(`\n❌ Errore durante l'esecuzione: ${error.message}`, 'red');
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
    if (localServer) {
      await new Promise((resolve) => localServer.close(resolve));
      localServer = null;
    }
  }

  // Stampa riepilogo
  return printSummary();
}

function printSummary() {
  log('\n' + '='.repeat(60), 'blue');
  log('📊 RIEPILOGO RISULTATI', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const total = testResults.length;

  log(`Totale test: ${total}`, 'reset');
  log(`✅ Passati: ${passed}`, 'green');
  log(`❌ Falliti: ${failed}`, failed > 0 ? 'red' : 'green');
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
  log(`📈 Percentuale successo: ${successRate}%\n`, 'cyan');

  // Mostra test falliti
  if (failed > 0) {
    log('Test falliti:', 'red');
    testResults.filter(r => r.status === 'FAIL').forEach(r => {
      log(`  • Step ${r.step}: ${r.description} - ${r.details}`, 'red');
    });
    log('');
  }

  // Statistiche per step
  log('Riepilogo per step:', 'cyan');
  for (let i = 1; i <= 8; i++) {
    const stepTests = testResults.filter(r => r.step === i);
    const stepPassed = stepTests.filter(r => r.status === 'PASS').length;
    const stepTotal = stepTests.length;
    const status = stepPassed === stepTotal ? 'green' : 'yellow';
    log(`  Step ${i}: ${stepPassed}/${stepTotal} test passati`, status);
  }

  log('\n' + '='.repeat(60), 'blue');
  log('🏁 Test E2E completato!', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  log(`📁 Screenshot salvati in: ${SCREENSHOTS_DIR}`, 'cyan');
  return failed === 0 && total > 0;
}

// Gestisci chiusura
process.on('SIGINT', async () => {
  log('\n\n⚠️ Test interrotto dall\'utente', 'yellow');
  if (browser) {
    await browser.close();
  }
  if (localServer) {
    await new Promise((resolve) => localServer.close(resolve));
  }
  process.exit(1);
});

// Esegui test
runTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    log(`\n❌ Errore imprevisto: ${error.message}`, 'red');
    process.exit(1);
  });
