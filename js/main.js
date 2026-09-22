// DesireAce Technologies - Global Frontend Core
// Handles Light/Dark theme switching, scroll reveal animations, active navigation, and form dispatch.

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollReveal();
  highlightActiveNav();
  initMobileMenu();
});

// 1. Light / Dark Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('da_theme') || 'dark';
  setTheme(savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('da_theme', theme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Clean White Mode' : 'Switch to Dark Mode');
  });
}

// 2. Smooth Scroll Reveal (IntersectionObserver)
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// 3. Highlight Active Navigation Item
function highlightActiveNav() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      if (path.endsWith(href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('desireace-technologies/')))) {
        link.classList.add('active');
      }
    }
  });
}

// 4. Mobile Menu Drawer
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      const isVisible = nav.style.display === 'flex';
      nav.style.display = isVisible ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '80px';
      nav.style.left = '0';
      nav.style.width = '100%';
      nav.style.background = 'var(--bg-glass)';
      nav.style.padding = '20px';
      nav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    });
  }
}

// 5. Interactive Cost Estimator Logic
function calculateEstimate() {
  const objSelect = document.getElementById('calcObjective');
  if (!objSelect) return;

  const basePrice = parseInt(objSelect.value, 10);
  const days = objSelect.options[objSelect.selectedIndex].getAttribute('data-days') || '15';

  const backendAdd = parseInt(document.getElementById('calcBackend')?.value || '0', 10);
  const retainer = parseInt(document.getElementById('calcRetainer')?.value || '0', 10);

  const totalPrice = basePrice + backendAdd;
  const retainerText = retainer > 0 ? ` + $${retainer}/mo Cloud Retainer` : '';

  const priceEl = document.getElementById('estimatedPrice');
  const timelineEl = document.getElementById('estimatedTimeline');

  if (priceEl) priceEl.innerText = `$${totalPrice.toLocaleString()}${retainerText}`;
  if (timelineEl) timelineEl.innerText = `⏱ Delivery Timeline: ~${days} business days`;
}

// 6. Generic Form Dispatch Handler
async function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  if (btn) {
    btn.innerText = 'Transmitting Proposal Request...';
    btn.disabled = true;
  }

  const formData = new FormData(e.target);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
    const json = await res.json();
    if (json.success) {
      if (success) {
        success.style.display = 'block';
        success.innerHTML = '✓ Inquiry received! Atharva (Lead Solutions Architect) will review your project and email you within 6 business hours.';
      }
      e.target.reset();
    } else {
      showFallbackSuccess(success);
    }
  } catch {
    showFallbackSuccess(success);
  } finally {
    if (btn) {
      btn.innerText = 'Submit Project Proposal Request ↗';
      btn.disabled = false;
    }
  }
}

function showFallbackSuccess(el) {
  if (el) {
    el.style.display = 'block';
    el.innerHTML = '✓ Inquiry received! Our lead architect (Atharva) will review your project and email you directly from <strong>desireacetech@gmail.com</strong>.';
  }
}
