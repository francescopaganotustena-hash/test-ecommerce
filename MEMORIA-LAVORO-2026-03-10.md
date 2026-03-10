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

## Stato attuale

- Branch: `main`
- Remote: `origin`
- Push: allineato con GitHub fino al commit `ad969bf`
- Script avvio disponibile e funzionante: `avvia-sito`
- Login Admin verificato funzionante sia su `localhost` sia su IP LAN

## Comandi utili

- Avvio sito (LAN + locale):
  - `./avvia-sito`
- Avvio su porta custom:
  - `./avvia-sito 8080`
- Test E2E:
  - `node test-e2e.js`

## Nota sicurezza

Durante la sessione è stato usato un PAT GitHub in chat. È consigliato revocarlo e generarne uno nuovo.
