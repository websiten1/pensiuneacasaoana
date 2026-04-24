// ================================================
// Header — sticky + mobile nav (same as main page)
// ================================================
const header    = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const headerNav = document.getElementById('headerNav');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
    const open = headerNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
});

headerNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        headerNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
    });
});

document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
        headerNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
    }
});

// ================================================
// Room data — descriptions + placeholder colors
// ================================================
const roomData = {
    'Cameră Dublă Clasică': {
        desc: 'Pat matrimonial, baie privată, vedere spre grădina interioară. Lenjerie schimbată zilnic. Capacitate: 2 persoane.',
        ph:   'ph-green-light',
    },
    'Cameră Dublă Deluxe': {
        desc: 'King-size cu topper de memorie, fotolii de relaxare, cadă și duș separat, parquet natural, halat și papuci incluse.',
        ph:   'ph-brown',
    },
    'Cameră Familială': {
        desc: 'Pat matrimonial + 2 paturi single, 35 mp, zonă de joc pentru copii, frigider și spațiu generos de depozitare. Capacitate: 4 persoane.',
        ph:   'ph-green',
    },
    'Suite Premium': {
        desc: 'Dormitor separat, salon de zi, cadă free-standing, duș cu ploaie, produse cosmetice premium, parquet din lemn masiv.',
        ph:   'ph-black-gold',
    },
};

const allPlaceholderClasses = ['ph-green-light', 'ph-brown', 'ph-green', 'ph-black-gold'];

// ================================================
// Summary panel elements
// ================================================
const summaryRoomImg   = document.getElementById('summaryRoomImg');
const summaryRoomLabel = document.getElementById('summaryRoomImgLabel');
const summaryRoomName  = document.getElementById('summaryRoomName');
const summaryRoomDesc  = document.getElementById('summaryRoomDesc');
const summaryCheckin   = document.getElementById('summaryCheckin');
const summaryCheckout  = document.getElementById('summaryCheckout');
const summaryNights    = document.getElementById('summaryNights');
const summaryGuests    = document.getElementById('summaryGuests');

// ================================================
// Form elements
// ================================================
const fRoom     = document.getElementById('f-room');
const fCheckin  = document.getElementById('f-checkin');
const fCheckout = document.getElementById('f-checkout');
const fAdults   = document.getElementById('f-adults');
const fChildren = document.getElementById('f-children');
const fName     = document.getElementById('f-name');
const fEmail    = document.getElementById('f-email');
const fPhone    = document.getElementById('f-phone');
const fRequests = document.getElementById('f-requests');
const fTerms    = document.getElementById('f-terms');

// ================================================
// Utility functions
// ================================================
function formatDate(str) {
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return `${d}.${m}.${y}`;
}

function calcNights() {
    if (!fCheckin.value || !fCheckout.value) return 0;
    return Math.round(
        (new Date(fCheckout.value) - new Date(fCheckin.value)) / 86400000
    );
}

function guestsText() {
    const adults   = parseInt(fAdults.value) || 2;
    const children = parseInt(fChildren.value) || 0;
    let txt = `${adults} adult${adults !== 1 ? 'i' : ''}`;
    if (children > 0) txt += `, ${children} cop${children !== 1 ? 'ii' : 'il'}`;
    return txt;
}

// ================================================
// Update summary panel
// ================================================
function updateSummary() {
    const room = fRoom.value;

    if (room && roomData[room]) {
        const data = roomData[room];

        // Update placeholder color
        allPlaceholderClasses.forEach(c => summaryRoomImg.classList.remove(c));
        summaryRoomImg.classList.add(data.ph);
        summaryRoomLabel.textContent = room;

        summaryRoomName.textContent = room;
        summaryRoomDesc.textContent = data.desc;
    } else {
        allPlaceholderClasses.forEach(c => summaryRoomImg.classList.remove(c));
        summaryRoomImg.classList.add('ph-green-light');
        summaryRoomLabel.textContent = 'Selectati o camera';
        summaryRoomName.textContent  = '—';
        summaryRoomDesc.textContent  = '';
    }

    summaryCheckin.textContent  = formatDate(fCheckin.value);
    summaryCheckout.textContent = formatDate(fCheckout.value);

    const nights = calcNights();
    summaryNights.textContent  = nights > 0 ? `${nights} ${nights === 1 ? 'noapte' : 'nopti'}` : '—';
    summaryGuests.textContent  = guestsText();
}

// ================================================
// Live listeners for summary
// ================================================
[fRoom, fCheckin, fCheckout, fAdults, fChildren].forEach(el => {
    el.addEventListener('change', updateSummary);
});
fAdults.addEventListener('input', updateSummary);
fChildren.addEventListener('input', updateSummary);

// ================================================
// Date constraints
// ================================================
const today = new Date().toISOString().split('T')[0];
fCheckin.min  = today;
fCheckout.min = today;

fCheckin.addEventListener('change', () => {
    if (fCheckin.value) {
        const next = new Date(fCheckin.value);
        next.setDate(next.getDate() + 1);
        fCheckout.min = next.toISOString().split('T')[0];
        if (fCheckout.value && fCheckout.value <= fCheckin.value) {
            fCheckout.value = '';
            updateSummary();
        }
    }
});

// ================================================
// Form validation
// ================================================
function clearFormErrors() {
    document.querySelectorAll('.field-err').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    document.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
}

function showError(field, message) {
    field.classList.add('is-error');
    const errEl = field.closest('.field-group')?.querySelector('.field-err');
    if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('visible');
    }
}

function isEmailValid(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Blur validation for immediate feedback
fRoom.addEventListener('blur',     () => { if (!fRoom.value)                 showError(fRoom,     'Selectati tipul camerei.'); });
fCheckin.addEventListener('blur',  () => { if (!fCheckin.value)              showError(fCheckin,  'Selectati data sosirii.'); });
fCheckout.addEventListener('blur', () => { if (!fCheckout.value)             showError(fCheckout, 'Selectati data plecarii.'); });
fName.addEventListener('blur',     () => { if (!fName.value.trim())          showError(fName,     'Introduceti numele complet.'); });
fEmail.addEventListener('blur',    () => { if (!isEmailValid(fEmail.value))  showError(fEmail,    'Introduceti un email valid.'); });
fPhone.addEventListener('blur',    () => { if (!fPhone.value.trim())         showError(fPhone,    'Introduceti numarul de telefon.'); });

// Clear error on input
[fRoom, fCheckin, fCheckout, fName, fEmail, fPhone].forEach(el => {
    el.addEventListener('input', () => {
        el.classList.remove('is-error');
        const errEl = el.closest('.field-group')?.querySelector('.field-err');
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
    });
});

// ================================================
// Form submit — validate + WhatsApp
// ================================================
const bookingForm    = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    clearFormErrors();

    let valid = true;

    if (!fRoom.value) {
        showError(fRoom, 'Selectati tipul camerei.'); valid = false;
    }
    if (!fCheckin.value) {
        showError(fCheckin, 'Selectati data sosirii.'); valid = false;
    }
    if (!fCheckout.value) {
        showError(fCheckout, 'Selectati data plecarii.'); valid = false;
    } else if (fCheckin.value && fCheckout.value <= fCheckin.value) {
        showError(fCheckout, 'Data plecarii trebuie sa fie dupa data sosirii.'); valid = false;
    }
    if (!fAdults.value || parseInt(fAdults.value) < 1) {
        showError(fAdults, 'Cel putin 1 adult.'); valid = false;
    }
    if (!fName.value.trim()) {
        showError(fName, 'Introduceti numele complet.'); valid = false;
    }
    if (!isEmailValid(fEmail.value)) {
        showError(fEmail, 'Introduceti un email valid.'); valid = false;
    }
    if (!fPhone.value.trim()) {
        showError(fPhone, 'Introduceti numarul de telefon.'); valid = false;
    }
    if (!fTerms.checked) {
        const errEl = fTerms.closest('.field-group')?.querySelector('.field-err');
        if (errEl) { errEl.textContent = 'Acceptati termenii pentru a continua.'; errEl.classList.add('visible'); }
        valid = false;
    }

    if (!valid) {
        // Scroll to first error
        const firstErr = bookingForm.querySelector('.is-error, .field-err.visible');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Build WhatsApp message
    const nights   = calcNights();
    const children = parseInt(fChildren.value) || 0;

    let msg = `Buna, vreau sa rezerv o camera la Casa Oana.\n\n`;
    msg += `Camera: ${fRoom.value}\n`;
    msg += `Sosire: ${formatDate(fCheckin.value)}\n`;
    msg += `Plecare: ${formatDate(fCheckout.value)}\n`;
    if (nights > 0) msg += `Nopti: ${nights}\n`;
    msg += `Adulti: ${fAdults.value}`;
    if (children > 0) msg += `, Copii: ${children}`;
    msg += `\n\nNume: ${fName.value.trim()}\nTelefon: ${fPhone.value.trim()}\nEmail: ${fEmail.value.trim()}`;
    if (fRequests.value.trim()) msg += `\n\nCerinte speciale: ${fRequests.value.trim()}`;

    const waUrl = `https://wa.me/40722645085?text=${encodeURIComponent(msg)}`;

    // Show success overlay
    bookingSuccess.hidden = false;
    document.body.style.overflow = 'hidden';

    // Open WhatsApp
    setTimeout(() => window.open(waUrl, '_blank', 'noopener,noreferrer'), 350);
});

// ================================================
// URL parameter — pre-select room from main page
// ================================================
(function applyUrlParam() {
    const params = new URLSearchParams(window.location.search);
    const camera = params.get('camera');
    if (camera && roomData[camera]) {
        fRoom.value = camera;
        updateSummary();
    } else {
        updateSummary(); // render defaults
    }
})();
