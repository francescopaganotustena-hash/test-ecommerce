# TechStore - E-commerce Elettronica di Consumo

Sito e-commerce multi-pagina (frontend statico) per prodotti di elettronica, con catalogo dinamico, carrello persistente, checkout simulato, area utente e pannello admin.

Ultimo aggiornamento documentazione: **10 marzo 2026 (fix login/logout/header/carrello)**.

## Stato attuale

- Flussi principali operativi: home, catalogo, prodotto, carrello, checkout, login/account, admin.
- Test E2E aggiornati e **verificati con esito 100% (50/50)**.
- Hardening frontend applicato su output dinamici (escaping/sanitizzazione) per ridurre rischio XSS.
- Gestione password migliorata (hash client-side) per utente e admin.
- Restyling grafico completato in 5 cicli, con pass di fidelity verso stile DTC moderno.

## Stack

- HTML + CSS + JavaScript vanilla
- Bootstrap 5 (CDN)
- LocalStorage / SessionStorage per persistenza demo
- Puppeteer per test E2E

## Struttura progetto

```text
Ecommerce/
├── index.html
├── catalogo.html
├── prodotto.html
├── carrello.html
├── checkout.html
├── login.html
├── account.html
├── ordine.html
├── admin.html
├── chi-siamo.html
├── contatti.html
├── registrazione.html
├── assets/
│   └── images/
│       └── products/
├── css/
│   ├── style.css
│   ├── components.css
│   └── admin.css
├── js/
│   ├── products.js
│   ├── cart.js
│   ├── main.js
│   └── admin.js
├── test-e2e.js
└── test-screenshots/
```

## Setup locale

1. Installa dipendenze:

```bash
npm install
```

2. (Solo se richiesto) installa browser per Puppeteer:

```bash
npx puppeteer browsers install chrome
```

3. Avvia il sito (opzionale, utile per sviluppo manuale):

```bash
python -m http.server 8000
# oppure
npx serve .
```

## Test E2E

Esegui:

```bash
node test-e2e.js
```

Note importanti:

- Lo script avvia automaticamente un server locale su `http://127.0.0.1:4173` (se `BASE_URL` non è impostata).
- Per usare un URL custom:

```bash
BASE_URL="http://localhost:8000" node test-e2e.js
```

- Exit code:
- `0` se tutti i test passano
- `1` se ci sono fail o errori di esecuzione

## Modifiche recenti (allineate al codice)

### 1. Correzioni funzionali

- Corretto mismatch categoria TV: `category=tv` -> `category=televisori`.
- Ripristinato flusso codice sconto nel carrello (input + applicazione + totale aggiornato).
- Checkout allineato al totale reale (`subtotale - sconto + spedizione`).
- ID ordine mostrato in conferma coerente con ID salvato.
- Pulsante `Dettagli` ordini ora apre una pagina dedicata (`ordine.html?id=...`) invece del popup.
- Fix pagina prodotto: tab Bootstrap ripristinati correttamente e descrizione non più tagliata; altezza contenuti dinamica che spinge in basso i prodotti correlati.

### 2. Sicurezza frontend (hardening)

- Aggiunte utility di escaping/sanitizzazione in rendering dinamico:
- card prodotto (`js/main.js`)
- carrello/riepilogo (`js/cart.js`)
- account ordini/profilo (`account.html`)
- checkout riepilogo (`checkout.html`)
- tabella admin (`js/admin.js`)
- Toast costruiti via `textContent` (dove applicato) per evitare injection tramite messaggi.

### 3. Autenticazione migliorata (modalità demo)

- **Utente (`login.html`)**:
- registrazione salva `passwordHash` SHA-256 (non password in chiaro)
- login verifica hash
- migrazione trasparente utenti legacy con password plain (al primo login valido)
- normalizzazione email (`trim` + lowercase) in registrazione/login
- supporto compatibilità con `techstore_user` e `techstore_users`
- supporto utenti legacy con `fullName` (fallback su `firstname/lastname`)
- fix blocco login per utenti "esistenti" senza credenziali complete: primo login inizializza hash e allinea il record
- recupero accesso automatico su dati legacy/incoerenti (allineamento record + hash)
- parsing sicuro di sessione/utente da localStorage (resistente a JSON corrotti)

- **Admin (`admin.html` + `js/admin.js`)**:
- rimossa password hardcoded `admin123`
- primo accesso: setup password admin (min 10 caratteri, conferma)
- password admin salvata come hash SHA-256 in localStorage
- sessione admin in sessionStorage

- **Registrazione dedicata (`registrazione.html`)**:
- ora salva anche `firstname`, `lastname`, `passwordHash` e email normalizzata
- persistenza allineata al login (aggiorna `techstore_user` e lista `techstore_users`)

### 4. Sessione, logout e header (stabilizzazione)

- Logout centralizzato in `js/main.js` (`performUserLogout`) usato da header e area account.
- Il logout ora pulisce in modo coerente:
- `techstore_session`
- `techstore_user`
- `techstore_cart`
- `techstore_discount`
- Corretto errore JS `cart is not defined` in `js/main.js` che poteva compromettere i flussi di pagina (incluso login/home).
- Corretto stato header auth:
- in stato guest `Accedi` punta sempre a `login.html`
- in stato autenticato punta ad `account.html`
- il link `Esci` viene aggiunto/rimosso in modo consistente.
- Corretto comportamento carrello:
- mantiene articoli quando l'utente è loggato
- viene svuotato al logout.

### 5. Restyling grafico (Template-inspired + DTC fidelity)

- **Ciclo 1 - Fondazioni + Header + Card**
- aggiornamento design token (palette neutra, tipografia editoriale, bordi più netti)
- header sticky con blur più elegante
- card prodotto e pulsanti semplificati

- **Ciclo 2 - Funnel acquisto**
- coerenza visuale su pagina prodotto, carrello, checkout, account e dettaglio ordine
- componenti chiave uniformati (stati, badge, riepiloghi, controlli quantità)

- **Ciclo 3 - Admin**
- allineamento cosmetico admin alla nuova identità del sito (senza cambiare la logica)
- login/dashboard/form/table in stile coerente

- **Ciclo 4 - Bite-inspired skin**
- palette fresca verde/corallo, card più morbide, pill buttons e gerarchia visuale più commerciale

- **Ciclo 5 - Fidelity pass**
- announcement/header/hero/CTA e griglie prodotto rifinite per maggiore somiglianza al riferimento DTC

## Funzionalità principali

- Catalogo dinamico con ricerca, filtri, ordinamento
- Carrello persistente con badge globale durante sessione utente
- Codici sconto demo: `BENVENUTO10`, `TECH20`, `SALDI30`
- Checkout con salvataggio ordine in localStorage
- Area account con storico ordini
- Pagina dettaglio ordine dedicata (`ordine.html`)
- Pannello admin con CRUD prodotti

## Limiti noti (importanti)

Questo progetto resta **frontend-only/demo**:

- autenticazione/autorizzazione sono client-side
- i dati sono modificabili dall'utente via DevTools
- non adatto a produzione senza backend

Per produzione serve backend con:

- auth server-side (session/JWT)
- password hashate lato server
- API protette per ordini/admin/prodotti
- validazione input lato server

## Strategia di rollback (operativa)

Per questo restyling è stata creata una snapshot completa dei file UI in:

- `/home/sviluppatore/Documenti/Ecommerce/backups/restyling-20260310-111535`

Backup aggiuntivo legato alla correzione permessi/fix registrazione:

- `/home/sviluppatore/Documenti/Ecommerce/backups/permission-fix-20260310/registrazione.html.root-owned.original`

Ripristino rapido:

```bash
/home/sviluppatore/Documenti/Ecommerce/backups/restyling-20260310-111535/RESTORE.sh
```

Il ripristino sovrascrive i file principali (`css/*.css` e pagine HTML chiave) riportando il progetto allo stato precedente al restyling.

## Punti di ingresso utili

- Sito: `index.html`
- Catalogo: `catalogo.html`
- Carrello: `carrello.html`
- Login/Account: `login.html`, `account.html`
- Dettaglio ordine: `ordine.html?id=<ORDER_ID>`
- Admin: `admin.html`
- Test E2E: `test-e2e.js`

## Licenza

Template/demo per uso personale e commerciale.
