const THEME_KEY = 'finance.theme';
const ROLE_KEY = 'finance.role';
const TRANSACTIONS_KEY = 'finance.transactions';

export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadRole(defaultRole = 'viewer') {
  return loadJson(ROLE_KEY, defaultRole);
}

export function saveRole(role) {
  saveJson(ROLE_KEY, role);
}

export function loadTheme() {
  // If unset, follow system preference.
  const saved = loadJson(THEME_KEY, null);
  if (saved === 'dark' || saved === 'light') return saved;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  return prefersDark ? 'dark' : 'light';
}

export function saveTheme(theme) {
  saveJson(THEME_KEY, theme);
}

export function loadTransactions(fallback) {
  return loadJson(TRANSACTIONS_KEY, fallback);
}

export function saveTransactions(transactions) {
  saveJson(TRANSACTIONS_KEY, transactions);
}

