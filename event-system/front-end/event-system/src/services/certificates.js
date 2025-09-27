// certificates.js
import { getToken } from './auth';
const API_BASE = 'http://localhost:5001/api';

export async function fetchCertificates() {
  const res = await fetch(`${API_BASE}/certificates`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch certificates');
  return res.json();
}

export async function uploadTemplate(file) {
  const formData = new FormData();
  formData.append('template', file);
  const res = await fetch(`${API_BASE}/certificates/template`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload template');
  return res.json();
}
