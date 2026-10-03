# Mega Infra Project - Billing App

Simple billing web app. Data browser ke localStorage mein save hota hai (backend nahi).

## Features
- Bill generator: room-wise items, qty, unit, rate, auto total, discount, advance, balance
- Rate / Amount toggle aur Signature ki jagah ON/OFF
- Saved items aur rates (preloaded), naam type karte hi suggestion, rate auto-fill
- Print / PDF (Print khulne pe "Save as PDF" chuno)
- History + search, Paid / Pending
- Backup download / Restore (Settings tab)

## Folder structure
```
billing-app/
  index.html
  css/style.css
  js/  storage.js firebase.js settings.js items.js bill.js history.js pdf.js backup.js app.js
  assets/logo.png
```

## Local chalana
`index.html` pe double-click karo.

## GitHub Pages pe free live
1. GitHub pe naya Public repository banao: `billing-app`
2. Is folder ki saari files (folders ke saath) upload karo
3. Settings -> Pages -> Deploy from a branch -> main -> / (root) -> Save
4. 1-2 minute baad link: https://USERNAME.github.io/billing-app

## Dhyan rakho
- Data usi phone/browser mein rehta hai. Regular Backup download karte raho.
- js/firebase.js abhi band hai (cloud save baad mein, permission ke baad).
