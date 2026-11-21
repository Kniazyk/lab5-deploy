'use strict';

/* ===== Лабораторна робота №4 ===== */

/* ---------- 1. Системна інформація: localStorage → футер ---------- */
const STORAGE_KEY = 'systemInfo';

// Збирає доступну інформацію про браузер та операційну систему
function collectSystemInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.userAgentData?.platform ?? navigator.platform,
    vendor: navigator.vendor,
    language: navigator.language,
    languages: (navigator.languages ?? []).join(', '),
    cookieEnabled: String(navigator.cookieEnabled),
    online: String(navigator.onLine),
    cpuCores: String(navigator.hardwareConcurrency ?? 'н/д'),
    screen: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

// localStorage зберігає лише рядки, тому об'єкт перетворюємо через JSON.stringify
function saveSystemInfo() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectSystemInfo()));
}

// Зчитує ВСЕ, що є в localStorage (JSON-об'єкти розгортає у пари ключ/значення)
function readLocalStorage() {
  const result = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => {
          result[k] = String(v);
        });
        continue;
      }
    } catch {
      // значення не є JSON - показуємо як є
    }
    result[key] = raw;
  }
  return result;
}

function renderSystemInfo() {
  const container = document.getElementById('system-info');
  const list = document.getElementById('system-info-list');
  list.replaceChildren();

  const entries = Object.entries(readLocalStorage());
  entries.forEach(([key, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = value; // textContent - безпечно для будь-яких рядків
    list.append(dt, dd);
  });
  container.hidden = entries.length === 0;
}

/* ---------- 2. Відгуки з сервера (async/await + fetch) ---------- */
const VARIANT = 10; // номер варіанта (порядковий номер у журналі групи)

async function loadReviews() {
  const status = document.getElementById('reviews-status');
  const list = document.getElementById('reviews-list');

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const comments = await response.json();

    status.hidden = true;
    comments.forEach((comment) => { // у порядку отримання
      const card = document.createElement('article');
      card.className = 'review';

      const title = document.createElement('h3');
      title.textContent = comment.name;
      const email = document.createElement('p');
      email.className = 'review-email';
      email.textContent = comment.email;
      const body = document.createElement('p');
      body.textContent = comment.body;

      card.append(title, email, body);
      list.append(card);
    });
  } catch (error) {
    console.error('Error:', error);
    status.hidden = false;
    status.className = 'error';
    status.textContent = 'Не вдалося завантажити відгуки. Спробуйте пізніше.';
  }
}

/* ---------- 3. Модальне вікно через 1 хвилину ---------- */
const SHOW_DELAY_MS = 60000;
const CLOSED_KEY = 'contactFormClosed';

const modal = document.getElementById('contact-modal');
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function openModal() {
  if (sessionStorage.getItem(CLOSED_KEY)) return; // вже закрито в цій сесії
  modal.hidden = false;
  form.elements.name.focus();
}

function closeModal() {
  modal.hidden = true;
  sessionStorage.setItem(CLOSED_KEY, '1');
}

function setFormStatus(text, type = '') {
  formStatus.textContent = text;
  formStatus.className = type;
}

document.getElementById('close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal(); // клік по затемненому фону
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // залишаємось на сторінці; без JS спрацює звичайний POST

  if (form.action.includes('[')) {
    setFormStatus('Не вказано endpoint Formspree.', 'error');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  setFormStatus('Надсилання...');
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setFormStatus('Дякуємо! Повідомлення надіслано.', 'success');
    form.reset();
  } catch (error) {
    console.error('Error:', error);
    setFormStatus('Не вдалося надіслати. Перевірте endpoint Formspree і спробуйте ще раз.', 'error');
  } finally {
    submitButton.disabled = false;
  }
});

setTimeout(openModal, SHOW_DELAY_MS);

/* ---------- 4. Денна / нічна тема ---------- */
const themeToggle = document.getElementById('theme-toggle');

// Світла тема: з 07:00 включно до 21:00 (не включно), в інший час - темна
function getThemeByTime(date = new Date()) {
  const hour = date.getHours();
  return hour >= 7 && hour < 21 ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? '☀️ Світла тема' : '🌙 Темна тема';
}

themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

/* ---------- Ініціалізація ---------- */
applyTheme(getThemeByTime());

try {
  saveSystemInfo();
  renderSystemInfo();
} catch (error) {
  console.error('localStorage недоступний:', error);
}

loadReviews();
