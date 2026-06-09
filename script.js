// Manejo de modales genéricos
const modalMap = {
    'Nosotros': document.getElementById('modal-nosotros'),
    'Recuerdos': document.getElementById('modal-recuerdos'),
    'Canciones': document.getElementById('modal-canciones'),
    'Para Siempre': document.getElementById('modal-paraSiempre')
};

function openModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
}

function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
}

// Asociar nav a modales
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const text = link.textContent.trim();
        // Map text to modal key
        if (text === 'Nosotros') openModal(modalMap['Nosotros']);
        if (text === 'Recuerdos') openModal(modalMap['Recuerdos']);
        if (text === 'Canciones') openModal(modalMap['Canciones']);
        if (text === 'Para Siempre') openModal(modalMap['Para Siempre']);
    });
});

// Cerrar modales desde el botón (delegación para asegurar que funcione siempre)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.modal-close');
    if (btn) {
        const modal = btn.closest('.modal');
        closeModal(modal);
    }
});

// Cerrar al hacer click fuera del contenido
const modals = document.querySelectorAll('.modal');
modals.forEach(m => {
    m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m);
    });
});

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModalEl = document.querySelector('.modal.open');
        if (openModalEl) closeModal(openModalEl);
    }
});

// Botón No que se mueve
const noBtn = document.getElementById('noBtn');
if (noBtn) {
    noBtn.addEventListener('mouseover', () => {
        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
    });

    noBtn.addEventListener('click', () => {
        openModal(document.getElementById('modal-no'));
    });
}

// Inicializar EmailJS
if (window.emailjs) {
    try {
        emailjs.init('jJNSPVFu1uXnHFDNG');
        console.log('EmailJS inicializado');
    } catch (err) {
        console.error('Error inicializando EmailJS', err);
    }
} else {
    console.warn('EmailJS no está disponible en window');
}

// Botón Sí -> abrir modal de términos antes de enviar
const yesBtn = document.querySelector('.yes');
const termsModal = document.getElementById('modal-terms');
const acceptTermsBtn = document.getElementById('accept-terms-btn');
const acceptTermsCheckbox = document.getElementById('accept-terms-checkbox');
const confirmModal = document.getElementById('modal-confirm');
const confirmResult = document.getElementById('confirm-result');

function sendEmail() {
    openModal(confirmModal);
    if (confirmResult) confirmResult.textContent = 'Enviando...';
    if (!window.emailjs) {
        console.error('Intento de envío pero EmailJS no está cargado');
        if (confirmResult) confirmResult.textContent = 'No se pudo enviar: EmailJS no cargado.';
        return;
    }
    console.log('Enviando correo mediante EmailJS...', { service: 'service_nc7cziz', template: 'template_wtgm0lv' });
    emailjs.send('service_nc7cziz', 'template_wtgm0lv', {
        respuesta: 'SI ❤️',
        fecha: new Date().toLocaleString(),
        name: 'Sebas',
        message: 'Hola'
    })
        .then(() => {
            console.log('EmailJS: enviado correctamente');
            if (confirmResult) confirmResult.textContent = '¡Enviado! 💙';
        })
        .catch((err) => {
            console.error(err);
            if (confirmResult) confirmResult.textContent = 'Error al enviar. Revisa la consola.';
        });
}

if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        openModal(termsModal);
        if (acceptTermsCheckbox) {
            acceptTermsCheckbox.checked = false;
        }
        if (acceptTermsBtn) {
            acceptTermsBtn.disabled = true;
        }
    });
}

if (acceptTermsCheckbox) {
    acceptTermsCheckbox.addEventListener('change', () => {
        if (acceptTermsBtn) {
            acceptTermsBtn.disabled = !acceptTermsCheckbox.checked;
        }
    });
}

if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', () => {
        if (!acceptTermsCheckbox || !acceptTermsCheckbox.checked) return;
        closeModal(termsModal);
        sendEmail();
    });
}

// Copiar plantilla al portapapeles
document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-template');
    if (!copyBtn) return;
    const key = copyBtn.dataset.template;
    const modal = document.querySelector(`.modal[data-template-id="${key}"]`) || document.querySelector(`#modal-${key}`) || copyBtn.closest('.modal');
    // tomar el HTML del bloque .template-screen correspondiente
    const screen = copyBtn.closest('.template-screen');
    if (!screen) return;
    const html = screen.outerHTML;
    navigator.clipboard.writeText(html).then(() => {
        // breve feedback
        copyBtn.textContent = 'Copiado ✅';
        setTimeout(() => { copyBtn.textContent = 'Copiar plantilla'; }, 1400);
    }).catch(() => {
        copyBtn.textContent = 'Error';
        setTimeout(() => { copyBtn.textContent = 'Copiar plantilla'; }, 1400);
    });
});

// --- Reproductor de audio simple para la lista de canciones ---
const audioListEl = document.querySelectorAll('.audio-list');
if (audioListEl.length) {
    // delegación para play/pause
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.play-song');
        if (!btn) return;
        const item = btn.closest('.audio-item');
        if (!item) return;
        const audio = item.querySelector('audio');
        if (!audio) return;

        // pausar otros audios
        document.querySelectorAll('.audio-item audio').forEach(a => {
            if (a !== audio) {
                a.pause();
                const otherBtn = a.closest('.audio-item')?.querySelector('.play-song');
                if (otherBtn) otherBtn.textContent = 'Play';
            }
        });

        if (audio.paused) {
            audio.play().catch(err => console.error(err));
            btn.textContent = 'Pause';
        } else {
            audio.pause();
            btn.textContent = 'Play';
        }
    });

    // actualizar barras de progreso
    document.querySelectorAll('.audio-item audio').forEach(audio => {
        const item = audio.closest('.audio-item');
        const seek = item.querySelector('.seek');
        const btn = item.querySelector('.play-song');
        audio.addEventListener('timeupdate', () => {
            if (audio.duration && seek) {
                const val = (audio.currentTime / audio.duration) * 100;
                seek.value = val || 0;
            }
        });
        audio.addEventListener('ended', () => {
            if (btn) btn.textContent = 'Play';
            if (seek) seek.value = 0;
        });
        // seek control
        seek?.addEventListener('input', (e) => {
            if (!audio.duration) return;
            const pct = Number(seek.value) / 100;
            audio.currentTime = pct * audio.duration;
        });
    });
}

// (confirm-send / confirm-cancel handlers removed — envío gestionado directamente al pulsar Sí)
