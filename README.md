# Casa Oana — Website Pensiune Iași

Website static pentru **Pensiunea Casa Oana**, Nicolae Beldiceanu nr. 2, Iași.

## Structura proiectului

```
casa-oana-website/
├── index.html      # Pagina principală
├── styles.css      # Toate stilurile
├── script.js       # Interactivitate (modal, animații, meniu)
├── images/         # Pune imaginile reale aici
└── README.md
```

## Cum deschizi local (preview)

Deschide `index.html` direct în browser. Pentru a evita restricțiile CORS pe hartă:
```
npx serve .
# sau
python3 -m http.server 8080
```

## Înlocuire imagini

Pune imaginile reale în folderul `images/` și înlocuiește URL-urile `picsum.photos/seed/...` din `index.html`.

| Fișier                          | Dimensiuni   | Unde e folosit     |
|---------------------------------|--------------|--------------------|
| `images/hero.jpg`               | 1920×1080px  | Fundalul Hero      |
| `images/room-double-standard.jpg` | 1200×900px | Cameră Dublă Standard |
| `images/room-double-premium.jpg`  | 1200×900px | Cameră Dublă Premium  |
| `images/room-family.jpg`         | 1200×900px  | Cameră Familială   |
| `images/room-single.jpg`         | 1200×900px  | Cameră Single      |
| `images/room-apartment.jpg`      | 1200×900px  | Apartament         |
| `images/gallery-1.jpg` ... `gallery-8.jpg` | 1200×900px | Galerie  |

Format recomandat: **JPG**, comprimat sub 400 KB/imagine (folosește [Squoosh](https://squoosh.app)).

## Deployment

### Netlify (recomandat, gratuit)
1. Creează cont la [netlify.com](https://netlify.com)
2. Drag & drop folderul `casa-oana-website` în dashboard
3. Site live instant — adaugă domeniu custom `casa-oana-iasi.ro` din Settings → Domains

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## Funcționalități incluse

- Header fix cu tranziție la scroll și meniu mobil hamburger
- Hero fullscreen cu overlay și badge rating
- 4 carduri Welcome cu animații fade-in
- 5 camere cu prețuri, facilități și buton rezervare direct
- Galerie 8 imagini cu lightbox (GLightbox)
- Ghid înlocuire imagini (collapsible în pagină)
- 9 facilități în grid 3 coloane
- Secțiune locație cu Google Maps embed + distanțe
- 6 recenzii autentice
- CTA section + footer complet
- Modal rezervare cu:
  - Validare completă a tuturor câmpurilor
  - Calculare automată nopți + preț estimat
  - Trimitere cerere prefilled pe WhatsApp (+40722645085)
- Animații fade-in la scroll
- Responsive complet: desktop / tablet / mobil

## Contact & date pensiune

- **Telefon / WhatsApp:** 0722 645 085
- **Adresă:** Nicolae Beldiceanu nr. 2, 700374 Iași
- **Rating:** 8.6/10 — 541 recenzii
