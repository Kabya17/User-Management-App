import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const register = (name, email, password) => {
  return axios.post(`${API_URL}/register`, { name, email, password });
};
export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
export const fetchUsers = (token) => {
  return axios.get(`${API_URL}/users`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });
};
export const blockUser = (userId, token) => {
  return axios.put(`${API_URL}/block/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const deleteUser = (userId, token) => {
  return axios.delete(`${API_URL}/delete/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const unblockUser = (userId, token) => {
  return axios.put(`${API_URL}/unblock/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

