// =============================================
// Header — scroll behavior + mobile menu
// =============================================
const header     = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mainNav    = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
}, { passive: true });

menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
    });
});

document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
    }
});

// Active nav link on scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
}

// =============================================
// Booking Modal
// =============================================
const modal              = document.getElementById('bookingModal');
const bookingFormWrapper = document.getElementById('bookingFormWrapper');
const bookingForm        = document.getElementById('bookingForm');
const bookingSuccess     = document.getElementById('bookingSuccess');

const ROOM_PRICES = {
    'Cameră Dublă Standard': 180,
    'Cameră Dublă Premium':  220,
    'Cameră Familială':      300,
    'Cameră Single':         120,
    'Apartament':            350,
};

function openModal(roomType = '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset to form view
    bookingFormWrapper.style.display = '';
    bookingSuccess.classList.remove('visible');
    bookingForm.style.display = '';

    if (roomType) {
        document.getElementById('roomType').value = roomType;
        updateNights();
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min  = today;
    document.getElementById('checkout').min = today;

    // Focus first focusable element for accessibility
    setTimeout(() => {
        const first = modal.querySelector('select, input, button:not(.modal-close)');
        if (first) first.focus();
    }, 100);
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    bookingForm.reset();
    clearErrors();
    hideNights();
}

// Close on backdrop click
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// =============================================
// Nights & price calculation
// =============================================
const checkinEl   = document.getElementById('checkin');
const checkoutEl  = document.getElementById('checkout');
const roomTypeEl  = document.getElementById('roomType');
const nightsDisp  = document.getElementById('nightsDisplay');
const nightsCount = document.getElementById('nightsCount');
const priceEst    = document.getElementById('priceEstimate');

function updateNights() {
    const ci = checkinEl.value;
    const co = checkoutEl.value;
    if (!ci || !co) { hideNights(); return; }

    const d1 = new Date(ci);
    const d2 = new Date(co);
    if (d2 <= d1) { hideNights(); return; }

    const nights = Math.round((d2 - d1) / 86400000);
    nightsCount.textContent = `${nights} ${nights === 1 ? 'noapte' : 'nopți'}`;

    const room = roomTypeEl.value;
    priceEst.textContent = (room && ROOM_PRICES[room])
        ? `Estimat: ${nights * ROOM_PRICES[room]} lei`
        : '';

    nightsDisp.classList.add('visible');
    nightsDisp.style.display = 'flex';
}

function hideNights() {
    nightsDisp.classList.remove('visible');
    nightsDisp.style.display = 'none';
}

checkinEl.addEventListener('change', () => {
    if (checkoutEl.value && new Date(checkoutEl.value) <= new Date(checkinEl.value)) {
        checkoutEl.value = '';
    }
    // Set checkout min to day after checkin
    if (checkinEl.value) {
        const next = new Date(checkinEl.value);
        next.setDate(next.getDate() + 1);
        checkoutEl.min = next.toISOString().split('T')[0];
    }
    updateNights();
});
checkoutEl.addEventListener('change', updateNights);
roomTypeEl.addEventListener('change', updateNights);

// =============================================
// Form validation & WhatsApp submit
// =============================================
function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    document.querySelectorAll('input.error, select.error').forEach(el => el.classList.remove('error'));
}

function showError(field, msg) {
    field.classList.add('error');
    const errEl = field.closest('.form-group')?.querySelector('.field-error');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
}

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function formatDateRO(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    return `${d}.${m}.${y}`;
}

bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const f = {
        roomType: document.getElementById('roomType'),
        checkin:  checkinEl,
        checkout: checkoutEl,
        adults:   document.getElementById('adults'),
        children: document.getElementById('children'),
        name:     document.getElementById('fullName'),
        email:    document.getElementById('email'),
        phone:    document.getElementById('phone'),
        requests: document.getElementById('requests'),
        terms:    document.getElementById('terms'),
    };

    let ok = true;
    if (!f.roomType.value)                   { showError(f.roomType, 'Selectează tipul camerei'); ok = false; }
    if (!f.checkin.value)                    { showError(f.checkin, 'Selectează data sosirii'); ok = false; }
    if (!f.checkout.value)                   { showError(f.checkout, 'Selectează data plecării'); ok = false; }
    else if (f.checkin.value && new Date(f.checkout.value) <= new Date(f.checkin.value)) {
        showError(f.checkout, 'Data plecării trebuie să fie după data sosirii'); ok = false;
    }
    if (!f.adults.value || parseInt(f.adults.value) < 1) { showError(f.adults, 'Cel puțin 1 adult'); ok = false; }
    if (!f.name.value.trim())                { showError(f.name, 'Introdu numele complet'); ok = false; }
    if (!isValidEmail(f.email.value))        { showError(f.email, 'Introdu un email valid'); ok = false; }
    if (!f.phone.value.trim())               { showError(f.phone, 'Introdu numărul de telefon'); ok = false; }
    if (!f.terms.checked) {
        const errEl = f.terms.closest('.form-group')?.querySelector('.field-error');
        if (errEl) { errEl.textContent = 'Trebuie să accepți termenii'; errEl.classList.add('visible'); }
        ok = false;
    }

    if (!ok) return;

    // Build WhatsApp pre-filled message
    const nights = (f.checkin.value && f.checkout.value)
        ? Math.round((new Date(f.checkout.value) - new Date(f.checkin.value)) / 86400000)
        : 0;
    const children = parseInt(f.children.value) || 0;

    let msg = `Bună! Vreau să rezerv o cameră la Casa Oana.\n\n`;
    msg += `📋 *DETALII REZERVARE*\n`;
    msg += `🏠 Cameră: ${f.roomType.value}\n`;
    msg += `📅 Sosire: ${formatDateRO(f.checkin.value)}\n`;
    msg += `📅 Plecare: ${formatDateRO(f.checkout.value)}\n`;
    if (nights > 0) msg += `🌙 Nopți: ${nights}\n`;
    msg += `👥 Adulți: ${f.adults.value}\n`;
    if (children > 0) msg += `👶 Copii: ${children}\n`;
    msg += `\n👤 *DATE CONTACT*\n`;
    msg += `Nume: ${f.name.value.trim()}\n`;
    msg += `Email: ${f.email.value.trim()}\n`;
    msg += `Telefon: ${f.phone.value.trim()}\n`;
    if (f.requests.value.trim()) msg += `\n💬 *Cerințe speciale*\n${f.requests.value.trim()}\n`;

    const waUrl = `https://wa.me/40722645085?text=${encodeURIComponent(msg)}`;

    // Show success screen
    bookingFormWrapper.style.display = 'none';
    bookingSuccess.classList.add('visible');

    // Open WhatsApp in new tab
    setTimeout(() => window.open(waUrl, '_blank', 'noopener,noreferrer'), 400);
});

// =============================================
// Scroll animations (IntersectionObserver)
// =============================================
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 70);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// =============================================
// GLightbox
// =============================================
if (typeof GLightbox !== 'undefined') {
    GLightbox({
        touchNavigation: true,
        loop: true,
        openEffect: 'zoom',
        closeEffect: 'fade',
    });
}
