import { API_BASE_URL } from './config.jsx';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${API_BASE_URL}${path}`;
  console.log('request', method, url, body ?? null);
  
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const text = await res.text();
    let data = {};
    try { 
      data = JSON.parse(text); 
    } catch (e) { 
      data = { raw: text, parseError: e.message }; 
    }
    
    console.log('response', res.status, data);
    
    if (!res.ok) {
      // Handle validation errors
      if (data?.errors) {
        const errorMessages = Object.values(data.errors).flat().join(', ');
        throw new Error(errorMessages || data?.message || 'Request failed');
      }
      const message = data?.message || `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (error.message.includes('Network request failed') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')) {
      throw new Error(`Network error: Cannot connect to ${API_BASE_URL}. Please check if the server is running and your network connection.`);
    }
    // Re-throw other errors
    throw error;
  }
}

export const api = {
  ping: () => request('/api/ping'),
  register: (payload) => request('/api/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/login', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/api/forgot-password', { method: 'POST', body: payload }),
  me: (token) => request('/api/user', { token }),
  logout: (token) => request('/api/logout', { method: 'POST', token }),
  
  // Dashboard
  getDashboard: (token) => request('/api/dashboard', { token }),
  
  // Medications
  getMedications: (token) => request('/api/medications', { token }),
  addMedication: (token, payload) => request('/api/medications', { method: 'POST', body: payload, token }),
  updateMedication: (token, id, payload) => request(`/api/medications/${id}`, { method: 'PUT', body: payload, token }),
  deleteMedication: (token, id) => request(`/api/medications/${id}`, { method: 'DELETE', token }),
  
  // Scanning
  scanMedication: (token, payload) => request('/api/medications/scan', { method: 'POST', body: payload, token }),
  scanMedicationImage: async (token, formData) => {
    const url = `${API_BASE_URL}/api/medications/scan-image`;
    console.log('request', 'POST', url, 'FormData');
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let fetch set it with boundary for FormData
        },
        body: formData,
      });
      
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { raw: text, parseError: e.message };
      }
      
      console.log('response', res.status, data);
      
      if (!res.ok) {
        if (data?.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages || data?.message || 'Request failed');
        }
        const message = data?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
      }
      
      return data;
    } catch (error) {
      if (error.message.includes('Network request failed') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')) {
        throw new Error(`Network error: Cannot connect to ${API_BASE_URL}. Please check if the server is running and your network connection.`);
      }
      throw error;
    }
  },
  
  // Analytics
  getAnalytics: (token) => request('/api/analytics', { token }),
  
  // Reminders
  getReminders: (token) => request('/api/reminders', { token }),
  createReminder: (token, payload) => request('/api/reminders', { method: 'POST', body: payload, token }),
  updateReminder: (token, id, payload) => request(`/api/reminders/${id}`, { method: 'PUT', body: payload, token }),
  deleteReminder: (token, id) => request(`/api/reminders/${id}`, { method: 'DELETE', token }),
  updateReminderSettings: (token, payload) => request('/api/reminders/settings', { method: 'PUT', body: payload, token }),
  
  // Pharmacies
  getPharmacies: (token) => request('/api/pharmacies', { token }),
  
  // Orders
  createOrder: (token, payload) => request('/api/orders', { method: 'POST', body: payload, token }),
  getOrders: (token) => request('/api/orders', { token }),
  
  // Payment
  processPayment: (token, payload) => request('/api/payments', { method: 'POST', body: payload, token }),
};


