// analytics.js
import { getToken } from './auth';
const API_BASE = 'http://localhost:5001/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/analytics/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}
