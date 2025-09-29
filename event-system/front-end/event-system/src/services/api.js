// api.js
// Centralized API service for backend communication
const API_BASE = 'http://localhost:5000/api';

// Generic API request function to reduce redundancy
async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  };

  // Append active event id to all requests as a query param if available
  try {
    if (typeof window !== 'undefined') {
      const activeEventId = window.sessionStorage.getItem('activeEventId');
      if (activeEventId) {
        const hasQuery = endpoint.includes('?');
        const hasEventParam = /[?&]eventId=/.test(endpoint);
        if (!hasEventParam) {
          endpoint = `${endpoint}${hasQuery ? '&' : '?'}eventId=${encodeURIComponent(activeEventId)}`;
        }
      }
    }
  } catch {}

  const response = await fetch(`${API_BASE}${endpoint}`, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}

export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function register(name, email, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function getDashboardStats() {
  return apiRequest('/analytics/stats');
}

export async function getForms() {
  return apiRequest('/forms');
}

export async function createForm(form) {
  return apiRequest('/forms', {
    method: 'POST',
    body: JSON.stringify(form)
  });
}

export async function getCertificates() {
  return apiRequest('/certificates');
}

export async function createCertificate(data) {
  return apiRequest('/certificates', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function uploadCertificateTemplate(certificateId, file) {
  const formData = new FormData();
  formData.append('template', file);
  return apiRequest(`/certificates/${certificateId}/upload-template`, {
    method: 'POST',
    headers: {}, // Remove Content-Type header for FormData
    body: formData
  });
}

export async function getFormQRCode(formId) {
  return apiRequest(`/forms/${formId}/qr`);
}

export async function getFormById(formId) {
  return apiRequest(`/forms/${formId}`);
}

export async function updateForm(formId, formData) {
  return apiRequest(`/forms/${formId}`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  });
}

export async function deleteForm(formId) {
  return apiRequest(`/forms/${formId}`, {
    method: 'DELETE'
  });
}