// feedback.js
const API_BASE = 'http://localhost:5000/api';

export async function submitFeedback(formId, data) {
  const res = await fetch(`${API_BASE}/forms/${formId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answers: data,
      time: Date.now()
    }),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}
