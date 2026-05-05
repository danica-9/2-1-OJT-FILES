/* ================================================================
   OJT PORTFOLIO v2 — app.js
   ================================================================ */

const searchInput  = document.getElementById('searchInput');
const mobileSearch = document.getElementById('mobileSearch');
const grid         = document.getElementById('studentsGrid');
const emptyState   = document.getElementById('emptyState');
const resultsText  = document.getElementById('resultsText');
const navCount     = document.getElementById('navCount');
const sortSelect   = document.getElementById('sortSelect');

// hero counters
const sTotal        = document.getElementById('sTotal');
const sComplete     = document.getElementById('sComplete');
const sPending      = document.getElementById('sPending');
const countAll      = document.getElementById('countAll');
const countComplete = document.getElementById('countComplete');
const countPending  = document.getElementById('countPending');

let currentFilter = 'all';
let currentQuery  = '';
let currentSort   = 'default';

// ── INITIAL COUNTER ──────────────────────────────────────────────
function updateHeroStats() {
  const all      = getAllCards();
  const complete = all.filter(c => c.dataset.status === 'complete').length;
  const pending  = all.filter(c => c.dataset.status === 'pending').length;

  if (sTotal)        sTotal.textContent = all.length;
  if (sComplete)     sComplete.textContent = complete;
  if (sPending)      sPending.textContent = pending;
  if (countAll)      countAll.textContent = all.length;
  if (countComplete) countComplete.textContent = complete;
  if (countPending)  countPending.textContent = pending;
  if (navCount)      navCount.textContent = all.length;
}

function getAllCards() {
  return Array.from(grid.querySelectorAll('.card'));
}

// ── FILTER + SEARCH + SORT ───────────────────────────────────────
function applyAll() {
  const cards   = getAllCards();
  let visible   = [];

  cards.forEach(card => {
    const name   = (card.dataset.name || '').toLowerCase();
    const status = card.dataset.status || '';
    const matchQ = !currentQuery || name.includes(currentQuery);
    const matchF = currentFilter === 'all' || status === currentFilter;

    if (matchQ && matchF) {
      card.style.display = '';
      visible.push(card);
    } else {
      card.style.display = 'none';
    }
  });

  // sort
  if (currentSort !== 'default') {
    const sorted = [...visible].sort((a, b) => {
      const na = a.dataset.name || '';
      const nb = b.dataset.name || '';
      const sa = a.dataset.status || '';
      const sb = b.dataset.status || '';
      if (currentSort === 'az')       return na.localeCompare(nb);
      if (currentSort === 'za')       return nb.localeCompare(na);
      if (currentSort === 'complete') return (sa === 'complete' ? -1 : 1);
      if (currentSort === 'pending')  return (sa === 'pending'  ? -1 : 1);
      return 0;
    });
    sorted.forEach(card => grid.appendChild(card));
  }

  const count = visible.length;
  if (emptyState) emptyState.style.display = count === 0 ? 'block' : 'none';
  if (navCount) navCount.textContent = count;

  const filterLabel = currentFilter === 'all' ? 'all' : currentFilter;
  resultsText.textContent   = count === 0
    ? 'No students match'
    : `Showing ${count} student${count !== 1 ? 's' : ''}${currentFilter !== 'all' ? ' · ' + filterLabel : ''}`;
}

// ── EVENTS ───────────────────────────────────────────────────────
searchInput.addEventListener('input', e => {
  currentQuery = e.target.value.toLowerCase().trim();
  if (mobileSearch) mobileSearch.value = e.target.value;
  applyAll();
});

if (mobileSearch) {
  mobileSearch.addEventListener('input', e => {
    currentQuery = e.target.value.toLowerCase().trim();
    searchInput.value = e.target.value;
    applyAll();
  });
}

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyAll();
  });
});

sortSelect.addEventListener('change', e => {
  currentSort = e.target.value;
  applyAll();
});

// ── MOBILE NAV ───────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── NAVBAR SCROLL SHRINK ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 0 var(--gold, #e8a020), 0 6px 28px rgba(0,0,0,.28)'
    : '0 2px 0 var(--gold, #e8a020), 0 4px 20px rgba(0,0,0,.22)';
}, { passive: true });


// ── NO UPLOADED FILE NOTIFICATION ───────────────────────────────
function showNoUploadToast(message = 'No file uploaded') {
  let toast = document.getElementById('noUploadToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'noUploadToast';
    toast.setAttribute('role', 'status');
    toast.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 28px;
      transform: translateX(-50%) translateY(18px);
      background: #0c3563;
      color: #fff;
      padding: 12px 18px;
      border-radius: 999px;
      font: 600 14px 'Outfit', sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity .18s ease, transform .18s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(18px)';
  }, 1800);
}

function bindNoUploadLinks() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showNoUploadToast('No file uploaded');
    });
  });
}

// ── INIT ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  updateHeroStats();
  bindNoUploadLinks();
  applyAll();
});

