// src/api/api.js

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const loginUser = (userId, password) =>
  axios.post(`${API_BASE}/auth/login`, { userId, password });

export const uploadExcelFile = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_BASE}/excel/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getFileHistory = (token) =>
  axios.get(`${API_BASE}/excel/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getFileById = (id, token) =>
  axios.get(`${API_BASE}/excel/file/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFile = (id, token) =>
  axios.delete(`${API_BASE}/excel/file/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const clearHistory = (token) =>
  axios.delete(`${API_BASE}/excel/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
