import { API_BASE_URL } from './config.jsx';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${API_BASE_URL}${path}`;
  console.log('request', method, url, body ?? null);
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  console.log('response', res.status, data);
  if (!res.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const api = {
  ping: () => request('/api/ping'),
  register: (payload) => request('/api/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/login', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/api/forgot-password', { method: 'POST', body: payload }),
  me: (token) => request('/api/user', { token }),
  logout: (token) => request('/api/logout', { method: 'POST', token }),
};


