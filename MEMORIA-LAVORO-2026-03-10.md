# Memoria lavoro - 10 marzo 2026

## Attività completate

1. Apertura progetto e verifica struttura in `/home/sviluppatore/Documenti/Ecommerce`.
2. Lettura README e check rapido di coerenza codice + test.
3. Esecuzione test E2E con esito `50/50` passati.
4. Avvio server locale su localhost e poi su rete LAN (`0.0.0.0`).
5. Creazione comando rapido di avvio sito:
   - File aggiunto: `./avvia-sito`
   - Uso: `./avvia-sito` oppure `./avvia-sito 8080`
6. Commit/push script avvio:
   - Commit: `a330af3`
   - Messaggio: `Add avvia-sito helper script to run local web server`
7. Fix area Admin (inizializzazione):
   - File: `js/admin.js`
   - Problema risolto: race condition + doppio binding eventi
   - Commit: `60e7732`
   - Messaggio: `Fix admin initialization race and duplicate binding`
8. Debug approfondito login Admin non funzionante su IP LAN.
   - Root cause: su `http://10.0.0.x` `crypto.subtle` non disponibile (contesto non sicuro)
   - Fix: fallback SHA-256 JS + gestione errori robusta in login
   - File: `js/admin.js`
   - Commit: `ad969bf`
   - Messaggio: `Fix admin login on LAN by adding SHA-256 fallback`
9. Verifica stato repository e sincronizzazione commit:
   - Branch locale/remoto verificati allineati su `main`.
   - Verifica storico commit recente eseguita.
10. Creazione sottopagine "Servizio Clienti" richieste:
   - `area-cliente.html`
   - `miei-ordini.html`
   - `spedizioni.html`
   - `resi-rimborsi.html`
   - `garanzia.html`
   - `faq.html`
11. Aggiornamento link "Servizio Clienti" nella home:
   - File modificato: `index.html`
   - Link aggiornati verso le nuove sottopagine.
12. Allineamento globale link assistenza/servizio clienti:
   - File modificati: `catalogo.html`, `prodotto.html`, `login.html`, `account.html`
   - Uniformati i link a: Area Cliente, I Miei Ordini, Spedizioni, Resi e Rimborsi, Garanzia, FAQ.
13. Creazione pagine legali dedicate:
   - `privacy-policy.html`
   - `cookie-policy.html`
   - `termini-condizioni.html`
14. Collegamento pagine legali nei punti di consenso e footer:
   - File modificati: `index.html`, `checkout.html`, `login.html`, `registrazione.html`
   - Link aggiornati per: Privacy Policy, Cookie Policy, Termini e Condizioni.

## Stato attuale

- Branch: `main`
- Remote: `origin`
- Working tree: modifiche locali presenti (pagine assistenza e link footer/header aggiornati)
- Script avvio disponibile e funzionante: `avvia-sito`
- Login Admin verificato funzionante sia su `localhost` sia su IP LAN
- Nuove pagine assistenza create e collegate in modo coerente nel sito
- Pagine legali create e linkate nei footer e nelle checkbox di consenso

## Comandi utili

- Avvio sito (LAN + locale):
  - `./avvia-sito`
- Avvio su porta custom:
  - `./avvia-sito 8080`
- Test E2E:
  - `node test-e2e.js`
- Stato modifiche:
  - `git status --short`

## Nota sicurezza

Durante la sessione è stato usato un PAT GitHub in chat. È consigliato revocarlo e generarne uno nuovo.
