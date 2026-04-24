# Casa Oana — Website de lux, Pensiune Iași

Website static single-page pentru **Pensiunea Casa Oana**, design clasic elegant, minimalist.

## Structura proiectului

```
casa-oana-website/
├── index.html      — Pagina principală (toate sectiunile)
├── styles.css      — Design system complet cu CSS custom properties
├── script.js       — Header, modal, lightbox, animatii, validare form
├── images/         — Pune imaginile reale here (vezi mai jos)
└── README.md
```

## Previzualizare locala

Deschide `index.html` direct în browser. Sau, pentru harta Google Maps fara erori CORS:

```bash
npx serve .
# sau
python3 -m http.server 8080
# apoi deschide http://localhost:8080
```

---

## Cum inlocuiesti imaginile placeholder

Toate imaginile sunt momentan placeholder-uri (div-uri gri cu text). Cand ai fotografii reale:

1. Pune imaginile în folderul `images/`
2. În `index.html`, înlocuieste fiecare bloc `<div class="img-placeholder ..."><span>...</span></div>` cu:
   ```html
   <img src="images/NUME-FISIER.jpg" alt="Descriere" loading="lazy">
   ```
3. In `script.js`, actualizeaza array-ul `galleryCaptions` cu descrierile corecte.

### Fisiere de imagini necesare

| Fisier                          | Dimensiuni   | Sectiune         |
|---------------------------------|--------------|------------------|
| `images/hero.jpg`               | 960×768px    | Hero (dreapta)   |
| `images/room-clasica.jpg`       | 800×560px    | Camera Clasica   |
| `images/room-deluxe.jpg`        | 800×560px    | Camera Deluxe    |
| `images/room-familiala.jpg`     | 800×560px    | Camera Familiala |
| `images/room-suite.jpg`         | 800×560px    | Suite Premium    |
| `images/gallery-1.jpg`          | 800×600px    | Galerie 1        |
| `images/gallery-2.jpg`          | 800×600px    | Galerie 2        |
| `images/gallery-3.jpg`          | 800×600px    | Galerie 3        |
| `images/gallery-4.jpg`          | 800×600px    | Galerie 4        |
| `images/gallery-5.jpg`          | 800×600px    | Galerie 5        |
| `images/gallery-6.jpg`          | 800×600px    | Galerie 6        |

Format recomandat: **JPG**, sub 350 KB/imagine — comprima cu [Squoosh](https://squoosh.app).

---

## Cum customizezi camerele

In `index.html`, fiecare `<article class="room-card">` contine:
- `class="room-name"` — titlul camerei
- `class="room-desc"` — descrierea (100 cuvinte)
- `class="room-facilities"` — lista facilitati (tag `<li>`)
- `class="room-price"` — pretul (ex: `350 lei / noapte` sau `Solicita oferta`)

Adauga sau elimina `<article class="room-card">` pentru a modifica numarul de camere.

---

## Cum customizezi recenziile

In `index.html`, sectiunea `<section id="recenzii">`, fiecare `<article class="review-card">` contine:
- `class="review-stars"` — numarul de stele (caractere ★)
- `class="review-text"` — citatul (italic)
- `class="review-author"` — Nume — Tara

---

## Actualizare date de contact

Cauta in `index.html` si `script.js`:
- `0722 645 085` — telefon
- `wa.me/40722645085` — link WhatsApp
- `Nicolae Beldiceanu nr. 2` — adresa

Inlocuieste cu datele actuale daca se schimba.

---

## Deployment

### Netlify (recomandat, gratuit)
1. Creeaza cont la [netlify.com](https://netlify.com)
2. Drag & drop folderul `casa-oana-website` in dashboard
3. Site live instant — adauga domeniu custom `casa-oana-iasi.ro` din Settings → Domains

### GitHub Pages
1. Fa push pe GitHub (repo existent: `github.com/websiten1/pensiuneacasaoana`)
2. Settings → Pages → Branch: `main` → Save
3. Site live la `https://websiten1.github.io/pensiuneacasaoana`

---

## Contact pensiune

- **Telefon / WhatsApp:** 0722 645 085
- **Adresa:** Nicolae Beldiceanu nr. 2, 700374 Iași, România
- **Rating:** 8.6 / 10 — 541 recenzii verificate
