const API_BASE = 'http://localhost:5000/api';

async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Request failed');
  }
  return res.json();
}

export function listEvents(params = {}) {
  const qp = new URLSearchParams(params).toString();
  const q = qp ? `?${qp}` : '';
  return api(`/events${q}`);
}

export function createEvent(payload) {
  return api('/events', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateEvent(id, payload) {
  return api(`/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function archiveEvent(id) {
  return api(`/events/${id}`, { method: 'DELETE' });
}


