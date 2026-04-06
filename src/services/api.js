// Centralized API configuration for the frontend
// Using relative /api path so Vite proxy handles routing for all devices
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // USER API
  signup: async (data) => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // GRIEVANCES API
  getGrievances: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/complaints/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  createGrievance: async (data) => {
    const res = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  updateGrievanceStatus: async (id, status, remarks) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status, note: remarks }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
