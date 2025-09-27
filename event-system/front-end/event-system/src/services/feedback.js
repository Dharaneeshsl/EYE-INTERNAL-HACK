// feedback.js
const API_BASE = 'http://localhost:5001/api';

export async function submitFeedback(formId, data) {
  const res = await fetch(`${API_BASE}/forms/${formId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}
