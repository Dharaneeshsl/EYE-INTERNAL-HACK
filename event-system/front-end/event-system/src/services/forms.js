// forms.js
import { getToken } from './auth';
const API_BASE = 'http://localhost:5001/api';

export async function fetchForms() {
  const res = await fetch(`${API_BASE}/forms`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
}

export async function createForm(form) {
  const res = await fetch(`${API_BASE}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
}

export async function fetchFormById(id) {
  const res = await fetch(`${API_BASE}/forms/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch form');
  return res.json();
}
