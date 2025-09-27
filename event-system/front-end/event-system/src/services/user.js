// user.js
import { getToken } from './auth';
const API_BASE = 'http://localhost:5001/api';


export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}


export async function updateUserProfile(data) {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}
