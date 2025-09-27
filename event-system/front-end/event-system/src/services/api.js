// api.js
// Centralized API service for backend communication
const API_BASE = 'http://localhost:5001/api'; // Adjust as needed


export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}


export async function register(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_BASE}/analytics/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getForms() {
  const res = await fetch(`${API_BASE}/forms`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
}

export async function createForm(form) {
  const res = await fetch(`${API_BASE}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(form)
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
}

export async function getCertificates() {
  const res = await fetch(`${API_BASE}/certificates`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch certificates');
  return res.json();
}

export async function uploadCertificateTemplate(file) {
  const formData = new FormData();
  formData.append('template', file);
  const res = await fetch(`${API_BASE}/certificates/template`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload template');
  return res.json();
}
