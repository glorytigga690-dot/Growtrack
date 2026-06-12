/**
 * GrowTrack — Utility Helpers
 */

// Date formatting
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDateShort(dateStr);
}

function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

function getDaysRemaining(targetDate) {
  const today = new Date();
  const target = new Date(targetDate);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

// String helpers
function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'GT';
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function truncate(str, len = 50) {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
}

// DOM helpers
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function createElement(tag, attrs = {}, children = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'class') el.className = val;
    else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else el.setAttribute(key, val);
  });
  if (typeof children === 'string') el.innerHTML = children;
  else if (children instanceof HTMLElement) el.appendChild(children);
  else if (Array.isArray(children)) children.forEach(c => {
    if (typeof c === 'string') el.innerHTML += c;
    else el.appendChild(c);
  });
  return el;
}

// Score color
function getScoreColor(score) {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-primary)';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

// Mood emoji
function getMoodEmoji(score) {
  const emojis = { 1: '😢', 2: '😕', 3: '😐', 4: '😊', 5: '🤩' };
  return emojis[score] || '😐';
}

function getMoodLabel(score) {
  const labels = { 1: 'Awful', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great' };
  return labels[score] || 'Unknown';
}

// Debounce
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Local storage helpers with JSON support
function storageGet(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage error:', e);
  }
}

function storageRemove(key) {
  localStorage.removeItem(key);
}
