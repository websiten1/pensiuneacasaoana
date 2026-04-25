// ================================================
// Header — sticky behavior + mobile nav
// ================================================
const header     = document.getElementById('header');
const navToggle  = document.getElementById('navToggle');
const headerNav  = document.getElementById('headerNav');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveSection();
}, { passive: true });

navToggle.addEventListener('click', () => {
    const open = headerNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
headerNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        headerNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
    });
});

// Close mobile nav on outside click
document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
        headerNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
    }
});

// Active nav link tracking
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.header-nav .nav-link');

function highlightActiveSection() {
    let current = '';
    allSections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    allNavLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
}

// ================================================
// Booking Modal
// ================================================
const bookingModal    = document.getElementById('bookingModal');
const modalFormView   = document.getElementById('modalFormView');
const modalSuccessView= document.getElementById('modalSuccessView');
const bookingForm     = document.getElementById('bookingForm');
const modalClose      = document.getElementById('modalClose');

function openModal(roomPreset = '') {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Always show form on open
    modalFormView.hidden   = false;
    modalSuccessView.hidden = true;

    // Pre-select room if triggered from a room card
    if (roomPreset) {
        const roomSelect = document.getElementById('f-room');
        if (roomSelect) roomSelect.value = roomPreset;
    }

    // Set minimum selectable date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('f-checkin').min  = today;
    document.getElementById('f-checkout').min = today;

    // Focus first field
    setTimeout(() => {
        const first = bookingModal.querySelector('select, input:not([type="checkbox"])');
        if (first) first.focus();
    }, 80);
}

function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
    bookingForm.reset();
    clearFormErrors();
}

// Close on backdrop click
bookingModal.addEventListener('click', e => {
    if (e.target === bookingModal) closeModal();
});

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (bookingModal.classList.contains('active')) closeModal();
        if (!galleryLightbox.hidden) closeLightbox();
    }
});

// Enforce checkout is after checkin
document.getElementById('f-checkin').addEventListener('change', () => {
    const ci = document.getElementById('f-checkin').value;
    const co = document.getElementById('f-checkout');
    if (ci) {
        const next = new Date(ci);
        next.setDate(next.getDate() + 1);
        co.min = next.toISOString().split('T')[0];
        if (co.value && co.value <= ci) co.value = '';
    }
});

// ================================================
// Form validation & WhatsApp submit
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
    if (errEl) { errEl.textContent = message; errEl.classList.add('visible'); }
}

function isEmailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    return `${d}.${m}.${y}`;
}

bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    clearFormErrors();

    const f = {
        room:     document.getElementById('f-room'),
        checkin:  document.getElementById('f-checkin'),
        checkout: document.getElementById('f-checkout'),
        adults:   document.getElementById('f-adults'),
        children: document.getElementById('f-children'),
        name:     document.getElementById('f-name'),
        email:    document.getElementById('f-email'),
        phone:    document.getElementById('f-phone'),
        requests: document.getElementById('f-requests'),
        terms:    document.getElementById('f-terms'),
    };

    let valid = true;

    if (!f.room.value) {
        showError(f.room, 'Selectati tipul camerei.'); valid = false;
    }
    if (!f.checkin.value) {
        showError(f.checkin, 'Selectati data sosirii.'); valid = false;
    }
    if (!f.checkout.value) {
        showError(f.checkout, 'Selectati data plecarii.'); valid = false;
    } else if (f.checkin.value && f.checkout.value <= f.checkin.value) {
        showError(f.checkout, 'Data plecarii trebuie sa fie dupa data sosirii.'); valid = false;
    }
    if (!f.adults.value || parseInt(f.adults.value) < 1) {
        showError(f.adults, 'Cel putin 1 adult.'); valid = false;
    }
    if (!f.name.value.trim()) {
        showError(f.name, 'Introduceti numele complet.'); valid = false;
    }
    if (!isEmailValid(f.email.value)) {
        showError(f.email, 'Introduceti un email valid.'); valid = false;
    }
    if (!f.phone.value.trim()) {
        showError(f.phone, 'Introduceti numarul de telefon.'); valid = false;
    }
    if (!f.terms.checked) {
        const errEl = f.terms.closest('.field-group')?.querySelector('.field-err');
        if (errEl) { errEl.textContent = 'Acceptati termenii pentru a continua.'; errEl.classList.add('visible'); }
        valid = false;
    }

    if (!valid) return;

    // Build WhatsApp pre-filled message
    const nights = (f.checkin.value && f.checkout.value)
        ? Math.round((new Date(f.checkout.value) - new Date(f.checkin.value)) / 86400000)
        : 0;
    const children = parseInt(f.children.value) || 0;

    let msg = `Buna, vreau sa rezerv o camera la Casa Oana.\n\n`;
    msg += `Camera: ${f.room.value}\n`;
    msg += `Sosire: ${formatDate(f.checkin.value)}\n`;
    msg += `Plecare: ${formatDate(f.checkout.value)}\n`;
    if (nights > 0) msg += `Nopti: ${nights}\n`;
    msg += `Adulti: ${f.adults.value}`;
    if (children > 0) msg += `, Copii: ${children}`;
    msg += `\n\nNume: ${f.name.value.trim()}\nTelefon: ${f.phone.value.trim()}\nEmail: ${f.email.value.trim()}`;
    if (f.requests.value.trim()) msg += `\n\nCerinte speciale: ${f.requests.value.trim()}`;

    const waUrl = `https://wa.me/40722645085?text=${encodeURIComponent(msg)}`;

    // Show success screen
    modalFormView.hidden    = true;
    modalSuccessView.hidden = false;

    // Open WhatsApp
    setTimeout(() => window.open(waUrl, '_blank', 'noopener,noreferrer'), 350);
});

// ================================================
// Gallery Lightbox
// ================================================
const galleryLightbox    = document.getElementById('galleryLightbox');
const lightboxClose      = document.getElementById('lightboxClose');
const lightboxPrev       = document.getElementById('lightboxPrev');
const lightboxNext       = document.getElementById('lightboxNext');
const lightboxCounter    = document.getElementById('lightboxCounter');
const lightboxCaption    = document.getElementById('lightboxCaption');

// Captions for each gallery slot — update when adding real images
const galleryCaptions = [
    'Camera Dubla Clasica',
    'Camera Dubla Deluxe',
    'Suite Premium',
    'Hol si receptie',
    'Terasa',
    'Mic dejun',
];

const totalImages = galleryCaptions.length;
let currentImage  = 0;

function openLightbox(index) {
    currentImage = index;
    updateLightbox();
    galleryLightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
}

function closeLightbox() {
    galleryLightbox.hidden = true;
    document.body.style.overflow = '';
}

function updateLightbox() {
    lightboxCaption.textContent  = galleryCaptions[currentImage] || 'Imagine galerie';
    lightboxCounter.textContent  = `${currentImage + 1} / ${totalImages}`;
}

function prevImage() {
    currentImage = (currentImage - 1 + totalImages) % totalImages;
    updateLightbox();
}

function nextImage() {
    currentImage = (currentImage + 1) % totalImages;
    updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click',  prevImage);
lightboxNext.addEventListener('click',  nextImage);

// Keyboard navigation in lightbox
galleryLightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape')     closeLightbox();
});

// Keyboard support for gallery items (Enter / Space)
document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(i);
        }
    });
});

// ================================================
// Scroll fade-in animations
// ================================================
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));

// ================================================
// Demo Wizard
// ================================================
(function initDemoWizard() {
    const wizard   = document.getElementById('demo-wizard');
    const closeBtn = document.getElementById('demo-wizard-close');
    const prevBtn  = document.getElementById('demo-wizard-prev');
    const nextBtn  = document.getElementById('demo-wizard-next');
    const progress = document.getElementById('demo-wizard-progress');

    if (!wizard) return;

    if (localStorage.getItem('demoWizardDone')) {
        wizard.classList.add('demo-hidden');
        return;
    }

    const TOTAL = 4;
    let current = 1;

    function updateUI() {
        progress.textContent = current + ' / ' + TOTAL;

        for (let i = 1; i <= TOTAL; i++) {
            const step = document.getElementById('demo-step-' + i);
            if (!step) continue;
            if (i === current) {
                step.classList.remove('demo-step-hidden');
                step.style.animation = 'none';
                step.offsetHeight; // trigger reflow to restart animation
                step.style.animation = '';
            } else {
                step.classList.add('demo-step-hidden');
            }
        }

        if (current === TOTAL) {
            prevBtn.className = 'demo-wizard-btn demo-wizard-btn--skip';
            prevBtn.textContent = 'Skip intro';
            prevBtn.disabled = false;
            nextBtn.className = 'demo-wizard-btn demo-wizard-btn--enter';
            nextBtn.textContent = 'Intră pe website';
        } else {
            prevBtn.className = 'demo-wizard-btn demo-wizard-btn--prev';
            prevBtn.innerHTML = '&#8592;';
            prevBtn.disabled = current === 1;
            nextBtn.className = 'demo-wizard-btn demo-wizard-btn--next';
            nextBtn.innerHTML = 'Next &#8594;';
        }
    }

    function hideWizard() {
        wizard.classList.add('demo-hiding');
        localStorage.setItem('demoWizardDone', 'true');
        wizard.addEventListener('animationend', () => {
            wizard.classList.add('demo-hidden');
        }, { once: true });
    }

    function goNext() {
        if (current < TOTAL) { current++; updateUI(); }
        else hideWizard();
    }

    function goPrev() {
        if (current === TOTAL) hideWizard(); // "Skip intro"
        else if (current > 1) { current--; updateUI(); }
    }

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);
    closeBtn.addEventListener('click', hideWizard);

    document.addEventListener('keydown', e => {
        if (wizard.classList.contains('demo-hidden')) return;
        if (e.key === 'ArrowRight') goNext();
        else if (e.key === 'ArrowLeft') goPrev();
        else if (e.key === 'Escape') hideWizard();
    });

    updateUI();
})();
