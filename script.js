/* Delta Balance – Landing Page Scripts */

/* ---------- NAVIGATION ---------- */
const header     = document.getElementById('header');
const navToggle  = document.getElementById('navToggle');
const navMenu    = document.getElementById('navMenu');
const navLinks   = navMenu.querySelectorAll('.nav__link');

// Sticky header style on scroll
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ---------- SCROLL ANIMATIONS ---------- */
const animateTargets = document.querySelectorAll(
  '.pillar-card, .service-card, .framework-item, .process__step, .about__stat, .section-header, .hero__card'
);

animateTargets.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling elements
      const siblings = [...entry.target.parentElement.children].filter(
        el => el.classList.contains(entry.target.classList[0])
      );
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animateTargets.forEach(el => observer.observe(el));

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('[type="submit"]');
  const name    = contactForm.querySelector('#name').value.trim();
  const email   = contactForm.querySelector('#email').value.trim();
  const service = contactForm.querySelector('#service').value;
  const message = contactForm.querySelector('#message').value.trim();

  // Basic validation
  if (!name || !email) {
    showFormFeedback('Por favor, preencha nome e e-mail.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormFeedback('Por favor, insira um e-mail válido.', 'error');
    return;
  }

  // Build WhatsApp message as fallback (can be swapped for a real backend)
  const whatsappText = encodeURIComponent(
    `Olá! Me chamo *${name}*.\n` +
    (contactForm.querySelector('#company').value.trim()
      ? `Empresa: ${contactForm.querySelector('#company').value.trim()}\n` : '') +
    `E-mail: ${email}\n` +
    (service ? `Serviço de interesse: ${getServiceLabel(service)}\n` : '') +
    (message ? `\n${message}` : '')
  );

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulate brief loading then open WhatsApp
  setTimeout(() => {
    window.open(`https://wa.me/554791101906?text=${whatsappText}`, '_blank', 'noopener,noreferrer');
    showFormFeedback('Redirecionando para o WhatsApp...', 'success');
    contactForm.reset();
    btn.textContent = 'Enviar mensagem';
    btn.disabled = false;
  }, 600);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getServiceLabel(value) {
  const map = {
    bpo: 'BPO Financeiro',
    assessoria: 'Assessoria Financeira Mensal',
    consultoria: 'Consultoria Estratégica',
    outros: 'Outros / Ainda não sei'
  };
  return map[value] || value;
}

function showFormFeedback(message, type) {
  const existing = contactForm.querySelector('.form-feedback');
  if (existing) existing.remove();

  const div = document.createElement('p');
  div.className = 'form-feedback';
  div.textContent = message;
  div.style.cssText = `
    font-size: 0.85rem;
    font-weight: 500;
    text-align: center;
    padding: 10px 16px;
    border-radius: 8px;
    background: ${type === 'success' ? '#f0f4e8' : '#fef2f2'};
    color: ${type === 'success' ? '#6D7743' : '#dc2626'};
    border: 1px solid ${type === 'success' ? 'rgba(109,119,67,0.2)' : 'rgba(220,38,38,0.2)'};
  `;

  const notice = contactForm.querySelector('.form-notice');
  notice.before(div);

  setTimeout(() => div.remove(), 5000);
}

/* ---------- SMOOTH ACTIVE NAV LINK ---------- */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));
